import { PayloadHelper, TGCallbackActions } from "./index";

describe("PayloadHelper", () => {
  let payloadHelper: PayloadHelper;

  beforeEach(() => {
    payloadHelper = new PayloadHelper();
  });

  const schema = {
    KEY_1: {
      key: "key1",
      payload: {
        payloadNum: "number",
        payloadStr: "string",
        payloadBool: "boolean",
        payloadNullNum: "number | null",
      },
    },
  } as const;

  const payloadJson = {
    payloadNum: 1,
    payloadStr: "str",
    payloadBool: true,
    payloadNullNum: null,
  };
  const payloadStr = "key1|1|str|t|null";

  describe("stringify", () => {
    it("should serialize payload correctly with different data types", () => {
      const result = payloadHelper.stringify(schema.KEY_1, payloadJson);

      expect(result).toBe(payloadStr);
    });
  });

  describe("parse", () => {
    it("should parse encoded string to correct payload", () => {
      const parsedPayload = payloadHelper.parse(schema.KEY_1, payloadStr);

      expect(parsedPayload).toEqual({ key: schema.KEY_1.key, ...payloadJson });
    });
  });

  describe("marry-go-round", () => {
    it("should marry-go-round correctly", () => {
      const stringified = payloadHelper.stringify(schema.KEY_1, payloadJson);
      const parsed = payloadHelper.parse(schema.KEY_1, stringified);

      expect(parsed).toEqual({ key: schema.KEY_1.key, ...payloadJson });
    });
  });
});
