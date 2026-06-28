import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  Movie,
  MoviePageResponse,
  ProducerIntervalResponse,
  StudiosWithWinCountResponse,
  YearsWithMultipleWinnersResponse
} from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly baseUrl = 'https://challenge.outsera.tech/api/movies';

  constructor(private readonly http: HttpClient) {}

  getMovies(page: number, size: number, year?: string, winner?: string): Observable<MoviePageResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (year) {
      params = params.set('year', year);
    }

    if (winner) {
      params = params.set('winner', winner);
    }

    return this.http.get<MoviePageResponse>(this.baseUrl, { params });
  }

  getYearsWithMultipleWinners(): Observable<YearsWithMultipleWinnersResponse> {
    return this.http.get<YearsWithMultipleWinnersResponse>(
      `${this.baseUrl}/yearsWithMultipleWinners`
    );
  }

  getStudiosWithWinCount(): Observable<StudiosWithWinCountResponse> {
    return this.http.get<StudiosWithWinCountResponse>(
      `${this.baseUrl}/studiosWithWinCount`
    );
  }

  getMaxMinWinIntervalForProducers(): Observable<ProducerIntervalResponse> {
    return this.http.get<ProducerIntervalResponse>(
      `${this.baseUrl}/maxMinWinIntervalForProducers`
    );
  }

  getWinnersByYear(year: number): Observable<Movie[]> {
    const params = new HttpParams().set('year', year);

    return this.http.get<Movie[] | Movie>(`${this.baseUrl}/winnersByYear`, { params })
      .pipe(
        map(response => Array.isArray(response) ? response : [response])
      );
  }
}
