import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MovieService } from './movie.service';
import { Movie } from '../models/movie.model';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://challenge.outsera.tech/api/movies';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService]
    });

    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request movies list with pagination and optional filters', () => {
    const mockResponse = { content: [], totalElements: 0, totalPages: 0, number: 0, size: 10, first: true, last: true };

    service.getMovies(1, 10, '1999', 'true').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(r =>
      r.method === 'GET' &&
      r.url === baseUrl &&
      r.params.get('page') === '1' &&
      r.params.get('size') === '10' &&
      r.params.get('year') === '1999' &&
      r.params.get('winner') === 'true'
    );

    expect(req).toBeTruthy();
    req.flush(mockResponse);
  });

  it('should request years with multiple winners', () => {
    const mockResponse = { years: [{ year: 2000, winnerCount: 2 }] };

    service.getYearsWithMultipleWinners().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/yearsWithMultipleWinners`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should request studios with win count', () => {
    const mockResponse = { studios: [{ name: 'Studio A', winCount: 5 }] };

    service.getStudiosWithWinCount().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/studiosWithWinCount`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should request producer max/min win interval', () => {
    const mockResponse = { max: [], min: [] };

    service.getMaxMinWinIntervalForProducers().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/maxMinWinIntervalForProducers`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return array when winnersByYear response is an array', () => {
    const year = 1999;
    const mockResponse: Movie[] = [{ id: 1, year, title: 'Winner', studios: ['Studio A'], producers: ['Producer A'], winner: true }];

    service.getWinnersByYear(year).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(r =>
      r.method === 'GET' &&
      r.url === `${baseUrl}/winnersByYear` &&
      r.params.get('year') === String(year)
    );

    req.flush(mockResponse);
  });

  it('should wrap single winner object into array', () => {
    const year = 1999;
    const singleWinner = { id: 1, year, title: 'Winner', studios: ['Studio A'], producers: ['Producer A'], winner: true };

    service.getWinnersByYear(year).subscribe(response => {
      expect(response).toEqual([singleWinner]);
    });

    const req = httpMock.expectOne(r =>
      r.method === 'GET' &&
      r.url === `${baseUrl}/winnersByYear` &&
      r.params.get('year') === String(year)
    );

    req.flush(singleWinner);
  });
});
