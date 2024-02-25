/**
 * Taken from KBSS:
 * https://github.com/kbss-cvut/termit-ui/blob/master/src/util/JsonLdUtils.ts
 *
 * Type declarations for jsonld.js
 *
 * Note: This is work in progress, the API description is not definitive.
 */

declare module "jsonld" {
  type JsonLdInput = object | object[] | string;
  type JsonLdContext = object | object[] | string;
  type JsonLdDictionary = object;

  interface JsonLdOptions {
    base: string;
    compactArrays: boolean;
    compactToRelative: boolean;
    documentLoader: (url: string) => Promise<string>;
    expandContext: {} | string;
    frameExpansion: boolean;
    processingMode: string;
    produceGeneralizedRdf: boolean;
  }

  export function compact<T extends JsonLdDictionary>(
    input: JsonLdInput,
    context?: JsonLdContext,
    options?: JsonLdOptions,
  ): Promise<T>;

  export function expand(input: JsonLdInput, options?: JsonLdOptions): Promise<JsonLdDictionary[]>;

  export function flatten(
    input: JsonLdInput,
    context?: JsonLdContext,
    options?: JsonLdOptions,
  ): Promise<JsonLdDictionary>;

  export function frame(
    input: JsonLdInput,
    frame?: object | string,
    options?: JsonLdOptions,
  ): Promise<JsonLdDictionary>;
}
