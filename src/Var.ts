class Var {
  #letter: string

  constructor(letter: string) {
    this.#letter = letter
  }

  toString() {
    return this.#letter
  }
}
