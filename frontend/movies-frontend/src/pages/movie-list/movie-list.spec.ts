import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { MovieListComponent } from './movie-list';
import { MovieService } from '../../service/movie.service';
import { Movie, MoviePageResponse } from '../../models/movie.model';

describe('MovieListComponent', () => {
  let component: MovieListComponent;
  let fixture: ComponentFixture<MovieListComponent>;
  let movieService: { getMovies: ReturnType<typeof vi.fn> };

  const movie: Movie = {
    id: 1,
    year: 2020,
    title: 'Test Movie',
    studios: ['Studio A'],
    producers: ['Producer A'],
    winner: true
  };

  const pageResponse: MoviePageResponse = {
    content: [movie],
    totalElements: 1,
    totalPages: 3,
    number: 0,
    size: 15,
    first: true,
    last: false
  };

  beforeEach(async () => {
    movieService = {
      getMovies: vi.fn().mockImplementation((page: number) => of({ ...pageResponse, number: page }))
    };

    await TestBed.configureTestingModule({
      imports: [MovieListComponent],
      providers: [{ provide: MovieService, useValue: movieService }]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movies on init', () => {
    expect(movieService.getMovies).toHaveBeenCalledWith(0, 15, '', '');
    expect(component.movies).toEqual([movie]);
    expect(component.totalPages).toBe(3);
    expect(component.page).toBe(0);
  });

  it('should apply filters and reset page to zero', () => {
    component.page = 2;
    component.yearFilter = '2020';
    component.winnerFilter = 'true';

    component.applyFilters();

    expect(component.page).toBe(0);
    expect(movieService.getMovies).toHaveBeenCalledWith(0, 15, '2020', 'true');
  });

  it('should clear filters and reset page to zero', () => {
    component.page = 2;
    component.yearFilter = '2020';
    component.winnerFilter = 'false';

    component.clearFilters();

    expect(component.page).toBe(0);
    expect(component.yearFilter).toBe('');
    expect(component.winnerFilter).toBe('');
    expect(movieService.getMovies).toHaveBeenCalledWith(0, 15, '', '');
  });

  it('should not go to previous page when already on first page', () => {
    component.page = 0;
    movieService.getMovies.mockClear();

    component.previousPage();

    expect(component.page).toBe(0);
    expect(movieService.getMovies).not.toHaveBeenCalled();
  });

  it('should go to previous page when page is greater than zero', () => {
    component.page = 2;
    movieService.getMovies.mockClear();

    component.previousPage();

    expect(component.page).toBe(1);
    expect(movieService.getMovies).toHaveBeenCalledWith(1, 15, '', '');
  });

  it('should not go to next page when on last page', () => {
    component.page = 2;
    component.totalPages = 3;
    movieService.getMovies.mockClear();

    component.nextPage();

    expect(component.page).toBe(2);
    expect(movieService.getMovies).not.toHaveBeenCalled();
  });

  it('should go to next page when there is a next page', () => {
    component.page = 1;
    component.totalPages = 3;
    movieService.getMovies.mockClear();

    component.nextPage();

    expect(component.page).toBe(2);
    expect(movieService.getMovies).toHaveBeenCalledWith(2, 15, '', '');
  });

  it('should go to a specific page', () => {
    movieService.getMovies.mockClear();

    component.goToPage(2);

    expect(component.page).toBe(2);
    expect(movieService.getMovies).toHaveBeenCalledWith(2, 15, '', '');
  });

  it('should compute visible pages correctly when totalPages is greater than 5', () => {
    component.page = 3;
    component.totalPages = 8;

    expect(component.pages).toEqual([1, 2, 3, 4, 5]);
  });

  it('should compute visible pages correctly when totalPages is less than 5', () => {
    component.page = 1;
    component.totalPages = 3;

    expect(component.pages).toEqual([0, 1, 2]);
  });
});
