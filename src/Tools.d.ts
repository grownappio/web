type Assign<A,B> = Omit<A, keyof B> & {[K in keyof B]: B[K]}

type Arrayable<T> = Array<T> | T

type Promisable<T> = Promise<T> | T