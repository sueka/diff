import Num from './Num'

describe('Num', () => {
  const it = new Num(2)

  test('The derivative of Num is zero', () => {
    expect(it.diff().equals(new Num(0))).toBe(true)
  })
})
