import { LineResource, Overrides } from "./resource";
import { inject, Type, Upstream } from "../common";

export class Line extends Upstream {
  public addPushMessage(type: Type, overrides?: Overrides): LineResource {
    const resource = new LineResource(type, overrides);

    this.add(resource);

    return resource;
  }
}

export const prepare = <T>(
  endpoint: string,
  registerer: (upstream: Line) => T
): T => {
  const upstream = new Line(endpoint);

  const resources = registerer(upstream);

  inject(upstream);

  return resources;
};
