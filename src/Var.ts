import HashableEq from './HashableEq'
import Num from './Num'

export default class Var<T extends string = string> extends HashableEq implements Expr, Diffible<Var<T>, Num> {
  #letter: T

  declare _exprBrand: never

  private constructor(letter: T) {
    super()

    this.#letter = letter
  }

  static of<T extends string>(letter: T) {
    return new Var(letter)
  }

  override toString(): string {
    return this.#letter
  }

  diff() {
    return Num.of(1)
  }

  hashCode() {
    let result = 0

    for (let i = 0; i < this.#letter.length; ++i) {
      result = 31 * result + this.#letter.charCodeAt(i)
    }

    return result
  }
}
