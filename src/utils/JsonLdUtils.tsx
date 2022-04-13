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
        context: JsonLdContext
    ): Promise<T> {
        return compact<T>(input, context).then((res) =>
            JsonLdUtils.resolveReferences<T>(res)
        );
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
        context: JsonLdContext
    ): Promise<T[]> {
        if (Array.isArray(input) && input.length === 0) {
            return Promise.resolve([]);
        }
        return compact(input, context)
            .then((res) => JsonLdUtils.loadArrayFromCompactedGraph<T>(res))
            .then((arr) => arr.map((item) => JsonLdUtils.resolveReferences<T>(item)));
    }

    /**
     * Loads an array of nodes from the specified compacted JSON-LD input.
     *
     * If the input represents a single node, it is returned in an array. If there are no items in the input, an empty
     * array is returned.
     * @param compacted Compacted JSON-LD
     */
    public static loadArrayFromCompactedGraph<T extends JsonLdDictionary>(
        compacted: object
    ): T[] {
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
     */
    public static resolveReferences<T extends JsonLdDictionary>(
        input: JsonLdDictionary
    ): T {
        const idMap = new Map<string, object>();
        JsonLdUtils.processNode(input, idMap);
        return input as T;
    }

    private static processNode(node: object, idMap: Map<string, object>) {
        if (!node.hasOwnProperty("iri")) {
            return;
        }
        // @ts-ignore
        idMap.set(node.iri, node);
        Object.getOwnPropertyNames(node)
            .sort()
            .forEach((p) => {
                const val = node[p];
                if (Array.isArray(val)) {
                    for (let i = 0, len = val.length; i < len; i++) {
                        if (typeof val[i] === "object") {
                            const reference = JsonLdUtils.getReferencedNodeIfExists(
                                val[i],
                                idMap
                            );
                            if (reference) {
                                val[i] = reference;
                            } else {
                                JsonLdUtils.processNode(val[i], idMap);
                            }
                        }
                    }
                } else if (typeof val === "object") {
                    const reference = JsonLdUtils.getReferencedNodeIfExists(val, idMap);
                    if (reference) {
                        node[p] = reference;
                    } else {
                        JsonLdUtils.processNode(val, idMap);
                    }
                }
            });
    }

    private static getReferencedNodeIfExists(
        node: any,
        idMap: Map<string, object>
    ): object | undefined {
        const valProps = Object.getOwnPropertyNames(node);
        if (valProps.length === 1 && valProps[0] === "iri" && idMap.has(node.iri)) {
            return idMap.get(node.iri);
        } else {
            return undefined;
        }
    }

    /**
     * Generates a random RDF blank node identifier.
     */
    public static generateBlankNodeId(): string {
        return "_:" + Math.random().toString(36).substring(8);
    }
}