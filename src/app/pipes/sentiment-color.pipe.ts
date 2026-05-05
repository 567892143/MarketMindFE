import { Pipe, PipeTransform } from '@angular/core';

// 📌 Angular concept: Pipes transform values in templates
// Usage: {{ sector.overallLabel | sentimentColor }}
// Returns a CSS class name

@Pipe({
  name:       'sentimentColor',
  standalone: true,
  pure:       true  // only recalculates when input changes
})
export class SentimentColorPipe implements PipeTransform {
  transform(label: string): string {
    switch (label?.toLowerCase()) {
      case 'bullish': return 'bullish';
      case 'bearish': return 'bearish';
      default:        return 'neutral';
    }
  }
}

@Pipe({
  name:       'sentimentBg',
  standalone: true,
  pure:       true
})
export class SentimentBgPipe implements PipeTransform {
  transform(label: string): string {
    switch (label?.toLowerCase()) {
      case 'bullish': return 'bullish-bg';
      case 'bearish': return 'bearish-bg';
      default:        return 'neutral-bg';
    }
  }
}