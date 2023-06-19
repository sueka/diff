import { Set } from 'immutable'
import HashableEq from './HashableEq'
import Num, { Zero } from './Num'
import Var from './Var'
import canDiff from './canDiff'

export default class Sum<
  T extends Expr,
  U extends Expr,
  V extends VarOf<T> | VarOf<U> = VarOf<T> | VarOf<U> // can be extracted by VarOf
>
extends HashableEq
implements Expr, Diffible<
  Sum<T, U>,
  | DerivOf<T>
  | DerivOf<U>
  | Sum<DerivOf<T>, DerivOf<U>>
  ,
  | Sum<PartialDerivOf<T>, PartialDerivOf<U>>
  | PartialDerivOf<T>
  | PartialDerivOf<U>
  | Zero
> {
  #left: T
  #right: U

  declare _exprBrand: never

  private constructor(left: T, right: U) {
    super()

    this.#left = left
    this.#right = right
  }

  static of<T>(left: T, right: Zero, raw?: false): T
  static of<U>(left: Zero, right: U, raw?: false): U
  static of(left: Num, right: Num, raw?: false): Num
  static of<T extends Expr, U extends Expr>(left: T, right: U, raw?: boolean): Sum<T, U>

  static of<T extends Expr, U extends Expr>(left: T, right: U, raw = false):
  // | T
  // | U
  | Num
  | Sum<T, U>
  {
    if (raw) {
      return new Sum(left, right)
    }

    return new Sum(left, right).simple()
  }

  static from<TS extends Expr[]>(...summands: TS): Zero | TS[number] | Sum<Expr, TS[number]> {
    const nzSummands = summands.filter(summand => !Zero.isZero(summand)) as TS[number][]

    switch (nzSummands.length) {
      case 0: return Zero.instance
      case 1: return nzSummands[0]!
      default: return Sum.of(
        Sum.from(...nzSummands.slice(0, -1)),
        nzSummands.slice(-1)[0]!
      )
    }
  }

  simple(this: Sum<T, Zero>): T
  simple(this: Sum<Zero, U>): U
  simple(this: Sum<Num, Num>): Num
  simple(): this

  simple() {
    if (Zero.isZero(this.#right)) {
      return this.#left.simple()
    }

    if (Zero.isZero(this.#left)) {
      return this.#right.simple()
    }

    if (this.#left instanceof Num && this.#right instanceof Num) {
      return Num.of(this.#left.value + this.#right.value)
    }

    const l = this.#left.simple()
    const r = this.#right.simple()

    if (l.equals(this.#left) && r.equals(this.#right)) {
      return this
    }

    return Sum.of(l, r).simple()
  }

  override toString(): string {
    return `(${ this.#left } + ${ this.#right })`
  }

  degree(variable?: Var<V>): number {
    const l = this.#left.degree(variable)
    const r = this.#right.degree(variable)

    return Math.max(l, r)
  }

  #summands(): SummandsOf<this> {
    const result = []

    if (this.#left instanceof Sum) {
      result.push(...this.#left.#summands())
    } else {
      result.push(this.#left)
    }

    if (this.#right instanceof Sum) {
      result.push(...this.#right.#summands())
    } else {
      result.push(this.#right)
    }

    return result as SummandsOf<this>
  }

  vars(): Set<Var<V>> {
    return Set([
      ...this.#left.vars(),
      ...this.#right.vars(),
    ] as Var<V>[])
  }

  diff(this: Sum<T, Num>): DerivOf<T>
  diff(this: Sum<Num, U>): DerivOf<U>
  diff(): Sum<DerivOf<T>, DerivOf<U>>

  // TODO: Make it work well even if #left and/or #right are non-differentiable. f(x) + g(x) may be differentiable even though f(x) and g(x) are both non-differentiable with respect to any x. It is trivial if f(x) is the Dirichlet function and g(x) := -f(x).
  diff():
  | DerivOf<T>
  | DerivOf<U>
  | Sum<DerivOf<T>, DerivOf<U>>
  {
    if (canDiff(this.#left) && canDiff(this.#right)) {
      return Sum.of(
        this.#left.diff(),
        this.#right.diff()
      )
    }

    throw new Error
  }

  // (f(x, y) + g(z, x))_x -> f(x, y)_x + g(z, x)_x
  // (f(x, y) + g(z, x))_y -> f(x, y)_y
  // (f(x, y) + g(z, x))_z -> g(z, x)_z
  // (f(x, y) + g(z, x))_k -> 0
  grad<S extends I & J, I extends VarOf<T>, J extends VarOf<U>>(this: Sum<T, U>, variable: Var<S>): Sum<PartialDerivOf<T, S>, PartialDerivOf<U, S>>
  grad<S extends Exclude<I, J>, I extends VarOf<T>, J extends VarOf<U>>(this: Sum<T, U>, variable: Var<S>): PartialDerivOf<T, S>
  grad<S extends Exclude<J, I>, I extends VarOf<T>, J extends VarOf<U>>(this: Sum<T, U>, variable: Var<S>): PartialDerivOf<U, S>

  // NOTE: It must be at the bottom, and `S` of the `grad()` overloads above it must be appropriately bounded.
  // NOTE: If `this` is omitted, it may be chosen in preference to other overloads.
  grad(this: Sum<T, U>, variable: Var): Zero

  grad(variable: Var):
  | Sum<PartialDerivOf<T>, PartialDerivOf<U>>
  | PartialDerivOf<T>
  | PartialDerivOf<U>
  | Zero
  {
    if (canDiff(this.#left) && canDiff(this.#right)) {
      return Sum.of(
        this.#left.grad(variable),
        this.#right.grad(variable)
      )
    }

    throw new Error
  }

  hashCode() {
    let l = this.#left.hashCode()
    let r = this.#right.hashCode()

    if (l > r) {
      ;[r, l] = [l, r]
    }

    return 43 * l + r
  }
}
