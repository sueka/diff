import HashableEq from './HashableEq'

export default class Num extends HashableEq implements Expr, Diffible<Num, Num> {
  #value: number

  declare _exprBrand: never

  constructor(value: number) {
    super()

    this.#value = value
  }

  override toString(): string {
    return this.#value.toString()
  }

  diff() {
    return new Num(0)
  }

  hashCode() {
    return this.#value
  }
}
