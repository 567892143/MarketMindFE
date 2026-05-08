import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MarketService } from '../../services/market.service';
import { MarketSnapshot } from '../../../models/market.model';

@Component({
  selector:    'app-us-recap',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './us-recap.component.html',
  styleUrl:    './us-recap.component.scss'
})
export class UsRecapComponent implements OnInit, OnDestroy {
  private marketService = inject(MarketService);
  private destroy$      = new Subject<void>();

  usSnapshots: MarketSnapshot[] = [];
  loading = true;

  ngOnInit(): void {
    this.marketService.getSnapshots()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.usSnapshots = data.filter(s =>
          ['NASDAQ', 'SP500', 'DOW'].includes(s.symbol));
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // AI insight based on US direction
  get usInsight(): string {
    const nasdaq = this.usSnapshots
      .find(s => s.symbol === 'NASDAQ');
    if (!nasdaq) return '';

    return nasdaq.isBullish
      ? 'Strong US close supports gap-up in Indian IT majors today.'
      : 'Weak US session may weigh on Indian IT and large-cap tech.';
  }

  get overallBullish(): boolean {
    const bullish = this.usSnapshots
      .filter(s => s.isBullish).length;
    return bullish > this.usSnapshots.length / 2;
  }
}