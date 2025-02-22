import {
  Article,
  ArticleIdentifier,
  Category,
  Criteria,
  Sort,
} from "domains/article";
import { URL } from "domains/common";
import { ulid } from "ulidx";
import { Builder, EnumFactory, Factory, StringFactory } from "../../common";
import { URLFactory } from "../common";

export const CategoryFactory = EnumFactory(Category);

export class ArticleIdentifierFactory extends Factory<
  ArticleIdentifier,
  { value: string }
> {
  protected instantiate(properties: { value: string }): ArticleIdentifier {
    return new ArticleIdentifier(properties.value);
  }

  protected prepare(
    overrides: Partial<{ value: string }>,
    seed: number
  ): { value: string } {
    return {
      value: ulid(Math.floor(seed / 281474976710655)),
      ...overrides,
    };
  }

  protected retrieve(instance: ArticleIdentifier): { value: string } {
    return {
      value: instance.value,
    };
  }
}

export type ArticleProperties = {
  identifier: ArticleIdentifier;
  url: URL;
  title: string;
  category: Category;
  published: boolean;
  description: string | null;
  image: URL | null;
};

export class ArticleFactory extends Factory<Article, ArticleProperties> {
  protected instantiate(properties: ArticleProperties): Article {
    return new Article(
      properties.identifier,
      properties.url,
      properties.title,
      properties.category,
      properties.published,
      properties.description,
      properties.image
    );
  }

  protected prepare(
    overrides: Partial<ArticleProperties>,
    seed: number
  ): ArticleProperties {
    return {
      identifier: Builder.get(ArticleIdentifierFactory).buildWith(seed),
      url: Builder.get(URLFactory).buildWith(seed),
      title: Builder.get(StringFactory(1, Article.MAX_TITLE_LENGTH)).buildWith(
        seed
      ),
      category: Builder.get(CategoryFactory).buildWith(seed),
      published: true,
      description: Builder.get(
        StringFactory(1, Article.MAX_DESCRIPTION_LENGTH_WITH_IMAGE)
      ).buildWith(seed),
      image: Builder.get(URLFactory).buildWith(seed),
      ...overrides,
    };
  }

  protected retrieve(instance: Article): ArticleProperties {
    return {
      identifier: instance.identifier,
      url: instance.url,
      title: instance.title,
      category: instance.category,
      published: instance.published,
      description: instance.description,
      image: instance.image,
    };
  }
}

export const SortFactory = EnumFactory(Sort);

export type CriteriaProperties = {
  category: Category | null;
  published: boolean | null;
  sort: Sort | null;
  items: number | null;
  fulfilled?: boolean;
};

export class CriteriaFactory extends Factory<Criteria, CriteriaProperties> {
  protected instantiate(properties: CriteriaProperties): Criteria {
    return new Criteria(
      properties.category,
      properties.published,
      properties.sort,
      properties.items
    );
  }

  protected prepare(
    overrides: Partial<CriteriaProperties>,
    seed: number
  ): CriteriaProperties {
    if (overrides.fulfilled) {
      return {
        category: Builder.get(CategoryFactory).buildWith(seed),
        published: Math.random() < 0.5,
        sort: Builder.get(SortFactory).buildWith(seed),
        items: Math.floor(seed / 10) + 1,
        ...overrides,
      };
    }

    return {
      category: null,
      published: true,
      sort: null,
      items: null,
      ...overrides,
    };
  }

  protected retrieve(instance: Criteria): CriteriaProperties {
    return {
      category: instance.category,
      published: instance.published,
      sort: instance.sort,
      items: instance.items,
    };
  }
}
