import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MarketService } from '../../services/market.service';
import { MarketSnapshot } from '../../../models/market.model';

@Component({
  selector:    'app-landing',
  standalone:  true,
  imports:     [RouterLink, CommonModule, NavbarComponent],
  templateUrl: './landing.component.html',
  styleUrl:    './landing.component.scss'
})
export class LandingComponent implements OnInit {
  private marketService = inject(MarketService);

  snapshots:   MarketSnapshot[] = [];
  currentTime: string = '';

  // Markets we cover section data
  readonly markets = [
    {
      icon:  '◈',
      name:  'Indian Equities',
      desc:  'NIFTY 50, SENSEX, BANK NIFTY, sector indices and top stocks',
      color: 'blue'
    },
    {
      icon:  '⟆',
      name:  'F&O / Derivatives',
      desc:  'Options chain, OI analysis, PCR ratio, IV trends, Max Pain',
      color: 'teal'
    },
    {
      icon:  '◎',
      name:  'Commodities',
      desc:  'Crude Oil, Gold, Silver — MCX prices with global context',
      color: 'amber'
    },
    {
      icon:  '⟳',
      name:  'Forex / Currency',
      desc:  'USD/INR, DXY index — currency impact on Indian markets',
      color: 'purple'
    },
    {
      icon:  '▦',
      name:  'US Markets',
      desc:  'S&P 500, Nasdaq, Dow Jones — overnight session impact',
      color: 'coral'
    }
  ];

  // Standout features data
  readonly features = [
    {
      icon:  '◈',
      title: 'The Why Engine',
      desc:  'Every market move explained in plain language. Not just NIFTY fell 200 pts — but WHY it fell, which global event triggered it, and what to watch next.',
      color: 'blue'
    },
    {
      icon:  '▦',
      title: 'Cross-Asset Intelligence',
      desc:  'Crude up → INR weakens → IT stocks benefit. MarketMind traces these chains automatically using AI.',
      color: 'green'
    },
    {
      icon:  '◎',
      title: 'Macro Pulse',
      desc:  'Fed meeting tomorrow? RBI policy this week? Get AI-summarized impact briefings before the market reacts.',
      color: 'purple'
    }
  ];

  // How it works steps
  readonly steps = [
    {
      number: '01',
      title:  'We aggregate',
      desc:   'NSE, global exchanges, news APIs, FII data — 50,000+ data points daily'
    },
    {
      number: '02',
      title:  'AI analyses',
      desc:   'RAG pipeline + Gemini processes every signal and finds the connections'
    },
    {
      number: '03',
      title:  'You decide',
      desc:   'Clear briefing on your dashboard before the market opens at 9:15 AM'
    }
  ];

  ngOnInit(): void {
    // Fetch real snapshots for the hero card preview
    this.marketService.getSnapshots().subscribe(data => {
      // Show only 5 key instruments in hero
      const keys = ['NIFTY', 'GIFT_NIFTY', 'CRUDE', 'GOLD', 'USDINR'];
      this.snapshots = data.filter(s => keys.includes(s.symbol));
    });

    // Update timestamp every second
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  private updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-IN', {
      hour:     '2-digit',
      minute:   '2-digit',
      timeZone: 'Asia/Kolkata'
    }) + ' IST';
  }

  // Helper for sentiment class
  sentimentClass(snapshot: MarketSnapshot): string {
    return snapshot.isBullish ? 'bullish' : 'bearish';
  }
}