interface Diffible<T extends Expr, U extends Expr> {
  diff(this: T): U
}
