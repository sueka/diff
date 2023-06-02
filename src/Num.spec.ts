import Num from './Num'

describe('Num', () => {
  const it = new Num(2)

  test('The derivative of it is zero', () => {
    expect(it.diff().equals(new Num(0))).toBe(true)
  })
})
