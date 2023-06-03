import Num from './Num'

export default class Var implements Expr, Diffible<Var, Num> {
  #letter: string

  declare _exprBrand: never

  constructor(letter: string) {
    this.#letter = letter
  }

  toString(): string {
    return this.#letter
  }

  diff() {
    return new Num(1)
  }
}
