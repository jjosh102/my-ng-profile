import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getLanguageColor'
})
export class GetLanguageColorPipe implements PipeTransform {
  private readonly languageColors: { [key: string]: string } = {
    "css": "#563d7c",
    "html": "#e34c26",
    "javascript": "#f1e05a",
    "python": "#3572A5",
    "c#": "#178600",
    "java": "#b07219",
    "ruby": "#701516",
    "php": "#4f5b93",
    "go": "#00ADD8",
    "c": "#555555",
    "c++": "#f34b7d",
    "typescript": "#2b7489",
    "swift": "#ffac45",
    "kotlin": "#7f52ff",
    "rust": "#000000",
    "dart": "#00B4AB",
    "scala": "#c22d40",
    "shell": "#89e051",
    "powershell": "#012456",
    "r": "#276dc3",
    "lua": "#000080",
    "objective-c": "#438eff",
    "elixir": "#6e4a7e",
    "perl": "#0298c3",
    "groovy": "#2f6a8f",
    "vue": "#42b883"
  };

  transform(language: string): string {
    if (!language) {
      return "#cccccc";
    }
    const color = this.languageColors[language.toLowerCase()];
    return color || '#cccccc';
  }
}
