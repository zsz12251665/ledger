const SIGN_LIST = ['+', '-', ''] as const;
const NUMERIC_STRING_PATTERN = /^[+-]?([0-9]*\.[0-9]+|[0-9]+\.?)(e[+-]?[0-9]+)?$/;

type Sign = (typeof SIGN_LIST)[number];
export type AmountLike = Amount | string | number | bigint;

export class Amount {
    readonly sign: Sign;
    readonly coefficient: string;
    readonly exponent: number;

    get precision(): number {
        return this.coefficient.length;
    }

    equals(other: AmountLike): boolean {
        if (!(other instanceof Amount)) other = Amount.toAmount(other);
        return other.coefficient === this.coefficient && other.exponent === this.exponent && other.sign === this.sign;
    }

    plus(other: AmountLike): Amount {
        if (!(other instanceof Amount)) other = Amount.toAmount(other);
        const minExponent = Math.min(this.exponent, other.exponent);
        const thisNum = BigInt(`${this.sign}${this.coefficient}${'0'.repeat(this.exponent - minExponent)}`);
        const otherNum = BigInt(`${other.sign}${other.coefficient}${'0'.repeat(other.exponent - minExponent)}`);
        return Amount.fromString(`${thisNum + otherNum}e${minExponent}`);
    }

    minus(other: AmountLike): Amount {
        if (!(other instanceof Amount)) other = Amount.toAmount(other);
        const minExponent = Math.min(this.exponent, other.exponent);
        const thisNum = BigInt(`${this.sign}${this.coefficient}${'0'.repeat(this.exponent - minExponent)}`);
        const otherNum = BigInt(`${other.sign}${other.coefficient}${'0'.repeat(other.exponent - minExponent)}`);
        return Amount.fromString(`${thisNum - otherNum}e${minExponent}`);
    }

    multiply(other: AmountLike): Amount {
        if (!(other instanceof Amount)) other = Amount.toAmount(other);
        const thisNum = BigInt(`${this.sign}${this.coefficient}`);
        const otherNum = BigInt(`${other.sign}${other.coefficient}`);
        return Amount.fromString(`${thisNum * otherNum}e${this.exponent + other.exponent}`);
    }

    divide(other: AmountLike): Amount {
        if (!(other instanceof Amount)) other = Amount.toAmount(other);
        const thisNum = BigInt(`${this.sign}${this.coefficient}`);
        const otherNum = BigInt(`${other.sign}${other.coefficient}`);
        return Amount.fromString(`${thisNum / otherNum}e${this.exponent - other.exponent}`);
    }

    modulo(other: AmountLike): Amount {
        if (!(other instanceof Amount)) other = Amount.toAmount(other);
        const minExponent = Math.min(this.exponent, other.exponent);
        const thisNum = BigInt(`${this.sign}${this.coefficient}${'0'.repeat(this.exponent - minExponent)}`);
        const otherNum = BigInt(`${other.sign}${other.coefficient}${'0'.repeat(other.exponent - minExponent)}`);
        return Amount.fromString(`${thisNum % otherNum}e${minExponent}`);
    }

    abs(): Amount {
        return new Amount('+', this.coefficient, this.exponent);
    }

    isZero(): boolean {
        return /^0+$/.test(this.coefficient);
    }

    isInteger(): boolean {
        return /^[+-]?[0-9]+(\.0+)?$/.test(this.toNormalString());
    }

    toString(notation: 'normal' | 'scientific' = 'scientific') {
        return notation === 'scientific' ? this.toScientificString() : this.toNormalString();
    }

    toNumber() {
        return Number(this.toScientificString());
    }

    toBigInt() {
        return BigInt(this.toNormalString().replace(/\.0+$/, ''));
    }

    valueOf() {
        return this.toScientificString();
    }

    [Symbol.toPrimitive](hint: 'number' | 'string' | 'default') {
        if (hint === 'number') return this.toNumber();
        // if (hint === 'string')
        else return this.toString();
        // if (hint === 'default')
        // return this.toBigInt();
    }

    protected constructor(sign: Sign, coefficient: string, exponent: number) {
        if (!SIGN_LIST.includes(sign)) {
            throw new RangeError('The sign is not a proper sign character');
        }
        if (!/^[0-9]+$/.test(coefficient)) {
            throw new RangeError('The coefficient is not a numeric string');
        }
        if (!Number.isInteger(exponent)) {
            throw new RangeError('The exponent is not an integer');
        }

        this.sign = /^0+$/.test(coefficient) ? '' : sign;
        this.coefficient = coefficient.replace(/^0+(?!$)/, '');
        this.exponent = exponent;

        if (this.constructor === Amount) Object.freeze(this);
    }

    static toAmount(value: AmountLike): Amount {
        if (typeof value === 'string') return Amount.fromString(value);
        if (typeof value === 'number') return Amount.fromString(value.toExponential());
        if (typeof value === 'bigint') return Amount.fromString(value.toString());
        return value;
    }

    private static fromString(value: string): Amount {
        value = value.toLowerCase();
        if (!NUMERIC_STRING_PATTERN.test(value)) {
            throw new RangeError('The argument is not a valid number notation.');
        }
        const [coefficientPart, exponentPart] = [...value.split('e', 2), '0'];
        let exponent = Number(exponentPart);
        if (coefficientPart.includes('.')) {
            exponent -= coefficientPart.length - 1 - coefficientPart.indexOf('.');
        }
        const coefficient = coefficientPart.replace(/[^0-9]/g, '');
        const sign: Sign = /^0+$/.test(coefficient) ? '' : coefficientPart[0] === '-' ? '-' : '+';
        return new Amount(sign, coefficient, exponent);
    }

    private toNormalString(): string {
        if (this.exponent >= 0) {
            return `${this.sign}${this.coefficient}${'0'.repeat(this.exponent)}`;
        } else {
            const decimalPointPosition = -(this.precision + this.exponent);
            return decimalPointPosition < 0
                ? `${this.sign}${this.coefficient.slice(0, decimalPointPosition)}.${this.coefficient.slice(decimalPointPosition)}`
                : `${this.sign}0.${'0'.repeat(decimalPointPosition)}${this.coefficient}`;
        }
    }

    private toScientificString(): string {
        const exponentPart = this.precision - 1 + this.exponent;
        const coefficientPart =
            this.precision === 1 ? this.coefficient : `${this.coefficient[0]}.${this.coefficient.slice(1)}`;
        return `${this.sign}${coefficientPart}e${exponentPart > 0 ? '+' : ''}${exponentPart}`;
    }
}
