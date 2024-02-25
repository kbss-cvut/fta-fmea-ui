import VocabularyUtils from "@utils/VocabularyUtils";
import { AbstractModel, CONTEXT as ABSTRACT_CONTEXT } from "@models/abstractModel";

const ctx = {
  username: VocabularyUtils.PREFIX + "hasUsername",
  password: VocabularyUtils.PREFIX + "hasPassword",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT);

export interface User extends AbstractModel {
  iri?: string;
  username?: string;
  token?: string;
  authenticated: boolean;
  roles: string[];
}

export interface ChangePasswordRequest {
  uri: string;
  username: string;
  password: string;
  newPassword: string;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface UserLoginResponse {
  uri: string;
  username: string;
  token: string;
  roles: string[];
}

export interface UserRegisterRequest extends UserLoginRequest {}

export interface UserRegisterResponse {
  uri: string;
}
