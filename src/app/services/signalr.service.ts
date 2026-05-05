import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { PriceUpdate, MarketStatus } from '../../models/market.model';

@Injectable({ providedIn: 'root' })
export class SignalrService {
  private connection!: signalR.HubConnection;

  // ── Public streams — components subscribe to these ─────────
  // 📌 Angular concept: Subject emits events
  //    BehaviorSubject holds state + emits to new subscribers
  readonly priceUpdates$  = new Subject<PriceUpdate>();
  readonly marketStatus$  = new BehaviorSubject<MarketStatus | null>(null);
  readonly briefingReady$ = new Subject<void>();
  readonly connected$     = new BehaviorSubject<boolean>(false);

  // Track prices by symbol for quick lookup
  readonly latestPrices$  = new BehaviorSubject<Map<string, PriceUpdate>>(
    new Map()
  );

  constructor() {
    this.buildConnection();
  }

  // ── Connection ─────────────────────────────────────────────

  async connect(): Promise<void> {
    if (this.connection.state === signalR.HubConnectionState.Connected)
      return;

    try {
      await this.connection.start();
      this.connected$.next(true);
      console.log('[SignalR] Connected');

      // Subscribe to all streams immediately on connect
      await this.connection.invoke('SubscribeToAll');
    } catch (err) {
      console.error('[SignalR] Connection failed:', err);
      this.connected$.next(false);

      // Retry after 5 seconds
      setTimeout(() => this.connect(), 5000);
    }
  }

  async disconnect(): Promise<void> {
    await this.connection.stop();
    this.connected$.next(false);
  }

  // ── Build connection ───────────────────────────────────────

  private buildConnection(): void {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubUrl)
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.registerHandlers();
  }

  // ── Event handlers ─────────────────────────────────────────

  private registerHandlers(): void {
    // Price update — push to Subject
    this.connection.on('PriceUpdate', (data: PriceUpdate) => {
      this.priceUpdates$.next(data);

      // Also update the prices map for components that
      // want the latest price for a specific symbol
      const current = this.latestPrices$.value;
      current.set(data.symbol, data);
      this.latestPrices$.next(new Map(current));
    });

    // Market status — update BehaviorSubject
    this.connection.on('MarketStatus', (data: MarketStatus) => {
      this.marketStatus$.next(data);
    });

    // Briefing ready — signal components to refresh
    this.connection.on('BriefingReady', () => {
      this.briefingReady$.next();
    });

    // Connection lifecycle
    this.connection.onreconnecting(() => {
      this.connected$.next(false);
      console.log('[SignalR] Reconnecting...');
    });

    this.connection.onreconnected(() => {
      this.connected$.next(true);
      this.connection.invoke('SubscribeToAll');
      console.log('[SignalR] Reconnected');
    });

    this.connection.onclose(() => {
      this.connected$.next(false);
    });
  }

  // ── Helper — get latest price for a symbol ─────────────────
  getLatestPrice(symbol: string): PriceUpdate | undefined {
    return this.latestPrices$.value.get(symbol);
  }
}