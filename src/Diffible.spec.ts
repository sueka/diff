import Num from './Num'
import Sum from './Sum'
import Product from './Product'
import Var from './Var'

describe('Diffible', () => {
  const two = Num.of(2)

  test('The derivative of Num is zero', () => {
    expect(two.diff().toString()).toBe('0')
    expect(two.diff().equals(Num.of(0))).toBe(true)
  })

  test('The partial derivative of Num is zero', () => {
    expect(two.grad().toString()).toBe('0')
    expect(two.grad().equals(Num.of(0))).toBe(true)
  })

  const x = Var.of('x')

  test('The derivative of Var is one', () => {
    expect(x.diff().toString()).toBe('1')
    expect(x.diff().equals(Num.of(1))).toBe(true)
  })

  test('The partial derivative of Var of `x\' with respect to `x\' is one', () => {
    expect(x.grad(x).toString()).toBe('1')
    expect(x.grad(x).equals(Num.of(1))).toBe(true)
  })

  const y = Var.of('y')

  test('The partial derivative of Var of `x\' with respect to `y\' (another indeterminate) is zero', () => {
    expect(x.grad(y).toString()).toBe('0')
    expect(x.grad(y).equals(Num.of(0))).toBe(true)
  })

  test('The derivative of Sum is Sum of the derivatives of the summands', () => {
    // x + 2 -> 1
    expect(Sum.of(x, two).diff().toString()).toBe('1')
    expect(Sum.of(x, two).diff().equals(Sum.of(x.diff(), two.diff()))).toBe(true)
  })

  test('The partial derivative of Sum is Sum of the partial derivatives of the summands', () => {
    // (x + 2)_x -> 1
    expect(Sum.of(x, two).grad(x).toString()).toBe('1')
    expect(Sum.of(x, two).grad(x).equals(Sum.of(x.grad(x), two.grad(x)))).toBe(true)

    // (x + 2)_y -> 0
    expect(Sum.of(x, two).grad(y).toString()).toBe('0')
    expect(Sum.of(x, two).grad(y).equals(Sum.of(x.grad(y), two.grad(y)))).toBe(true)
    expect(Sum.of(x, two).grad(y).equals(Num.of(0))).toBe(true)
  })

  test('The derivative of Product satisfies the Leibniz rule', () => {
    // 2x -> 2
    expect(Product.of(two, x).diff().toString()).toBe('2')

    // x^2 -> 2x = x + x
    // expect(Product.of(x, x).diff().equals(Product.of(two, x))).toBe(true)
    expect(Product.of(x, x).diff().equals(Sum.of(x, x))).toBe(true)
  })

  test('The partial derivative of Product satisfies the Leibniz rule', () => {
    // (2x)_x -> 2
    expect(Product.of(two, x).grad(x).toString()).toBe('2')

    // (2x)_y -> 0
    expect(Product.of(two, x).grad(y).toString()).toBe('0')

    // (x^2)_x -> 2x = x + x
    // expect(Product.of(x, x).diff().equals(Product.of(two, x))).toBe(true)
    expect(Product.of(x, x).grad(x).equals(Sum.of(x, x))).toBe(true)

    // (x^2)_y -> 0
    expect(Product.of(x, x).grad(y).equals(Num.of(0))).toBe(true)

    // (x^2 y)_x -> 2xy = (x + x)y
    expect(Product.of(Product.of(x, x), y).grad(x).equals(Product.of(Sum.of(x, x), y))).toBe(true)

    // (x^2 y)_y -> x^2 = x * x
    expect(Product.of(Product.of(x, x), y).grad(y).equals(Product.of(x, x))).toBe(true)
  })
})
