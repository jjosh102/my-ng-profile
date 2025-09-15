import { Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appLoading]'
})
export class LoadingDirective {

  isLoading = input.required<boolean>({
    alias: 'appLoading'
  });

  private templateRef = inject(TemplateRef)
  private viewContainerRef = inject(ViewContainerRef);
  constructor() {
    effect(() => {
      if (this.isLoading()) {
        this.viewContainerRef.createEmbeddedView(this.templateRef)
      } else {
        this.viewContainerRef.clear();
      }
    });
  }
}
