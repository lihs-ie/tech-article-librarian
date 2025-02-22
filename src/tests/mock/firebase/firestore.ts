import { FirebaseBuilder } from "acl/common";
import { ValueOf } from "aspects/type";
import { QueryConstraint, QueryConstraintType } from "firebase/firestore";
import { List } from "immutable";

class FirestoreMock<T extends { identifier: string }, C extends string> {
  public store: Record<C, Array<T>>;

  public type: "firestore-lite" | "firestore" = "firestore";

  public constructor(initial: Record<C, Array<T>>) {
    this.store = initial;
  }

  get app() {
    return {} as any;
  }

  toJSON(): Record<string, Array<T>> {
    return this.store;
  }
}

export abstract class QueryConstraintMock implements QueryConstraint {
  type: QueryConstraintType;
  public readonly process: (...args: any[]) => any;

  constructor(type: QueryConstraintType, ...args: any[]) {
    this.type = type;
    this.process = this.createProcess(args);
  }

  protected abstract createProcess(...args: any[]): any;
}

export class WhereQueryConstraintMock<
  T extends { identifier: string }
> extends QueryConstraintMock {
  constructor(
    private readonly field: keyof T,
    private readonly expected: any,
    private readonly equals: (comparand: ValueOf<T>, expected: any) => boolean
  ) {
    super("where");
  }

  public orderBy(values: Array<T>, compare: (left: T, right: T) => number): Array<T> {
    return values.sort(compare);
  }

  protected createProcess(...args: any[]) {
    return (values: Array<T>) =>
      values.filter((value) => this.equals(value[this.field], this.expected));
  }
}

export class SortQueryConstraintMock<T extends { identifier: string }> extends QueryConstraintMock {
  constructor(private readonly field: keyof T, private readonly order: "asc" | "desc") {
    super("orderBy");
  }

  protected createProcess(...args: any[]) {
    return (values: Array<T>) => {
      return values.sort((left, right) => {
        if (this.order === "asc") {
          return left[this.field] > right[this.field] ? 1 : -1;
        } else {
          return left[this.field] < right[this.field] ? 1 : -1;
        }
      });
    };
  }
}

export class FirebaseBuilderMock<
  T extends { identifier: string },
  C extends string
> extends FirebaseBuilder<T> {
  constructor(collectionName: C, initial: Record<C, Array<T>>) {
    super(new FirestoreMock(initial), collectionName);
  }

  public override async persist(data: T): Promise<void> {
    const store = this.database.toJSON() as Record<string, Array<T>>;

    const index = store[this.collectionName].indexOf(data);

    if (index >= 0) {
      store[this.collectionName][index] = data;
    } else {
      store[this.collectionName].push(data);
    }
  }

  public override async search(...constrants: Array<QueryConstraintMock>): Promise<List<T>> {
    const store = this.database.toJSON() as Record<string, Array<T>>;

    let values = store[this.collectionName];

    List(constrants)
      .map((constraint) => constraint.process)
      .forEach((process) => {
        values = process(values);
      });

    return List(values);
  }
}
