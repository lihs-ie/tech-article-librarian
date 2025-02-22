import { Adaptor } from "acl/ogp";
import { Repository } from "domains/ogp";
import { ACLOGPRepository } from "infrastructures";
import { ContainerModule } from "inversify";

export const infrastructureOGP = new ContainerModule((bind) => {
  bind(Repository).toDynamicValue(
    (context) => new ACLOGPRepository(context.container.get(Adaptor))
  );
});
