import { makeRe } from 'picomatch';
import { Amount, type AmountLike } from './Amount';

export type CommodityLike = Commodity | string;

export class Commodity {
    readonly name: string;
    readonly unit: Amount;

    private static instances: Map<string, Commodity> = new Map();
    private static units: [RegExp, Amount][] = [];

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
        if (Commodity.instances.has(name)) throw new RangeError('Duplicated instances for the same commodity name');

        this.name = name;
        this.unit = Amount.toAmount(unit);

        if (this.constructor === Commodity) Object.freeze(this);
        Commodity.instances.set(name, this);
    }

    static toCommodity(value: CommodityLike): Commodity {
        if (typeof value === 'string') return Commodity.fromName(value);
        return value;
    }

    private static fromName(name: string): Commodity {
        return Commodity.instances.get(name) ?? new Commodity(name, Commodity.getUnitFromName(name));
    }

    static importUnits(entries: [string, AmountLike][], matchMode: 'glob' | 'RegExp' = 'glob'): void {
        Commodity.units.splice(0); // clear units
        Commodity.instances.clear();
        for (const [pattern, candidate] of entries) {
            const re = matchMode === 'RegExp' ? RegExp(`^${pattern}$`) : makeRe(pattern, { dot: true });
            Commodity.units.unshift([re, Amount.toAmount(candidate)]);
        }
    }

    private static getUnitFromName(name: string): Amount {
        for (const [pattern, unit] of Commodity.units) {
            if (pattern.test(name)) {
                return unit;
            }
        }
        throw new RangeError('No pattern match in the base matches the given name');
    }

    static [Symbol.iterator]() {
        return Commodity.instances.values();
    }
}
