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
  user = {
    username: '',
    email: '',
    question: '',
    answer: '',
    gender: ''
  }
  submitted = false

  suggestUserName() {
    const suggestedName = 'Superuser';
    // this.signupForm.setValue({
    //   userData: {
    //     username: suggestedName,
    //     email: ''
    //   },
    //   secret: 'pet',
    //   questionAnswer: '',
    //   gender: 'male'
    // })
    this.signupForm.form.patchValue({
      userData: {
        username: suggestedName
      }
    })
  }

  onSubmit() {
    this.submitted = true
    this.user.username = this.signupForm.value.userData.username
    this.user.email = this.signupForm.value.userData.email
    this.user.question = this.signupForm.value.sercret
    this.user.answer = this.signupForm.value.questionAnswer
    this.user.username = this.signupForm.value.gender
  }

  // onSubmit(f: NgForm) {
  //   console.log(f)
  // }
}
