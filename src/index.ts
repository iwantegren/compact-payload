type TypeMapping = {
  number: number;
  string: string;
  boolean: boolean;
  "number | null": number | null;
};

export type PayloadItem = {
  key: string;
  payload: Record<string, keyof TypeMapping>;
};

export type PayloadRecords = Record<string, PayloadItem>;

export const TGCallbackActions: PayloadRecords = {
  NOTE_LIST: {
    key: "nList",
    payload: { categoryId: "number | null", isAll: "boolean" },
  },
  NOTE_GO_VIEW: {
    key: "nGoView",
    payload: { noteId: "number", view: "string" },
  },
  NOTE_PARAM_SWITCH: {
    key: "nPmSw",
    payload: {
      noteId: "number",
      viewRedirect: "string",
      param: "string",
      switchValue: "boolean",
    },
  },
  NOTE_PARAM_SET: {
    key: "nPmSet",
    payload: {
      noteId: "number",
      viewRedirect: "string",
      param: "string",
      value: "number | null",
    },
  },
  NOTE_DELETE: {
    key: "nd",
    payload: { noteId: "number" },
  },
  CATEGORY_GO_VIEW: {
    key: "cGoView",
    payload: { categoryId: "number", view: "string" },
  },
  CATEGORY_PARAM_SET: {
    key: "cPmSet",
    payload: {
      categoryId: "number",
      viewRedirect: "string",
      param: "string",
      value: "number | null",
    },
  },
  CATEGORY_EDIT_NAME: {
    key: "ceNm",
    payload: { categoryId: "number | null" },
  },
  CATEGORY_EDIT_CONTEXT: {
    key: "ceCtx",
    payload: { categoryId: "number | null" },
  },
  CALLBACK_CANCEL: {
    key: "cancel",
    payload: {},
  },
  DELETE_ACCOUNT_CONFIRM: {
    key: "adCnf",
    payload: {},
  },
  USER_GO_VIEW: {
    key: "uGoView",
    payload: { view: "string" },
  },
  USER_PARAM_SWITCH: {
    key: "uPmSw",
    payload: {
      viewRedirect: "string",
      param: "string",
      switchValue: "boolean",
    },
  },
  USER_PARAM_SET: {
    key: "uPmSet",
    payload: {
      viewRedirect: "string",
      param: "string",
      value: "number | null",
    },
  },
  USER_SETTINGS: {
    key: "uSett",
    payload: {},
  },
} as const;

export type ParsedPayload<T extends Record<string, keyof TypeMapping>> = {
  [K in keyof T]: TypeMapping[T[K]];
};

type CallbackType = (typeof TGCallbackActions)[keyof typeof TGCallbackActions];

export class PayloadHelper {
  private deserializePayload<T extends Record<string, keyof TypeMapping>>(
    payloadTemplate: T,
    data: string,
    delimiter: string = "|"
  ): ParsedPayload<T> {
    const parts = data.split(delimiter);
    const keys = Object.keys(payloadTemplate) as (keyof T)[];

    if (parts.length !== keys.length) {
      throw new Error(`Expected ${keys.length} parts but got ${parts.length}`);
    }

    const result = {} as ParsedPayload<T>;
    keys.forEach((key, index) => {
      const type = payloadTemplate[key];
      const value = parts[index];
      switch (type) {
        case "number":
          result[key] = Number(value) as any;
          break;
        case "string":
          result[key] = value as any;
          break;
        case "boolean":
          result[key] = (value === "t") as any;
          break;
        case "number | null":
          result[key] = value === "null" ? null : (Number(value) as any);
          break;
        default:
          const invalidType: never = type;
          throw new Error(`Unknown type: ${invalidType}`);
      }
    });
    return result;
  }

  private serializePayload<T extends Record<string, keyof TypeMapping>>(
    payloadTemplate: T,
    payload: ParsedPayload<T>,
    delimiter: string = "|"
  ): string {
    // payload mustn't contain delimiter in string values
    const keys = Object.keys(payloadTemplate) as (keyof T)[];
    return keys
      .map((key) => {
        const type = payloadTemplate[key];
        const value = payload[key];
        if (type === "boolean") {
          return value ? "t" : "f";
        }
        return String(value);
      })
      .join(delimiter);
  }

  public parseKey(payload: string): string {
    return payload.split("|")[0];
  }

  public stringify<T extends CallbackType>(
    callback: T,
    payload: ParsedPayload<T["payload"]>
  ): string {
    const payloadString = this.serializePayload(
      { key: "string", ...callback.payload },
      { key: callback.key, ...payload }
    );
    return payloadString;
  }

  public parse<
    T extends (typeof TGCallbackActions)[keyof typeof TGCallbackActions]
  >(callback: T, payload: string): ParsedPayload<T["payload"]> {
    const result = this.deserializePayload(
      { key: "string", ...callback.payload },
      payload
    );
    return result;
  }
}
