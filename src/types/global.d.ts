type Merge<A, B> = { [K in keyof A]: K extends keyof B ? B[K] : A[K] } & B extends infer O
  ? { [K in keyof O]: O[K] }
  : never;

// 获得对象上某个属性的类型，比如 ValueOf<{ a: object }, 'a'> 得到object
type ValueOf<T extends Record<string, any>, K> = K extends keyof T ? T[K] : never;

type ComponentOptions = Array<{ value: string; label: string }>;

declare let If: React.FunctionComponent<{ condition: boolean }>;
declare let For: React.FunctionComponent<{ each: string; index: string; of: any[] }>;
declare let Choose: React.FunctionComponent;
declare let When: React.FunctionComponent<{ condition: boolean }>;
declare let Otherwise: React.FunctionComponent;

interface Obj<T extends any> {
  [k: string]: T;
}
