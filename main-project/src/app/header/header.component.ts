import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataStorage} from "../shared/data-storage.service";
import {Subscription} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLoggedIn = false
  private userSub: Subscription

  constructor(private dataStorage: DataStorage,
              private authService: AuthService,
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
    this.dataStorage.storeRecipes()
  }

  fetchData() {
    this.dataStorage.fetchData().subscribe()
  }

  logout() {
    this.authService.logout()
  }
}
