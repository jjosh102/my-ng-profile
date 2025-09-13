import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatSize'
})
export class FormatSizePipe implements PipeTransform {

  transform(sizeInKb: number): string {
    const mb = sizeInKb / 1024;
    const gb = mb / 1024;

    if (gb >= 1) {
      return `${gb.toFixed(1)} GB`;
    }
    if (mb >= 1) {
      return `${mb.toFixed(1)} MB`;
    }
    return `${sizeInKb} KB`;
  }
}
