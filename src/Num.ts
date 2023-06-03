export default class Num implements Diffible<Num, Num> {
  #value: number

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
