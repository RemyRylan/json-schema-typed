export declare const draft: "v1";
export declare const $schema: "https://json-schema.org/v1";
type MaybeReadonlyArray<T> = Array<T> | ReadonlyArray<T>;
type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
/** `true` when `T` is a union of two or more members. */
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;
/**
 * The `type` names for a schema describing `Value`; every known name for an
 * unconstrained value (`any`, `unknown`).
 */
type SchemaTypeFor<Value> = Value extends boolean ? "boolean" : Value extends null ? "null" : Value extends number ? "number" | "integer" : Value extends string ? "string" : Value extends unknown[] ? "array" : Value extends Record<string | number, unknown> ? "object" : JSONSchema.TypeValue;
/**
 * The `type` keyword of a permissive `JSONSchema<Value>`: the names for
 * `Value`, the list form when there is more than one, and — when `Value` is
 * unconstrained — any string, so that schemas whose literal types have been
 * widened (e.g. imported from JSON) are still `JSONSchema`s.
 */
type PermissiveSchemaType<Value> = [JSONSchema.TypeValue] extends [
    SchemaTypeFor<Value>
] ? JSONSchema.TypeValue | (string & {}) : SchemaTypeFor<Value> | (IsUnion<SchemaTypeFor<Value>> extends true ? MaybeReadonlyArray<SchemaTypeFor<Value>> : never);
/**
 * JSON Schema [v1 (unreleased)](https://github.com/json-schema-org/json-schema-spec/blob/main/specs/jsonschema-core.md)
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
export type JSONSchema<Value = any, SchemaType = PermissiveSchemaType<Value>> = boolean | JSONSchema.Interface<Value, SchemaType>;
export declare namespace JSONSchema {
    /**
     * Every value the `type` keyword accepts: a single type name (as a string
     * literal or a `TypeName` enum member) or a list of them.
     */
    type TypeValue = TypeName | `${TypeName}` | MaybeReadonlyArray<TypeName | `${TypeName}`>;
    /**
     * The complete set of keywords for this draft. Every keyword is optional.
     * The `type` keyword is constrained to `SchemaType`; nested schemas are
     * typed as `Sub` (`JSONSchema` unless specified, so that a type extending
     * this interface can also be used for nested schemas).
     *
     * This is the object half of `JSONSchema`; extend it to add custom
     * keywords.
     */
    interface Interface<Value = any, SchemaType = TypeValue | (string & {}), Sub = JSONSchema> {
        /**
         * Using JSON Pointers in IRI fragments to reference subschemas couples the
         * IRI to the structure of the schema. Using plain name fragment identifiers
         * in IRI fragments to identify subschemas is sometimes preferable because it
         * is not tied to a particular structural location. This allows a subschema to
         * be relocated without requiring references to be updated.
         *
         * The `$anchor` keyword is used to define location-independent identifiers
         * for subschemas within a schema resource. `$anchor` defines a plain name
         * fragment identifier that can be used in IRI fragments as an alternative to
         * JSON Pointers.
         *
         * Note that the anchor string does not include the `#` character, as it is
         * just a fragment identifier, not an IRI reference. To reference the `foo`
         * `$anchor` from the same schema resource, you would use the fragment-only
         * IRI `#foo`.
         *
         * If present, the value of this keyword MUST be a string and MUST conform to
         * the plain name fragment identifier syntax, which matches XML's [`NCName`
         * production][ncname].
         *
         * [ncname]: https://www.w3.org/TR/2006/REC-xml-names11-20060816/#NT-NCName
         */
        $anchor?: string;
        /**
         * This keyword reserves a location for comments from schema authors to
         * readers or maintainers of the schema.
         *
         * The value of this keyword MUST be a string.
         *
         * This keyword MUST NOT affect validation or be collected as an annotation.
         *
         * The value of this keyword MAY be used as directives for developer tooling
         * such as a directive for a linter to ignore a linting rule in a schema.
         *
         * Tools that translate schemas between media types or programming languages
         * MAY choose to convert that media type or programming language's native
         * comments to or from `$comment` values. The behavior of such translation
         * when both native comments and `$comment` properties are present is
         * implementation-dependent.
         */
        $comment?: string;
        /**
         * The `$defs` keyword reserves a location for schema authors to inline
         * reusable JSON Schemas into a more general schema. The keyword does not
         * directly affect the validation result.
         *
         * This keyword's value MUST be an object. Each member value of this object
         * MUST be a valid JSON Schema.
         */
        $defs?: Record<string, Sub>;
        /**
         * The `$dynamicAnchor` keyword is used to define location-independent
         * identifiers for subschemas within the dynamic scope of a schema evaluation.
         * They are only used by `$dynamicRef`. They are not meaningful in IRI
         * fragments.
         *
         * The fragment identifiers defined by `$dynamicAnchor` are not normal
         * fragment identifiers because they identify both the primary resource and
         * the secondary resource.
         *
         * If present, the value of this keyword MUST be a string.
         */
        $dynamicAnchor?: string;
        /**
         * The `$dynamicRef` keyword is an applicator that is used when the
         * referencing schema might need to override where a reference in the
         * referenced schema will resolve. This is useful for cases such as authoring
         * a recursive schema that can be extended or a generic schema such as a list
         * whose items are defined by the referencing schema.
         *
         * The value of the `$dynamicRef` property MUST be a string and MUST conform
         * to the plain name fragment identifier syntax (the same syntax as
         * `$anchor`). Unlike previous drafts, the value is a bare anchor name, not an
         * IRI reference.
         *
         * `$dynamicAnchor` and `$dynamicRef` form a string-matched pair.
         *
         * Resolution of `$dynamicRef` begins by identifying the outermost schema
         * resource in the dynamic scope which defines a matching `$dynamicAnchor`.
         * The schema to apply is the subschema of this resource which contains a
         * `$dynamicAnchor` matching the value of `$dynamicRef`.
         */
        $dynamicRef?: string;
        /**
         * An `$id` keyword in a schema or subschema identifies that schema or
         * subschema as a distinct schema resource and applies to the entire lexical
         * scope of that schema resource. The value for this keyword MUST be a string,
         * and MUST represent a valid IRI reference without a fragment.
         *
         * When the value of this keyword is resolved against the current base IRI,
         * the resulting absolute IRI then serves as the identifier for the schema
         * resource and as a base IRI for relative IRI references in keywords within
         * that schema resource and for embedded schema resources, in accordance with
         * [RFC 3987 section 6.5][RFC3987] and [RFC 3986 section 5.1.1][RFC3986]
         * regarding base IRIs embedded in content and RFC 3986 section 5.1.2
         * regarding encapsulating entities.
         *
         * Note that this IRI is an identifier and not necessarily a network locator.
         * In the case of a network-addressable URL, a schema need not be downloadable
         * from its canonical IRI.
         *
         * Also note that an `$id` consisting of an empty IRI only will result in the
         * embedded resource having the same IRI as the encapsulating resource, which
         * SHOULD be considered an error.
         *
         * If no parent schema object explicitly identifies itself as a resource with
         * `$id`, the base IRI is that of the entire document.
         *
         * The root schema of a JSON Schema document SHOULD contain an `$id` keyword
         * with an absolute IRI (containing a scheme, but no fragment).
         *
         * [RFC3987]: https://www.rfc-editor.org/rfc/rfc3987.html#section-6.5
         * [RFC3986]: https://www.rfc-editor.org/rfc/rfc3986.html#section-5.1.1
         *
         *
         *
         * @format "iri-reference"
         */
        $id?: string;
        /**
         * The `$ref` keyword is an applicator that is used to reference a statically
         * identified schema. Its results are the results of the referenced schema.
         * Other keywords can appear alongside of `$ref` in the same schema object.
         *
         * The value of the `$ref` keyword MUST be a string which is an IRI reference.
         * Resolved against the current IRI base, it produces the IRI of the schema to
         * apply. This resolution is safe to perform on schema load, as the process of
         * evaluating an instance cannot change how the reference resolves.
         *
         * The resolved IRI produced by `$ref` is not necessarily a network locator,
         * only an identifier. A schema need not be downloadable from the address if
         * it is a network-addressable URL. Implementations which can access the
         * network SHOULD default to operating offline.
         *
         *
         *
         * @format "iri-reference"
         */
        $ref?: string;
        /**
         * The `$schema` keyword is both used as a JSON Schema dialect identifier and
         * as the identifier of a resource which is itself a JSON Schema, which
         * describes the set of valid schemas written for this particular dialect. The
         * identified dialect applies to the resource in which it is declared as well
         * as any embedded schema resources, unless such a resource itself declares a
         * different dialect by including the `$schema` keyword with a different
         * value.
         *
         * The value of this keyword MUST be an [absolute IRI][RFC3987] (without a
         * fragment). This IRI MUST be normalized.
         *
         * The `$schema` keyword SHOULD be used in the document root schema object,
         * and MAY be used in the root schema objects of embedded schema resources.
         * This keyword MUST NOT appear in a subschema that is not also the root
         * object of a schema resource.
         *
         * Values for this property are defined elsewhere in this and other documents,
         * and by other parties.
         *
         * [RFC3987]: https://www.rfc-editor.org/info/rfc3987
         *
         *
         *
         * @format "iri"
         */
        $schema?: string;
        /**
         * The value of `additionalProperties` MUST be a valid JSON Schema.
         *
         * The behavior of this keyword depends on the presence of `properties` and
         * `patternProperties` within the same schema object. Validation with
         * `additionalProperties` applies only to the property values for which
         * neither `properties` nor `patternProperties` apply.
         *
         * For all such properties, validation succeeds if the child instance
         * validates against the `additionalProperties` schema.
         *
         * Omitting this keyword has the same assertion behavior as an empty schema.
         *
         * The annotation result of this keyword is the set of instance property names
         * validated by this keyword's subschema.
         *
         * The presence of this keyword affects the behavior of
         * `unevaluatedProperties`.
         */
        additionalProperties?: Sub;
        /**
         * This keyword's value MUST be a non-empty array. Each item of the array MUST
         * be a valid JSON Schema.
         *
         * An instance validates successfully against this keyword if it validates
         * successfully against all schemas defined by this keyword's value.
         */
        allOf?: MaybeReadonlyArray<Sub>;
        /**
         * This keyword's value MUST be a non-empty array. Each item of the array MUST
         * be a valid JSON Schema.
         *
         * An instance validates successfully against this keyword if it validates
         * successfully against at least one schema defined by this keyword's value.
         * Note that when annotations are being collected, all subschemas MUST be
         * examined so that annotations are collected from each subschema that
         * validates successfully.
         */
        anyOf?: MaybeReadonlyArray<Sub>;
        /**
         * The value of this keyword MAY be of any type, including null.
         *
         * Use of this keyword is functionally equivalent to an `enum` with a single
         * value.
         *
         * An instance validates successfully against this keyword if its value is
         * equal to the value of the keyword.
         */
        const?: Value;
        /**
         * The value of this keyword MUST be a valid JSON Schema.
         *
         * This keyword applies to array instances by applying its subschema to the
         * array's elements.
         *
         * An instance is valid against `contains` if the number of elements that are
         * valid against its subschema is within the inclusive range of the minimum
         * and (if any) maximum number of occurrences.
         *
         * The maximum number of occurrences is provided by the `maxContains` keyword
         * within the same schema object as `contains`. If `maxContains` is absent,
         * the maximum number of occurrences MUST be unbounded.
         *
         * The minimum number of occurrences is provided by the `minContains` keyword
         * within the same schema object as `contains`. If `minContains` is absent,
         * the minimum number of occurrences MUST be 1.
         *
         * This keyword produces an annotation value which is an array of the
         * zero-based indices for which this keyword validates successfully when
         * applying its subschema, in ascending order. The value MAY be a boolean
         * `true` if the subschema validates successfully when applied to every index
         * of the instance. The annotation MUST be present if the instance array to
         * which this keyword's schema applies is empty.
         *
         * The presence of this keyword affects the behavior of `unevaluatedItems`.
         *
         * Under most circumstances, the `contains` subschema MAY be short-circuited.
         * However, for the following cases, the `contains` subschema MUST be applied
         * to every array element.
         *
         * - If `unevaluatedItems` appears in any subschema in the dynamic scope that
         *   applies to the same instance location, to ensure that all evaluated items
         *   are accounted for.
         * - When collecting annotations, to ensure that all annotations are found.
         */
        contains?: Sub;
        /**
         * If the instance value is a string, this property defines that the string
         * SHOULD be interpreted as encoded binary data and applications wishing to
         * decode it SHOULD do so using the encoding named by this property.
         *
         * Possible values indicating base 16, 32, and 64 encodings with several
         * variations are listed in [RFC 4648][RFC4648]. Additionally, sections 6.7
         * and 6.8 of [RFC 2045][RFC2045] provide encodings used in MIME. This keyword
         * is derived from MIME's Content-Transfer-Encoding header, which was designed
         * to map binary data into ASCII characters. It is not related to HTTP's
         * Content-Encoding header, which is used to encode (e.g. compress or encrypt)
         * the content of HTTP request and responses.
         *
         * As `"base64"` is defined in both RFCs, the definition from RFC 4648 SHOULD
         * be assumed unless the string is specifically intended for use in a MIME
         * context. Note that all of these encodings result in strings consisting only
         * of 7-bit ASCII characters. Therefore, this keyword has no meaning for
         * strings containing characters outside of that range.
         *
         * If this keyword is absent, but `contentMediaType` is present, this
         * indicates that the encoding is the identity encoding, meaning that no
         * transformation was needed in order to represent the content in a UTF-8
         * string.
         *
         * The value of this property MUST be a string.
         *
         * The `ContentEncoding` enum lists the well-known values.
         *
         * [RFC2045]: https://www.rfc-editor.org/info/rfc2045
         * [RFC4648]: https://www.rfc-editor.org/info/rfc4648
         */
        contentEncoding?: string;
        /**
         * If the instance is a string, this property indicates the media type of the
         * contents of the string. If `contentEncoding` is present, this property
         * describes the decoded string.
         *
         * The value of this property MUST be a string, which MUST be a media type, as
         * defined by [RFC 2046][RFC2046].
         *
         * [RFC2046]: https://www.rfc-editor.org/info/rfc2046
         */
        contentMediaType?: string;
        /**
         * If the instance is a string, and if `contentMediaType` is present, this
         * keyword's subschema describes the structure of the string.
         *
         * This keyword MAY be used with any media type that can be mapped into JSON
         * Schema's data model. Specifying such mappings is outside of the scope of
         * this specification.
         *
         * The value of this property MUST be a valid JSON schema. The subschema is
         * produced as an annotation.
         *
         * Since `contentMediaType` is required to provide instruction on how to
         * interpret string content, `contentSchema` SHOULD NOT produce an annotation
         * if `contentMediaType` is not present.
         *
         * Note that evaluating the `contentSchema` subschema in-place (i.e. as part
         * of its parent schema) will ensure that it is correctly processed.
         * Independent use of the extracted subschema (as returned in an annotation)
         * is only safe if the subschema is an embedded resource which defines both a
         * `$schema` and an absolute IRI `$id`.
         */
        contentSchema?: Sub;
        /**
         * There are no restrictions placed on the value of this keyword. When
         * multiple occurrences of this keyword are applicable to a single
         * sub-instance, implementations SHOULD remove duplicates.
         *
         * This keyword can be used to supply a default JSON value associated with a
         * particular schema. It is RECOMMENDED that a default value be valid against
         * the associated schema.
         */
        default?: Value;
        /**
         * The value of this keyword MUST be an object. Properties in this object, if
         * any, MUST be arrays. Elements in each array, if any, MUST be strings, and
         * MUST be unique.
         *
         * This keyword specifies properties that are required if a specific other
         * property is present. Their requirement is dependent on the presence of the
         * other property.
         *
         * Validation succeeds if, for each name that appears in both the instance and
         * as a name within this keyword's value, every item in the corresponding
         * array is also the name of a property in the instance.
         *
         * Omitting this keyword has the same behavior as an empty object.
         */
        dependentRequired?: Record<string, MaybeReadonlyArray<string>>;
        /**
         * This keyword specifies subschemas that are evaluated if the instance is an
         * object and contains a certain property.
         *
         * This keyword's value MUST be an object. Each value in the object MUST be a
         * valid JSON Schema.
         *
         * If the object key is a property in the instance, the entire instance must
         * validate against the subschema. Its use is dependent on the presence of the
         * property.
         *
         * Omitting this keyword has the same behavior as an empty object.
         */
        dependentSchemas?: Record<string, Sub>;
        /**
         * The value of this keyword MUST be a boolean. When multiple occurrences of
         * this keyword are applicable to a single sub-instance, applications SHOULD
         * consider the instance location to be deprecated if any occurrence specifies
         * a `true` value.
         *
         * If `deprecated` has a value of boolean `true`, it indicates that
         * applications SHOULD refrain from usage of the declared property. It may
         * mean the property is going to be removed in the future.
         *
         * A root schema containing `deprecated` with a value of `true` indicates that
         * the entire resource being described may be removed in the future.
         *
         * The `deprecated` keyword applies to each instance location to which the
         * schema object containing the keyword successfully applies. This can result
         * in scenarios where every array item or object property is deprecated even
         * though the containing array or object is not.
         *
         * Omitting this keyword has the same behavior as a value of `false`.
         *
         *
         *
         * @default false
         */
        deprecated?: boolean;
        /**
         * The value of this keyword MUST be a string.
         *
         * Can be used to decorate a user interface with information about the data
         * produced by this user interface. A description will provide explanation
         * about the purpose of the instance described by this schema.
         */
        description?: string;
        /**
         * This keyword's value MUST be a valid JSON Schema.
         *
         * When `if` is present, and the instance fails to validate against its
         * subschema, then validation succeeds against this keyword if the instance
         * successfully validates against this keyword's subschema.
         *
         * This keyword has no effect when `if` is absent, or when the instance
         * successfully validates against the `if` subschema. Implementations MUST NOT
         * evaluate the instance against this keyword, for either validation or
         * annotation collection purposes, in such cases.
         */
        else?: Sub;
        /**
         * The value of this keyword MUST be an array. This array SHOULD have at least
         * one element. Elements in the array SHOULD be unique.
         *
         * An instance validates successfully against this keyword if its value is
         * equal to one of the elements in this keyword's array value.
         *
         * Elements in the array might be of any type, including null.
         */
        enum?: MaybeReadonlyArray<Value>;
        /**
         * The value of this keyword MUST be an array. There are no restrictions
         * placed on the values within the array. When multiple occurrences of this
         * keyword are applicable to a single sub-instance, implementations MUST
         * provide a flat array of all values rather than an array of arrays.
         *
         * This keyword can be used to provide sample JSON values associated with a
         * particular schema, for the purpose of illustrating usage. It is RECOMMENDED
         * that these values be valid against the associated schema.
         *
         * Implementations MAY use the value(s) of `default`, if present, as an
         * additional example. If `examples` is absent, `default` MAY still be used in
         * this manner.
         */
        examples?: MaybeReadonlyArray<Value>;
        /**
         * The value of `exclusiveMaximum` MUST be a number, representing an exclusive
         * upper limit for a numeric instance.
         *
         * If the instance is a number, then the instance is valid only if it has a
         * value strictly less than (not equal to) `exclusiveMaximum`.
         */
        exclusiveMaximum?: number;
        /**
         * The value of `exclusiveMinimum` MUST be a number, representing an exclusive
         * lower limit for a numeric instance.
         *
         * If the instance is a number, then the instance is valid only if it has a
         * value strictly greater than (not equal to) `exclusiveMinimum`.
         */
        exclusiveMinimum?: number;
        /**
         * The `format` keyword allows schema authors to convey semantic information
         * for a fixed subset of values which are accurately described by
         * authoritative resources, be they RFCs or other external specifications.
         *
         * The value of this keyword MUST be a string. While this keyword can validate
         * any type, each distinct value will generally only validate a given set of
         * instance types. If the type of the instance to validate is not in this set,
         * validation for this keyword SHOULD succeed.
         *
         * Implementations SHOULD provide assertion behavior for the format values
         * defined by the specification and MUST refuse to process any schema which
         * contains a format value it doesn't support. This is a departure from
         * previous drafts, where `format` was annotation-only by default. In addition
         * to the assertion behavior, this keyword also produces its value as an
         * annotation.
         *
         * In addition to the formats defined by the specification, JSON Schema
         * maintains a [format registry][registry]. Implementations SHOULD support the
         * formats listed in this registry as if they were defined by the
         * specification. Implementations MAY support custom format values, but such
         * support MUST be configurable and disabled by default.
         *
         * The requirement for validation of format values is limited to syntactic
         * checking; implementations SHOULD NOT attempt to send an email, connect to a
         * URL, or otherwise check the existence of an entity identified by a format
         * instance.
         *
         * The `Format` enum lists the formats defined by the specification.
         *
         * [registry]:
         *   https://github.com/json-schema-org/json-schema-spec/blob/main/specs/registries/format.json
         */
        format?: string;
        /**
         * This keyword's value MUST be a valid JSON Schema.
         *
         * This validation outcome of this keyword's subschema has no direct effect on
         * the overall validation result. Rather, it controls which of the `then` or
         * `else` keywords are evaluated.
         *
         * Instances that successfully validate against this keyword's subschema MUST
         * also be valid against the subschema value of the `then` keyword, if
         * present.
         *
         * Instances that fail to validate against this keyword's subschema MUST also
         * be valid against the subschema value of the `else` keyword, if present.
         *
         * If annotations are being collected, they are collected from this keyword's
         * subschema in the usual way, including when the keyword is present without
         * either `then` or `else`.
         */
        if?: Sub;
        /**
         * The value of `items` MUST be a valid JSON Schema.
         *
         * This keyword ignores elements in the instance array equal to the number of
         * subschemas found in the `prefixItems` array in the same schema object,
         * starting from the beginning of the instance array. It then applies its
         * subschema to remaining elements.
         *
         * If `prefixItems` contains more subschemas than the number of elements in
         * the instance array, `items` applies its subschema to no elements.
         *
         * If `prefixItems` does not exist within the same schema object, `items`
         * applies its subschema to all elements.
         *
         * If the `items` subschema is applied to any positions within the instance
         * array, it produces an annotation result of boolean `true`, indicating that
         * all remaining array elements have been evaluated against this keyword's
         * subschema.
         *
         * Omitting this keyword has the same assertion behavior as an empty schema.
         *
         * The presence of this keyword affects the behavior of `unevaluatedItems`.
         */
        items?: Sub;
        /**
         * The value of this keyword MUST be a non-negative integer.
         *
         * This keyword modifies the behavior of `contains` within the same schema
         * object: it provides the maximum number of array elements that may validate
         * against the `contains` subschema. If `maxContains` is absent, the maximum
         * number of occurrences MUST be unbounded.
         *
         * This keyword produces no assertion result. The value of this keyword is
         * used as its annotation result.
         *
         *
         *
         * @minimum 0
         */
        maxContains?: number;
        /**
         * The value of `maximum` MUST be a number, representing an inclusive upper
         * limit for a numeric instance.
         *
         * If the instance is a number, then this keyword validates only if the
         * instance is less than or exactly equal to `maximum`.
         */
        maximum?: number;
        /**
         * The value of this keyword MUST be a non-negative integer.
         *
         * An array instance is valid against `maxItems` if its size is less than, or
         * equal to, the value of this keyword.
         *
         *
         *
         * @minimum 0
         */
        maxItems?: number;
        /**
         * The value of this keyword MUST be a non-negative integer.
         *
         * A string instance is valid against this keyword if its length is less than,
         * or equal to, the value of this keyword.
         *
         * The length of a string instance is defined as the number of Unicode code
         * points that make up the string.
         *
         *
         *
         * @minimum 0
         */
        maxLength?: number;
        /**
         * The value of this keyword MUST be a non-negative integer.
         *
         * An object instance is valid against `maxProperties` if its number of
         * properties is less than, or equal to, the value of this keyword.
         *
         *
         *
         * @minimum 0
         */
        maxProperties?: number;
        /**
         * The value of this keyword MUST be a non-negative integer.
         *
         * This keyword modifies the behavior of `contains` within the same schema
         * object: it provides the minimum number of array elements that must validate
         * against the `contains` subschema. If `minContains` is absent, the minimum
         * number of occurrences MUST be 1.
         *
         * A value of `0` causes `contains` to always pass validation (but validation
         * can still fail against a `maxContains` keyword).
         *
         * This keyword has no assertion behavior. The value of this keyword is used
         * as its annotation result.
         *
         *
         *
         * @default 1
         * @minimum 0
         */
        minContains?: number;
        /**
         * The value of `minimum` MUST be a number, representing an inclusive lower
         * limit for a numeric instance.
         *
         * If the instance is a number, then this keyword validates only if the
         * instance is greater than or exactly equal to `minimum`.
         */
        minimum?: number;
        /**
         * The value of this keyword MUST be a non-negative integer.
         *
         * An array instance is valid against `minItems` if its size is greater than,
         * or equal to, the value of this keyword.
         *
         * Omitting this keyword has the same behavior as a value of `0`.
         *
         *
         *
         * @default 0
         * @minimum 0
         */
        minItems?: number;
        /**
         * The value of this keyword MUST be a non-negative integer.
         *
         * A string instance is valid against this keyword if its length is greater
         * than, or equal to, the value of this keyword.
         *
         * The length of a string instance is defined as the number of Unicode code
         * points that make up the string.
         *
         * Omitting this keyword has the same behavior as a value of `0`.
         *
         *
         *
         * @default 0
         * @minimum 0
         */
        minLength?: number;
        /**
         * The value of this keyword MUST be a non-negative integer.
         *
         * An object instance is valid against `minProperties` if its number of
         * properties is greater than, or equal to, the value of this keyword.
         *
         * Omitting this keyword has the same behavior as a value of `0`.
         *
         *
         *
         * @default 0
         * @minimum 0
         */
        minProperties?: number;
        /**
         * The value of `multipleOf` MUST be a number, strictly greater than `0`.
         *
         * A numeric instance is valid only if division by this keyword's value
         * results in an integer.
         *
         *
         *
         * @exclusiveMinimum 0
         */
        multipleOf?: number;
        /**
         * This keyword's value MUST be a valid JSON Schema.
         *
         * An instance is valid against this keyword if it fails to validate
         * successfully against the schema defined by this keyword.
         */
        not?: Sub;
        /**
         * This keyword's value MUST be a non-empty array. Each item of the array MUST
         * be a valid JSON Schema.
         *
         * An instance validates successfully against this keyword if it validates
         * successfully against exactly one schema defined by this keyword's value.
         */
        oneOf?: MaybeReadonlyArray<Sub>;
        /**
         * The value of this keyword MUST be a string. This string SHOULD be a valid
         * regular expression, according to the [ECMA-262][ecma262] regular expression
         * dialect.
         *
         * A string instance is considered valid if the regular expression matches the
         * instance successfully. Recall: regular expressions are not implicitly
         * anchored.
         *
         * [ecma262]: https://www.ecma-international.org/ecma-262/11.0/index.html
         *
         *
         *
         * @format "regex"
         */
        pattern?: string;
        /**
         * The value of `patternProperties` MUST be an object. Each property name of
         * this object SHOULD be a valid regular expression, according to the
         * [ECMA-262][ecma262] regular expression dialect. Each property value of this
         * object MUST be a valid JSON Schema.
         *
         * Validation succeeds if, for each instance name that matches any regular
         * expressions that appear as a property name in this keyword's value, the
         * child instance for that name successfully validates against each schema
         * that corresponds to a matching regular expression. Recall: regular
         * expressions are not implicitly anchored.
         *
         * Omitting this keyword has the same assertion behavior as an empty object.
         *
         * The annotation result of this keyword is the set of instance property names
         * matched by at least one property under this keyword.
         *
         * The presence of this keyword affects the behaviors of
         * `additionalProperties` and `unevaluatedProperties`.
         *
         * [ecma262]: https://www.ecma-international.org/ecma-262/11.0/index.html
         */
        patternProperties?: Record<string, Sub>;
        /**
         * The value of `prefixItems` MUST be a non-empty array of valid JSON Schemas.
         *
         * Validation succeeds if each element of the instance validates against the
         * subschema at the same position, if any. This keyword does not constrain the
         * length of the array. Only array positions present in both the keyword's
         * value and the instance value are affected by this keyword.
         *
         * This keyword produces an annotation value which is the largest index to
         * which this keyword applied a subschema. The value MAY be a boolean `true`
         * if a subschema was applied to every index of the instance, such as is
         * produced by the `items` keyword.
         *
         * The presence of this keyword affects the behaviors of `items` and
         * `unevaluatedItems`.
         */
        prefixItems?: MaybeReadonlyArray<Sub>;
        /**
         * The value of `properties` MUST be an object. Each value of this object MUST
         * be a valid JSON Schema.
         *
         * Validation succeeds if, for each name that appears in both the instance and
         * as a name within this keyword's value, the child instance for that name
         * successfully validates against the corresponding schema.
         *
         * Omitting this keyword has the same assertion behavior as an empty object.
         *
         * The annotation result of this keyword is the set of instance property names
         * which are also present under this keyword.
         *
         * The presence of this keyword affects the behaviors of
         * `additionalProperties` and `unevaluatedProperties`.
         */
        properties?: Record<string, Sub>;
        /**
         * The value of `propertyNames` MUST be a valid JSON Schema.
         *
         * If the instance is an object, this keyword validates if every property name
         * in the instance validates against the provided schema. Note the property
         * name that the schema is testing will always be a string.
         *
         * Omitting this keyword has the same behavior as an empty schema.
         */
        propertyNames?: Sub;
        /**
         * The value of this keyword MUST be a boolean. When multiple occurrences of
         * this keyword are applicable to a single sub-instance, the resulting
         * behavior SHOULD be as for a `true` value if any occurrence specifies a
         * `true` value, and SHOULD be as for a `false` value otherwise.
         *
         * If `readOnly` has a value of boolean `true`, it indicates that the
         * corresponding value in the instance is managed exclusively by the owning
         * authority, and attempts by an application to modify the value are expected
         * to be ignored or rejected by that owning authority.
         *
         * An instance document that is marked as `readOnly` for the entire document
         * MAY be ignored if sent to the owning authority, or MAY result in an error,
         * at the authority's discretion.
         *
         * For example, `readOnly` would be used to mark a database-generated serial
         * number as read-only.
         *
         * Omitting this keyword has the same behavior as a value of `false`.
         *
         *
         *
         * @default false
         */
        readOnly?: boolean;
        /**
         * The value of this keyword MUST be an array. Elements of this array, if any,
         * MUST be strings, and MUST be unique.
         *
         * An object instance is valid against this keyword if every item in the array
         * is the name of a property in the instance.
         *
         * Omitting this keyword has the same behavior as an empty array.
         */
        required?: MaybeReadonlyArray<string>;
        /**
         * This keyword's value MUST be a valid JSON Schema.
         *
         * When `if` is present, and the instance successfully validates against its
         * subschema, then validation succeeds against this keyword if the instance
         * also successfully validates against this keyword's subschema.
         *
         * This keyword has no effect when `if` is absent, or when the instance fails
         * to validate against the `if` subschema. Implementations MUST NOT evaluate
         * the instance against this keyword, for either validation or annotation
         * collection purposes, in such cases.
         */
        then?: Sub;
        /**
         * The value of this keyword MUST be a string.
         *
         * Can be used to decorate a user interface with information about the data
         * produced by this user interface. A title will preferably be short.
         */
        title?: string;
        /**
         * The value of this keyword MUST be either a string or an array. If it is an
         * array, it MUST be non-empty, and elements of the array MUST be strings and
         * MUST be unique.
         *
         * String values MUST be one of the six primitive types (`"null"`,
         * `"boolean"`, `"object"`, `"array"`, `"number"`, or `"string"`), or
         * `"integer"` which matches any number with a zero fractional part.
         *
         * If the value of `type` is a string, then an instance validates successfully
         * if its type matches the type represented by the value of the string.
         *
         * If the value of `type` is an array, then an instance validates successfully
         * if its type matches any of the types indicated by the strings in the array.
         */
        type?: SchemaType;
        /**
         * The value of `unevaluatedItems` MUST be a valid JSON Schema.
         *
         * This keyword applies to array instances by applying its subschema to the
         * array's elements.
         *
         * The behavior of this keyword depends on all adjacent keywords as well as
         * keywords in successfully validated subschemas that apply to the same
         * instance location by evaluating the instance's elements. This includes, but
         * is not limited to, `prefixItems`, `items`, and `contains`, itself, and all
         * in-place applicators defined in the specification.
         *
         * This keyword applies its subschema to any array elements which have not
         * been deemed "evaluated". Validation passes if the keyword's subschema
         * validates against all applicable array elements.
         *
         * If the `unevaluatedItems` subschema is applied to any positions within the
         * instance array, it produces an annotation result of boolean `true`,
         * analogous to the behavior of `items`.
         *
         * The presence of this keyword affects the behavior of other
         * `unevaluatedItems` keywords found earlier in the dynamic scope that apply
         * to the same instance location.
         *
         * Omitting this keyword has the same assertion behavior as an empty schema.
         */
        unevaluatedItems?: Sub;
        /**
         * The value of `unevaluatedProperties` MUST be a valid JSON Schema.
         *
         * This keyword applies to object instances by applying its subschema to the
         * object's property values.
         *
         * The behavior of this keyword depends on all adjacent keywords as well as
         * keywords in successfully validated subschemas that apply to the same
         * instance location by evaluating the instance's property values. This
         * includes, but is not limited to, `properties`, `patternProperties`, and
         * `additionalProperties`, itself, and all in-place applicators defined in the
         * specification.
         *
         * This keyword applies its subschema to any property values which have not
         * been deemed "evaluated". Validation passes if the keyword's subschema
         * validates against all applicable property values.
         *
         * The annotation result of this keyword is the set of instance property names
         * validated by this keyword's subschema.
         *
         * The presence of this keyword affects the behavior of other
         * `unevaluatedProperties` keywords found earlier in the dynamic scope that
         * apply to the same instance location.
         *
         * Omitting this keyword has the same assertion behavior as an empty schema.
         */
        unevaluatedProperties?: Sub;
        /**
         * The value of this keyword MUST be a boolean.
         *
         * If this keyword has boolean value `false`, the instance validates
         * successfully. If it has boolean value `true`, the instance validates
         * successfully if all of its elements are unique.
         *
         * Omitting this keyword has the same behavior as a value of `false`.
         *
         *
         *
         * @default false
         */
        uniqueItems?: boolean;
        /**
         * The value of this keyword MUST be a boolean. When multiple occurrences of
         * this keyword are applicable to a single sub-instance, the resulting
         * behavior SHOULD be as for a `true` value if any occurrence specifies a
         * `true` value, and SHOULD be as for a `false` value otherwise.
         *
         * If `writeOnly` has a value of boolean `true`, it indicates that the value
         * is never present when the instance is retrieved from the owning authority.
         * It can be present when sent to the owning authority to update or create the
         * document (or the resource it represents), but it will not be included in
         * any updated or newly created version of the instance.
         *
         * An instance document that is marked as `writeOnly` for the entire document
         * MAY be returned as a blank document of some sort, or MAY produce an error
         * upon retrieval, or have the retrieval request ignored, at the authority's
         * discretion.
         *
         * For example, `writeOnly` would be used to mark a password input field.
         * Applications MAY choose to use a widget that hides input values as they are
         * typed for write-only fields.
         *
         * Omitting this keyword has the same behavior as a value of `false`.
         *
         *
         *
         * @default false
         */
        writeOnly?: boolean;
    }
    /**
     * The keywords permitted for a given `type` value. Keywords shared by every
     * type are always included; type-specific keywords are included when
     * `SchemaType` contains that type. A list of type names permits the
     * keywords of every type in the list.
     */
    type KeywordsFor<SchemaType extends TypeValue> = KeywordByType.Any | (SchemaType extends "array" ? KeywordByType.Array : never) | (SchemaType extends "integer" | "number" ? KeywordByType.Number : never) | (SchemaType extends "object" ? KeywordByType.Object : never) | (SchemaType extends "string" ? KeywordByType.String : never) | (SchemaType extends MaybeReadonlyArray<unknown> ? keyof Interface : never);
    /**
     * A schema object with only the keywords that apply to `SchemaType`.
     * `JSONSchema.String`, `JSONSchema.Object`, etc. are instances of this.
     */
    type Narrowed<Value, SchemaType extends TypeValue, Sub = JSONSchema> = Pick<Interface<Value, SchemaType, Sub>, KeywordsFor<SchemaType>>;
    type Array<T = any> = Narrowed<T, "array">;
    type Boolean = Narrowed<boolean, "boolean">;
    type Integer = Narrowed<number, "integer">;
    type Number = Narrowed<number, "number">;
    type Null = Narrowed<null, "null">;
    type Object<T = any> = Narrowed<T, "object">;
    type String = Narrowed<string, "string">;
}
/**
 * Keyword names grouped by the `type` they apply to. `Any` applies to every
 * type.
 */
export declare namespace KeywordByType {
    type Any = "$anchor" | "$comment" | "$defs" | "$dynamicAnchor" | "$dynamicRef" | "$id" | "$ref" | "$schema" | "allOf" | "anyOf" | "const" | "default" | "deprecated" | "description" | "else" | "enum" | "examples" | "format" | "if" | "not" | "oneOf" | "readOnly" | "then" | "title" | "type" | "writeOnly";
    type Array = "contains" | "items" | "maxContains" | "maxItems" | "minContains" | "minItems" | "prefixItems" | "unevaluatedItems" | "uniqueItems";
    type Number = "exclusiveMaximum" | "exclusiveMinimum" | "maximum" | "minimum" | "multipleOf";
    type Object = "additionalProperties" | "dependentRequired" | "dependentSchemas" | "maxProperties" | "minProperties" | "patternProperties" | "properties" | "propertyNames" | "required" | "unevaluatedProperties";
    type String = "contentEncoding" | "contentMediaType" | "contentSchema" | "maxLength" | "minLength" | "pattern";
}
/**
 * Content encoding strategy enum.
 *
 * - [RFC 4648: The Base16, Base32, and Base64 Data Encodings](https://datatracker.ietf.org/doc/html/rfc4648)
 * - [Content-Transfer-Encoding Syntax](https://datatracker.ietf.org/doc/html/rfc2045#section-6.1)
 * - [7bit vs 8bit encoding](https://stackoverflow.com/questions/25710599/content-transfer-encoding-7bit-or-8-bit/28531705#28531705)
 */
export declare enum ContentEncoding {
    /**
     * Only US-ASCII characters, which use the lower 7 bits for each character.
     *
     * Each line must be less than 1,000 characters.
     */
    "7bit" = "7bit",
    /**
     * Allow extended ASCII characters which can use the 8th (highest) bit to
     * indicate special characters not available in 7bit.
     *
     * Each line must be less than 1,000 characters.
     */
    "8bit" = "8bit",
    /**
     * Hexadecimal encoding using the alphabet `0-9A-F`, as defined by
     * [RFC 4648, Section 8](https://datatracker.ietf.org/doc/html/rfc4648#section-8).
     */
    Base16 = "base16",
    /**
     * Base 32 encoding using the alphabet `A-Z2-7`, as defined by
     * [RFC 4648, Section 6](https://datatracker.ietf.org/doc/html/rfc4648#section-6).
     */
    Base32 = "base32",
    /**
     * Base 32 encoding using the "Extended Hex" alphabet `0-9A-V`, as defined by
     * [RFC 4648, Section 7](https://datatracker.ietf.org/doc/html/rfc4648#section-7).
     */
    Base32Hex = "base32hex",
    /**
     * Base 64 encoding as defined by
     * [RFC 4648, Section 4](https://datatracker.ietf.org/doc/html/rfc4648#section-4).
     * Useful for data that is mostly non-text. Where RFC 2045 and RFC 4648
     * differ, the RFC 4648 definition (no line length limit) SHOULD be assumed.
     */
    Base64 = "base64",
    /**
     * Base 64 encoding with the URL and filename safe alphabet (`-` and `_`
     * instead of `+` and `/`), as defined by
     * [RFC 4648, Section 5](https://datatracker.ietf.org/doc/html/rfc4648#section-5).
     */
    Base64URL = "base64url",
    /**
     * Same character set as 8bit, with no line length restriction.
     */
    Binary = "binary",
    /**
     * An extension token defined by a standards-track RFC and registered with
     * IANA.
     */
    IETFToken = "ietf-token",
    /**
     * Lines are limited to 76 characters, and line breaks are represented using
     * special characters that are escaped.
     */
    QuotedPrintable = "quoted-printable",
    /**
     * The two characters "X-" or "x-" followed, with no intervening white space,
     * by any token.
     */
    XToken = "x-token"
}
/**
 * The formats defined by the JSON Schema specification. All of them apply to
 * string instances. Additional formats are listed in the [format
 * registry][registry], and implementations are encouraged to support those as
 * if they were defined by the specification.
 *
 * [registry]:
 *   https://github.com/json-schema-org/json-schema-spec/blob/main/specs/registries/format.json
 */
export declare enum Format {
    /**
     * A string instance is valid against this attribute if it is a valid
     * representation according to the "full-date" ABNF rule in [RFC
     * 3339][RFC3339].
     *
     * [RFC3339]: https://www.rfc-editor.org/info/rfc3339
     */
    Date = "date",
    /**
     * A string instance is valid against this attribute if it is a valid
     * representation of the "date-time-ext" rule in [RFC 9557][RFC9557]. This
     * SHOULD allow and validate published leap seconds. See [RFC 3339, section
     * 5.7][RFC3339].
     *
     * [RFC9557]: https://www.rfc-editor.org/info/rfc9557
     * [RFC3339]: https://www.rfc-editor.org/info/rfc3339
     */
    DateTime = "date-time",
    /**
     * A string instance is valid against this attribute if it is a valid
     * representation according to the "duration" ABNF rule in [RFC 3339, Appendix
     * A][RFC3339].
     *
     * [RFC3339]: https://www.rfc-editor.org/info/rfc3339
     */
    Duration = "duration",
    /**
     * A string instance is valid against this attribute if it is a valid Internet
     * email address as defined by the "Mailbox" ABNF rule in [RFC 5321][RFC5321],
     * section 4.1.2.
     *
     * [RFC5321]: https://datatracker.ietf.org/doc/html/rfc5321
     */
    Email = "email",
    /**
     * A string instance is valid against this attribute if it is a valid
     * representation for an Internet hostname as defined by [RFC 1123, section
     * 2.1][RFC1123].
     *
     * [RFC1123]: https://www.rfc-editor.org/info/rfc1123
     */
    Hostname = "hostname",
    /**
     * An IPv4 address according to the "dotted-quad" ABNF syntax as defined in
     * [RFC 2673, section 3.2][RFC2673].
     *
     * [RFC2673]: https://datatracker.ietf.org/doc/html/rfc2673
     */
    IPv4 = "ipv4",
    /**
     * An IPv6 address as defined in [RFC 4291, section 2.2][RFC4291].
     *
     * [RFC4291]: https://datatracker.ietf.org/doc/html/rfc4291
     */
    IPv6 = "ipv6",
    /**
     * A string instance is valid against this attribute if it is a valid IRI,
     * according to [RFC 3987][RFC3987].
     *
     * [RFC3987]: https://datatracker.ietf.org/doc/html/rfc3987
     */
    IRI = "iri",
    /**
     * A string instance is valid against this attribute if it is a valid IRI
     * Reference (either an IRI or a relative-reference), according to [RFC
     * 3987][RFC3987].
     *
     * [RFC3987]: https://datatracker.ietf.org/doc/html/rfc3987
     */
    IRIReference = "iri-reference",
    /**
     * A string instance is valid against this attribute if it is a valid JSON
     * string representation of a JSON Pointer, according to [RFC 6901, section
     * 5][RFC6901].
     *
     * [RFC6901]: https://datatracker.ietf.org/doc/html/rfc6901
     */
    JSONPointer = "json-pointer",
    /**
     * A regular expression, which SHOULD be valid according to the
     * [ECMA-262][ecma262] regular expression dialect.
     *
     * Implementations that validate formats MUST accept at least the subset of
     * [ECMA-262][ecma262] defined in the Regular Expressions section of the
     * validation specification, and SHOULD accept all valid [ECMA-262][ecma262]
     * expressions.
     *
     * [ecma262]: https://www.ecma-international.org/ecma-262/11.0/index.html
     */
    RegEx = "regex",
    /**
     * A string instance is valid against this attribute if it is a valid
     * [Relative JSON Pointer][relative-json-pointer]. To allow for both absolute
     * and relative JSON Pointers, use `anyOf` or `oneOf` to indicate support for
     * either format.
     *
     * [relative-json-pointer]:
     *   https://datatracker.ietf.org/doc/html/draft-handrews-relative-json-pointer-01
     */
    RelativeJSONPointer = "relative-json-pointer",
    /**
     * A string instance is valid against this attribute if it is a valid
     * representation according to the "full-time" ABNF rule in [RFC
     * 3339][RFC3339]. This MUST NOT include leap seconds.
     *
     * The `time` format represents a time value that is independent of any
     * specific date, such as a scheduled time of day or a measured duration.
     * Because there is no date, it is not well suited for capturing a moment in
     * time; for that, use `date-time`.
     *
     * [RFC3339]: https://www.rfc-editor.org/info/rfc3339
     */
    Time = "time",
    /**
     * A string instance is valid against this attribute if it is a valid URI,
     * according to [RFC3986][RFC3986].
     *
     * [RFC3986]: https://datatracker.ietf.org/doc/html/rfc3986
     */
    URI = "uri",
    /**
     * A string instance is valid against this attribute if it is a valid URI
     * Reference (either a URI or a relative-reference), according to
     * [RFC3986][RFC3986].
     *
     * [RFC3986]: https://datatracker.ietf.org/doc/html/rfc3986
     */
    URIReference = "uri-reference",
    /**
     * A string instance is valid against this attribute if it is a valid URI
     * Template (of any level), according to [RFC 6570][RFC6570].
     *
     * Note that URI Templates may be used for IRIs; there is no separate IRI
     * Template specification.
     *
     * [RFC6570]: https://www.rfc-editor.org/info/rfc6570
     */
    URITemplate = "uri-template",
    /**
     * A string instance is valid against this attribute if it is a valid string
     * representation of a UUID, according to [RFC 4122][RFC4122].
     *
     * Note that the `uuid` format is for plain UUIDs, not UUIDs in URNs. An
     * example is `f81d4fae-7dec-11d0-a765-00a0c91e6bf6`. For UUIDs as URNs, use
     * the `uri` format, with a `pattern` regular expression of `^urn:uuid:` to
     * indicate the URI scheme and URN namespace.
     *
     * [RFC4122]: https://www.rfc-editor.org/info/rfc4122
     */
    UUID = "uuid"
}
/**
 * Enum consisting of simple type names for the `type` keyword
 */
export declare enum TypeName {
    /**
     * Value MUST be an array.
     */
    Array = "array",
    /**
     * Value MUST be a boolean.
     */
    Boolean = "boolean",
    /**
     * Value MUST be an integer, no floating point numbers are allowed. This is a
     * subset of the number type.
     */
    Integer = "integer",
    /**
     * Value MUST be null. Note this is mainly for purpose of being able use union
     * types to define nullability. If this type is not included in a union, null
     * values are not allowed (the primitives listed above do not allow nulls on
     * their own).
     */
    Null = "null",
    /**
     * Value MUST be a number, floating point numbers are allowed.
     */
    Number = "number",
    /**
     * Value MUST be an object.
     */
    Object = "object",
    /**
     * Value MUST be a string.
     */
    String = "string"
}
export declare const keywords: readonly ["$anchor", "$comment", "$defs", "$dynamicAnchor", "$dynamicRef", "$id", "$ref", "$schema", "additionalProperties", "allOf", "anyOf", "const", "contains", "contentEncoding", "contentMediaType", "contentSchema", "default", "dependentRequired", "dependentSchemas", "deprecated", "description", "else", "enum", "examples", "exclusiveMaximum", "exclusiveMinimum", "format", "if", "items", "maxContains", "maximum", "maxItems", "maxLength", "maxProperties", "minContains", "minimum", "minItems", "minLength", "minProperties", "multipleOf", "not", "oneOf", "pattern", "patternProperties", "prefixItems", "properties", "propertyNames", "readOnly", "required", "then", "title", "type", "unevaluatedItems", "unevaluatedProperties", "uniqueItems", "writeOnly"];
export {};
