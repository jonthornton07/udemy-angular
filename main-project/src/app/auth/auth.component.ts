import {Component, ComponentFactoryResolver, OnDestroy, ViewChild} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthResponseData, AuthService} from "./auth.service";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AlertComponent} from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/placeholder/placeholder.directive";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy{
  isLoginMode = true
  isLoading = false
  error: string = null
  @ViewChild(PlaceholderDirective, { static: false }) alertLocation: PlaceholderDirective
  private closeSub: Subscription

  constructor(private authService: AuthService,
              private router: Router,
              private resolver: ComponentFactoryResolver) { }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe()
    }
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode
  }

  submit(form: NgForm) {
    if (form.invalid) { return }
    const email = form.value.email;
    const password = form.value.password;

    let authObserv: Observable<AuthResponseData>;

    this.isLoading = true
    this.error = null
    if (this.isLoginMode) {
      authObserv = this.authService.login(email, password)
    } else {
      authObserv = this.authService.signUp(email, password)
    }

    authObserv.subscribe(response => {
      console.log(response)
      this.isLoading = false
      this.router.navigate(['/recipes'])
    }, errorMessage => {
      console.log(errorMessage)
      this.error = errorMessage
      this.showErrorAlert(errorMessage)
      this.isLoading = false
    })
    form.reset()
  }

  onHandleError() {
    this.error = null
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
    })
  }
}
