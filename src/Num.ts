import * as assert from 'assert'
import { Set } from 'immutable'
import HashableEq from './HashableEq'
import Var from './Var'
import doubleToLongBits from './doubleToLongBits'

export default class Num extends HashableEq implements Expr, Diffible<Num, Zero, Zero> {
  #value: number

  get value() {
    return this.#value
  }

  declare _exprBrand: never

  protected constructor(value: number) {
    super()

    this.#value = value
  }

  static of(value: 0): Zero
  static of(value: 1): One
  static of(value: number): Num

  static of(value: number) {
    if (value === 0) {
      return Zero.instance
    }

    if (value === 1) {
      return One.instance
    }

    return new Num(value)
  }

  override toString(): string {
    return this.#value.toString()
  }

  degree() {
    return 0
  }

  vars(): Set<never> {
    return Set()
  }

  diff() {
    return Zero.instance
  }

  grad(_var?: Var) {
    return Zero.instance
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
  static override of(value: number): never
  static override of(): Zero

  static override of(value = 0) {
    assert(value === 0)

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

export class One extends Num {
  #brand: any

  static #instance?: One

  private constructor() {
    super(1)
  }

  static override of(value: 1): One
  static override of(value: number): never
  static override of(): One

  static override of(value = 1) {
    assert(value === 1)

    return One.instance
  }

  static get instance(): One {
    if (One.#instance === undefined) {
      One.#instance = new One
    }

    return One.#instance
  }

  static isOne(expr: Expr): expr is One {
    return #brand in expr // || expr instanceof Num && expr.equals(One.instance)
  }
}
