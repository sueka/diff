import HashableEq from './HashableEq'
import Num from './Num'

export default class Var extends HashableEq implements Expr, Diffible<Var, Num> {
  #letter: string

  declare _exprBrand: never

  constructor(letter: string) {
    super()

    this.#letter = letter
  }

  override toString(): string {
    return this.#letter
  }

  diff() {
    return new Num(1)
  }

  hashCode() {
    let result = 0

    for (let i = 0; i < this.#letter.length; ++i) {
      result = 31 * result + this.#letter.charCodeAt(i)
    }

    return result
  }
}
