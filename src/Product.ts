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
  | Sum<Product<T, DerivOf<U>>, Product<DerivOf<T>, U>>
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

  hashCode() {
    let l = this.#left.hashCode()
    let r = this.#right.hashCode()

    if (l > r) {
      ;[r, l] = [l, r]
    }

    return 61 * l + r
  }
}
