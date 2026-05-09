import {
  Component, OnInit, OnDestroy, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { SectorService } from '../../services/sector.service';
import { SectorAnalysis } from '../../../models/market.model';

@Component({
  selector:    'app-sector-detail',
  standalone:  true,
  imports:     [CommonModule, RouterLink],
  templateUrl: './sector-detail.component.html',
  styleUrl:    './sector-detail.component.scss'
})
export class SectorDetailComponent implements OnInit, OnDestroy {
  private route         = inject(ActivatedRoute);
  private sectorService = inject(SectorService);
  private destroy$      = new Subject<void>();

  analysis:    SectorAnalysis | null = null;
  sectorName:  string  = '';
  loading      = true;
  error        = false;

  ngOnInit(): void {
    // 📌 RxJS concept: switchMap cancels previous API call
    // when route param changes (user navigates to different sector)
    this.route.paramMap.pipe(
      switchMap(params => {
        this.sectorName = params.get('name') ?? '';
        this.loading    = true;
        this.error      = false;
        return this.sectorService.getAnalysis(this.sectorName);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.analysis = data;
        this.loading  = false;
      },
      error: () => {
        this.loading = false;
        this.error   = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get displayName(): string {
    return this.sectorName.charAt(0).toUpperCase()
      + this.sectorName.slice(1);
  }

  get sentimentClass(): string {
    const label = this.analysis?.sentiment?.overallLabel ?? '';
    return label.toLowerCase();
  }

  getSignalClass(signal: string): string {
    switch (signal?.toLowerCase()) {
      case 'bullish': return 'bullish';
      case 'bearish': return 'bearish';
      case 'caution': return 'neutral';
      default:        return 'neutral';
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('en-IN', {
      hour:     '2-digit',
      minute:   '2-digit',
      timeZone: 'Asia/Kolkata'
    }) + ' IST';
  }
}