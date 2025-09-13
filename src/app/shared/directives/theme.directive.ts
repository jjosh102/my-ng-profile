import { Directive, effect, inject, input, TemplateRef, ViewContainerRef } from "@angular/core";
import { ThemeService } from "../../services/theme.service";
import { Theme } from "../../models/theme.model";

@Directive(
  {
    selector: '[appTheme]',
    standalone: true
  }
)
export class ThemeDirective {

  theme = input.required<Theme>({
    alias: 'appTheme'
  });

  private themeService = inject(ThemeService);
  private templateRef = inject(TemplateRef)
  private viewContainerRef = inject(ViewContainerRef);
  constructor() {
    effect(() => {
      if (this.themeService.theme() === this.theme()) {
        this.viewContainerRef.createEmbeddedView(this.templateRef)
      } else {
        this.viewContainerRef.clear();
      }

    });
  }

}
