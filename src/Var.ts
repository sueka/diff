import HashableEq from './HashableEq'
import Num from './Num'

export default class Var<S extends string = string> extends HashableEq implements Expr, Diffible<Var<S>, Num, Num> {
  #text: S

  declare _exprBrand: never

  private constructor(text: S) {
    super()

    this.#text = text
  }

  static of<S extends string>(text: S) {
    return new Var(text)
  }

  override toString(): string {
    return this.#text
  }

  diff() {
    return Num.of(1)
  }

  grad<T extends string>(variable: Var<T>) {
    if (variable.equals(this)) {
      return Num.of(1)
    }

    return Num.of(0)
  }

  hashCode() {
    let result = 0

    for (let i = 0; i < this.#text.length; ++i) {
      result = 31 * result + this.#text.charCodeAt(i)
    }

    return result
  }
}
