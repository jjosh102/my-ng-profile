import {
  Component,
  DestroyRef,
  inject,
  signal,
  ElementRef,
  viewChild,
  AfterViewInit,
} from '@angular/core';
import { GithubService } from '../../../services/github.service';
import { Contribution } from '../../../models/github.model';
import {
  Chart,
  ChartConfiguration,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  LineController,
  LineElement,
  PointElement,
} from 'chart.js';

@Component({
  selector: 'app-activity-pulse',
  templateUrl: './activity-pulse.html',
  standalone: true,
  imports: []
})
export class ActivityPulse implements AfterViewInit {
  private githubService = inject(GithubService);
  private destroyRef = inject(DestroyRef);
  private chart?: Chart;

  pulseCanvas = viewChild<ElementRef<HTMLCanvasElement>>('activityPulse');
  overallContributions = signal<number>(0);
  isLoading = signal(true);

  ngAfterViewInit() {
    const subscription = this.githubService.getContributions().subscribe({
      next: (result) => {
        if (result.isSuccess && result.value) {
          const contributions = result.value;
          const currentYear = new Date().getFullYear();
          const total = contributions
            .filter((c) => new Date(c.date).getFullYear() === currentYear)
            .reduce((sum, c) => sum + c.contributionCount, 0);

          this.overallContributions.set(total);
          if (this.pulseCanvas()) {
            this.renderActivityPulse(contributions);
          }
          this.isLoading.set(false);
        }
      },
      error: () => this.isLoading.set(false),
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  private renderActivityPulse(contributions: readonly Contribution[]) {
    if (!this.pulseCanvas()) return;
    const canvas = this.pulseCanvas()!.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    Chart.register(
      LineController,
      LineElement,
      PointElement,
      LinearScale,
      CategoryScale,
      Tooltip,
      Filler
    );

    // Group by month for a cleaner "Pulse" view that's easier for non-techies to read
    const monthlyData = contributions.reduce((acc: Record<string, number>, curr) => {
      const month = new Date(curr.date).toLocaleString('en-US', { month: 'short' });
      acc[month] = (acc[month] || 0) + curr.contributionCount;
      return acc;
    }, {});

    const labels = Object.keys(monthlyData);
    const values = Object.values(monthlyData);

    const gradient = ctx.createLinearGradient(0, 0, 0, 150);
    gradient.addColorStop(0, 'rgba(249, 115, 22, 0.4)'); // orange-500
    gradient.addColorStop(1, 'rgba(249, 115, 22, 0)');

    const data: ChartConfiguration<'line'>['data'] = {
      labels: labels,
      datasets: [
        {
          label: 'Activity',
          data: values,
          fill: true,
          backgroundColor: gradient,
          borderColor: '#f97316',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#f97316',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 3,
        },
      ],
    };

    const options: ChartConfiguration<'line'>['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(13, 17, 23, 0.8)',
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          padding: 12,
          cornerRadius: 12,
          displayColors: false,
          callbacks: {
            label: (context) => ` ${context.raw} Contributions`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: '#94a3b8',
            font: { size: 11, weight: 600 },
          },
          border: { display: false },
        },
        y: {
          display: false,
          grid: { display: false },
          beginAtZero: true,
        },
      },
    };

    this.chart = new Chart(ctx, {
      type: 'line',
      data,
      options,
    });
  }
}
