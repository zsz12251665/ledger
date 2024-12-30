import { describe, expect, test } from '@jest/globals';
import { Amount, type AmountLike } from './Amount';

interface IExpectedAmount {
    sign: string;
    coefficient: string;
    exponent: number;
}

describe('Amount.toAmount()', () => {
    describe('does not accept', () => {
        const expectToFail = (s: AmountLike) => {
            expect(() => Amount.toAmount(s)).toThrow(RangeError);
        };
        test.each(['+', '-'])('sign-only string "%s"', expectToFail);
        test.each(['1,000', '2 000'])('string with delimiter "%s"', expectToFail);
        test.each(['0x', '1e', '2n', '3.0f', '4k', '5M'])('string ended with letter "%s"', expectToFail);
        test.each([' ', '6 ', '\\t7', '8\\n', '9\\b10', '11\\u0000'])('string with invisible chars "%s"', (escaped) => {
            expectToFail(JSON.parse(`"${escaped}"`));
        });
        test.each([
            { type: 'empty string', value: '' },
            { type: 'percentages', value: '100%' },
            { type: 'strings with multiple decimal points', value: '127.0.0.1' },
            { type: 'formulas', value: '2024-12-30' },
            { type: 'non-integer exponents', value: '1314e52.0' },
            { type: 'non-starting sign', value: '0+0' },
            { type: 'hex string', value: '0x00' },
        ])('$type "$value"', ({ value }) => expectToFail(value));
        test('positive infinity', () => expectToFail(Number.POSITIVE_INFINITY));
        test('negative infinity', () => expectToFail(Number.NEGATIVE_INFINITY));
        test('not a number (NaN)', () => expectToFail(Number.NaN));
    });
    describe('accepts strings', () => {
        const expectOutputToBeExpected = ({ input, expected }: { input: string; expected: IExpectedAmount }) => {
            expect(Amount.toAmount(input)).toEqual(expected);
        };
        test.each([
            { input: '1', expected: { sign: '+', coefficient: '1', exponent: 0 } },
            { input: '20', expected: { sign: '+', coefficient: '20', exponent: 0 } },
            { input: '003', expected: { sign: '+', coefficient: '3', exponent: 0 } },
            { input: '000000000000000000', expected: { sign: '', coefficient: '0', exponent: 0 } },
        ])('with digits only "$input"', expectOutputToBeExpected);
        test.each([
            { input: '-4', expected: { sign: '-', coefficient: '4', exponent: 0 } },
            { input: '+5000', expected: { sign: '+', coefficient: '5000', exponent: 0 } },
            { input: '-000060', expected: { sign: '-', coefficient: '60', exponent: 0 } },
            { input: '+0', expected: { sign: '', coefficient: '0', exponent: 0 } },
            { input: '-0000', expected: { sign: '', coefficient: '0', exponent: 0 } },
        ])('with sign "$input"', expectOutputToBeExpected);
        test.each([
            { input: '7.8', expected: { sign: '+', coefficient: '78', exponent: -1 } },
            { input: '-9.10', expected: { sign: '-', coefficient: '910', exponent: -2 } },
            { input: '+0.0', expected: { sign: '', coefficient: '0', exponent: -1 } },
            { input: '0.000000', expected: { sign: '', coefficient: '0', exponent: -6 } },
        ])('with decimal point "$input"', expectOutputToBeExpected);
        test.each([
			{ input: '-11e+12', expected: { sign: '-', coefficient: '11', exponent: 12 } },
            { input: '13e-14', expected: { sign: '+', coefficient: '13', exponent: -14 } },
            { input: '-15e000016', expected: { sign: '-', coefficient: '15', exponent: 16 } },
            { input: '+17E18', expected: { sign: '+', coefficient: '17', exponent: 18 } },
            { input: '19.20e21', expected: { sign: '+', coefficient: '1920', exponent: 19 } },
            { input: '22.23e-24', expected: { sign: '+', coefficient: '2223', exponent: -26 } },
            { input: '0e0', expected: { sign: '', coefficient: '0', exponent: 0 } },
            { input: '0e25', expected: { sign: '', coefficient: '0', exponent: 25 } },
            { input: '0.0000e-26', expected: { sign: '', coefficient: '0', exponent: -30 } },
        ])('with exponent "$input"', expectOutputToBeExpected);
    });
    describe('accepts numbers', () => {
        test.each([
            { input: 0, expected: { sign: '', coefficient: '0', exponent: 0 } },
            { input: 1, expected: { sign: '+', coefficient: '1', exponent: 0 } },
            { input: -2, expected: { sign: '-', coefficient: '2', exponent: 0 } },
            { input: 3.4, expected: { sign: '+', coefficient: '34', exponent: -1 } },
            { input: 0.05, expected: { sign: '+', coefficient: '5', exponent: -2 } },
            { input: '6 / 7', expected: { sign: '+', coefficient: '8571428571428571', exponent: -16 } },
            { input: '8e9', expected: { sign: '+', coefficient: '8', exponent: 9 } },
            { input: 10, expected: { sign: '+', coefficient: '1', exponent: 1 } },
            { input: 11, expected: { sign: '+', coefficient: '11', exponent: 0 } },
            { input: '0x12', expected: { sign: '+', coefficient: '18', exponent: 0 } },
            { input: '-13e-14', expected: { sign: '-', coefficient: '13', exponent: -14 } },
            { input: 'Number.EPSILON', expected: { sign: '+', coefficient: '2220446049250313', exponent: -31 } },
            { input: 'Number.MAX_SAFE_INTEGER', expected: { sign: '+', coefficient: '9007199254740991', exponent: 0 } },
            { input: 'Number.MIN_SAFE_INTEGER', expected: { sign: '-', coefficient: '9007199254740991', exponent: 0 } },
            { input: 'Number.MAX_VALUE', expected: { sign: '+', coefficient: '17976931348623157', exponent: 292 } },
            { input: 'Number.MIN_VALUE', expected: { sign: '+', coefficient: '5', exponent: -324 } },
        ])('$input', ({ input, expected }) => {
            if (typeof input === 'string') input = eval(input) as number;
            expect(Amount.toAmount(input)).toEqual(expected);
        });
    });
    describe('accepts bigint', () => {
        test.each([
            { input: 0n, expected: { sign: '', coefficient: '0', exponent: 0 } },
            { input: -1n, expected: { sign: '-', coefficient: '1', exponent: 0 } },
            { input: 20n, expected: { sign: '+', coefficient: '20', exponent: 0 } },
            {
                input: 12345678901234567890n,
                expected: { sign: '+', coefficient: '12345678901234567890', exponent: 0 },
            },
        ])('$input \bn', ({ input, expected }) => {
            expect(Amount.toAmount(input)).toEqual(expected);
        });
    });
    describe('accepts an `Amount` instance', () => {
        test.each([
            Amount.toAmount('0.0000'),
            Amount.toAmount('1e2'),
            Amount.toAmount(-3.4e-5),
            Amount.toAmount(67890n),
        ])('%p', (input: Amount) => {
            expect(Amount.toAmount(input)).toStrictEqual(input);
        });
    });
});
