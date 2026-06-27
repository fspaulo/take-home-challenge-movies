package com.movies.movies_backend.runner;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.movies.movies_backend.service.MoviesImportService;

@Component
public class MovieLoader implements ApplicationRunner {

    private final MoviesImportService movieImportService;

    public MovieLoader(MoviesImportService movieImportService) {
        this.movieImportService = movieImportService;
    }

    @Override
    public void run(ApplicationArguments args) {
        movieImportService.importMovies();
    }
}
