import { makeRe } from 'picomatch';
import { Amount, type AmountLike } from './Amount';

export type CommodityLike = Commodity | string;

export class Commodity {
    readonly name: string;
    readonly unit: Amount;

    static importBase(entries: [string, AmountLike][], matchMode: 'glob' | 'RegExp' = 'glob'): void {
        Commodity.unitBase.splice(0); // clear unitBase
        Commodity.nameMap.clear();
        for (const [pattern, candidate] of entries) {
            const re =
                matchMode === 'RegExp'
                    ? RegExp(`^${pattern.replace(/^\^|\$$/g, '')}$`)
                    : makeRe(pattern, { dot: true });
            Commodity.unitBase.unshift([re, Amount.toAmount(candidate)]);
        }
    }

    static toCommodity(value: CommodityLike): Commodity {
        if (typeof value === 'string') return Commodity.fromName(value);
        return value;
    }

    quantize(amount: AmountLike): bigint {
        if (!(amount instanceof Amount)) amount = Amount.toAmount(amount);
        return amount.divide(this.unit).toBigInt();
    }

    toString() {
        return this.name;
    }

    valueOf() {
        return this.toString();
    }

    protected constructor(name: string, unit: AmountLike) {
        this.name = name;
        this.unit = Amount.toAmount(unit);
        if (this.constructor === Commodity) Object.freeze(this);
    }

    private static unitBase: [RegExp, Amount][] = [];
    private static nameMap: Map<string, Commodity> = new Map();

    private static fromName(name: string): Commodity {
        if (Commodity.nameMap.has(name)) {
            return Commodity.nameMap.get(name) as Commodity;
        } else {
            for (const [pattern, candidate] of Commodity.unitBase) {
                if (pattern.test(name)) {
                    const commodity = new Commodity(name, candidate);
                    Commodity.nameMap.set(name, commodity);
                    return commodity;
                }
            }
            throw new RangeError('No pattern match in the base matches the given name');
        }
    }
}
