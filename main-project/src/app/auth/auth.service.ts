import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions"

@Injectable({providedIn: 'root'})
export class AuthService {

  private logoutTimer: number

  constructor(private client: HttpClient,
              private router: Router,
              private store: Store<AppState>) {}

  setLogoutTimer(expirationDuration: number) {
    this.logoutTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.LogoutAction())
    }, expirationDuration)
  }

  clearLogoutTimer() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer)
    }
  }
}
