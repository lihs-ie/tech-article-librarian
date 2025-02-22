import { OGPResource, Overrides } from "./resource";
import { inject, Type, Upstream } from "../common";

export class OGP extends Upstream {
  public addResource(type: Type, overrides?: Overrides): OGPResource {
    const resource = new OGPResource(type, overrides);

    this.add(resource);

    return resource;
  }
}

export const prepare = <T>(
  endpoint: string,
  registerer: (upstream: OGP) => T
): T => {
  const upstream = new OGP(endpoint);

  const resources = registerer(upstream);

  inject(upstream);

  return resources;
};
