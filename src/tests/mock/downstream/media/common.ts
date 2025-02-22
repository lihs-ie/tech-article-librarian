export abstract class Media<T extends object, M extends object> {
  protected readonly _data: Required<T>;

  public constructor(protected readonly overrides?: T | M) {
    this._data = this.fill(overrides);
  }

  public data(): Required<T> {
    return this._data;
  }

  public abstract createContent(): string;

  protected abstract fillByModel(overrides: M): T;

  protected abstract fill(overrides?: T | M): Required<T>;
}
