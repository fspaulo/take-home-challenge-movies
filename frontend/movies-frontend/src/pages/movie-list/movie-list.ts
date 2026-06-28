import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../service/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss'
})

export class MovieListComponent implements OnInit {
  movies: Movie[] = [];

  page = 0;
  size = 15;
  totalPages = 0;

  yearFilter = '';
  winnerFilter = '';

  constructor(private readonly movieService: MovieService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.movieService
      .getMovies(this.page, this.size, this.yearFilter, this.winnerFilter)
      .subscribe(response => {
        this.movies = response.content;
        this.totalPages = response.totalPages;
        this.page = response.number;
      });
  }

  applyFilters(): void {
    this.page = 0;
    this.loadMovies();
  }

  clearFilters(): void {
    this.yearFilter = '';
    this.winnerFilter = '';
    this.page = 0;
    this.loadMovies();
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadMovies();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadMovies();
    }
  }

  goToPage(pageNumber: number): void {
    this.page = pageNumber;
    this.loadMovies();
  }

  get pages(): number[] {
    const pagesToShow = Math.min(this.totalPages, 5);
    const start = Math.max(0, Math.min(this.page - 2, this.totalPages - pagesToShow));

    return Array.from({ length: pagesToShow }, (_, index) => start + index);
  }
}
