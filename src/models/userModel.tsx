import VocabularyUtils from "@utils/VocabularyUtils";

export const CONTEXT = {
    "iri": "@id",
    "username": VocabularyUtils.PREFIX + "hasUsername",
    "password": VocabularyUtils.PREFIX + "hasPassword",
    "types": "@type"
};

export interface User {
    iri?: string,
    username?: string,
    token?: string,
    authenticated: boolean
}

export interface UserLoginRequest {
    username: string,
    password: string,
}

export interface UserLoginResponse {
    username: string,
    token: string,
}

export interface UserRegisterRequest extends UserLoginRequest {
}

export interface UserRegisterResponse {
    uri: string
}