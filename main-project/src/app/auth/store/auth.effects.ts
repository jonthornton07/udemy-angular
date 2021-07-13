import {Actions, Effect, ofType} from '@ngrx/effects'
import * as AuthActions from './auth.actions'
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {of} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {User} from "../user.model";
import {AuthService} from "../auth.service";

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
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((authData: AuthActions.SignupStart) => {
      const email = authData.email
      const password = authData.password
      const body = {
        email,
        password,
        returnSecureToken: true
      }
      return this.client.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey,
        body
      ).pipe(
        map(responseData => {
          this.authService.setLogoutTimer(+responseData.expiresIn * 1000)
          return handleSuccess(responseData)
        }),
        catchError(handleError)
      )
    })
  )

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
          this.authService.setLogoutTimer(+responseData.expiresIn * 1000)
          return handleSuccess(responseData)
        }),
        catchError(handleError)
      )
    })
  )

  @Effect({dispatch: false})
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTH_SUCCESS),
    tap((action: AuthActions.AuthSuccess) => {
      if (action.redirect) {
        this.router.navigate(['/recipes'])
      }
    }))

  @Effect({dispatch: false})
  logoutSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer()
      localStorage.removeItem('userData')
      this.router.navigate(['/auth'])
    }))

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem('userData'))
      if (!userData) {
        return { type: 'DUMMY' }
      }
      const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))
      if (loadedUser.token) {
        return new AuthActions.AuthSuccess(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate),
          false
        )
      }
      return { type: 'DUMMY' }
    }))

  constructor(private actions$: Actions,
              private client: HttpClient,
              private router: Router,
              private authService: AuthService) { }
}

const handleSuccess = (responseData) => {
  const now = new Date().getTime()
  const timeOffset = now + (+responseData.expiresIn * 1000)
  const expirationDate = new Date(timeOffset)
  const user = new User(
    responseData.email,
    responseData.localId,
    responseData.idToken,
    new Date(expirationDate))
  localStorage.setItem('userData', JSON.stringify(user))
  return new AuthActions.AuthSuccess(
    responseData.email,
    responseData.localId,
    responseData.idToken,
    new Date(expirationDate),
    true
  )
}

const handleError = (errorResponse: HttpErrorResponse) => {
  let errorMessage = 'An unknown error occurred'
  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.AuthFail(errorMessage))
  }
  switch (errorResponse.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email already exists'
      break
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist'
      break
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct'
  }
  return of(new AuthActions.AuthFail(errorMessage))
}
