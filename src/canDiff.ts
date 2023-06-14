// TODO: Make a brand check if needed
export default function canDiff<F extends Expr>(expr: F): expr is F & Diffible<F, DerivOf<F>> {
  return 'diff' in expr && typeof expr.diff === 'function'
}
