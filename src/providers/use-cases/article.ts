import { Repository as ArticleRepository } from "domains/article";
import { Repository as OGPRepository } from "domains/ogp";
import { ContainerModule } from "inversify";
import { Article } from "use-cases";

export const useCaseArticle = new ContainerModule((bind) => {
  bind(Article).toDynamicValue(
    (context) =>
      new Article(context.container.get(ArticleRepository), context.container.get(OGPRepository))
  );
});
