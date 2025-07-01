# compact-payload

A TypeScript utility for serializing and deserializing structured payloads into compact string format.

## Usage

```typescript
import { PayloadHandler, PayloadSchema } from "compact-payload";

// Define your schema with proper TypeScript typing
const Schema = {
  KEY_1: {
    key: "key1",
    payload: {
      payloadNum: "number",
      payloadStr: "string",
      payloadBool: "boolean",
      payloadNullNum: "number | null",
    },
  },
} as const satisfies PayloadSchema; // ⚠️ IMPORTANT: Use 'as const satisfies PayloadSchema'

// Create handler instance
const payloadHelper = new PayloadHandler<typeof Schema>();

// Serialize payload to string
const payload = {
  payloadNum: 1,
  payloadStr: "str",
  payloadBool: true,
  payloadNullNum: null,
};
const encoded = payloadHelper.stringify(Schema.KEY_1, payload);
// Result: "key1|1|str|t|null"

// Parse string back to payload
const decoded = payloadHelper.parse(Schema.KEY_1, encoded);
// Result: { key: "key1", payloadNum: 1, payloadStr: "str", payloadBool: true, payloadNullNum: null }
```

## ⚠️ Important TypeScript Usage

**Always use `as const satisfies PayloadSchema` instead of `const Schema: PayloadSchema`:**

```typescript
// ✅ Correct - preserves exact types for compile-time checks
const Schema = { ... } as const satisfies PayloadSchema;

// ❌ Wrong - widens types, compile-time checks won't work
const Schema: PayloadSchema = { ... };
```

Using `as const satisfies PayloadSchema` ensures full type safety and compile-time validation of your payload structure.

## Supported Types

- `"number"` - numeric values
- `"string"` - string values
- `"boolean"` - boolean values (serialized as "t"/"f")
- `"number | null"` - nullable numbers

## API

- `new PayloadHandler(delimiter?: string)` - Create handler with custom delimiter (default: "|")
- `stringify(entry, payload)` - Serialize payload to string
- `parse(entry, payloadString)` - Parse string back to payload
- `parseKey(payloadString)` - Extract key from serialized payload
