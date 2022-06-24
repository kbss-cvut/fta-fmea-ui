import VocabularyUtils from "@utils/VocabularyUtils";

export const CONTEXT = {
    "iri": "@id",
    "types": "@type",
    "annotationSource": VocabularyUtils.DC_TERMS + "source"
};

export interface AbstractModel {
    iri?: string,
    types?: string[],
    annotationSource?: AbstractModel,
}

export interface AbstractUpdateModel {
    uri: string,
}