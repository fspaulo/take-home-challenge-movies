package com.movies.movies_backend.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movies.movies_backend.model.Movie;
import com.movies.movies_backend.repository.MoviesRepository;

@Service
public class MoviesImportService {
    private static final String CSV_FILE_NAME = "Movielist.csv";
    private static final String CSV_SEPARATOR = ";";

    private final MoviesRepository movieRepository;

    public MoviesImportService(MoviesRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Transactional
    public void importMovies() {
        if (movieRepository.count() > 0) {
            return;
        }

        ClassPathResource resource = new ClassPathResource(CSV_FILE_NAME);

        try (
                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)
                )
        ) {
            reader.lines()
                    .skip(1)
                    .filter(line -> line != null && !line.isBlank())
                    .map(this::parseMovie)
                    .forEach(movieRepository::save);

        } catch (Exception exception) {
            throw new IllegalStateException("Error importing movies from file", exception);
        }
    }

    private Movie parseMovie(String line) {
        String[] columns = line.split(CSV_SEPARATOR, -1);

        if (columns.length < 4) {
            throw new IllegalArgumentException("Invalid CSV line: " + line);
        }

        Integer year = parseYear(columns[0]);
        String title = clean(columns[1]);
        String studios = clean(columns[2]);
        String producers = clean(columns[3]);
        Boolean winner = columns.length > 4 && isWinner(columns[4]);

        return new Movie(year, title, studios, producers, winner);
    }

    private Integer parseYear(String value) {
        return Integer.valueOf(clean(value));
    }

    private Boolean isWinner(String value) {
        String cleanedValue = clean(value);

        return "yes".equalsIgnoreCase(cleanedValue)
                || "true".equalsIgnoreCase(cleanedValue);
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }
}
