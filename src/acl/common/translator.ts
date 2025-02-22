export interface Translator<M, T> {
  translate: (media: M, ...args: Array<any>) => T;
}
