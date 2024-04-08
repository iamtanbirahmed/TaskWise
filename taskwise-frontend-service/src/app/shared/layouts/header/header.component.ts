import { Component } from "@angular/core";
import { TokenService } from "../../../core/services/token.service";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../core/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  isAuthenticated$;
  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isAuthenticated$ = this.tokenService.isAuthentication;
  }

  onLogout() {
    this.authService.onLogout();
  }
  onClickTodo() {
    this.router.navigate(["/"]);
  }
}
