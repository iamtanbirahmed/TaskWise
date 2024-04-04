import { Component } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthService } from "../../core/services/auth.service";
import { AlertComponent } from "../../shared/components/alert/alert.component";

@Component({
  selector: "app-login",
  standalone: true,
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
  imports: [ReactiveFormsModule, AlertComponent],
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorResponse: { message: string; show: boolean; color: string } = {
    message: "This is alert",
    show: false,
    color: "red",
  };

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required]),
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.onLogin(this.loginForm.value).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          this.errorResponse.show = true;
          this.errorResponse.message = error;
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  closeAlert(isClosed: boolean) {
    this.errorResponse.show = !isClosed;
  }
}
