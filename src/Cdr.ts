type Cdr<TS extends unknown[]> = TS extends [any, ...infer Cdr] ? Cdr : TS
