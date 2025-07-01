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

export type PayloadSchema = Record<string, PayloadItem>;

type ParsedPayload<T extends Record<string, keyof TypeMapping>> = {
  [K in keyof T]: TypeMapping[T[K]];
};

type EnrtyOf<S extends PayloadSchema> = S[keyof S];

export class PayloadHandler<S extends PayloadSchema> {
  constructor(public readonly delimiter: string = "|") {}

  public parseKey(payload: string): string {
    return payload.split(this.delimiter)[0];
  }

  public stringify<T extends EnrtyOf<S>>(
    enrty: T,
    payload: ParsedPayload<T["payload"]>
  ): string {
    const payloadString = this.serializePayload(
      { key: "string", ...enrty.payload },
      { key: enrty.key, ...payload }
    );
    return payloadString;
  }

  public parse<T extends EnrtyOf<S>>(
    entry: T,
    payload: string
  ): ParsedPayload<T["payload"]> {
    const result = this.deserializePayload(
      { key: "string", ...entry.payload },
      payload
    );
    return result;
  }

  private deserializePayload<T extends Record<string, keyof TypeMapping>>(
    payloadTemplate: T,
    data: string
  ): ParsedPayload<T> {
    const parts = data.split(this.delimiter);
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
    payload: ParsedPayload<T>
  ): string {
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
      .join(this.delimiter);
  }
}
