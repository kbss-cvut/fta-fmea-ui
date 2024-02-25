export const PREFIX = "http://onto.fel.cvut.cz/ontologies/diagram/";

const ctx = {
  iri: "@id",
  types: "@type",
  x: PREFIX + "x",
  y: PREFIX + "y",
  width: PREFIX + "width",
  height: PREFIX + "height",
};

export const CONTEXT = Object.assign({}, ctx);

export interface Rectangle {
  iri?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}
