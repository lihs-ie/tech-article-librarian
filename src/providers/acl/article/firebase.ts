import { Adaptor } from "acl/article/firebase";
import { FirebaseBuilder } from "acl/common";
import { acl } from "config";
import { ContainerModule } from "inversify";
import admin from "firebase-admin";

admin
  .auth(
    admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(acl.firebase.SERVICE_ACCOUNT_KEY)
      ),
    })
  )
  .setCustomUserClaims(acl.firebase.USER_ID, { app: acl.firebase.APP_ID })
  .then(() => console.log("firebase user claims set"))
  .catch((error) => console.error("firebase user claims error", error));

export const aclArticleFirebase = new ContainerModule((bind) => {
  bind(Adaptor).toDynamicValue(
    () => new Adaptor(new FirebaseBuilder(admin.firestore(), "articles"))
  );
});
