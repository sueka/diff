import Num, { One, Zero } from './Num'

describe('Zero.isZero()', () => {
  it('works well', () => {
    expect(Zero.isZero(Num.of(0))).toBe(true)
  })
})

describe('One.isOne()', () => {
  it('works well', () => {
    expect(One.isOne(Num.of(1))).toBe(true)
  })
})
