import VocabularyUtils from "@utils/VocabularyUtils";
import {AbstractModel, CONTEXT as ABSTRACT_CONTEXT} from "@models/abstractModel";

const ctx = {
    "username": VocabularyUtils.PREFIX + "hasUsername",
    "password": VocabularyUtils.PREFIX + "hasPassword",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT);

export interface User extends AbstractModel{
    username?: string,
    token?: string,
    authenticated: boolean
}

// TODO tune types
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