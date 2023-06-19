type PartialDerivOf<F, V extends VarOf<F> = VarOf<F>> =
  F extends Diffible<infer P, any, infer G> ?
  VarOf<P> extends V ? G : P :
  never
