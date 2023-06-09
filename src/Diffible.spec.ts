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

  const x = Var.of('x')

  test('The derivative of Var is one', () => {
    expect(x.diff().toString()).toBe('1')
    expect(x.diff().equals(Num.of(1))).toBe(true)
  })

  test('The derivative of Sum is Sum of the derivatives of the summands', () => {
    // x + 2 -> 1
    expect(Sum.of(x, two).diff().toString()).toBe('1')
    expect(Sum.of(x, two).diff().equals(Sum.of(x.diff(), two.diff()))).toBe(true)
  })

  test('The derivative of Product satisfies the Leibniz rule', () => {
    // 2x -> 2
    expect(Product.of(two, x).diff().toString()).toBe('2')

    // x^2 -> 2x = x + x
    expect(Product.of(x, x).diff().equals(Product.of(two, x))).toBe(true)
  })
})
