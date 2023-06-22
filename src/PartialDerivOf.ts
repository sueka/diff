type PartialDerivOf<F, V extends VarOf<F> = VarOf<F>> =
  F extends { grad(this: infer P extends F, variable: any): infer G extends Expr<V> } ?
  VarOf<P> extends V ? G : P :
  never
