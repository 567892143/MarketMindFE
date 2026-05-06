import {
  Component, Input, OnChanges, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketSnapshot } from '../../../models/market.model';

@Component({
  selector:    'app-price-card',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './price-card.component.html',
  styleUrl:    './price-card.component.scss'
})
export class PriceCardComponent implements OnChanges {
  // 📌 Angular concept: @Input receives data from parent
  @Input() snapshot!: MarketSnapshot;
  @Input() large = false;

  isFlashing = false;
  prevPrice  = 0;

  // 📌 Angular concept: ngOnChanges fires when @Input changes
  // Gives you previous and current values for comparison
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['snapshot'] && !changes['snapshot'].firstChange) {
      const prev    = changes['snapshot'].previousValue as MarketSnapshot;
      const current = changes['snapshot'].currentValue  as MarketSnapshot;

      if (prev?.price !== current?.price) {
        this.triggerFlash();
      }
    }
  }

  private triggerFlash(): void {
    this.isFlashing = true;
    setTimeout(() => this.isFlashing = false, 800);
  }

  get changeClass(): string {
    if (!this.snapshot) return '';
    return this.snapshot.isBullish ? 'bullish' : 'bearish';
  }
}