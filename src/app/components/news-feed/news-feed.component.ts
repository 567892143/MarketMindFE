import {
  Component, OnInit, OnDestroy, inject, Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { RelativeTimePipe } from '../../pipes/relative-time.pipe';
import { environment } from '../../../environments/environment';
import { ApiResponse, NewsArticle } from '../../../models/market.model';

@Component({
  selector:    'app-news-feed',
  standalone:  true,
  imports:     [CommonModule, RelativeTimePipe],
  templateUrl: './news-feed.component.html',
  styleUrl:    './news-feed.component.scss'
})
export class NewsFeedComponent implements OnInit, OnDestroy {
  private http     = inject(HttpClient);
  private destroy$ = new Subject<void>();

  // Optional sector filter — if provided, shows sector news only
  @Input() sector?: string;
  @Input() limit  = 5;

  articles: NewsArticle[] = [];
  loading  = true;

  ngOnInit(): void {
    this.loadNews();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadNews(): void {
    // If sector provided use sector endpoint,
    // otherwise fall back to briefing source articles
    const url = this.sector
      ? `${environment.apiUrl}/sectors/${this.sector}`
      : `${environment.apiUrl}/market/briefing`;

    this.http.get<ApiResponse<any>>(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Extract articles from whichever endpoint was called
          const data = response.data;
          const raw  = data?.drivingNews
                    ?? data?.sourceArticles
                    ?? [];

          this.articles = raw.slice(0, this.limit);
          this.loading  = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  getSentimentLabel(sentiment: number): string {
    switch (sentiment) {
      case 0:  return 'Bullish';
      case 1:  return 'Bearish';
      default: return 'Neutral';
    }
  }

  getSentimentClass(sentiment: number): string {
    switch (sentiment) {
      case 0:  return 'bullish';
      case 1:  return 'bearish';
      default: return 'neutral';
    }
  }
}