import { Component, DestroyRef, DOCUMENT, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-section',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-section.html',
})
export class DashboardSection {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  readonly email = 'joshuajpiluden@gmail.com';
  readonly copyStatus = signal('');
  readonly previewOpened = signal(false);
  readonly previewZoomed = signal(false);

  printProfile(): void {
    this.document.defaultView?.print();
  }

  openPreview(dialog: HTMLDialogElement, viewport: HTMLElement): void {
    this.previewOpened.set(true);
    this.previewZoomed.set(false);
    dialog.showModal();
    viewport.scrollTo({ left: 0, top: 0, behavior: 'instant' });
  }

  togglePreviewZoom(viewport: HTMLElement): void {
    this.previewZoomed.update((zoomed) => !zoomed);
    viewport.scrollTo({ left: 0, top: 0, behavior: 'instant' });
  }

  closePreviewOnBackdrop(event: MouseEvent, dialog: HTMLDialogElement): void {
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }
  }

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
