import Num from './Num'
import Sum from './Sum'
import Var from './Var'

describe('Diffible', () => {
  const two = new Num(2)

  test('The derivative of Num is zero', () => {
    expect(two.diff().equals(new Num(0))).toBe(true)
  })

  const x = new Var('x')

  test('The derivative of Var is one', () => {
    expect(x.diff().equals(new Num(1))).toBe(true)
  })

  test('The derivative of Sum is Sum of the derivatives of the summands', () => {
    expect(new Sum(x, two).diff().equals(new Sum(x.diff(), two.diff())))
  })
})
