import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions";
import * as RecipesActions from "../recipes/store/recipes.actions"

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLoggedIn = false
  private userSub: Subscription

  constructor(private authService: AuthService,
              private store: Store<AppState>) { }

  ngOnInit() {
    this.userSub = this.store.select('auth').subscribe(authState => {
        this.isLoggedIn = !!authState.user
    })
  }

  ngOnDestroy() {
    this.userSub.unsubscribe()
  }

  saveData() {
    this.store.dispatch(new RecipesActions.SaveRecipes())
  }

  fetchData() {
    this.store.dispatch(new RecipesActions.FetchRecipes())
  }

  logout() {
    this.store.dispatch(new AuthActions.LogoutAction())
  }
}
