import Var from './Var'
import Num from './Num'

describe('Var', () => {
  const it = new Var('x')

  test('The derivative of it is one', () => {
    expect(it.diff().equals(new Num(1))).toBe(true)
  })
})
