import { defineValidationSpec, desc } from "../../spec.ts";

// Reflects spec commit: 41014ea723120ce70b314d72f863c6929d9f3cfd

export default defineValidationSpec({
  $copyright: {
    credits: [
      "IETF Trust <https://www.ietf.org/>",
      "Austin Wright <aaa@bzfx.net>",
      "Henry Andrews <henry@cloudflare.com>",
      "Geraint Luff <luffgd@gmail.com>",
      "Cloudflare, Inc. <https://www.cloudflare.com/>",
    ],
    year: 2018,
  },
  $docsUrl: "https://json-schema.org/draft-07/json-schema-validation.html",
  $draft: "7",
  $license: desc`
    BSD-2-Clause License

    Original source code is copyright (c) 2019-2025 Remy Rylan
    <https://github.com/RemyRylan>

    {COPYRIGHT}

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

    1. Redistributions of source code must retain the above copyright notice,
       this list of conditions and the following disclaimer.

    2. Redistributions in binary form must reproduce the above copyright notice,
       this list of conditions and the following disclaimer in the documentation
       and/or other materials provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
    ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
    CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
    SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
    INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
    CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
    ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
    POSSIBILITY OF SUCH DAMAGE.
  `,
  $schemaUrl: "https://json-schema.org/draft-07/schema",
  enums: {
    contentEncoding: {
      description: desc`
        Content encoding strategy enum.

        - [Content-Transfer-Encoding Syntax](https://datatracker.ietf.org/doc/html/rfc2045#section-6.1)
        - [7bit vs 8bit encoding](https://stackoverflow.com/questions/25710599/content-transfer-encoding-7bit-or-8-bit/28531705#28531705)
      `,
      title: "ContentEncoding",
      values: {
        "7bit": {
          description: desc`
            Only US-ASCII characters, which use the lower 7 bits for each 
            character.

            Each line must be less than 1,000 characters.
          `,
          value: "7bit",
        },
        "8bit": {
          description: desc`
            Allow extended ASCII characters which can use the 8th (highest) bit 
            to indicate special characters not available in 7bit.

            Each line must be less than 1,000 characters.
          `,
          value: "8bit",
        },
        Base64: {
          description: desc`
            Useful for data that is mostly non-text.
          `,
          value: "base64",
        },
        Binary: {
          description: desc`
            Same character set as 8bit, with no line length restriction.
          `,
          value: "binary",
        },
        IETFToken: {
          description: desc`
            An extension token defined by a standards-track RFC and registered 
            with IANA.
          `,
          value: "ietf-token",
        },
        QuotedPrintable: {
          description: desc`
            Lines are limited to 76 characters, and line breaks are represented 
            using special characters that are escaped.
          `,
          value: "quoted-printable",
        },
        XToken: {
          description: desc`
            The two characters "X-" or "x-" followed, with no intervening white 
            space, by any token.
          `,
          value: "x-token",
        },
      },
    },
    format: {
      description: desc`
        This enum provides well-known formats that apply to strings.
      `,
      title: "Format",
      values: {
        Date: {
          description: desc`
            A string instance is valid against this attribute if it is a valid
            representation according to the "full-date" production in
            [RFC 3339][RFC3339].

            [RFC3339]: https://datatracker.ietf.org/doc/html/rfc3339
          `,
          value: "date",
        },
        DateTime: {
          description: desc`
            A string instance is valid against this attribute if it is a valid
            representation according to the "date-time" production in 
            [RFC 3339][RFC3339].

            [RFC3339]: https://datatracker.ietf.org/doc/html/rfc3339
          `,
          value: "date-time",
        },
        Email: {
          description: desc`
            A string instance is valid against this attribute if it is a valid
            Internet email address as defined by 
            [RFC 5322, section 3.4.1][RFC5322].

            [RFC5322]: https://datatracker.ietf.org/doc/html/rfc5322
          `,
          value: "email",
        },
        Hostname: {
          description: desc`
            As defined by [RFC 1034, section 3.1][RFC1034], including host names
            produced using the Punycode algorithm specified in
            [RFC 5891, section 4.4][RFC5891].

            [RFC1034]: https://datatracker.ietf.org/doc/html/rfc1034
            [RFC5891]: https://datatracker.ietf.org/doc/html/rfc5891
          `,
          value: "hostname",
        },
        IDNEmail: {
          description: desc`
            A string instance is valid against this attribute if it is a valid
            Internet email address as defined by [RFC 6531][RFC6531].

            [RFC6531]: https://datatracker.ietf.org/doc/html/rfc6531
          `,
          value: "idn-email",
        },
        IDNHostname: {
          description: desc`
            As defined by either [RFC 1034, section 3.1][RFC1034] as for 
            hostname, or an internationalized hostname as defined by 
            [RFC 5890, section 2.3.2.3][RFC5890].

            [RFC1034]: https://datatracker.ietf.org/doc/html/rfc1034
            [RFC5890]: https://datatracker.ietf.org/doc/html/rfc5890
          `,
          value: "idn-hostname",
        },
        IPv4: {
          description: desc`
            An IPv4 address according to the "dotted-quad" ABNF syntax as defined 
            in [RFC 2673, section 3.2][RFC2673].

            [RFC2673]: https://datatracker.ietf.org/doc/html/rfc2673
          `,
          value: "ipv4",
        },
        IPv6: {
          description: desc`
            An IPv6 address as defined in [RFC 4291, section 2.2][RFC4291].

            [RFC4291]: https://datatracker.ietf.org/doc/html/rfc4291
          `,
          value: "ipv6",
        },
        IRI: {
          description: desc`
            A string instance is valid against this attribute if it is a valid 
            IRI, according to [RFC 3987][RFC3987].

            [RFC3987]: https://datatracker.ietf.org/doc/html/rfc3987
          `,
          value: "iri",
        },
        IRIReference: {
          description: desc`
            A string instance is valid against this attribute if it is a valid IRI
            Reference (either an IRI or a relative-reference), according to
            [RFC 3987][RFC3987].

            [RFC3987]: https://datatracker.ietf.org/doc/html/rfc3987
          `,
          value: "iri-reference",
        },
        JSONPointer: {
          description: desc`
            A string instance is valid against this attribute if it is a valid 
            JSON string representation of a JSON Pointer, according to
            [RFC 6901, section 5][RFC6901].

            [RFC6901]: https://datatracker.ietf.org/doc/html/rfc6901
          `,
          value: "json-pointer",
        },
        JSONPointerURIFragment: {
          description: desc`
            A string instance is valid against this attribute if it is a valid 
            JSON string representation of a JSON Pointer fragment, according to
            [RFC 6901, section 5][RFC6901].

            [RFC6901]: https://datatracker.ietf.org/doc/html/rfc6901
          `,
          value: "json-pointer-uri-fragment",
        },
        RegEx: {
          description: desc`
            This attribute applies to string instances.

            A regular expression, which SHOULD be valid according to the
            [ECMA-262][ecma262] regular expression dialect.

            Implementations that validate formats MUST accept at least the subset 
            of [ECMA-262][ecma262] defined in the 
            [Regular Expressions][regexInterop] section of this specification, and 
            SHOULD accept all valid [ECMA-262][ecma262] expressions.

            [ecma262]: https://www.ecma-international.org/publications-and-standards/standards/ecma-262/
            [regexInterop]: https://json-schema.org/draft-07/json-schema-validation.html#regexInterop
          `,
          value: "regex",
        },
        RelativeJSONPointer: {
          description: desc`
            A string instance is valid against this attribute if it is a valid
            [Relative JSON Pointer][relative-json-pointer].

            [relative-json-pointer]: https://datatracker.ietf.org/doc/html/draft-handrews-relative-json-pointer-01
          `,
          value: "relative-json-pointer",
        },
        Time: {
          description: desc`
            A string instance is valid against this attribute if it is a valid
            representation according to the "time" production in 
            [RFC 3339][RFC3339].

            [RFC3339]: https://datatracker.ietf.org/doc/html/rfc3339
          `,
          value: "time",
        },
        URI: {
          description: desc`
            A string instance is valid against this attribute if it is a valid 
            URI, according to [RFC3986][RFC3986].

            [RFC3986]: https://datatracker.ietf.org/doc/html/rfc3986
          `,
          value: "uri",
        },
        URIReference: {
          description: desc`
            A string instance is valid against this attribute if it is a valid URI
            Reference (either a URI or a relative-reference), according to
            [RFC3986][RFC3986].

            [RFC3986]: https://datatracker.ietf.org/doc/html/rfc3986
          `,
          value: "uri-reference",
        },
        URITemplate: {
          description: desc`
            A string instance is valid against this attribute if it is a valid URI
            Template (of any level), according to [RFC6570][RFC6570].

            Note that URI Templates may be used for IRIs; there is no separate IRI
            Template specification.

            [RFC6570]: https://datatracker.ietf.org/doc/html/rfc6570
          `,
          value: "uri-template",
        },
        UUID: {
          description: desc`
            UUID
          `,
          value: "uuid",
        },
      },
    },
    typeName: {
      description:
        "Enum consisting of simple type names for the `type` keyword",
      title: "TypeName",
      values: {
        Array: {
          description: desc`
            Value MUST be an array.
          `,
          value: "array",
        },
        Boolean: {
          description: desc`
            Value MUST be a boolean.
          `,
          value: "boolean",
        },
        Integer: {
          description: desc`
            Value MUST be an integer, no floating point numbers are allowed. 
            This is a subset of the number type.
          `,
          value: "integer",
        },
        Null: {
          description: desc`
            Value MUST be null. Note this is mainly for purpose of being able
            use union types to define nullability. If this type is not included
            in a union, null values are not allowed (the primitives listed above
            do not allow nulls on their own).
          `,
          value: "null",
        },
        Number: {
          description: desc`
            Value MUST be a number, floating point numbers are allowed.
          `,
          value: "number",
        },
        Object: {
          description: desc`
            Value MUST be an object.
          `,
          value: "object",
        },
        String: {
          description: desc`
            Value MUST be a string.
          `,
          value: "string",
        },
      },
    },
  },
  keywords: {
    $comment: {
      description: desc`
        This keyword is reserved for comments from schema authors to readers or
        maintainers of the schema. The value of this keyword MUST be a string.
        Implementations MUST NOT present this string to end users. Tools for
        editing schemas SHOULD support displaying and editing this keyword.

        The value of this keyword MAY be used in debug or error output which is
        intended for developers making use of schemas. Schema vocabularies 
        SHOULD allow \`comment\` within any object containing vocabulary 
        keywords.

        Implementations MAY assume \`comment\` is allowed unless the vocabulary
        specifically forbids it. Vocabularies MUST NOT specify any effect of
        \`comment\` beyond what is described in this specification. Tools that
        translate other media types or programming languages to and from
        \`application/schema+json\` MAY choose to convert that media type or
        programming language's native comments to or from \`comment\` values.

        The behavior of such translation when both native comments and 
        \`comment\` properties are present is implementation-dependent. 
        Implementations SHOULD treat \`comment\` identically to an unknown 
        extension keyword.

        They MAY strip \`comment\` values at any point during processing. In
        particular, this allows for shortening schemas when the size of deployed
        schemas is a concern. Implementations MUST NOT take any other action 
        based on the presence, absence, or contents of \`comment\` properties.
      `,
      type: "string",
    },
    $id: {
      description: desc`
        The \`$id\` keyword defines a URI for the schema, and the base URI that 
        other URI references within the schema are resolved against. A 
        subschema's \`$id\` is resolved against the base URI of its parent 
        schema. If no parent sets an explicit base with \`$id\`, the base URI is
        that of the entire document, as determined per 
        [RFC 3986 section 5][RFC3986].

        If present, the value for this keyword MUST be a string, and MUST 
        represent a valid [URI-reference][RFC3986]. This value SHOULD be 
        normalized, and SHOULD NOT be an empty fragment \`#\` or an empty string.

        [RFC3986]: https://datatracker.ietf.org/doc/html/rfc3986
      `,
      format: "uri-reference",
      type: "string",
    },
    $ref: {
      description: desc`
        The \`$ref\` keyword is used to reference a schema, and provides the 
        ability to validate recursive structures through self-reference.

        An object schema with a \`$ref\` property MUST be interpreted as a 
        \`$ref\` reference. The value of the \`$ref\` property MUST be a URI 
        Reference. Resolved against the current URI base, it identifies the URI 
        of a schema to use. All other properties in a \`$ref\` object MUST be
        ignored.

        The URI is not a network locator, only an identifier. A schema need not 
        be downloadable from the address if it is a network-addressable URL, and
        implementations SHOULD NOT assume they should perform a network 
        operation when they encounter a network-addressable URI.

        A schema MUST NOT be run into an infinite loop against a schema. For
        example, if two schemas \`"#alice"\` and \`"#bob"\` both have an 
        \`allOf\` property that refers to the other, a naive validator might get 
        stuck in an infinite recursive loop trying to validate the instance. 
        Schemas SHOULD NOT make use of infinite recursive nesting like this; the
        behavior is undefined.
      `,
      format: "uri-reference",
      type: "string",
    },
    $schema: {
      description: desc`
        The \`$schema\` keyword is both used as a JSON Schema version identifier 
        and the location of a resource which is itself a JSON Schema, which 
        describes any schema written for this particular version.

        The value of this keyword MUST be a [URI][RFC3986] (containing a scheme)
        and this URI MUST be normalized. The current schema MUST be valid 
        against the meta-schema identified by this URI.

        If this URI identifies a retrievable resource, that resource SHOULD be 
        of media type \`application/schema+json\`.

        The \`$schema\` keyword SHOULD be used in a root schema. It MUST NOT 
        appear in subschemas.

        Values for this property are defined in other documents and by other
        parties. JSON Schema implementations SHOULD implement support for 
        current and previous published drafts of JSON Schema vocabularies as 
        deemed reasonable.

        [RFC3986]: https://datatracker.ietf.org/doc/html/rfc3986
      `,
      format: "uri",
      type: "string",
    },
    additionalItems: {
      description: desc`
        The value of \`additionalItems\` MUST be a valid JSON Schema.

        This keyword determines how child instances validate for arrays, and 
        does not directly validate the immediate instance itself.

        If \`items\` is an array of schemas, validation succeeds if every 
        instance element at a position greater than the size of \`items\` 
        validates against \`additionalItems\`.

        Otherwise, \`additionalItems\` MUST be ignored, as the \`items\` schema
        (possibly the default value of an empty schema) is applied to all 
        elements.

        Omitting this keyword has the same behavior as an empty schema.
      `,
      type: "JSONSchema",
    },
    additionalProperties: {
      description: desc`
        The value of \`additionalProperties\` MUST be a valid JSON Schema.

        This keyword determines how child instances validate for objects, and 
        does not directly validate the immediate instance itself.

        Validation with \`additionalProperties\` applies only to the child 
        values of instance names that do not match any names in \`properties\`, 
        and do not match any regular expression in \`patternProperties\`.

        For all such properties, validation succeeds if the child instance
        validates against the \`additionalProperties\` schema.

        Omitting this keyword has the same behavior as an empty schema.
      `,
      type: "JSONSchema",
    },
    allOf: {
      description: desc`
        This keyword's value MUST be a non-empty array. Each item of the array 
        MUST be a valid JSON Schema.

        An instance validates successfully against this keyword if it validates
        successfully against all schemas defined by this keyword's value.
      `,
      items: { type: "JSONSchema<Narrowable>" },
      type: "array",
    },
    anyOf: {
      description: desc`
        This keyword's value MUST be a non-empty array. Each item of the array 
        MUST be a valid JSON Schema.

        An instance validates successfully against this keyword if it validates
        successfully against at least one schema defined by this keyword's 
        value.
      `,
      items: { type: "JSONSchema<Narrowable>" },
      type: "array",
    },
    const: {
      description: desc`
        An instance validates successfully against this keyword if its value is
        equal to the value of the keyword.

        Use of this keyword is functionally equivalent to the \`enum\` keyword 
        with a single value.
      `,
      type: "Value",
    },
    contains: {
      description: desc`
        The value of this keyword MUST be a valid JSON Schema.

        An array instance is valid against \`contains\` if at least one of its
        elements is valid against the given schema.
      `,
      type: "JSONSchema<Narrowable>",
    },
    contentEncoding: {
      description: desc`
        If the instance value is a string, this property defines that the 
        string SHOULD be interpreted as binary data and decoded using the 
        encoding named by this property. [RFC 2045, Sec 6.1][RFC2045] lists the 
        possible values for this property.

        The value of this property SHOULD be ignored if the instance described 
        is not a string.

        [RFC2045]: https://datatracker.ietf.org/doc/html/rfc2045#section-6.1
      `,
      enum: [
        "7bit",
        "8bit",
        "base64",
        "binary",
        "ietf-token",
        "quoted-printable",
        "x-token",
      ],
      type: "string",
    },
    contentMediaType: {
      description: desc`
        The value of this property must be a media type, as defined by
        [RFC 2046][RFC2046]. This property defines the media type of instances
        which this schema defines.

        The value of this property SHOULD be ignored if the instance described 
        is not a string.

        If the \`contentEncoding\` property is not present, but the instance 
        value is a string, then the value of this property SHOULD specify a text
        document type, and the character set SHOULD be the character set into 
        which the JSON string value was decoded (for which the default is 
        Unicode).

        [RFC2046]: https://datatracker.ietf.org/doc/html/rfc2046
      `,
      type: "string",
    },
    default: {
      description: desc`
        This keyword can be used to supply a default JSON value associated with 
        a particular schema. It is RECOMMENDED that a \`default\` value be valid
        against the associated schema.
      `,
      type: "Value",
    },
    definitions: {
      additionalProperties: { type: "JSONSchema" },
      description: desc`
        The \`definitions\` keywords provides a standardized location for schema
        authors to inline re-usable JSON Schemas into a more general schema. The
        keyword does not directly affect the validation result.

        This keyword's value MUST be an object. Each member value of this object
        MUST be a valid JSON Schema.
      `,
      type: "object",
    },
    dependencies: {
      description: desc`
        This keyword specifies rules that are evaluated if the instance is an
        object and contains a certain property.

        This keyword's value MUST be an object. Each property specifies a
        dependency. Each dependency value MUST be an array or a valid JSON 
        Schema.

        If the dependency value is a subschema, and the dependency key is a
        property in the instance, the entire instance must validate against the
        dependency value.

        If the dependency value is an array, each element in the array, if any,
        MUST be a string, and MUST be unique. If the dependency key is a 
        property in the instance, each of the items in the dependency value must
        be a property that exists in the instance.

        Omitting this keyword has the same behavior as an empty object.
      `,
      oneOf: [{
        additionalProperties: {
          oneOf: [
            { items: { type: "string" }, type: "array" },
            { type: "JSONSchema" },
          ],
        },
        type: "object",
      }],
    },
    description: {
      description: desc`
        Can be used to decorate a user interface with explanation or information
        about the data produced.
      `,
      type: "string",
    },
    else: {
      description: desc`
        This keyword's value MUST be a valid JSON Schema.

        When \`if\` is present, and the instance fails to validate against its
        subschema, then validation succeeds against this keyword if the instance
        successfully validates against this keyword's subschema.

        This keyword has no effect when \`if\` is absent, or when the instance
        successfully validates against its subschema. Implementations MUST NOT
        evaluate the instance against this keyword, for either validation or
        annotation collection purposes, in such cases.
      `,
      type: "JSONSchema<Narrowable>",
    },
    enum: {
      description: desc`
        The value of this keyword MUST be an array. This array SHOULD have at 
        least one element. Elements in the array SHOULD be unique.

        An instance validates successfully against this keyword if its value is
        equal to one of the elements in this keyword's array value.

        Elements in the array might be of any type, including \`null\`.
      `,
      items: { type: "Value" },
      type: "array",
    },
    examples: {
      description: desc`
        The value of this keyword MUST be an array. When multiple occurrences of
        this keyword are applicable to a single sub-instance, implementations 
        MUST provide a flat array of all values rather than an array of arrays.

        This keyword can be used to provide sample JSON values associated with a
        particular schema, for the purpose of illustrating usage. It is 
        RECOMMENDED that these values be valid against the associated schema.

        Implementations MAY use the value(s) of \`default\`, if present, as an
        additional example. If \`examples\` is absent, \`default\` MAY still be 
        used in this manner.
      `,
      items: { type: "Value" },
      type: "array",
    },
    exclusiveMaximum: {
      description: desc`
        The value of \`exclusiveMaximum\` MUST be a number, representing an 
        exclusive upper limit for a numeric instance.

        If the instance is a number, then the instance is valid only if it has a
        value strictly less than (not equal to) \`exclusiveMaximum\`.
      `,
      type: "number",
    },
    exclusiveMinimum: {
      description: desc`
        The value of \`exclusiveMinimum\` MUST be a number, representing an 
        exclusive lower limit for a numeric instance.

        If the instance is a number, then the instance is valid only if it has a
        value strictly greater than (not equal to) \`exclusiveMinimum\`.
      `,
      type: "number",
    },
    format: {
      description: desc`
        The \`format\` keyword functions as both an [annotation][annotation] and 
        as an [assertion][assertion]. While no special effort is required to 
        implement it as an annotation conveying semantic meaning, implementing 
        validation is non-trivial.

        Implementations MAY support the \`format\` keyword as a validation 
        assertion.

        Implementations MAY add custom \`format\` attributes. Save for agreement
        between parties, schema authors SHALL NOT expect a peer implementation 
        to support this keyword and/or custom \`format\` attributes.

        [annotation]: https://json-schema.org/draft-07/json-schema-validation.html#annotations
        [assertion]: https://json-schema.org/draft-07/json-schema-validation.html#assertions
      `,
      type: "string",
    },
    if: {
      description: desc`
        This keyword's value MUST be a valid JSON Schema.

        This validation outcome of this keyword's subschema has no direct effect
        on the overall validation result. Rather, it controls which of the 
        \`then\` or \`else\` keywords are evaluated.

        Instances that successfully validate against this keyword's subschema 
        MUST also be valid against the subschema value of the \`then\` keyword, 
        if present.

        Instances that fail to validate against this keyword's subschema MUST 
        also be valid against the subschema value of the \`else\` keyword, if 
        present.

        If [annotations][annotations] are being collected, they are collected 
        from this keyword's subschema in the usual way, including when the 
        keyword is present without either \`then\` or \`else\`.

        [annotations]: https://json-schema.org/draft-07/json-schema-validation.html#annotations
      `,
      type: "JSONSchema<Narrowable>",
    },
    items: {
      description: desc`
        The value of \`items\` MUST be either a valid JSON Schema or an array of
        valid JSON Schemas.

        This keyword determines how child instances validate for arrays, and 
        does not directly validate the immediate instance itself.

        If \`items\` is a schema, validation succeeds if all elements in the 
        array successfully validate against that schema.

        If \`items\` is an array of schemas, validation succeeds if each element 
        of the instance validates against the schema at the same position, if 
        any.

        Omitting this keyword has the same behavior as an empty schema.
      `,
      oneOf: [
        { items: { type: "JSONSchema" }, type: "array" },
        { type: "JSONSchema" },
      ],
    },
    maximum: {
      description: desc`
        The value of \`maximum\` MUST be a number, representing an inclusive 
        upper limit for a numeric instance.

        If the instance is a number, then this keyword validates only if the
        instance is less than or exactly equal to \`maximum\`.
      `,
      type: "number",
    },
    maxItems: {
      description: desc`
        The value of this keyword MUST be a non-negative integer.

        An array instance is valid against \`maxItems\` if its size is less 
        than, or equal to, the value of this keyword.
      `,
      minimum: 0,
      type: "integer",
    },
    maxLength: {
      description: desc`
        The value of this keyword MUST be a non-negative integer.

        A string instance is valid against this keyword if its length is less 
        than, or equal to, the value of this keyword.

        The length of a string instance is defined as the number of its 
        characters as defined by [RFC 7159][RFC7159].

        [RFC7159]: https://datatracker.ietf.org/doc/html/rfc7159
      `,
      minimum: 0,
      type: "integer",
    },
    maxProperties: {
      description: desc`
        The value of this keyword MUST be a non-negative integer.

        An object instance is valid against \`maxProperties\` if its number of
        \`properties\` is less than, or equal to, the value of this keyword.
      `,
      minimum: 0,
      type: "integer",
    },
    minimum: {
      description: desc`
        The value of \`minimum\` MUST be a number, representing an inclusive 
        lower limit for a numeric instance.

        If the instance is a number, then this keyword validates only if the
        instance is greater than or exactly equal to \`minimum\`.
      `,
      type: "number",
    },
    minItems: {
      default: 0,
      description: desc`
        The value of this keyword MUST be a non-negative integer.

        An array instance is valid against \`minItems\` if its size is greater 
        than, or equal to, the value of this keyword.

        Omitting this keyword has the same behavior as a value of \`0\`.
      `,
      minimum: 0,
      type: "integer",
    },
    minLength: {
      default: 0,
      description: desc`
        The value of this keyword MUST be a non-negative integer.

        A string instance is valid against this keyword if its length is greater
        than, or equal to, the value of this keyword.

        The length of a string instance is defined as the number of its 
        characters as defined by [RFC 7159][RFC7159].

        Omitting this keyword has the same behavior as a value of \`0\`.

        [RFC7159]: https://datatracker.ietf.org/doc/html/rfc7159
      `,
      minimum: 0,
      type: "integer",
    },
    minProperties: {
      default: 0,
      description: desc`
        The value of this keyword MUST be a non-negative integer.

        An object instance is valid against \`minProperties\` if its number of
        \`properties\` is greater than, or equal to, the value of this keyword.

        Omitting this keyword has the same behavior as a value of \`0\`.
      `,
      minimum: 0,
      type: "integer",
    },
    multipleOf: {
      description: desc`
        The value of \`multipleOf\` MUST be a number, strictly greater than 
        \`0\`.

        A numeric instance is valid only if division by this keyword's value
        results in an integer.
      `,
      exclusiveMinimum: 0,
      type: "number",
    },
    not: {
      description: desc`
        This keyword's value MUST be a valid JSON Schema.

        An instance is valid against this keyword if it fails to validate
        successfully against the schema defined by this keyword.
      `,
      type: "JSONSchema<Narrowable>",
    },
    oneOf: {
      description: desc`
        This keyword's value MUST be a non-empty array. Each item of the array 
        MUST be a valid JSON Schema.

        An instance validates successfully against this keyword if it validates
        successfully against exactly one schema defined by this keyword's value.
      `,
      items: { type: "JSONSchema<Narrowable>" },
      type: "array",
    },
    pattern: {
      description: desc`
        The value of this keyword MUST be a string. This string SHOULD be a 
        valid regular expression, according to the [ECMA-262][ecma262] regular 
        expression dialect.

        A string instance is considered valid if the regular expression matches 
        the instance successfully. Recall: regular expressions are not 
        implicitly anchored.

        [ecma262]: https://www.ecma-international.org/publications-and-standards/standards/ecma-262/
      `,
      format: "regex",
      type: "string",
    },
    patternProperties: {
      additionalProperties: { type: "JSONSchema" },
      description: desc`
        The value of \`patternProperties\` MUST be an object. Each property name 
        of this object SHOULD be a valid regular expression, according to the 
        [ECMA-262][ecma262] regular expression dialect. Each property value of 
        this object MUST be a valid JSON Schema.

        This keyword determines how child instances validate for objects, and 
        does not directly validate the immediate instance itself. Validation of 
        the primitive instance type against this keyword always succeeds.

        Validation succeeds if, for each instance name that matches any regular
        expressions that appear as a property name in this keyword's value, the
        child instance for that name successfully validates against each schema
        that corresponds to a matching regular expression.

        Omitting this keyword has the same behavior as an empty object.

        [ecma262]: https://www.ecma-international.org/publications-and-standards/standards/ecma-262/
      `,
      type: "object",
    },
    properties: {
      additionalProperties: { type: "JSONSchema" },
      description: desc`
        The value of \`properties\` MUST be an object. Each value of this object 
        MUST be a valid JSON Schema.

        This keyword determines how child instances validate for objects, and 
        does not directly validate the immediate instance itself.

        Validation succeeds if, for each name that appears in both the instance 
        and as a name within this keyword's value, the child instance for that 
        name successfully validates against the corresponding schema.

        Omitting this keyword has the same behavior as an empty object.
      `,
      type: "object",
    },
    propertyNames: {
      description: desc`
        The value of \`propertyNames\` MUST be a valid JSON Schema.

        If the instance is an object, this keyword validates if every property 
        name in the instance validates against the provided schema. Note the 
        property name that the schema is testing will always be a string.

        Omitting this keyword has the same behavior as an empty schema.
      `,
      type: "JSONSchema",
    },
    readOnly: {
      default: false,
      description: desc`
        The value of this keyword MUST be a boolean. When multiple occurrences 
        of this keyword are applicable to a single sub-instance, the resulting 
        value MUST be \`true\` if any occurrence specifies a \`true\` value, and 
        MUST be \`false\` otherwise.

        If \`readOnly\` has a value of boolean \`true\`, it indicates that the 
        value of the instance is managed exclusively by the owning authority, 
        and attempts by an application to modify the value of this property are 
        expected to be ignored or rejected by that owning authority.

        An instance document that is marked as \`readOnly\` for the entire 
        document MAY be ignored if sent to the owning authority, or MAY result 
        in an error, at the authority's discretion.

        For example, \`readOnly\` would be used to mark a database-generated 
        serial number as read-only.

        This keyword can be used to assist in user interface instance 
        generation.
      `,
      type: "boolean",
    },
    required: {
      description: desc`
        The value of this keyword MUST be an array. Elements of this array, if 
        any, MUST be strings, and MUST be unique.

        An object instance is valid against this keyword if every item in the 
        array is the name of a property in the instance.

        Omitting this keyword has the same behavior as an empty array.
      `,
      items: { type: "string" },
      type: "array",
    },
    then: {
      description: desc`
        This keyword's value MUST be a valid JSON Schema.

        When \`if\` is present, and the instance successfully validates against 
        its subschema, then validation succeeds against this keyword if the 
        instance also successfully validates against this keyword's subschema.

        This keyword has no effect when \`if\` is absent, or when the instance 
        fails to validate against its subschema. Implementations MUST NOT 
        evaluate the instance against this keyword, for either validation or 
        annotation collection purposes, in such cases.
      `,
      type: "JSONSchema<Narrowable>",
    },
    title: {
      description: desc`
        Can be used to decorate a user interface with a short label about the 
        data produced.
      `,
      type: "string",
    },
    type: {
      description: desc`
        The value of this keyword MUST be either a string or an array. If it is 
        an array, elements of the array MUST be strings and MUST be unique.

        String values MUST be one of the six primitive types (\`"null"\`,
        \`"boolean"\`, \`"object"\`, \`"array"\`, \`"number"\`, or 
        \`"string"\`), or \`"integer"\` which matches any number with a zero 
        fractional part.

        An instance validates if and only if the instance is in any of the sets
        listed for this keyword.
      `,
      oneOf: [{
        enum: [
          "array",
          "boolean",
          "integer",
          "null",
          "number",
          "object",
          "string",
        ],
        type: "string",
      }, {
        items: {
          enum: [
            "array",
            "boolean",
            "integer",
            "null",
            "number",
            "object",
            "string",
          ],
          type: "string",
        },
        type: "array",
      }],
    },
    uniqueItems: {
      default: false,
      description: desc`
        The value of this keyword MUST be a boolean.

        If this keyword has boolean value \`false\`, the instance validates
        successfully. If it has boolean value \`true\`, the instance validates
        successfully if all of its elements are unique.

        Omitting this keyword has the same behavior as a value of \`false\`.
      `,
      type: "boolean",
    },
    writeOnly: {
      default: false,
      description: desc`
        The value of this keyword MUST be a boolean. When multiple occurrences 
        of this keyword is applicable to a single sub-instance, the resulting 
        value MUST be \`true\` if any occurrence specifies a \`true\` value, and 
        MUST be \`false\` otherwise.

        If \`writeOnly\` has a value of boolean \`true\`, it indicates that the 
        value is never present when the instance is retrieved from the owning 
        authority. It can be present when sent to the owning authority to update 
        or create the document (or the resource it represents), but it will not 
        be included in any updated or newly created version of the instance.

        An instance document that is marked as \`writeOnly\` for the entire 
        document MAY be returned as a blank document of some sort, or MAY 
        produce an error upon retrieval, or have the retrieval request ignored, 
        at the authority's discretion.

        For example, \`writeOnly\` would be used to mark a password input field.

        These keywords can be used to assist in user interface instance 
        generation. In particular, an application MAY choose to use a widget 
        that hides input values as they are typed for write-only fields.
      `,
      type: "boolean",
    },
  },
  keywordsByType: {
    array: {
      title: "Array",
      values: [
        "additionalItems",
        "contains",
        "items",
        "maxItems",
        "minItems",
        "uniqueItems",
      ],
    },
    number: {
      title: "Number",
      values: [
        "exclusiveMaximum",
        "exclusiveMinimum",
        "maximum",
        "minimum",
        "multipleOf",
      ],
    },
    object: {
      title: "Object",
      values: [
        "additionalProperties",
        "dependencies",
        "maxProperties",
        "minProperties",
        "patternProperties",
        "properties",
        "propertyNames",
        "required",
      ],
    },
    string: {
      title: "String",
      values: [
        "contentEncoding",
        "contentMediaType",
        "format",
        "maxLength",
        "minLength",
        "pattern",
      ],
    },
  },
});
