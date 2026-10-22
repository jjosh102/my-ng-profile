import { Component, DestroyRef, DOCUMENT, inject, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard-section',
  standalone: true,
  templateUrl: './dashboard-section.html',
})
export class DashboardSection {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  readonly email = 'joshuajpiluden@gmail.com';
  readonly copyStatus = signal('');

  async copyEmail(): Promise<void> {
    try {
      const clipboard = this.document.defaultView?.navigator.clipboard;
      if (!clipboard) throw new Error('Clipboard unavailable');
      await clipboard.writeText(this.email);
      if (!this.destroyRef.destroyed) this.copyStatus.set('Email copied.');
    } catch {
      if (!this.destroyRef.destroyed) this.copyStatus.set('Copy unavailable. Select the email address above.');
    }
  }
}
