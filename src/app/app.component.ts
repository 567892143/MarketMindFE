import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignalrService } from './services/signalr.service';

@Component({
  selector:    'app-root',
  standalone:  true,
  imports:     [RouterOutlet],
  template:    `<router-outlet />`,
  styles:      [`
    :host { display: block; min-height: 100vh; }
  `]
})
export class AppComponent implements OnInit {
    // 📌 Angular concept: inject service at root level
  // SignalR connects once for the entire app lifetime
  private signalr = inject(SignalrService);

  ngOnInit(): void {
    // Connect SignalR immediately on app load
    // Prices start streaming before user even opens dashboard
    this.signalr.connect();
}
}