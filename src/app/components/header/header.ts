import { afterNextRender, Component, DestroyRef, DOCUMENT, inject, signal } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
})
export class Header {
  private readonly themeService = inject(ThemeService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  readonly isDarkTheme = this.themeService.isDarkTheme;
  readonly activeSection = signal('');

  constructor() {
    const view = this.document.defaultView;
    if (!view) return;
    // Router fragment scrolling uses scrollTo, so CSS scroll-padding alone is insufficient.
    inject(ViewportScroller).setOffset(() => [
      0, (this.document.querySelector('app-header')?.getBoundingClientRect().height ?? 0) + 16,
    ]);

    let frame = 0;
    const update = () => {
      frame = 0;
      const sections = this.document.querySelectorAll<HTMLElement>('main section[id]');
      const activationLine = (this.document.querySelector('app-header')?.getBoundingClientRect().height ?? 0) + 32;
      let active = '';
      for (const section of sections) {
        if (section.getBoundingClientRect().top > activationLine) break;
        active = section.id;
      }
      // The last, short section may never reach the activation line.
      if (sections.length && view.scrollY > 0 && view.scrollY + view.innerHeight >= this.document.documentElement.scrollHeight - 2) {
        active = sections[sections.length - 1].id;
      }
      this.activeSection.set(active);
    };
    const schedule = () => { if (!frame) frame = view.requestAnimationFrame(update); };
    const controller = new AbortController();
    view.addEventListener('scroll', schedule, { passive: true, signal: controller.signal });
    view.addEventListener('resize', schedule, { signal: controller.signal });
    inject(Router).events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationEnd) schedule();
    });
    afterNextRender(schedule);
    this.destroyRef.onDestroy(() => {
      controller.abort();
      view.cancelAnimationFrame(frame);
    });
  }

  onThemeToggle(): void {
    this.themeService.toggleTheme();
  }
}
