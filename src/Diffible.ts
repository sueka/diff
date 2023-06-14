interface Diffible<P extends Expr, D extends Expr> {
  diff(this: P): D
}
