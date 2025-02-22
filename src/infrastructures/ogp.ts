import { Adaptor } from "acl/ogp";
import { URL } from "domains/common";
import { OGP, Repository } from "domains/ogp";
import { injectable } from "inversify";

@injectable()
export class ACLOGPRepository implements Repository {
  constructor(private readonly adaptor: Adaptor) {}

  public async find(identifier: URL): Promise<OGP> {
    return this.adaptor.find(identifier);
  }
}
