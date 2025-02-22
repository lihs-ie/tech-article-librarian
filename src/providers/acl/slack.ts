import { Adaptor, Translator } from "acl/slack";
import { acl } from "config";
import { ContainerModule } from "inversify";

export const aclSlack = new ContainerModule((bind) => {
  bind(Translator).toDynamicValue(() => new Translator(acl.slack.CATEGORIES));

  bind(Adaptor).toDynamicValue(
    (context) => new Adaptor(context.container.get(Translator))
  );
});
