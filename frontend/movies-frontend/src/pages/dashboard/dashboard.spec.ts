import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { DashboardComponent } from './dashboard';
import { MovieService } from '../../service/movie.service';
import { Movie, ProducerInterval, StudioWinCount, YearWinnerCount } from '../../models/movie.model';

describe('Dashboard', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let movieService: {
    getYearsWithMultipleWinners: ReturnType<typeof vi.fn>;
    getStudiosWithWinCount: ReturnType<typeof vi.fn>;
    getMaxMinWinIntervalForProducers: ReturnType<typeof vi.fn>;
    getWinnersByYear: ReturnType<typeof vi.fn>;
  };

  const years: YearWinnerCount[] = [{ year: 1999, winnerCount: 2 }];
  const studios: StudioWinCount[] = [{ name: 'Studio A', winCount: 3 }];
  const maxIntervals: ProducerInterval[] = [{ producer: 'Producer A', interval: 10, previousWin: 2000, followingWin: 2010 }];
  const minIntervals: ProducerInterval[] = [{ producer: 'Producer B', interval: 1, previousWin: 2018, followingWin: 2019 }];
  const winners: Movie[] = [{ id: 1, year: 1999, title: 'Winner', studios: ['Studio A'], producers: ['Producer A'], winner: true }];

  beforeEach(async () => {
    movieService = {
      getYearsWithMultipleWinners: vi.fn().mockReturnValue(of({ years })),
      getStudiosWithWinCount: vi.fn().mockReturnValue(of({ studios })),
      getMaxMinWinIntervalForProducers: vi.fn().mockReturnValue(of({ max: maxIntervals, min: minIntervals })),
      getWinnersByYear: vi.fn().mockReturnValue(of(winners))
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [{ provide: MovieService, useValue: movieService }]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard data on init', () => {
    expect(movieService.getYearsWithMultipleWinners).toHaveBeenCalled();
    expect(movieService.getStudiosWithWinCount).toHaveBeenCalled();
    expect(movieService.getMaxMinWinIntervalForProducers).toHaveBeenCalled();

    expect(component.yearsWithMultipleWinners).toEqual(years);
    expect(component.topStudios).toEqual(studios);
    expect(component.maxIntervals).toEqual(maxIntervals);
    expect(component.minIntervals).toEqual(minIntervals);
  });

  it('should clear winners when search year is empty', () => {
    component.searchYear = '';
    component.winnersByYear = winners;

    component.searchWinnersByYear();

    expect(component.winnersByYear).toEqual([]);
    expect(component.loading).toBe(false);
    expect(movieService.getWinnersByYear).not.toHaveBeenCalled();
  });

  it('should fetch winners by year when searchYear is provided', () => {
    component.searchYear = '1999';

    component.searchWinnersByYear();

    expect(movieService.getWinnersByYear).toHaveBeenCalledWith(1999);
    expect(component.winnersByYear).toEqual(winners);
    expect(component.loading).toBe(false);
  });

  it('should handle errors from winners by year search', () => {
    movieService.getWinnersByYear = vi.fn().mockReturnValue(throwError(() => new Error('Network error')));
    component.searchYear = '1999';

    component.searchWinnersByYear();

    expect(movieService.getWinnersByYear).toHaveBeenCalledWith(1999);
    expect(component.winnersByYear).toEqual([]);
    expect(component.loading).toBe(false);
  });
});
