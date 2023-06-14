type DerivOf<F, V extends VarOf<F> = VarOf<F>> =
  F extends Diffible<infer P, infer D, any> ?
  VarOf<F> extends V ? D : P :
  never
