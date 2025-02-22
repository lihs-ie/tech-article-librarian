import { ValueOf } from "aspects/type";
import { URL } from "domains/common";
import { Set } from "immutable";
import { injectable } from "inversify";

export const OGPType = {
  WEBSITE: "website",
  ARTICLE: "article",
  PROFILE: "profile",
} as const;

export type OGPType = ValueOf<typeof OGPType>;

export const isOGPType = (value: string | null): value is OGPType => {
  return Set(Object.values(OGPType)).has(value as OGPType);
};

export class OGP {
  public constructor(
    public readonly identifier: URL,
    public readonly type: OGPType,
    public readonly title: string,
    public readonly image: URL | null,
    public readonly description: string | null
  ) {
    if (title === "") {
      throw new Error("Title must not be empty.");
    }

    if (description && description === "") {
      throw new Error("Description must not be empty.");
    }
  }
}

@injectable()
export abstract class Repository {
  public abstract find(identifier: URL): Promise<OGP>;
}
