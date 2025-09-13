import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTimeAgo'
})
export class FormatTimeAgoPipe implements PipeTransform {
  transform(lastModified: string | Date): string {
    const date = typeof lastModified === 'string' ? new Date(lastModified) : lastModified;
    const now = new Date();
    const timeDifference = now.getTime() - date.getTime();

    const totalSeconds = Math.floor(timeDifference / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = Math.floor(totalDays / 30);
    const totalYears = Math.floor(totalDays / 365);

    if (totalSeconds < 60) {
      return 'just now';
    }
    if (totalMinutes < 60) {
      return `Updated ${totalMinutes} minute${totalMinutes > 1 ? 's' : ''} ago`;
    }
    if (totalHours < 24) {
      return `Updated ${totalHours} hour${totalHours > 1 ? 's' : ''} ago`;
    }
    if (totalDays < 7) {
      return `Updated ${totalDays} day${totalDays > 1 ? 's' : ''} ago`;
    }
    if (totalDays < 30) {
      return `Updated ${totalWeeks} week${totalWeeks > 1 ? 's' : ''} ago`;
    }
    if (totalDays < 365) {
      return `Updated ${totalMonths} month${totalMonths > 1 ? 's' : ''} ago`;
    }

    return `Updated ${totalYears} year${totalYears > 1 ? 's' : ''} ago`;
  }
}
