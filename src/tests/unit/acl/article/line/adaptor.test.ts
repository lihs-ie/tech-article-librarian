import { Adaptor, Writer } from "acl/article/line";
import { Category } from "domains/article";
import { Map } from "immutable";
import { beforeEach } from "node:test";
import { Builder, StringFactory } from "tests/factories/common";
import { ArticleFactory } from "tests/factories/domains/article";
import { URLFactory } from "tests/factories/domains/common";
import { Type } from "tests/mock/upstream/common";
import { prepare } from "tests/mock/upstream/line";
import { afterEach, describe, expect, it } from "vitest";

const endpoint = "http://localhost:8080";

const createAdaptor = (
  overrides?: Partial<{
    writer: Writer;
    endpoint: string;
    accessToken: string;
    retryKey: string;
  }>
) =>
  new Adaptor(
    overrides?.writer ??
      new Writer(
        Builder.get(StringFactory(1, 40)).build(),
        "http://test.com",
        Map()
      ),
    overrides?.endpoint ?? endpoint,
    overrides?.accessToken ?? Builder.get(StringFactory(1, 40)).build(),
    overrides?.retryKey ?? Builder.get(StringFactory(1, 40)).build()
  );

describe("Package adaptor", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
  describe("class adaptor", () => {
    describe("instantiate", () => {
      it("success.", () => {
        const adaptor = new Adaptor(
          new Writer("user", "https://example.com", Map()),
          "http://localhost",
          Builder.get(StringFactory(1, 40)).build(),
          Builder.get(StringFactory(1, 40)).build()
        );

        expect(adaptor).toBeInstanceOf(Adaptor);
      });
    });

    // describe("publish", () => {
    //   describe("success.", () => {
    //     it("returns void.", async () => {
    //       const user = Builder.get(StringFactory(1, 40)).build();
    //       const noImageURL = Builder.get(URLFactory).build();
    //       const backGroundColors = Map<Category, string>();
    //       const accessToken = Builder.get(StringFactory(1, 40)).build();
    //       const retryKey = Builder.get(StringFactory(1, 40)).build();
    //       const writer = new Writer(user, noImageURL.value, backGroundColors);

    //       const adaptor = createAdaptor({ writer, accessToken, retryKey });

    //       const articles = Builder.get(ArticleFactory).buildList(5);

    //       prepare(endpoint, (upstream) =>
    //         upstream.addPushMessage(Type.OK, {
    //           model: articles,
    //           user,
    //           accessToken,
    //           retryKey,
    //           noImageURL,
    //           backGroundColors,
    //         })
    //       );

    //       expect(await adaptor.publish(articles));
    //     });
    //   });
    // });
  });
});
