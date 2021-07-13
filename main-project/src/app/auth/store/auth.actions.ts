import {Action} from "@ngrx/store";
import {User} from "../user.model";

export const LOGIN_START = "[Auth] Login Start"
export const AUTH_FAIL = "[Auth] Login Fail"
export const AUTH_SUCCESS = "[Auth] Login"
export const LOGOUT = "[Auth] Logout"
export const SIGNUP_START = "[Auth] Sign Up Start"
export const CLEAR_ERROR = "[Auth] Clear Error"
export const AUTO_LOGIN = "[Auth] Auto Login"

export class LoginStart implements Action {
  readonly type = LOGIN_START
  constructor(public email: string, public password: string) { }
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START
  constructor(public email: string, public password: string) { }
}

export class AuthFail implements Action {
  readonly type = AUTH_FAIL
  constructor(public error: string) { }
}

export class AuthSuccess implements Action {
  readonly type = AUTH_SUCCESS
  constructor(
    public email: string,
    public userId: string,
    public token: string,
    public expirationDate: Date,
    public redirect
  ) {}
}

export class LogoutAction implements Action {
  readonly type = LOGOUT
}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN
}

export type AuthActions = AuthSuccess
  | LogoutAction
  | AuthFail
  | LoginStart
  | SignupStart
  | ClearError
  | AutoLogin
