import {Actions, Effect, ofType} from '@ngrx/effects'
import * as AuthActions from './auth.actions'
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, map, switchMap} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {of, throwError} from "rxjs";
import {Injectable} from "@angular/core";

export interface AuthResponseData {
  idToken: string
  email: string
  refreshToken: string
  expiresIn: string
  localId: string
  registered?: boolean
}

@Injectable()
export class AuthEffects {

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      const email = authData.email
      const password = authData.password
      const body = {
        email,
        password,
        returnSecureToken: true
      }
      return this.client.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey,
        body
      ).pipe(
        map(responseData => {
          const now = new Date().getTime()
          const timeOffset = now + (+responseData.expiresIn * 1000)
          const expirationDate = new Date(timeOffset)
          return of(new AuthActions.LoginAction(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            new Date(expirationDate)
          ))
        }),
        catchError(error => {
          return of()
        }
      ))
    })
  )

  constructor(private actions$: Actions,
              private client: HttpClient) { }
}
