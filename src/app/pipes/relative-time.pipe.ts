import { Pipe, PipeTransform } from '@angular/core';

// {{ article.publishedAt | relativeTime }}
// → "2h ago", "just now", "3d ago"

@Pipe({
  name:       'relativeTime',
  standalone: true,
  pure:       false  // impure — recalculates on every change detection
                     // needed because "now" changes over time
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    const date  = new Date(value);
    const now   = new Date();
    const diffMs= now.getTime() - date.getTime();
    const diffS = Math.floor(diffMs / 1000);
    const diffM = Math.floor(diffS / 60);
    const diffH = Math.floor(diffM / 60);
    const diffD = Math.floor(diffH / 24);

    if (diffS < 60)  return 'just now';
    if (diffM < 60)  return `${diffM}m ago`;
    if (diffH < 24)  return `${diffH}h ago`;
    if (diffD < 7)   return `${diffD}d ago`;

    return date.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short'
    });
  }
}