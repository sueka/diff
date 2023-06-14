type DerivOf<F, V extends string = string> =
  F extends Diffible<infer P, infer D> ?
  VarOf<P> extends V ? D : P :
  never
