import { ArticleAdaptor } from "acl/article/common";
import { Adaptor as PersistenceAdaptor } from "acl/article/firebase";
import { Adaptor as ACLAdaptor } from "acl/article/line";
import { Repository } from "domains/article";
import { Map } from "immutable";
import { AdaptorType, DelegateArticleRepository } from "infrastructures";
import { ContainerModule } from "inversify";

export const infrastructureArticle = new ContainerModule((bind) => {
  bind(Repository).toDynamicValue(
    (context) =>
      new DelegateArticleRepository(
        Map<AdaptorType, ArticleAdaptor>({
          acl: context.container.get(ACLAdaptor),
          persistence: context.container.get(PersistenceAdaptor),
        })
      )
  );
});
