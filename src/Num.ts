export default class Num implements Expr, Diffible<Num, Num> {
  #value: number

  declare exprBrand: never

  constructor(value: number) {
    this.#value = value
  }

  toString(): string {
    return this.#value.toString()
  }

  diff() {
    return new Num(0)
  }

  equals(this: this, that: this): boolean {
    return this.#value === that.#value
  }
}
