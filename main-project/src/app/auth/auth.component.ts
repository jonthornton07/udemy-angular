import {Component} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthResponseData, AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode = true
  isLoading = false
  error: string = null

  constructor(private authService: AuthService,
              private router: Router) { }

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
      this.isLoading = false
    })
    form.reset()
  }
}
