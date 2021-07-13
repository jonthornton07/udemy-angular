import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AlertComponent} from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/placeholder/placeholder.directive";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions"

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true
  isLoading = false
  error: string = null
  @ViewChild(PlaceholderDirective, { static: false }) alertLocation: PlaceholderDirective
  private closeSub: Subscription
  private storeSub: Subscription

  constructor(private authService: AuthService,
              private router: Router,
              private resolver: ComponentFactoryResolver,
              private store: Store<AppState>) { }

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading
      this.error = authState.error
      if (this.error !== null) {
        this.showErrorAlert(this.error)
      }
    })
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe()
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe()
    }
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode
  }

  submit(form: NgForm) {
    if (form.invalid) { return }
    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart(email, password))
    } else {
      this.store.dispatch(new AuthActions.SignupStart(email, password))
    }
    form.reset()
  }

  private showErrorAlert(message: string) {
    const alertComponentFactory = this.resolver.resolveComponentFactory(AlertComponent)
    const ref = this.alertLocation.viewContainer
    ref.clear()
    const alertRef = ref.createComponent(alertComponentFactory)
    alertRef.instance.message = message
    this.closeSub = alertRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe()
      ref.clear()
      this.store.dispatch(new AuthActions.ClearError())
    })
  }
}
