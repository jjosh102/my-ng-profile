import { Component } from '@angular/core';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-dashboard-section',
  standalone: true,
  imports: [Footer],
  templateUrl: './dashboard-section.html'
})
export class DashboardSection {}
