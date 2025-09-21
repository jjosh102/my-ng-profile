import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { Projects } from "../projects/projects";
import { Footer } from '../footer/footer';
import { UserProfileCard } from './user-profile-card/user-profile-card';
import { HeatMap } from "../charts/heat-map/heat-map";
import { Stats } from './stats/stats';


@Component({
  selector: 'app-dashboard-section',
  imports: [Projects, UserProfileCard, Footer, HeatMap, Stats],
  templateUrl: './dashboard-section.html',
})
export class DashboardSection  {
}
