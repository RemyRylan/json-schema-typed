export type Copyright = {
  credits: string[];
  year: number;
};

export type EnumSchema = {
  description?: string;
  values: Record<string, { description?: string; value: string }>;
  title: string;
};

export type KeywordSchema =
  | {
    deprecated?: string;
    description?: string;
    type: "array";
    items:
      | KeywordSchema
      | Array<KeywordSchema>;
    minItems?: number;
  }
  | {
    const?: false;
    deprecated?: string;
    description?: string;
    type: "boolean";
    default?: boolean;
  }
  | {
    default?: number;
    deprecated?: string;
    description?: string;
    exclusiveMinimum?: number;
    minimum?: number;
    type:
      | "integer"
      | "number";
  }
  | {
    deprecated?: string;
    description?: string;
    type: "null";
  }
  | {
    deprecated?: string;
    description?: string;
    type: "object";
    additionalProperties: KeywordSchema;
  }
  | {
    deprecated?: string;
    description?: string;
    enum?: string[];
    format?:
      | "iri"
      | "iri-reference"
      | "regex"
      | "uri"
      | "uri-reference";
    type: "string";
  }
  | {
    deprecated?: string;
    description?: string;
    type:
      | "JSONSchema"
      | "Value";
  }
  | {
    deprecated?: string;
    description?: string;
    oneOf: Array<KeywordSchema>;
  }
  | {
    deprecated?: string;
    description?: string;
    anyOf: Array<KeywordSchema>;
  };

export type KeywordKind<
  Keyword extends string | number | symbol,
  Title extends string,
> = {
  description?: string;
  title: Title;
  values: Keyword[];
};

export type ValidationSpecDefinition = {
  $license: string;
  $copyright: Copyright;
  $docsUrl: string;
  $draft: string;
  $schemaUrl: string;
  /** Human-readable name used in generated documentation, e.g. "Draft 2020-12". */
  $title: string;
  enums: Record<string, EnumSchema>;
  keywords: Record<string, KeywordSchema>;
  keywordsByType: {
    array: KeywordKind<string, "Array">;
    number: KeywordKind<string, "Number">;
    object: KeywordKind<string, "Object">;
    string: KeywordKind<string, "String">;
  };
};
