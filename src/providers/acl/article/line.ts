import { Adaptor, Writer } from "acl/article/line";
import { acl } from "config";
import { ContainerModule } from "inversify";

export const aclArticleLine = new ContainerModule((bind) => {
  bind(Writer).toDynamicValue(
    () =>
      new Writer(
        acl.line.USER_ID,
        acl.line.image.NO_IMAGE_URL,
        acl.line.image.BACKGROUND_COLORS
      )
  );

  bind(Adaptor).toDynamicValue(
    (context) =>
      new Adaptor(
        context.container.get(Writer),
        acl.line.API_ENDPOINT,
        acl.line.CHANNEL_ACCESS_TOKENS
      )
  );
});
