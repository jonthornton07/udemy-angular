import {Component} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode = true

  constructor(private authService: AuthService) { }

  switchMode() {
    this.isLoginMode = !this.isLoginMode
  }

  submit(form: NgForm) {
    if (form.invalid) { return }
    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      this.authService.login(email, password).subscribe(response => {
        console.log(response)
      }, error => {
        console.log(error)
      })
    } else {
      this.authService.signUp(email, password).subscribe(response => {
        console.log(response)
      }, error => {
        console.log(error)
      })
    }
    form.reset()
  }
}
