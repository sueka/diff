import HashableEq from './HashableEq'
import doubleToLongBits from './doubleToLongBits'

export default class Num extends HashableEq implements Expr, Diffible<Num, Num> {
  #value: number

  declare _exprBrand: never

  protected constructor(value: number) {
    super()

    this.#value = value
  }

  static of(value: 0): Zero
  static of(value: number): Num

  static of(value: number) {
    if (value === 0) {
      return Zero.instance
    }

    return new Num(value)
  }

  override toString(): string {
    return this.#value.toString()
  }

  diff() {
    return new Num(0)
  }

  hashCode() {
    const v = doubleToLongBits(this.#value)

    return Number(v & BigInt(0xFFFFFFFF)) ^ Number(v >> BigInt(32))
  }
}

export class Zero extends Num {
  #brand: any

  static #instance?: Zero

  private constructor() {
    super(0)
  }

  static override of(value: 0): Zero
  static override of(): Zero

  static override of(_value: 0 = 0) {
    return Zero.instance
  }

  static get instance(): Zero {
    if (Zero.#instance === undefined) {
      Zero.#instance = new Zero
    }

    return Zero.#instance
  }

  static isZero(expr: Expr): expr is Zero {
    return #brand in expr // || expr instanceof Num && expr.equals(Zero.instance)
  }
}
