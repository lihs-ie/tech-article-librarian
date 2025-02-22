import { AbstractAdaptor } from "acl/common";
import { Article, Criteria } from "domains/article";
import { List } from "immutable";
import { injectable } from "inversify";

@injectable()
export abstract class ArticleAdaptor extends AbstractAdaptor {
  public abstract persist(article: Article): Promise<void>;
  public abstract search(criteria: Criteria): Promise<List<Article>>;
  public abstract publish(articles: List<Article>): Promise<void>;
}
