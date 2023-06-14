import HashableEq from './HashableEq'
import Num, { Zero } from './Num'
import Var from './Var'
import canDiff from './canDiff'

export default class Sum<
  T extends Expr,
  U extends Expr,
  _V extends VarOf<T> | VarOf<U> = VarOf<T> | VarOf<U> // can be extracted by VarOf
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

  static of<T>(left: T, right: Zero): T
  static of<U>(left: Zero, right: U): U
  static of<T extends Expr, U extends Expr>(left: T, right: U): Sum<T, U>

  static of<T extends Expr, U extends Expr>(left: T, right: U) {
    if (Zero.isZero(right)) {
      return left
    }

    if (Zero.isZero(left)) {
      return right
    }

    return new Sum(left, right)
  }

  override toString(): string {
    return `(${ this.#left } + ${ this.#right })`
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

  grad<S extends I & J, I extends VarOf<T>, J extends VarOf<U>>(this: Sum<T, U>, variable: Var<S>): Sum<PartialDerivOf<T, S>, PartialDerivOf<U, S>>
  grad<S extends Exclude<I, J>, I extends VarOf<T>, J extends VarOf<U>>(this: Sum<T, U>, variable: Var<S>): PartialDerivOf<T, S>
  grad<S extends Exclude<J, I>, I extends VarOf<T>, J extends VarOf<U>>(this: Sum<T, U>, variable: Var<S>): PartialDerivOf<U, S>
  grad(variable: Var): Zero // NOTE: It must be at the bottom, and `S` of the `grad()` overloads above it must be appropriately bounded.

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
