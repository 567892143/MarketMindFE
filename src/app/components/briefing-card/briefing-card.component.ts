import {
  Component, OnInit, OnDestroy, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MarketService } from '../../services/market.service';
import { SignalrService } from '../../services/signalr.service';
import { PreMarketBriefing } from '../../../models/market.model';

@Component({
  selector:    'app-briefing-card',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './briefing-card.component.html',
  styleUrl:    './briefing-card.component.scss'
})
export class BriefingCardComponent implements OnInit, OnDestroy {
  private marketService = inject(MarketService);
  private signalr       = inject(SignalrService);
  private destroy$      = new Subject<void>();

  briefing:  PreMarketBriefing | null = null;
  loading    = true;
  error      = false;
  refreshing = false;

  ngOnInit(): void {
    this.loadBriefing();

    // Auto-refresh when SignalR says briefing is ready
    // 📌 RxJS concept: subscribe to Subject for one-time events
    this.signalr.briefingReady$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refreshing = true;
        this.loadBriefing();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBriefing(): void {
    this.marketService.getBriefing()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.briefing   = data;
          this.loading    = false;
          this.refreshing = false;
          this.error      = false;
        },
        error: () => {
          this.loading    = false;
          this.refreshing = false;
          this.error      = true;
        }
      });
  }

  get sentimentLabel(): string {
    return this.briefing?.isBullish ? 'Bullish' : 'Bearish';
  }

  get sentimentClass(): string {
    return this.briefing?.isBullish ? 'bullish' : 'bearish';
  }

  get generatedTime(): string {
    if (!this.briefing?.generatedAt) return '';
    return new Date(this.briefing.generatedAt)
      .toLocaleTimeString('en-IN', {
        hour:     '2-digit',
        minute:   '2-digit',
        timeZone: 'Asia/Kolkata'
      }) + ' IST';
  }

  // Split briefing text into paragraphs for display
  get paragraphs(): string[] {
    if (!this.briefing?.briefingText) return [];
    return this.briefing.briefingText
      .split('\n\n')
      .filter(p => p.trim().length > 0);
  }
}