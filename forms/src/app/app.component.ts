import {Component, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // @ts-ignore
  @ViewChild('f') signupForm: NgForm;
  defaultQuestion = 'teacher'
  answer = ''
  genders = ['male', 'female']

  suggestUserName() {
    const suggestedName = 'Superuser';
  }

  onSubmit() {
    console.log(this.signupForm)
  }

  // onSubmit(f: NgForm) {
  //   console.log(f)
  // }
}
