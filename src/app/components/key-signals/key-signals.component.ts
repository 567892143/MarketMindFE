import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MarketService } from '../../services/market.service';
import { MarketSnapshot } from '../../../models/market.model';

interface Signal {
  label:     string;
  value:     string;
  direction: 'bullish' | 'bearish' | 'neutral';
  icon:      string;
}

@Component({
  selector:    'app-key-signals',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './key-signals.component.html',
  styleUrl:    './key-signals.component.scss'
})
export class KeySignalsComponent implements OnInit, OnDestroy {
  private marketService = inject(MarketService);
  private destroy$      = new Subject<void>();

  signals: Signal[] = [];
  loading = true;

  ngOnInit(): void {
    this.marketService.getSnapshots()
      .pipe(takeUntil(this.destroy$))
      .subscribe(snapshots => {
        this.signals = this.buildSignals(snapshots);
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildSignals(snapshots: MarketSnapshot[]): Signal[] {
    const get = (sym: string) =>
      snapshots.find(s => s.symbol === sym);

    const giftNifty = get('GIFT_NIFTY');
    const nasdaq    = get('NASDAQ');
    const crude     = get('CRUDE');
    const usdinr    = get('USDINR');
    const vix       = get('VIX');

    return [
    {
      label:     'GIFT NIFTY Surge',
      value:     giftNifty
        ? `${giftNifty.directionLabel}${Math.abs(giftNifty.changeAbsolute).toFixed(0)} pts`
        : '— pts',
      direction: (giftNifty?.isBullish ? 'bullish' : 'bearish') as Signal['direction'],
      icon:      '◈'
    },
    {
      label:     'Nasdaq (US)',
      value:     nasdaq
        ? `${nasdaq.directionLabel}${Math.abs(nasdaq.changePercent).toFixed(2)}%`
        : '—',
      direction: (nasdaq?.isBullish ? 'bullish' : 'bearish') as Signal['direction'],
      icon:      '▦'
    },
    {
      label:     'Crude Oil',
      value:     crude
        ? `$${crude.price.toFixed(1)} ${crude.directionLabel}`
        : '—',
      direction: (crude
        ? (crude.isBullish ? 'bearish' : 'bullish')
        : 'neutral') as Signal['direction'],
      icon:      '◎'
    },
    {
      label:     'USD/INR',
      value:     usdinr
        ? `₹${usdinr.price.toFixed(2)}`
        : '—',
      direction: (usdinr
        ? (usdinr.isBullish ? 'bearish' : 'bullish')
        : 'neutral') as Signal['direction'],
      icon:      '⟳'
    }
  ].filter(s => s.value !== '—');
  }
}