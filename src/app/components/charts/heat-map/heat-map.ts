import {
  Component,
  DestroyRef,
  inject,
  signal,
  effect,
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
  Legend,
} from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';

@Component({
  selector: 'app-heat-map',
  templateUrl: './heat-map.html',
})
export class HeatMap implements AfterViewInit {
  private githubService = inject(GithubService);
  private destroyRef = inject(DestroyRef);

  heatmapCanvas = viewChild<ElementRef<HTMLCanvasElement>>('heatMap');
  overallContributions = signal<number>(0);
  isLoading = signal(true);

  ngAfterViewInit() {
    const subscription = this.githubService.getContributions().subscribe({
      next: (result) => {
        if (result.isSuccess && result.value) {
          const contribs = result.value.contributions;
          const total = contribs
            .filter((c) => new Date(c.date).getFullYear() === new Date().getFullYear())
            .reduce((sum, c) => sum + c.contributionCount, 0);

          this.overallContributions.set(total);
          if (this.heatmapCanvas()) {
            this.renderHeatmap(contribs);
          }
          this.isLoading.set(false);

        }

      },
      error: () => this.isLoading.set(false),
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  private renderHeatmap(contribs: Contribution[]) {
    if (!this.heatmapCanvas) return;
    const canvas = this.heatmapCanvas()!.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    Chart.register(
      MatrixController,
      MatrixElement,
      LinearScale,
      CategoryScale,
      Tooltip,
      Legend
    );

    const dates = contribs.map(c => c.date);
    const counts = contribs.map(c => c.contributionCount);

    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[dates.length - 1]);
    const totalWeeks = Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24 * 7));
    const maxCount = Math.max(...counts);

    const colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
    const getColor = (value: number) => {
      if (value === 0) return colors[0];
      if (value <= maxCount * 0.25) return colors[1];
      if (value <= maxCount * 0.50) return colors[2];
      if (value <= maxCount * 0.75) return colors[3];
      return colors[4];
    };

    const data = {
      datasets: [
        {
          label: 'Contributions',
          data: dates.map((date, index) => {
            const currentDate = new Date(date);
            const diffDays = Math.floor((+currentDate - +startDate) / (1000 * 60 * 60 * 24));
            const startDayOfWeek = startDate.getDay();
            return {
              x: Math.floor((diffDays + startDayOfWeek) / 7),
              y: currentDate.getDay(),
              d: date,
              v: counts[index],
            };
          }),
          backgroundColor: (ctx: any) => getColor(ctx.raw.v),
          borderRadius: 2,
          width: (c: any) => {
            const area = c.chart.chartArea;
            return area ? (area.right - area.left) / totalWeeks - 5 : 0;
          },
          height: (c: any) => {
            const area = c.chart.chartArea;
            return area ? (area.bottom - area.top) / 7 - 5 : 0;
          },
          borderWidth: 0,

        },
      ],
    };

    const options: ChartConfiguration<'matrix'>['options'] = {
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#8b949e',
            generateLabels: () => [
              {
                text: 'Less',
                fillStyle: 'transparent',
                strokeStyle: 'transparent',
                fontColor: '#8b949e',
                boxWidth: 0,
                borderWidth: 0
              },
              ...colors.map(color => ({
                text: '',
                fillStyle: color,
                strokeStyle: '#0d1117',
                lineWidth: 0,
                borderRadius: 0
              })),
              {
                text: 'More',
                fillStyle: 'transparent',
                strokeStyle: 'transparent',
                fontColor: '#8b949e',
                boxWidth: 0,
                borderWidth: 0
              }
            ],
            boxWidth: 10,
            padding: 12
          },
        },
        tooltip: {
          displayColors: false,
          backgroundColor: '#161b22',
          titleColor: '#c9d1d9',
          bodyColor: '#c9d1d9',
          callbacks: {
            title: () => '',
            label: (context: any) => {
              const { d, v } = context.dataset.data[context.dataIndex];
              return `${v} contributions on ${new Date(d).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
              })}`;
            },
          },
        },
      },
      scales: {
        x: {
          position: 'top',
          min: -0.5,
          max: totalWeeks - 0.5,
          grid: { display: false },
          ticks: {
            color: '#7D8590',
            maxRotation: 0,
            autoSkip: false,
            padding: 8,
            font: {
              size: 11,
            },
            callback: (value: any) => {
              const date = new Date(startDate);
              date.setDate(date.getDate() + value * 7);
              return date.toLocaleString('en-US', { month: 'short' });
            },
          },
        },
        y: {
          display: true,
          offset: false,
          min: -0.5,
          max: 6.5,
          position: 'left',
          grid: { display: false },
          ticks: {
            color: '#7D8590',
            padding: 8,
            font: {
              size: 11,
            },
            callback: (value: any) => ['Mon', '', 'Wed', '', 'Fri', '', ''][value],
          },
        },
      },
      responsive: true,
      layout: {
        padding: { top: 12, right: 2, bottom: 2, left: 2 }
      }
    };

    new Chart(ctx, { type: 'matrix', data, options });
  }
}
