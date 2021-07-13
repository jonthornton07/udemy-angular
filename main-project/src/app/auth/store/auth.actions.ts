import {Action} from "@ngrx/store";
import {User} from "../user.model";

export const LOGIN_START = "[Auth] Login Start"
export const LOGIN_FAIL = "[Auth] Login Fail"
export const LOGIN = "[Auth] Login"
export const LOGOUT = "[Auth] Logout"

export class LoginStart implements Action {
  readonly type = LOGIN_START
  constructor(public email: string, public password: string) { }
}

export class LoginFail implements Action {
  readonly type = LOGIN_FAIL
  constructor(public error: string) { }
}

export class LoginAction implements Action {
  readonly type = LOGIN
  constructor(
    public email: string,
    public userId: string,
    public token: string,
    public expirationDate: Date
  ) {}
}

export class LogoutAction implements Action {
  readonly type = LOGOUT
}

export type AuthActions = LoginAction
  | LogoutAction
  | LoginFail
  | LoginStart
