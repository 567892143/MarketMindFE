import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ApiResponse,
  SectorSentiment,
  SectorAnalysis
} from '../../models/market.model';

@Injectable({ providedIn: 'root' })
export class SectorService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // All sector sentiment scores — drives heatmap
  getSentiments(): Observable<SectorSentiment[]> {
    return this.http
      .get<ApiResponse<SectorSentiment[]>>(`${this.api}/sectors`)
      .pipe(
        map(response => response.data ?? []),
        catchError(err => {
          console.error('[SectorService] getSentiments failed:', err);
          return of([]);
        })
      );
  }

  // Deep analysis for one sector — drives detail page
  getAnalysis(sector: string): Observable<SectorAnalysis> {
    return this.http
      .get<ApiResponse<SectorAnalysis>>(
        `${this.api}/sectors/${sector}`)
      .pipe(
        map(response => response.data),
        catchError(err => {
          console.error('[SectorService] getAnalysis failed:', err);
          return of(null as any);
        })
      );
  }
}