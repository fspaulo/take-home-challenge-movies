package com.movies.movies_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "movie_year", nullable=false)
    private Integer year;

    @Column(nullable=false)
    private String title;

    @Column(length = 1000)
    private String studios;

    @Column(length = 1000)
    private String producers;

    @Column(nullable=false)
    private Boolean winner;

    public Movie() {
        // Default
    }

    public Movie(Integer year, String title, String studios, String producers, Boolean winner) {
        this.year = year;
        this.title = title;
        this.studios = studios;
        this.producers = producers;
        this.winner = winner;
    }
}
