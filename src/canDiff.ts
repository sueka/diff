// TODO: Make a brand check if needed
export default function canDiff<F extends Expr>(expr: F): expr is F & Diffible<F, DerivOf<F>, PartialDerivOf<F>> {
  return 'diff' in expr && typeof expr.diff === 'function' &&
         'grad' in expr && typeof expr.grad === 'function'
}
