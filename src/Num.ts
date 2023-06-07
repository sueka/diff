import HashableEq from './HashableEq'
import doubleToLongBits from './doubleToLongBits'

export default class Num extends HashableEq implements Expr, Diffible<Num, Num> {
  #value: number

  declare _exprBrand: never

  private constructor(value: number) {
    super()

    this.#value = value
  }

  static of(value: number) {
    return new Num(value)
  }

  override toString(): string {
    return this.#value.toString()
  }

  diff() {
    return new Num(0)
  }

  hashCode() {
    const v = doubleToLongBits(this.#value)

    return Number(v & BigInt(0xFFFFFFFF)) ^ Number(v >> BigInt(32))
  }
}
