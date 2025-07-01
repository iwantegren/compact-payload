export type TypeMapping = {
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
