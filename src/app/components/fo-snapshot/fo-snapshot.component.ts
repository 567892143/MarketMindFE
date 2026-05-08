import {
  Component, OnInit, OnDestroy, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MarketService } from '../../services/market.service';
import { FoSnapshot } from '../../../models/market.model';

@Component({
  selector:    'app-fo-snapshot',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './fo-snapshot.component.html',
  styleUrl:    './fo-snapshot.component.scss'
})
export class FoSnapshotComponent implements OnInit, OnDestroy {
  private marketService = inject(MarketService);
  private destroy$      = new Subject<void>();

  niftyFo:     FoSnapshot | null = null;
  bankNiftyFo: FoSnapshot | null = null;
  loading      = true;

  // Active tab — NIFTY or BANKNIFTY
  activeSymbol = 'NIFTY';

  ngOnInit(): void {
    // Fetch both in parallel
    // 📌 RxJS concept: two separate subscriptions run concurrently
    this.marketService.getNiftyFo()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.niftyFo = data;
        this.loading = false;
      });

    this.marketService.getBankNiftyFo()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.bankNiftyFo = data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get activeFo(): FoSnapshot | null {
    return this.activeSymbol === 'NIFTY'
      ? this.niftyFo
      : this.bankNiftyFo;
  }

  getPcrClass(signal: string): string {
    switch (signal?.toLowerCase()) {
      case 'bullish': return 'bullish';
      case 'bearish': return 'bearish';
      default:        return 'neutral';
    }
  }

  getStrikeClass(signal: string): string {
    switch (signal?.toLowerCase()) {
      case 'support':          return 'strike--support';
      case 'resistance':
      case 'strong resistance': return 'strike--resistance';
      default:                  return '';
    }
  }

  formatOI(oi: number): string {
    if (oi >= 10_000_000) return (oi / 10_000_000).toFixed(1) + 'Cr';
    if (oi >= 100_000)    return (oi / 100_000).toFixed(1) + 'L';
    return oi.toString();
  }
}