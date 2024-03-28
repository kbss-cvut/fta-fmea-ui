import VocabularyUtils from "../VocabularyUtils";
import JsonLdUtils from "../JsonLdUtils";
import { describe, expect, it } from "vitest";
import { CONTEXT as FTA_CONTEXT } from "@models/faultTreeModel";

describe("JsonLdUtils", () => {
  describe("resolveReferences", () => {
    it("replaces reference node with a known instance in a singular property", () => {
      const data = {
        iri: "http://data",
        author: {
          iri: "http://user",
          username: "username",
          types: [VocabularyUtils.USER],
        },
        created: Date.now() - 10000,
        lastEditor: {
          iri: "http://user",
        },
        lastModified: Date.now(),
      };
      const result: any = JsonLdUtils.resolveReferences(data, new Map<string, object>());
      expect(result.lastEditor).toEqual(data.author);
    });

    it("replaces reference node with a known instance in an array", () => {
      const data = {
        iri: "http://data",
        author: {
          iri: "http://user",
          username: "username",
          types: [VocabularyUtils.USER],
        },
        created: Date.now() - 10000,
        editors: [
          {
            iri: "http://user",
          },
          {
            iri: "http://anotherUser",
            username: "anotherUsername",
            types: [VocabularyUtils.USER],
          },
        ],
        lastModified: Date.now(),
      };
      const result: any = JsonLdUtils.resolveReferences(data, new Map<string, object>());
      expect(result.editors[0]).toEqual(data.author);
    });
  });

  describe("compactAndResolveReferences", () => {
    it("compacts input JSON-LD using the context and resolves references", () => {
      const input = require("../../rest-mock/fta");

      return JsonLdUtils.compactAndResolveReferences(input, FTA_CONTEXT).then((result: any) => {
        result;
        let scenarioParts = result.faultEventScenarios.flatMap((s) => s.scenarioParts).filter((p) => !!p);
        expect(scenarioParts.length, "there are four scenario parts").toBe(4);

        scenarioParts.forEach((p) =>
          expect("name" in p, "reference to fault event is resolved " + JSON.stringify(p)).toBeTruthy(),
        );
        let set = new Set(result.manifestingEvent.children);
        scenarioParts.forEach((p) =>
          expect(set.has(p), "reference to fault event is resolved to basic event " + JSON.stringify(p)).toBeTruthy(),
        );
      });
    });
  });

  describe("compactAndResolveReferencesAsArray", () => {
    it("returns array with items compacted from the specified JSON-LD", () => {
      const input = [require("../../rest-mock/fta"), require("../../rest-mock/fta")];

      return JsonLdUtils.compactAndResolveReferencesAsArray(input, FTA_CONTEXT).then((result: any[]) => {
        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toEqual(2);
        let scenarioParts = result[0].faultEventScenarios.flatMap((s) => s.scenarioParts).filter((p) => !!p);
        expect(scenarioParts.length, "there are four scenario parts").toBe(4);
        scenarioParts.forEach((p) =>
          expect("name" in p, "reference to fault event is resolved " + JSON.stringify(p)).toBeTruthy(),
        );
        let set = new Set(result[0].manifestingEvent.children);
        scenarioParts.forEach((p) =>
          expect(set.has(p), "reference to fault event is resolved to basic event " + JSON.stringify(p)).toBeTruthy(),
        );
      });
    });

    it("returns array with single item compacted from specified JSON-LD", () => {
      const input = require("../../rest-mock/fta");

      return JsonLdUtils.compactAndResolveReferencesAsArray(input, FTA_CONTEXT).then((result: any[]) => {
        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toEqual(1);
        let scenarioParts = result[0].faultEventScenarios.flatMap((s) => s.scenarioParts).filter((p) => !!p);
        expect(scenarioParts.length, "there are four scenario parts").toBe(4);
        scenarioParts.forEach((p) =>
          expect("name" in p, "reference to fault event is resolved " + JSON.stringify(p)).toBeTruthy(),
        );
        let set = new Set(result[0].manifestingEvent.children);
        scenarioParts.forEach((p) =>
          expect(set.has(p), "reference to fault event is resolved to basic event " + JSON.stringify(p)).toBeTruthy(),
        );
      });
    });

    it("returns an empty array when input JSON-LD is an empty array", () => {
      const input: object = [];
      return JsonLdUtils.compactAndResolveReferencesAsArray(input, FTA_CONTEXT).then((result: any[]) => {
        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toEqual(0);
      });
    });

    it("returns and empty array when input JSON-LD contains context and empty graph", () => {
      const input: object = { "@context": {}, "@graph": [] };
      return JsonLdUtils.compactAndResolveReferencesAsArray(input, FTA_CONTEXT).then((result: any[]) => {
        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toEqual(0);
      });
    });
  });
});
