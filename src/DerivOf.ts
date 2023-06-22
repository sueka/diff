type DerivOf<F, V extends VarOf<F> = VarOf<F>> =
  F extends { diff(this: infer P extends F): infer D extends Expr<V> } ?
  VarOf<F> extends V ? D : P :
  never
