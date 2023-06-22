import { Set } from 'immutable'
import HashableEq from './HashableEq'
import Num, { One, Zero } from './Num'
import Sum from './Sum'
import Var from './Var'
import canDiff from './canDiff'

export default class Product<
  T extends Expr,
  U extends Expr,
  V extends VarOf<T> | VarOf<U> = VarOf<T> | VarOf<U> // can be extracted by VarOf
>
extends HashableEq
implements Expr<V>, Diffible {
  #left: T
  #right: U

  declare _exprBrand: never

  private constructor(left: T, right: U) {
    super()

    this.#left = left
    this.#right = right
  }

  static of(left: unknown, right: Zero, raw?: false): Zero
  static of(left: Zero, right: unknown, raw?: false): Zero
  static of<T>(left: T, right: One, raw?: false): T
  static of<U>(left: One, right: U, raw?: false): U
  static of(left: Num, right: Num, raw?: false): Num
  static of<T extends Expr, U extends Expr>(left: T, right: U, raw?: boolean): Product<T, U>

  static of<T extends Expr, U extends Expr>(left: T, right: U, raw = false):
  | Zero
  // | T
  // | U
  | Num
  | Product<T, U>
  {
    if (raw) {
      return new Product(left, right)
    }

    return new Product(left, right).simple()
  }

  simple(this: Product<T, Zero>): Zero
  simple(this: Product<Zero, U>): Zero
  simple(this: Product<T, One>): T
  simple(this: Product<One, U>): U
  simple(this: Product<Num, Num>): Num
  simple(): this

  simple() {
    if (Zero.isZero(this.#left) || Zero.isZero(this.#right)) {
      return Zero.instance
    }

    if (One.isOne(this.#right)) {
      return this.#left.simple()
    }

    if (One.isOne(this.#left)) {
      return this.#right.simple()
    }

    if (this.#left instanceof Num && this.#right instanceof Num) {
      return Num.of(this.#left.value * this.#right.value)
    }

    const l = this.#left.simple()
    const r = this.#right.simple()

    if (l.equals(this.#left) && r.equals(this.#right)) {
      return this
    }

    return Product.of(l, r).simple()
  }

  override toString(): string {
    return `${ this.#left } * ${ this.#right }`
  }

  degree(variable?: Var<V>): number {
    const l = this.#left.degree(variable)
    const r = this.#right.degree(variable)

    return l + r
  }

  vars(): Set<Var<V>> {
    return Set([
      ...this.#left.vars(),
      ...this.#right.vars(),
    ] as Var<V>[])
  }

  // (2x)' = 2
  diff(this: Product<Num, Var>): Num
  diff(this: Product<Var, Num>): Num

  // (2 f(x))' -> 2 f'(x)
  diff(this: Product<Num, U>): Product<Num, DerivOf<U>>
  diff(this: Product<T, Num>): Product<DerivOf<T>, Num>

  // (x f(x))' -> x f'(x) + f(x)
  diff(this: Product<Var, U>): Sum<Product<Var, DerivOf<U>>, U>
  diff(this: Product<T, Var>): Sum<T, Product<DerivOf<T>, Var>>

  // Leibniz rule: (f(x) g(x))' -> f(x) g'(x) + f'(x) g(x)
  diff(): Sum<Product<T, DerivOf<U>>, Product<DerivOf<T>, U>>

  diff():
  | Num
  | Product<Num, DerivOf<U>>
  | Product<DerivOf<T>, Num>
  | Sum<Product<Var, DerivOf<U>>, U>
  | Sum<T, Product<DerivOf<T>, Var>>
  | Sum<Product<T, DerivOf<U>>, Product<DerivOf<T>, U>>
  {
    if (canDiff(this.#left) && canDiff(this.#right)) {
      return Sum.of(
        Product.of(this.#left, this.#right.diff() as DerivOf<U>),
        Product.of(this.#left.diff() as DerivOf<T>, this.#right),
      )
    }

    throw new Error
  }

  // (x f(x, y))_x -> x f(x, y)_x + f(x, y)
  // (x f(y, z))_x -> f(y, z)
  grad<S extends I & J, I extends string, J extends VarOf<U>>(this: Product<Var<I>, U>, variable: Var<S>): Sum<Product<Var<I>, PartialDerivOf<U, S>>, U>
  grad<S extends Exclude<I, J>, I extends string, J extends VarOf<U>>(this: Product<Var<I>, U>, variable: Var<S>): U
  grad<S extends I & J, I extends VarOf<T>, J extends string>(this: Product<T, Var<J>>, variable: Var<S>): Sum<T, Product<PartialDerivOf<T, S>, Var<J>>>
  grad<S extends Exclude<J, I>, I extends VarOf<T>, J extends string>(this: Product<T, Var<J>>, variable: Var<S>): T

  // Leibniz rule:
  // (f(x, y) g(z, x))_x -> f(x, y) g(z, x)_x + f(x, y)_x g(z, x)
  // (f(x, y) g(z, x))_y -> f(x, y)_y g(z, x)
  // (f(x, y) g(z, x))_z -> f(x, y) g(z, x)_z
  // (f(x, y) g(z, x))_k -> 0
  grad<S extends I & J, I extends VarOf<T>, J extends VarOf<U>>(this: Product<T, U>, variable: Var<S>): Sum<Product<T, PartialDerivOf<U, S>>, Product<PartialDerivOf<T, S>, U>>
  grad<S extends Exclude<I, J>, I extends VarOf<T>, J extends VarOf<U>>(this: Product<T, U>, variable: Var<S>): Product<PartialDerivOf<T, S>, U>
  grad<S extends Exclude<J, I>, I extends VarOf<T>, J extends VarOf<U>>(this: Product<T, U>, variable: Var<S>): Product<T, PartialDerivOf<U, S>>

  // NOTE: It must be at the bottom, and `S` of the `grad()` overloads above it must be appropriately bounded.
  // NOTE: If `this` is omitted, it may be chosen in preference to other overloads.
  grad(this: Product<T, U>, variable: Var): Zero

  grad(variable: Var):
  | Sum<Product<Var, PartialDerivOf<U>>, U>
  | U
  | Sum<T, Product<PartialDerivOf<T>, Var>>
  | T
  | Sum<Product<T, PartialDerivOf<U>>, Product<PartialDerivOf<T>, U>>
  | Product<T, PartialDerivOf<U>>
  | Product<PartialDerivOf<T>, U>
  | Zero
  {
    if (canDiff(this.#left) && canDiff(this.#right)) {
      return Sum.of(
        Product.of(this.#left, this.#right.grad(variable) as PartialDerivOf<U>),
        Product.of(this.#left.grad(variable) as PartialDerivOf<T>, this.#right)
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

    return 61 * l + r
  }
}
