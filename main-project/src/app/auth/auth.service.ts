import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {Observable, Subject, throwError} from "rxjs";
import {User} from "./user.model";

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

  user = new Subject<User>()

  constructor(private client: HttpClient) {}

  signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.client
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBw9LjEFWtu8OwxRbWG_GsFbSURu4FIKYE', {
          email,
        password,
        returnSecureToken: true
      })
      .pipe(catchError(this.handleError), tap(this.createUser))
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.client
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBw9LjEFWtu8OwxRbWG_GsFbSURu4FIKYE', {
          email,
          password,
          returnSecureToken: true
        })
      .pipe(catchError(this.handleError), tap(this.createUser))
  }

  private createUser(responseData: AuthResponseData) {
    const now = new Date().getTime()
    const timeOffset = now + (+responseData.expiresIn * 1000)
    const expirationDate = new Date(timeOffset)
    const userData = new User(responseData.email, responseData.localId, responseData.idToken, expirationDate)
    // this.user.next(userData)
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
