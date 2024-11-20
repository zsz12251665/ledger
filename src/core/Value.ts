import type { Amount, AmountLike } from './Amount';
import { Commodity, type CommodityLike } from './Commodity';

interface IValue {
    readonly amount: AmountLike;
    readonly commodity: CommodityLike;
}

interface IValueWithQuantity {
    readonly quantity: bigint;
    readonly commodity: CommodityLike;
}

export type ValueLike = IValue | IValueWithQuantity | string;

export class Value implements IValue, IValueWithQuantity {
    readonly quantity: bigint;
    readonly commodity: Commodity;

    get amount(): Amount {
        return this.commodity.unit.multiply(this.quantity);
    }

    toString(): string {
        return `${this.amount.toString()} ${this.commodity.toString()}`;
    }

    valueOf() {
        return this.toString();
    }

    protected constructor(amount: AmountLike, commodity: CommodityLike) {
        this.commodity = Commodity.toCommodity(commodity);
        this.quantity = this.commodity.quantize(amount);
        if (this.constructor === Value) Object.freeze(this);
    }

    static toValue(value: ValueLike): Value {
        if (typeof value === 'string') return Value.fromString(value);
        if (value instanceof Value) return value;
        if ('amount' in value) return new Value(value.amount, value.commodity);
        else {
            const commodity = Commodity.toCommodity(value.commodity);
            const amount = commodity.unit.multiply(value.quantity);
            return new Value(amount, commodity);
        }
    }

    private static fromString(value: string): Value {
        const [amount, commodity] = value.split(' ', 2);
        if (amount === undefined || commodity === undefined)
            throw new RangeError('The value string is in invalid format');
        return new Value(amount, commodity);
    }
}
