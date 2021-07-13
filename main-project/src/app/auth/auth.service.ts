import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {User} from "./user.model";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions"

export interface AuthResponseData {
  idToken: string
  email: string
  refreshToken: string
  expiresIn: string
  localId: string
  registered?: boolean
}

@Injectable({providedIn: 'root'})
export class AuthService {

  private logoutTimer: number

  constructor(private client: HttpClient,
              private router: Router,
              private store: Store<AppState>) {}

  signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.client
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey, {
          email,
        password,
        returnSecureToken: true
      })
      .pipe(catchError(handleError), tap(response => {
        this.createUser(response)
      }))
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'))
    if (!userData) {
      return
    }
    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))
    if (loadedUser.token) {
      this.store.dispatch(new AuthActions.LoginAction(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      ))
      const duration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
      this.autoLogout(duration)
    }
  }

  logout() {
    this.store.dispatch(new AuthActions.LogoutAction())
    localStorage.removeItem('userData')
    this.router.navigate(['/auth'])
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer)
    }
    this.logoutTimer = null
  }

  private autoLogout(expirationDuration: number) {
    this.logoutTimer = setTimeout(() => {
      this.logout()
    }, expirationDuration)
  }

  private createUser(responseData: AuthResponseData) {
    const now = new Date().getTime()
    const timeOffset = now + (+responseData.expiresIn * 1000)
    const expirationDate = new Date(timeOffset)
    const userData = new User(responseData.email, responseData.localId, responseData.idToken, expirationDate)
    localStorage.setItem('userData', JSON.stringify(userData))
    this.autoLogout(+responseData.expiresIn * 1000)
    this.store.dispatch(new AuthActions.LoginAction(
      responseData.email,
      responseData.localId,
      responseData.idToken,
      new Date(expirationDate)
    ))
  }
}

function handleError(errorResponse: HttpErrorResponse) {
  let errorMessage = 'An unknown error occurred'
  if (!errorResponse.error || !errorResponse.error.error) {
    return throwError(errorResponse)
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
  return throwError(errorMessage)
}
