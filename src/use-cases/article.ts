import {
  Article as Entity,
  Repository as ArticleRepository,
  Category,
  Criteria,
  ArticleIdentifier,
  Sort,
} from "domains/article";
import { URL } from "domains/common";
import { Repository as OGPRepository } from "domains/ogp";
import { List } from "immutable";
import { injectable } from "inversify";
import { ulid } from "ulidx";
import { z } from "zod";

export type Condition = {
  category?: Category;
  published?: boolean;
  sort?: Sort;
  items?: number;
};

@injectable()
export class Article {
  public constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly ogpRepository: OGPRepository
  ) {}

  public async persist(
    url: URL,
    category: Category,
    published: boolean
  ): Promise<void> {
    const ogp = await this.ogpRepository.find(url);

    // titleがurlの場合はスパムとみなしreturn
    if (z.string().url().safeParse(ogp.title).success) {
      console.warn(`Spam detected: ${JSON.stringify(ogp)}`);
      return;
    }

    const image = ogp.image
      ? ogp.image.value.length < Entity.MAX_IMAGE_URL_LENGTH
        ? ogp.image
        : null
      : null;

    let description = null;

    if (ogp.description) {
      description =
        ogp.description.length < Entity.MAX_DESCRIPTION_LENGTH_WITH_IMAGE
          ? ogp.description
          : ogp.description.slice(
              0,
              Entity.MAX_DESCRIPTION_LENGTH_WITH_IMAGE - 1
            ) + "…";
    }

    const title =
      ogp.title.length < Entity.MAX_TITLE_LENGTH
        ? ogp.title
        : ogp.title.slice(0, Entity.MAX_TITLE_LENGTH - 1) + "…";

    const article = new Entity(
      new ArticleIdentifier(ulid()),
      url,
      title,
      category,
      published,
      description,
      image
    );

    await this.articleRepository.persist(article);
  }

  public async search(condition: Condition): Promise<List<Entity>> {
    const criteria = new Criteria(
      condition.category ?? null,
      condition.published ?? null,
      condition.sort ?? null,
      condition.items ?? null
    );

    return this.articleRepository.search(criteria);
  }

  public async publish(articles: List<Entity>): Promise<void> {
    await this.articleRepository.publish(articles);
  }
}
