import type { Amount, AmountLike } from './Amount';
import { Commodity, type CommodityLike } from './Commodity';

interface IValue {
    readonly amount: AmountLike;
    readonly commodity: Commodity;
}

export type ValueLike = Value | IValue | string;

export class Value {
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
        if (!(value instanceof Value)) return new Value(value.amount, value.commodity);
        return value;
    }

    private static fromString(value: string): Value {
        const [amount, commodity] = value.split(' ', 2);
        if (amount === undefined || commodity === undefined)
            throw new RangeError('The value string is in invalid format');
        return new Value(amount, commodity);
    }
}
