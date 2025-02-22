import { Adaptor, Reader, Translator } from "acl/ogp";
import { acl } from "config";
import { ContainerModule } from "inversify";

export const aclOgp = new ContainerModule((bind) => {
  bind(Reader).toSelf();
  bind(Translator).toSelf();

  bind(Adaptor).toDynamicValue(
    (context) =>
      new Adaptor(
        context.container.get(Reader),
        context.container.get(Translator),
        acl.ogp.USER_AGENT
      )
  );
});
