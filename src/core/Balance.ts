import { Commodity, type CommodityLike } from './Commodity';
import { Value, type ValueLike } from './Value';

export class Balance {
    private readonly commodityMap: ReadonlyMap<Commodity, bigint>;

    get(key: CommodityLike): Value {
        const commodity = Commodity.toCommodity(key);
        const quantity = this.commodityMap.get(commodity) ?? 0n;
        return Value.toValue({ quantity, commodity });
    }

    *values(...includes: CommodityLike[]) {
        const toBeIncluded = new Set(includes.map(Commodity.toCommodity));
        for (const [commodity, quantity] of this.commodityMap.entries()) {
            // if (quantity === 0n) continue;
            yield Value.toValue({ commodity, quantity });
            toBeIncluded.delete(commodity);
        }
        for (const commodity of toBeIncluded.values()) {
            yield Value.toValue({ commodity, amount: 0 });
        }
    }

    [Symbol.iterator]() {
        return this.values();
    }

    isEmpty() {
        for (const quantity of this.commodityMap.values()) if (quantity !== 0n) return false;
        return true;
    }

    protected constructor(commodityMap: ReadonlyMap<Commodity, bigint>) {
        this.commodityMap = commodityMap;

        if (this.constructor === Balance) Object.freeze(this);
    }

    static fromValues(...values: ValueLike[]): Balance {
        const commodityMap = new Map<Commodity, bigint>();
        values.forEach((value) => {
            const { commodity, quantity } = Value.toValue(value);
            commodityMap.set(commodity, quantity + (commodityMap.get(commodity) ?? 0n));
        });
        return new Balance(commodityMap);
    }
}
