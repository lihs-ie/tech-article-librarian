import { Container } from "inversify";
import { acl } from "./acl";
import { infrastructures } from "./infrastructures";
import { useCases } from "./use-cases";

const container = new Container();

container.load(...acl, ...infrastructures, ...useCases);

export { container };
