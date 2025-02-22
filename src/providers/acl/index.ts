import { aclArticle } from "./article";
import { aclOgp } from "./ogp";
import { aclSlack } from "./slack";

export const acl = [...aclArticle, aclOgp, aclSlack];
