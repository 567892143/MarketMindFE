import {
  Component, OnInit, OnDestroy, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TickerBarComponent } from
  '../../components/ticker-bar/ticker-bar.component';
import { BriefingCardComponent } from
  '../../components/briefing-card/briefing-card.component';
import { KeySignalsComponent } from
  '../../components/key-signals/key-signals.component';
import { UsRecapComponent } from
  '../../components/us-recap/us-recap.component';
import { PriceCardComponent } from
  '../../components/price-card/price-card.component';

import { MarketService } from '../../services/market.service';
import { MarketSnapshot } from '../../../models/market.model';

import { SectorHeatmapComponent } from
  '../../components/sector-heatmap/sector-heatmap.component';
import { FoSnapshotComponent } from
  '../../components/fo-snapshot/fo-snapshot.component';
  import { NewsFeedComponent } from
  '../../components/news-feed/news-feed.component';

@Component({
  selector:    'app-dashboard',
  standalone:  true,
  imports: [
    CommonModule,
    RouterLink,
    TickerBarComponent,
    BriefingCardComponent,
    KeySignalsComponent,
    UsRecapComponent,
    PriceCardComponent,
    SectorHeatmapComponent,
    FoSnapshotComponent,
    NewsFeedComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl:    './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private marketService = inject(MarketService);
  private destroy$      = new Subject<void>();

  snapshots:  MarketSnapshot[] = [];
  activeMode  = 'intraday';
  today       = new Date();

  readonly modes = [
    { key: 'intraday', label: 'Intraday'      },
    { key: 'swing',    label: 'Swing Trader'  },
    { key: 'investor', label: 'Investor'      }
  ];

  ngOnInit(): void {
    this.marketService.getSnapshots()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.snapshots = data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setMode(mode: string): void {
    this.activeMode = mode;
  }

  getSnapshot(symbol: string): MarketSnapshot | undefined {
    return this.snapshots.find(s => s.symbol === symbol);
  }
}