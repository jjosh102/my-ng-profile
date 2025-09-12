import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Projects } from "./components/projects/projects";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Projects],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-ng-profile');
}
