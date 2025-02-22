import { ArticleAdaptor } from "acl/article/common";
import { Article, Criteria, Repository } from "domains/article";
import { List, Map } from "immutable";
import { injectable } from "inversify";

export type AdaptorType = "persistence" | "acl";

@injectable()
export class DelegateArticleRepository implements Repository {
  constructor(private readonly adaptors: Map<AdaptorType, ArticleAdaptor>) {}

  public async persist(article: Article): Promise<void> {
    await this.adaptor("persistence").persist(article);
  }

  public async search(criteria: Criteria): Promise<List<Article>> {
    return await this.adaptor("persistence").search(criteria);
  }

  public async publish(articles: List<Article>): Promise<void> {
    await this.adaptor("acl").publish(articles);

    const persistence = this.adaptor("persistence");

    await persistence.publish(articles);
  }

  private adaptor(type: AdaptorType): ArticleAdaptor {
    return this.adaptors.get(type)!;
  }
}
