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
  Sum<Product<T, DerivOf<U>>, Product<DerivOf<T>, U>>,
  Sum<Product<T, PartialDerivOf<U>>, Product<PartialDerivOf<T>, U>>
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

  diff(): Sum<Product<T, DerivOf<U>>, Product<DerivOf<T>, U>> {
    if (canDiff(this.#left) && canDiff(this.#right)) {
      return Sum.of(
        Product.of(this.#left, this.#right.diff()),
        Product.of(this.#left.diff(), this.#right),
      )
    }

    throw new Error
  }

  grad<S extends string>(variable: Var<string>): Sum<Product<T, PartialDerivOf<U>>, Product<PartialDerivOf<T>, U>> {
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
