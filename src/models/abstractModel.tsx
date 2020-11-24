export const CONTEXT = {
    "iri": "@id",
    "types": "@type"
};

export interface AbstractModel {
    iri?: string,
    types?: string[]
}

export interface AbstractUpdateModel {
    uri: string,
}