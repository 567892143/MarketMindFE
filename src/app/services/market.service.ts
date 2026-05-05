import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, FoSnapshot, MarketSnapshot, PreMarketBriefing, WhyMarketMoved } from '../../models/market.model';


@Injectable({ providedIn: 'root' })
export class MarketService {
  // inject() is the modern Angular 17+ way
  // replaces constructor(private http: HttpClient)
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Returns Observable<PreMarketBriefing>
  // Component uses async pipe — never subscribes manually
  getBriefing(): Observable<PreMarketBriefing> {
    return this.http
      .get<ApiResponse<PreMarketBriefing>>(`${this.api}/market/briefing`)
      .pipe(
        map(response => response.data),
        catchError(err => {
          console.error('[MarketService] getBriefing failed:', err);
          // Return null so UI can show error state
          return of(null as any);
        })
      );
  }

  getSnapshots(): Observable<MarketSnapshot[]> {
    return this.http
      .get<ApiResponse<MarketSnapshot[]>>(`${this.api}/market/snapshots`)
      .pipe(
        map(response => response.data ?? []),
        catchError(err => {
          console.error('[MarketService] getSnapshots failed:', err);
          return of([]);
        })
      );
  }

  getSnapshot(symbol: string): Observable<MarketSnapshot> {
    return this.http
      .get<ApiResponse<MarketSnapshot>>(
        `${this.api}/market/snapshots/${symbol}`)
      .pipe(
        map(response => response.data),
        catchError(err => {
          console.error('[MarketService] getSnapshot failed:', err);
          return of(null as any);
        })
      );
  }

  getNiftyFo(): Observable<FoSnapshot> {
    return this.http
      .get<ApiResponse<FoSnapshot>>(`${this.api}/fo/nifty`)
      .pipe(
        map(response => response.data),
        catchError(() => of(null as any))
      );
  }

  getBankNiftyFo(): Observable<FoSnapshot> {
    return this.http
      .get<ApiResponse<FoSnapshot>>(`${this.api}/fo/banknifty`)
      .pipe(
        map(response => response.data),
        catchError(() => of(null as any))
      );
  }

  getWhyMoved(date?: string): Observable<WhyMarketMoved> {
    const url = date
      ? `${this.api}/analysis/why-moved?date=${date}`
      : `${this.api}/analysis/why-moved`;

    return this.http
      .get<ApiResponse<WhyMarketMoved>>(url)
      .pipe(
        map(response => response.data),
        catchError(() => of(null as any))
      );
  }
}