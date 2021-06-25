import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

interface AuthResponseData {
  idToken: string
  email: string
  refreshToken: string
  expiresIn: string
  localId: string
}

@Injectable({providedIn: 'root'})
export class AuthService {

  constructor(private client: HttpClient) {}

  signUp(email: string, password: string) {
    return this.client
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBw9LjEFWtu8OwxRbWG_GsFbSURu4FIKYE', {
          email,
        password,
        returnSecureToken: true
    })
  }

  login(email: string, password: string) {
    return this.client
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBw9LjEFWtu8OwxRbWG_GsFbSURu4FIKYE', {
          email,
          password,
          returnSecureToken: true
        })
  }

}
