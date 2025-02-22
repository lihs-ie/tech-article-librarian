import { List, Map, Set } from "immutable";
import { ValueOf } from "aspects/type";
import { URL, ValueObject } from "../common";
import { injectable } from "inversify";

export const Category = {
  FRONTEND: "frontend",
  BACKEND: "backend",
  DEVOPS: "devops",
  INFRASTRUCTURE: "infrastructure",
  ARTIFICIAL_INTELLIGENCE: "artificial_intelligence",
  MOBILE_APPLICATION: "mobile_application",
  SCALA: "scala",
  DDD: "ddd",
  OTHER: "other",
} as const;

export type Category = ValueOf<typeof Category>;

export const isCategory = (value: unknown): value is Category => {
  return Set(Object.values(Category)).has(value as Category);
};

export class ArticleIdentifier extends ValueObject {
  public static VALUE_VALID_PATTERN = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;

  public constructor(public readonly value: string) {
    super();

    if (!ArticleIdentifier.VALUE_VALID_PATTERN.test(value)) {
      throw new Error("Article identifier must be ULID.");
    }
  }

  public values(): Map<string, unknown> {
    return Map({
      value: this.value,
    });
  }
}

export class Article {
  public static MAX_TITLE_LENGTH = 40;
  public static MAX_DESCRIPTION_LENGTH_WITH_IMAGE = 60;
  public static MAX_DESCRIPTION_LENGTH_WITHOUT_IMAGE = 100;
  public static MAX_IMAGE_URL_LENGTH = 2000;

  public constructor(
    public readonly identifier: ArticleIdentifier,
    public readonly url: URL,
    public readonly title: string,
    public readonly category: Category,
    public readonly published: boolean,
    public readonly description: string | null,
    public readonly image: URL | null
  ) {
    if (title === "" || Article.MAX_TITLE_LENGTH < title.length) {
      throw new Error(
        `Title must be between 1 and ${Article.MAX_TITLE_LENGTH} characters.`
      );
    }

    if (description !== null) {
      const maxDescriptionLength =
        image === null
          ? Article.MAX_DESCRIPTION_LENGTH_WITHOUT_IMAGE
          : Article.MAX_DESCRIPTION_LENGTH_WITH_IMAGE;
      if (description.length > maxDescriptionLength) {
        throw new Error(
          `Description must be less than ${maxDescriptionLength} characters.`
        );
      }
    }

    if (image !== null && Article.MAX_IMAGE_URL_LENGTH < image.value.length) {
      throw new Error(
        `Image URL must be less than ${Article.MAX_IMAGE_URL_LENGTH} characters.`
      );
    }
  }

  public publish(): Article {
    return new Article(
      this.identifier,
      this.url,
      this.title,
      this.category,
      true,
      this.description,
      this.image
    );
  }
}

export const Sort = {
  CREATED_AT_ASC: "created_at_asc",
  CREATED_AT_DESC: "created_at_desc",
} as const;

export type Sort = ValueOf<typeof Sort>;

export class Criteria extends ValueObject {
  public constructor(
    public readonly category: Category | null,
    public readonly published: boolean | null,
    public readonly sort: Sort | null,
    public readonly items: number | null
  ) {
    super();

    if (items !== null && items < 1) {
      throw new Error("Items must be greater than or equal to 1.");
    }
  }

  public values(): Map<string, unknown> {
    return Map({
      category: this.category,
      published: this.published,
      sort: this.sort,
      items: this.items,
    });
  }
}

@injectable()
export abstract class Repository {
  public abstract persist(article: Article): Promise<void>;
  public abstract search(criteria: Criteria): Promise<List<Article>>;
  public abstract publish(articles: List<Article>): Promise<void>;
}
