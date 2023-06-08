import Num from './Num'
import Sum from './Sum'
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
    expect(Sum.of(x, two).diff().toString()).toBe('1')
    expect(Sum.of(x, two).diff().equals(Sum.of(x.diff(), two.diff())))
  })
})
