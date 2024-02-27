import VocabularyUtils from "@utils/VocabularyUtils";

export const extractFragment = (uri: string): string => uri.split("/").pop();

export const composeFragment = (fragment: string) => VocabularyUtils.PREFIX + fragment;
