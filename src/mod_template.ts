// This file is a template. `src/build.ts` expands the `__PLACEHOLDER__`
// markers and strips every `// @ts-expect-error` line (they only exist so the
// template itself type-checks before the placeholders are filled in).

// __BEGIN__
// __PLACEHOLDER:LICENSE__

export const draft = "__PLACEHOLDER:DRAFT__" as const;
export const $schema = "__PLACEHOLDER:SCHEMA_URL__" as const;

type MaybeReadonlyArray<T> = Array<T> | ReadonlyArray<T>;
type UnionToIntersection<U> =
  (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I
    : never;
/** `true` when `T` is a union of two or more members. */
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;
/**
 * The `type` names for a schema describing `Value`; every known name for an
 * unconstrained value (`any`, `unknown`).
 */
type SchemaTypeFor<Value> = Value extends boolean ? "boolean"
  : Value extends null ? "null"
  : Value extends number ? "number" | "integer"
  : Value extends string ? "string"
  : Value extends unknown[] ? "array"
  : Value extends Record<string | number, unknown> ? "object"
  : JSONSchema.TypeValue;
/**
 * The `type` keyword of a permissive `JSONSchema<Value>`: the names for
 * `Value`, the list form when there is more than one, and — when `Value` is
 * unconstrained — any string, so that schemas whose literal types have been
 * widened (e.g. imported from JSON) are still `JSONSchema`s.
 */
type PermissiveSchemaType<Value> =
  [JSONSchema.TypeValue] extends [SchemaTypeFor<Value>]
    ? JSONSchema.TypeValue | (string & {})
    :
      | SchemaTypeFor<Value>
      | (IsUnion<SchemaTypeFor<Value>> extends true
        ? MaybeReadonlyArray<SchemaTypeFor<Value>>
        : never);

/**
 * JSON Schema [__PLACEHOLDER:TITLE__](__PLACEHOLDER:DOCS_URL__)
 *
 * A schema is either a boolean or an object of keywords. Every keyword is
 * optional and documented inline.
 *
 * - `JSONSchema` — any schema.
 * - `JSONSchema<Value>` — a schema for a particular kind of value; `type` is
 *   constrained accordingly (`JSONSchema<string>` has `type?: "string"`).
 * - `JSONSchema.String`, `JSONSchema.Object`, ... — only the keywords that
 *   apply to that type.
 */
export type JSONSchema<
  Value = any,
  SchemaType = PermissiveSchemaType<Value>,
> = boolean | JSONSchema.Interface<Value, SchemaType>;

// -----------------------------------------------------------------------------

export namespace JSONSchema {
  /**
   * Every value the `type` keyword accepts: a single type name (as a string
   * literal or a `TypeName` enum member) or a list of them.
   */
  export type TypeValue =
    // @ts-expect-error
    | TypeName
    // @ts-expect-error
    | `${TypeName}`
    // @ts-expect-error
    | MaybeReadonlyArray<TypeName | `${TypeName}`>;

  /**
   * The complete set of keywords for this draft. Every keyword is optional.
   * The `type` keyword is constrained to `SchemaType`; nested schemas are
   * typed as `Sub` (`JSONSchema` unless specified, so that a type extending
   * this interface can also be used for nested schemas).
   *
   * This is the object half of `JSONSchema`; extend it to add custom
   * keywords.
   */
  export interface Interface<
    Value = any,
    SchemaType = TypeValue | (string & {}),
    Sub = JSONSchema,
  > {
    __PLACEHOLDER__: [Value, SchemaType, Sub]; // KEYWORDS_INTERFACE
  }

  /**
   * The keywords permitted for a given `type` value. Keywords shared by every
   * type are always included; type-specific keywords are included when
   * `SchemaType` contains that type. A list of type names permits the
   * keywords of every type in the list.
   */
  export type KeywordsFor<SchemaType extends TypeValue> =
    // @ts-expect-error
    | KeywordByType.Any
    // @ts-expect-error
    | (SchemaType extends "array" ? KeywordByType.Array : never)
    // @ts-expect-error
    | (SchemaType extends "integer" | "number" ? KeywordByType.Number : never)
    // @ts-expect-error
    | (SchemaType extends "object" ? KeywordByType.Object : never)
    // @ts-expect-error
    | (SchemaType extends "string" ? KeywordByType.String : never)
    | (SchemaType extends MaybeReadonlyArray<unknown> ? keyof Interface : never);

  /**
   * A schema object with only the keywords that apply to `SchemaType`.
   * `JSONSchema.String`, `JSONSchema.Object`, etc. are instances of this.
   */
  export type Narrowed<
    Value,
    SchemaType extends TypeValue,
    Sub = JSONSchema,
  > = Pick<Interface<Value, SchemaType, Sub>, KeywordsFor<SchemaType>>;

  export type Array<T = any> = Narrowed<T, "array">;

  export type Boolean = Narrowed<boolean, "boolean">;

  export type Integer = Narrowed<number, "integer">;

  export type Number = Narrowed<number, "number">;

  export type Null = Narrowed<null, "null">;

  export type Object<T = any> = Narrowed<T, "object">;

  export type String = Narrowed<string, "string">;
}

/**
 * Keyword names grouped by the `type` they apply to. `Any` applies to every
 * type.
 */
export namespace KeywordByType {
  // __PLACEHOLDER:KEYWORD_TYPES__
}

// -----------------------------------------------------------------------------

// __PLACEHOLDER:ENUMS__

// -----------------------------------------------------------------------------
// Keywords
// -----------------------------------------------------------------------------

// __PLACEHOLDER:KEYWORDS__
