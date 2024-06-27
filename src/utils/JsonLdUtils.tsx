import { compact, JsonLdContext, JsonLdDictionary, JsonLdInput } from "jsonld";

/**
 * Utility functions for processing JSON-LD data.
 * Taken from KBSS:
 * https://github.com/kbss-cvut/termit-ui/blob/master/src/util/JsonLdUtils.ts
 *
 */
export default class JsonLdUtils {
  /**
   * Compacts the specified JSON-LD input and ensures that node references (i.e., nodes with a single attribute -
   * iri) are replaced with previously encountered nodes which they represent.
   *
   * This method expects that the JSON-LD represents a single object node.
   * @param input The JSON-LD input
   * @param context Context to use for JSON-LD compaction
   */
  public static compactAndResolveReferences<T extends JsonLdDictionary>(
    input: JsonLdInput,
    context: JsonLdContext,
  ): Promise<T> {
    let map = new Map<string, Referenced>();
    return compact<T>(input, context).then((res) => JsonLdUtils._resolveReferences<T>(res, map));
  }

  /**
   * Compacts the specified JSON-LD input and ensures that node references (i.e., nodes with a single attribute -
   * iri) are replaced with previously encountered nodes which they represent.
   *
   * This method expects that the JSON-LD represents an array and thus returns an array, even if it contains a single
   * element.
   * @param input The JSON-LD input
   * @param context Context to use for JSON-LD compaction
   */
  public static compactAndResolveReferencesAsArray<T extends JsonLdDictionary>(
    input: JsonLdInput,
    context: JsonLdContext,
  ): Promise<T[]> {
    if (Array.isArray(input) && input.length === 0) {
      return Promise.resolve([]);
    } else if (Array.isArray(input["@graph"]) && input["@graph"].length === 0) {
      return Promise.resolve([]);
    }

    const map = new Map<string, object>();

    return compact(input, context)
      .then((res) => JsonLdUtils.loadArrayFromCompactedGraph<T>(res))
      .then((arr) =>
        arr.map((item) => {
          return JsonLdUtils.resolveReferences<T>(item, map);
        }),
      );
  }

  /**
   * Loads an array of nodes from the specified compacted JSON-LD input.
   *
   * If the input represents a single node, it is returned in an array. If there are no items in the input, an empty
   * array is returned.
   * @param compacted Compacted JSON-LD
   */
  public static loadArrayFromCompactedGraph<T extends JsonLdDictionary>(compacted: object): T[] {
    if (!compacted.hasOwnProperty("@context")) {
      return [];
    }
    return compacted.hasOwnProperty("@graph")
      ? Object.keys(compacted["@graph"]).map((k) => compacted["@graph"][k])
      : [compacted];
  }

  /**
   * Replaces JSON-LD references to nodes (i.e., nodes with a single attribute - iri) with existing nodes encountered
   * in the specified input.
   * @param input JSON-LD compaction result to be processed
   * @param idMap Map of already processed nodes (id -> node) to replace references with. Optional
   */
  public static resolveReferences<T extends JsonLdDictionary>(
    input: JsonLdDictionary,
    idMap: Map<string, object> = new Map<string, object>(),
  ): T {
    const _idMap = new Map<string, Referenced>();
    idMap.forEach((v, k) => _idMap.set(k, { entity: v, references: [] }));
    const ret: T = this._resolveReferences(input, _idMap);
    _idMap.forEach((v, k) => {
      if (!idMap.has(k) && v.entity) idMap.set(k, v.entity);
    });
    return ret;
  }

  /**
   * Replaces JSON-LD references to nodes (i.e., nodes with a single attribute - iri) with existing nodes encountered
   * in the specified input.
   * @param input JSON-LD compaction result to be processed
   * @param idMap Map of already processed nodes (id -> node) to replace references with. Optional
   */
  private static _resolveReferences<T extends JsonLdDictionary>(
    input: JsonLdDictionary,
    idMap: Map<string, Referenced> = new Map<string, Referenced>(),
  ): T {
    JsonLdUtils.processNode(input, idMap);
    // replace references
    idMap.forEach((r) => {
      r.references.forEach((callback) => callback(r.entity));
    });
    return input as T;
  }

  /**
   * Finds all entities and associates them with callbacks to replace references
   * @param node
   * @param idMap
   * @private
   */
  private static processNode(node: object, idMap: Map<string, Referenced>) {
    if (!node.hasOwnProperty("iri")) {
      return;
    }
    // @ts-ignore
    const nodeReferenced = JsonLdUtils.getReferenced(node.iri, idMap);
    nodeReferenced.entity = node;
    Object.getOwnPropertyNames(node)
      .sort()
      .forEach((p) => {
        const val = node[p];
        if (Array.isArray(val)) {
          for (let i = 0, len = val.length; i < len; i++) {
            if (typeof val[i] === "object" && val[i].hasOwnProperty("iri")) {
              const referenced = JsonLdUtils.getReferenced(val[i].iri, idMap);
              if (JsonLdUtils.isReference(val[i])) {
                referenced.references.push((o) => {
                  val[i] = o;
                });
              } else {
                JsonLdUtils.processNode(val[i], idMap);
              }
            }
          }
        } else if (typeof val === "object" && val.hasOwnProperty("iri")) {
          const referenced = JsonLdUtils.getReferenced(val.iri, idMap);
          if (JsonLdUtils.isReference(val)) {
            referenced.references.push((o) => {
              node[p] = o;
            });
          } else {
            JsonLdUtils.processNode(val, idMap);
          }
        }
      });
  }

  private static getReferenced(iri: string, idMap: Map<string, Referenced>): Referenced {
    let referenced = idMap.get(iri);
    if (!referenced) {
      referenced = { entity: null, references: [] };
      idMap.set(iri, referenced);
    }
    return referenced;
  }

  private static isReference(node: any) {
    const valProps = Object.getOwnPropertyNames(node);
    return valProps.length === 1 && valProps[0] === "iri";
  }

  /**
   * Generates a random RDF blank node identifier.
   */
  public static generateBlankNodeId(): string {
    return "_:" + Math.random().toString(36).substring(8);
  }
}

interface Referenced {
  entity: object;
  references: Array<(val: object) => void>;
}
