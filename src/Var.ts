import Num from './Num'

export default class Var implements Diffible<Var, Num> {
  #letter: string

  constructor(letter: string) {
    this.#letter = letter
  }

  toString() {
    return this.#letter
  }

  diff() {
    return new Num(1)
  }
}
