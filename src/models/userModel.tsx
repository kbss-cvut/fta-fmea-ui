import VocabularyUtils from "@utils/VocabularyUtils";

export const CONTEXT = {
    "iri": "@id",
    "username": VocabularyUtils.PREFIX + "hasUsername",
    "password": VocabularyUtils.PREFIX + "hasPassword",
    "types": "@type"
};

export interface User {
    iri: string,
    username: string,
    token: string,
    authenticated: boolean,
    types?: string[]
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

export interface UserContextProps {
    user: User,
    setUser: Function
}

// TODO use JSON-LD etc.
// export default class User implements UserData {
//     public readonly iri: string;
//     public readonly username: string;
//     public readonly types: string[];
//     protected readonly password?: string;
//     protected readonly originalPassword?: string;
//
//     constructor(data: UserData | UserDataWithPassword) {
//         this.iri = data.iri;
//         this.firstName = data.firstName;
//         this.lastName = data.lastName;
//         this.username = data.username;
//         this.types = Utils.sanitizeArray(data.types);
//     }
//
//     public toJsonLd(): UserData {
//         return Object.assign({}, this, {"@context": CONTEXT});
//     }
// }