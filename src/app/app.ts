import { Component, inject } from '@angular/core';
import { Header } from "./components/header/header";
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet],
  templateUrl: './app.html'
})
export class App {
  private userService = inject(UserService);
  user = this.userService.user();
}
