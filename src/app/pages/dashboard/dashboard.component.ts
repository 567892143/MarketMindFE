import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketService } from '../../services/market.service';
import { MarketSnapshot } from '../../../models/market.model';

@Component({
  selector:    'app-dashboard',
  standalone:  true,
  imports:     [CommonModule],
  template: `
    <div style="padding:20px;color:white">
      <h2>API Test</h2>

      @if (loading) {
        <p>Loading snapshots...</p>
      }

      @if (error) {
        <p style="color:red">Error: {{ error }}</p>
      }

      @for (snap of snapshots; track snap.symbol) {
        <div style="margin:8px 0;font-family:monospace">
          {{ snap.displayName }}:
          {{ snap.price | number:'1.2-2' }}
          {{ snap.directionLabel }}
          {{ snap.changePercent | number:'1.2-2' }}%
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  // 📌 Angular concept: inject() — modern dependency injection
  private marketService = inject(MarketService);

  snapshots: MarketSnapshot[] = [];
  loading   = true;
  error     = '';

  // 📌 Angular concept: ngOnInit — runs once after component creation
  //    Use for API calls, not in constructor
  ngOnInit(): void {
    this.marketService.getSnapshots().subscribe({
      next:  (data) => {
        this.snapshots = data;
        this.loading   = false;
      },
      error: (err) => {
        this.error   = 'Could not connect to API';
        this.loading = false;
      }
    });
  }
}