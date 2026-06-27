package com.movies.movies_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.movies.movies_backend.model.Movie;

public interface MoviesRepository extends JpaRepository<Movie, Long> {

    List<Movie> findByWinnerTrue();
}

