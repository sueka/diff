import { Set } from 'immutable'
import HashableEq from './HashableEq'
import Num, { One, Zero } from './Num'

export default class Var<T extends string = string> extends HashableEq implements Expr, Diffible<Var<T>, One, One | Zero> {
  #text: T

  declare _exprBrand: never

  private constructor(text: T) {
    super()

    this.#text = text
  }

  static of<T extends string>(text: T) {
    return new Var(text)
  }

  simple() {
    return this
  }

  override toString(): string {
    return this.#text
  }

  degree(variable = this) {
    if (variable.equals(this)) {
      return 1
    }

    return 0
  }

  vars(): Set<Var<T>> {
    return Set([this])
  }

  diff() {
    return Num.of(1)
  }

  grad<S extends T>(variable: Var<S>): One
  grad(variable: Var): Zero // NOTE: It must be at the bottom, and `S` of the `grad()` overloads above it must be appropriately bounded.

  grad(variable: Var) {
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
