package com.movies.movies_backend.service;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.movies.movies_backend.dto.AwardsIntervalDTO;
import com.movies.movies_backend.dto.ProducerIntervalDTO;
import com.movies.movies_backend.model.Movie;
import com.movies.movies_backend.repository.MoviesRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProducerAwardServiceTest {

    @Mock
    private MoviesRepository moviesRepository;

    @InjectMocks
    private ProducerAwardService producerAwardService;

    @BeforeEach
    void setup() {
        // Empty setup handled by MockitoExtension
    }

    @Test
    void shouldReturnEmptyIntervalsWhenNoWinnerMoviesExist() {
        when(moviesRepository.findByWinnerTrue()).thenReturn(List.of());

        AwardsIntervalDTO result = producerAwardService.getAwardIntervals();

        assertThat(result.min()).isEmpty();
        assertThat(result.max()).isEmpty();
    }

    @Test
    void shouldCalculateMinimumAndMaximumProducerIntervals() {
        when(moviesRepository.findByWinnerTrue()).thenReturn(List.of(
                new Movie(2000, "Movie A", "Studio A", "Producer A", true),
                new Movie(2001, "Movie B", "Studio B", "Producer A", true),
                new Movie(2000, "Movie C", "Studio C", "Producer B", true),
                new Movie(2005, "Movie D", "Studio D", "Producer B", true),
                new Movie(2010, "Movie E", "Studio E", "Producer C", true),
                new Movie(2015, "Movie F", "Studio F", "Producer C", true),
                new Movie(2020, "Movie G", "Studio G", "Producer C", true)
        ));

        AwardsIntervalDTO result = producerAwardService.getAwardIntervals();

        assertThat(result.min()).hasSize(1);
        assertThat(result.max()).hasSize(3);

        ProducerIntervalDTO minInterval = result.min().get(0);

        assertThat(minInterval.producer()).isEqualTo("Producer A");
        assertThat(minInterval.interval()).isEqualTo(1);
        assertThat(minInterval.previousWin()).isEqualTo(2000);
        assertThat(minInterval.followingWin()).isEqualTo(2001);

        assertThat(result.max()).extracting(ProducerIntervalDTO::producer, ProducerIntervalDTO::interval, ProducerIntervalDTO::previousWin, ProducerIntervalDTO::followingWin)
                .containsExactly(
                        tuple("Producer B", 5, 2000, 2005),
                        tuple("Producer C", 5, 2010, 2015),
                        tuple("Producer C", 5, 2015, 2020)
                );
    }

    @Test
    void shouldSplitProducerNamesByCommaAndAndWhenParsingIntervals() {
        when(moviesRepository.findByWinnerTrue()).thenReturn(List.of(
                new Movie(2000, "Movie A", "Studio A", "Producer A and Producer B", true),
                new Movie(2005, "Movie B", "Studio B", "Producer A, Producer B", true)
        ));

        AwardsIntervalDTO result = producerAwardService.getAwardIntervals();

        assertThat(result.min()).hasSize(2);
        assertThat(result.max()).hasSize(2);

        assertThat(result.min()).extracting(ProducerIntervalDTO::producer)
                .containsExactlyInAnyOrder("Producer A", "Producer B");
    }
}
