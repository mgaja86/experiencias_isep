import { Component, OnInit } from '@angular/core';
import { LandingComponent } from './landing/landing.component';
import { SeoService } from './seo/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LandingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'dyad-angular-template';

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.apply();
  }
}