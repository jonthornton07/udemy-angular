import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {User} from "./user.model";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

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

  user = new BehaviorSubject<User>(null)
  private logoutTimer: any

  constructor(private client: HttpClient,
              private router: Router) {}

  signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.client
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey, {
          email,
        password,
        returnSecureToken: true
      })
      .pipe(catchError(this.handleError), tap(response => {
        this.user.next(this.createUser(response))
      }))
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.client
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey, {
          email,
          password,
          returnSecureToken: true
        })
      .pipe(catchError(this.handleError), tap(response => {
        this.user.next(this.createUser(response))
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
      this.user.next(loadedUser)
      const duration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
      this.autoLogout(duration)
    }
  }

  logout() {
    this.user.next(null)
    localStorage.removeItem('userData')
    this.router.navigate(['/auth'])
    if (this.logoutTimer) {
      this.logoutTimer.clear()
    }
    this.logoutTimer = null
  }

  autoLogout(expirationDuration: number) {
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
    this.autoLogout(timeOffset)
    return userData
  }

  private handleError(errorResponse: HttpErrorResponse) {
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

}
