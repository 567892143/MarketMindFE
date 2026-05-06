import {
  Component, OnInit, OnDestroy, inject, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SignalrService } from '../../services/signalr.service';
import { MarketService } from '../../services/market.service';
import {
  MarketSnapshot, PriceUpdate, MarketStatus
} from '../../../models/market.model';

@Component({
  selector:    'app-ticker-bar',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './ticker-bar.component.html',
  styleUrl:    './ticker-bar.component.scss'
})
export class TickerBarComponent implements OnInit, OnDestroy {
  private signalr = inject(SignalrService);
  private market  = inject(MarketService);
  private cdr     = inject(ChangeDetectorRef);

  // 📌 Angular concept: destroy$ pattern — ALWAYS do this
  private destroy$ = new Subject<void>();

  snapshots:    MarketSnapshot[]    = [];
  marketStatus: MarketStatus | null = null;
  connected     = false;

  // Track which symbols are flashing (price just updated)
  flashingSymbols = new Set<string>();

  ngOnInit(): void {
    // Load initial snapshots from REST
    this.market.getSnapshots()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.snapshots = data;
      });

    // Connect SignalR
    this.signalr.connect();

    // Subscribe to live price updates
    // 📌 RxJS concept: takeUntil stops subscription when destroy$ fires
    this.signalr.priceUpdates$
      .pipe(takeUntil(this.destroy$))
      .subscribe(update => this.handlePriceUpdate(update));

    // Subscribe to market status
    this.signalr.marketStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.marketStatus = status;
        this.cdr.markForCheck();
      });

    // Subscribe to connection state
    this.signalr.connected$
      .pipe(takeUntil(this.destroy$))
      .subscribe(connected => {
        this.connected = connected;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    // 📌 Angular concept: complete destroy$ — stops ALL subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handlePriceUpdate(update: PriceUpdate): void {
    // Find and update the matching snapshot
    const index = this.snapshots
      .findIndex(s => s.symbol === update.symbol);

    if (index !== -1) {
      // Update price in place
      this.snapshots[index] = {
        ...this.snapshots[index],
        price:          update.price,
        changePercent:  update.changePercent,
        changeAbsolute: update.changeAbsolute,
        isBullish:      update.isBullish,
        directionLabel: update.directionLabel,
        capturedAt:     update.updatedAt
      };

      // Flash effect — add symbol, remove after 1 second
      this.flashingSymbols.add(update.symbol);
      setTimeout(() => {
        this.flashingSymbols.delete(update.symbol);
        this.cdr.markForCheck();
      }, 1000);
    }

    this.cdr.markForCheck();
  }

  isFlashing(symbol: string): boolean {
    return this.flashingSymbols.has(symbol);
  }

  getSessionLabel(): string {
    return this.marketStatus?.session ?? 'Loading...';
  }

  isMarketOpen(): boolean {
    return this.marketStatus?.isMarketOpen ?? false;
  }
}