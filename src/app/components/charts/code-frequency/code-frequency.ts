import { Component, DestroyRef, effect, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { GithubService } from '../../../services/github.service';
import { Chart, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-code-frequency',
  imports: [],
  templateUrl: './code-frequency.html'
})

export class CodeFrequency implements OnInit {
  private githubService = inject(GithubService);
  private destroyRef = inject(DestroyRef);

  repoName = input.required<string>();

  weeks = signal<string[]>([]);
  additions = signal<number[]>([]);
  deletions = signal<number[]>([]);
  hasData = signal<boolean>(false);


  private chart: Chart | null = null;
  chartCanvas = viewChild.required<HTMLCanvasElement>('chartCanvas');

  constructor() {

    effect(() => {
      if (this.hasData()) {
        this.renderChart();
      } else {
        this.destroyChart();
      }
    });
  }

  ngOnInit() {
    const subscription = this.githubService
      .getCodeFrequencyStats(this.repoName())
      .subscribe({
        next: (result) => {
          if (result.isSuccess && Array.isArray(result.value)) {
            const raw = result.value;

            const weeks = raw.map(data =>
              new Date(data[0] * 1000).toISOString().slice(0, 10) // yyyy-MM-dd
            );
            const additions = raw.map(data => data[1]);
            const deletions = raw.map(data => -data[2]);

            this.weeks.set(weeks);
            this.additions.set(additions);
            this.deletions.set(deletions);
            this.hasData.set(weeks.length > 0);
          } else {
            console.warn("No valid code frequency data:", result);
            this.hasData.set(false);
          }
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  private renderChart() {
    const ctx = this.chartCanvas().getContext('2d')!;
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.weeks(),
        datasets: [
          {
            label: 'Additions',
            data: this.additions(),
            backgroundColor: 'rgba(46, 160, 67, 0.2)',
            borderColor: 'rgba(46, 160, 67, 1)',
            borderWidth: 1,
          },
          {
            label: 'Deletions',
            data: this.deletions(),
            backgroundColor: 'rgba(248, 81, 73, 0.2)',
            borderColor: 'rgba(248, 81, 73, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: { stacked: true },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: {
              callback: (value) => Math.abs(Number(value)).toString(),
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                if (context.parsed.y !== null) {
                  label += Math.abs(context.parsed.y);
                }
                return label;
              },
            },
          },
        },
      },
    };

    this.destroyChart();
    this.chart = new Chart(ctx, config);
  }

  private destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}
