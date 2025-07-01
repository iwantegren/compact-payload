import { PayloadHandler, PayloadSchema } from "./index";

describe("PayloadHelper", () => {
  const Schema: PayloadSchema = {
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

  let payloadHelper: PayloadHandler<typeof Schema>;

  beforeEach(() => {
    payloadHelper = new PayloadHandler<typeof Schema>();
  });

  const payloadJson = {
    payloadNum: 1,
    payloadStr: "str",
    payloadBool: true,
    payloadNullNum: null,
  };
  const payloadStr = "key1|1|str|t|null";

  describe("stringify", () => {
    it("should serialize payload correctly with different data types", () => {
      // const result = payloadHelper.stringify(Schema.KEY_1, payloadJson);
      const result = payloadHelper.stringify(Schema.KEY_1, {
        payloadNum: 1,
        payloadStr: "str",
        // payloadBool: true,
        // payloadNullNum: null,
      });

      expect(result).toBe(payloadStr);
    });
  });

  describe("parse", () => {
    it("should parse encoded string to correct payload", () => {
      const parsedPayload = payloadHelper.parse(Schema.KEY_1, payloadStr);

      expect(parsedPayload).toEqual({ key: Schema.KEY_1.key, ...payloadJson });
    });
  });

  describe("marry-go-round", () => {
    it("should marry-go-round correctly", () => {
      const stringified = payloadHelper.stringify(Schema.KEY_1, payloadJson);
      const parsed = payloadHelper.parse(Schema.KEY_1, stringified);

      expect(parsed).toEqual({ key: Schema.KEY_1.key, ...payloadJson });
    });
  });
});
