import { injectable } from "inversify";
import { ArticleAdaptor } from "../common";
import {
  Article,
  ArticleIdentifier,
  Category,
  Criteria,
  Sort,
} from "domains/article";

import { List } from "immutable";
import { QueryConstraint } from "firebase/firestore";
import { FirebaseBuilder, Query } from "acl/common";
import { URL } from "domains/common";

type Document = {
  identifier: string;
  url: string;
  title: string;
  category: Category;
  published: boolean;
  description: string | null;
  image: string | null;
};

@injectable()
export class Adaptor extends ArticleAdaptor {
  constructor(private readonly builder: FirebaseBuilder<Document>) {
    super();
  }

  public async persist(article: Article): Promise<void> {
    const document = this.dehydrate(article);

    try {
      await this.builder.persist(document);
    } catch (error) {
      console.error(`Failed to persist article: ${(error as Error).message}`);
      throw error;
    }
  }

  public async search(criteria: Criteria): Promise<List<Article>> {
    const query = this.createQuery(criteria);

    const documents = await this.builder.search(...query);

    return documents.map((document) => this.restore(document));
  }

  public async publish(articles: List<Article>): Promise<void> {
    await Promise.all(
      articles.map((article) => this.persist(article.publish()))
    );
  }

  private dehydrate(article: Article): Document {
    return {
      identifier: article.identifier.value,
      url: article.url.value,
      title: article.title,
      category: article.category,
      published: article.published,
      description: article.description ?? null,
      image: article.image?.value ?? null,
    };
  }

  private restore(document: Document): Article {
    return new Article(
      new ArticleIdentifier(document.identifier),
      new URL(document.url),
      document.title,
      document.category,
      document.published,
      document.description,
      document.image ? new URL(document.image) : null
    );
  }

  private createQuery(criteria: Criteria): Array<Query> {
    const constraints: Array<Query> = [];

    if (criteria.category) {
      constraints.push({
        type: "where",
        field: "category",
        operator: "==",
        value: criteria.category,
      });
    }

    if (criteria.published) {
      constraints.push({
        type: "where",
        field: "published",
        operator: "==",
        value: String(criteria.published),
      });
    }

    if (criteria.items) {
      constraints.push({ type: "limit", value: criteria.items });
    }

    if (criteria.sort) {
      switch (criteria.sort) {
        case Sort.CREATED_AT_ASC:
          constraints.push({
            type: "orderBy",
            field: "createdAt",
            direction: "asc",
          });
          break;

        case Sort.CREATED_AT_DESC:
          constraints.push({
            type: "orderBy",
            field: "createdAt",
            direction: "desc",
          });
          break;

        default:
          constraints.push({
            type: "orderBy",
            field: "createdAt",
            direction: "asc",
          });
          break;
      }
    }

    return constraints;
  }
}
