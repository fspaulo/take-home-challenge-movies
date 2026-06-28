import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../service/movie.service';
import {
  Movie,
  ProducerInterval,
  StudioWinCount,
  YearWinnerCount
} from '../../models/movie.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})

export class DashboardComponent implements OnInit {
  yearsWithMultipleWinners: YearWinnerCount[] = [];
  topStudios: StudioWinCount[] = [];
  maxIntervals: ProducerInterval[] = [];
  minIntervals: ProducerInterval[] = [];
  winnersByYear: Movie[] = [];

  searchYear = '';
  loading = false;

  constructor(private readonly movieService: MovieService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.movieService.getYearsWithMultipleWinners()
      .subscribe(response => this.yearsWithMultipleWinners = response.years);

    this.movieService.getStudiosWithWinCount()
      .subscribe(response => this.topStudios = response.studios.slice(0, 3));

    this.movieService.getMaxMinWinIntervalForProducers()
      .subscribe(response => {
        this.maxIntervals = response.max;
        this.minIntervals = response.min;
      });
  }

  searchWinnersByYear(): void {
    if (!this.searchYear) {
      this.winnersByYear = [];
      return;
    }

    this.loading = true;

    this.movieService.getWinnersByYear(Number(this.searchYear))
      .subscribe({
        next: response => {
          this.winnersByYear = response;
          this.loading = false;
        },
        error: () => {
          this.winnersByYear = [];
          this.loading = false;
        }
      });
  }
}
