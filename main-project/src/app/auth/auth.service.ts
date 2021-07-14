import {Inject, Injectable, PLATFORM_ID} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions"
import {isPlatformBrowser} from "@angular/common";

@Injectable({providedIn: 'root'})
export class AuthService {

  private logoutTimer: number

  constructor(private client: HttpClient,
              private router: Router,
              private store: Store<AppState>,
              @Inject(PLATFORM_ID) private platformId) {}

  setLogoutTimer(expirationDuration: number) {
    if (isPlatformBrowser(this.platformId)) {
      this.logoutTimer = window.setTimeout(() => {
        this.store.dispatch(new AuthActions.LogoutAction())
      }, expirationDuration)
    }
  }

  clearLogoutTimer() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer)
    }
  }
}
