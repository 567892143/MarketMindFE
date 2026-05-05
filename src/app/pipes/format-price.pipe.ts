import { Pipe, PipeTransform } from '@angular/core';

// Formats price numbers for display
// {{ 24312.45 | formatPrice }} → "24,312.45"
// {{ 94.22 | formatPrice:2 }} → "94.22"

@Pipe({
  name:       'formatPrice',
  standalone: true,
  pure:       true
})
export class FormatPricePipe implements PipeTransform {
  transform(value: number, decimals: number = 2): string {
    if (value == null || isNaN(value)) return '—';
    return value.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }
}

@Pipe({
  name:       'formatChange',
  standalone: true,
  pure:       true
})
export class FormatChangePipe implements PipeTransform {
  // {{ 1.82 | formatChange }} → "+1.82%"
  // {{ -0.38 | formatChange }} → "-0.38%"
  transform(value: number): string {
    if (value == null || isNaN(value)) return '—';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  }
}