import {
  Component, OnInit, OnDestroy, inject, Output, EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SectorService } from '../../services/sector.service';
import { SectorSentiment } from '../../../models/market.model';

@Component({
  selector:    'app-sector-heatmap',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './sector-heatmap.component.html',
  styleUrl:    './sector-heatmap.component.scss'
})
export class SectorHeatmapComponent implements OnInit, OnDestroy {
  private sectorService = inject(SectorService);
  private router        = inject(Router);
  private destroy$      = new Subject<void>();

  // 📌 Angular concept: @Output emits events to parent
  @Output() sectorSelected = new EventEmitter<string>();

  sectors: SectorSentiment[] = [];
  loading = true;

  // Fallback sectors when API returns empty
  // (before news has been ingested and scored)
  private readonly fallbackSectors: SectorSentiment[] = [
    { sector: 'Financials', bullishScore: 72,
      overall: 0, overallLabel: 'Bullish',
      articleCount: 0, computedAt: '' },
    { sector: 'IT Services', bullishScore: 65,
      overall: 0, overallLabel: 'Bullish',
      articleCount: 0, computedAt: '' },
    { sector: 'Auto',        bullishScore: 58,
      overall: 2, overallLabel: 'Neutral',
      articleCount: 0, computedAt: '' },
    { sector: 'Energy',      bullishScore: 38,
      overall: 1, overallLabel: 'Bearish',
      articleCount: 0, computedAt: '' },
    { sector: 'Pharma',      bullishScore: 61,
      overall: 0, overallLabel: 'Bullish',
      articleCount: 0, computedAt: '' },
    { sector: 'Metals',      bullishScore: 45,
      overall: 2, overallLabel: 'Neutral',
      articleCount: 0, computedAt: '' },
    { sector: 'FMCG',        bullishScore: 54,
      overall: 2, overallLabel: 'Neutral',
      articleCount: 0, computedAt: '' },
    { sector: 'Realty',      bullishScore: 70,
      overall: 0, overallLabel: 'Bullish',
      articleCount: 0, computedAt: '' },
  ];

  ngOnInit(): void {
    this.sectorService.getSentiments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // Use real data if available, fallback otherwise
        this.sectors = data.length > 0
          ? data
          : this.fallbackSectors;
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Navigate to sector detail page
  onSectorClick(sector: string): void {
    this.router.navigate(['/sector', sector.toLowerCase()]);
  }

  // Bar color based on score
  // 📌 TypeScript concept: method returning different values based on condition
  getBarColor(score: number): string {
    if (score >= 60) return 'var(--green)';
    if (score <= 40) return 'var(--red)';
    return 'var(--amber)';
  }

  // Text color class based on label
  getSentimentClass(label: string): string {
    switch (label?.toLowerCase()) {
      case 'bullish': return 'bullish';
      case 'bearish': return 'bearish';
      default:        return 'neutral';
    }
  }

  // Animation delay for staggered entrance
  getDelay(index: number): string {
    return `${index * 60}ms`;
  }
}