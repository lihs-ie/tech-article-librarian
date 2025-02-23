import { firestore } from "firebase-admin";
import { List } from "immutable";

type Where = {
  type: "where";
  field: string;
  operator: firestore.WhereFilterOp;
  value: string;
};

type OrderBy = {
  type: "orderBy";
  field: string;
  direction: firestore.OrderByDirection;
};

type Limit = {
  type: "limit";
  value: number;
};

export type Query = Where | OrderBy | Limit;

export class FirebaseBuilder<T extends { identifier: string }> {
  constructor(
    protected readonly database: firestore.Firestore,
    protected readonly collectionName: string
  ) {}

  public async persist(data: T): Promise<void> {
    const reference = this.collection().doc(data.identifier);

    const target = await reference.get();

    const candidate = {
      ...data,
      createdAt: target.exists
        ? target.data()?.createdAt
        : firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    await reference.set(candidate);
  }

  public async search(...constraints: Array<Query>): Promise<List<T>> {
    const query = constraints.reduce((carry, current) => {
      switch (current.type) {
        case "where":
          return carry.where(current.field, current.operator, current.value);

        case "orderBy":
          return carry.orderBy(current.field, current.direction);

        case "limit":
          return carry.limit(current.value);

        default:
          throw new Error(`Unknown query type: ${current}.`);
      }
    }, this.collection() as firestore.Query);

    const documents = await query.get();

    return List(documents.docs.map((document) => document.data() as T));
  }

  protected collection(): firestore.CollectionReference {
    return this.database.collection(this.collectionName);
  }
}
