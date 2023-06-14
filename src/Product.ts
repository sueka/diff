import HashableEq from './HashableEq'
import Num, { One, Zero } from './Num'
import Sum from './Sum'
import Var from './Var'
import canDiff from './canDiff'

export default class Product<
  T extends Expr,
  U extends Expr,
  _V extends VarOf<T> | VarOf<U> = VarOf<T> | VarOf<U> // can be extracted by VarOf
>
extends HashableEq
implements Expr, Diffible<
  Product<T, U>,
  | Num
  | Product<Num, DerivOf<U>>
  | Product<DerivOf<T>, Num>
  | Sum<Product<Var, DerivOf<U>>, U>
  | Sum<T, Product<DerivOf<T>, Var>>
  | Sum<Product<T, DerivOf<U>>, Product<DerivOf<T>, U>>
  ,
  | Num
  | Sum<Product<Var, PartialDerivOf<U>>, U>
  | U
  | Sum<T, Product<PartialDerivOf<T>, Var>>
  | T
  | Sum<Product<T, PartialDerivOf<U>>, Product<PartialDerivOf<T>, U>>
  | Product<T, PartialDerivOf<U>>
  | Product<PartialDerivOf<T>, U>
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

  static of<T>(left: T, right: One): T
  static of<U>(left: One, right: U): U
  static of<T extends Expr, U extends Expr>(left: T, right: U): Product<T, U>

  static of<T extends Expr, U extends Expr>(left: T, right: U) {
    if (Zero.isZero(left) || Zero.isZero(right)) {
      return Zero.instance
    }

    if (One.isOne(right)) {
      return left
    }

    if (One.isOne(left)) {
      return right
    }

    return new Product(left, right)
  }

  override toString(): string {
    return `${ this.#left } * ${ this.#right }`
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
        Product.of(this.#left, this.#right.diff()),
        Product.of(this.#left.diff(), this.#right),
      )
    }

    throw new Error
  }

  // (2x)_x = 2
  grad<S extends J, J extends string>(this: Product<Num, Var<J>>, variable: Var<S>): Num
  grad<S extends I, I extends string>(this: Product<Var<I>, Num>, variable: Var<S>): Num

  // (x f(x, y))_x -> x f(x, y)_x + f(x, y)
  // (x f(y, z))_x -> f(y, z)
  grad<S extends I & J, I extends string, J extends VarOf<U>>(this: Product<Var<I>, U>, variable: Var<S>): Sum<Product<Var, PartialDerivOf<U, S>>, U>
  grad<S extends Exclude<I, J>, I extends string, J extends VarOf<U>>(this: Product<Var<I>, U>, variable: Var<S>): U
  grad<S extends I & J, I extends VarOf<T>, J extends string>(this: Product<T, Var<J>>, variable: Var<S>): Sum<T, Product<PartialDerivOf<T, S>, Var>>
  grad<S extends Exclude<J, I>, I extends VarOf<T>, J extends string>(this: Product<T, Var<J>>, variable: Var<S>): T

  // Leibniz rules:
  // (f(x, y) g(y, z))_y -> f(x, y) g(y, z)_y + f(x, y)_y g(y, z)
  // (f(x, y) g(y, z))_x -> f(x, y)_x g(y, z)
  // (f(x, y) g(y, z))_z -> f(x, y) g(y, z)_z
  // (f(x, y) g(y, z))_k -> 0
  grad<S extends I & J, I extends VarOf<T>, J extends VarOf<U>>(this: Product<T, U>, variable: Var<S>): Sum<Product<T, PartialDerivOf<U, S>>, Product<PartialDerivOf<T, S>, U>>
  grad<S extends Exclude<I, J>, I extends VarOf<T>, J extends VarOf<U>>(this: Product<T, U>, variable: Var<S>): Product<PartialDerivOf<T, S>, U>
  grad<S extends Exclude<J, I>, I extends VarOf<T>, J extends VarOf<U>>(this: Product<T, U>, variable: Var<S>): Product<T, PartialDerivOf<U, S>>
  grad(variable: Var): Zero // NOTE: It must be at the bottom, and `S` of the `grad()` overloads above it must be appropriately bounded.

  grad(variable: Var):
  | Num
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
        Product.of(this.#left, this.#right.grad(variable)),
        Product.of(this.#left.grad(variable), this.#right)
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
