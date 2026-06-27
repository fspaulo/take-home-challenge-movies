package com.movies.movies_backend.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.movies.movies_backend.dto.AwardsIntervalDTO;
import com.movies.movies_backend.dto.ProducerIntervalDTO;
import com.movies.movies_backend.model.Movie;
import com.movies.movies_backend.repository.MoviesRepository;

@Service
public class ProducerAwardService {

    private final MoviesRepository movieRepository;

    public ProducerAwardService(MoviesRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public AwardsIntervalDTO getAwardIntervals() {
        List<Movie> winners = movieRepository.findByWinnerTrue();

        Map<String, TreeSet<Integer>> producerWinsByYear = winners.stream()
                .flatMap(movie -> extractProducers(movie.getProducers()).stream()
                        .map(producer -> Map.entry(producer, movie.getYear())))
                .collect(Collectors.groupingBy(
                        Map.Entry::getKey,
                        Collectors.mapping(Map.Entry::getValue, Collectors.toCollection(TreeSet::new))
                ));

        List<ProducerIntervalDTO> intervals = calculateIntervals(producerWinsByYear);

        if (intervals.isEmpty()) {
            return new AwardsIntervalDTO(List.of(), List.of());
        }

        Integer minInterval = intervals.stream()
                .map(ProducerIntervalDTO::interval)
                .min(Integer::compareTo)
                .orElseThrow();

        Integer maxInterval = intervals.stream()
                .map(ProducerIntervalDTO::interval)
                .max(Integer::compareTo)
                .orElseThrow();

        List<ProducerIntervalDTO> min = intervals.stream()
                .filter(interval -> interval.interval().equals(minInterval))
                .sorted(intervalComparator())
                .toList();

        List<ProducerIntervalDTO> max = intervals.stream()
                .filter(interval -> interval.interval().equals(maxInterval))
                .sorted(intervalComparator())
                .toList();

        return new AwardsIntervalDTO(min, max);
    }

    private List<ProducerIntervalDTO> calculateIntervals(Map<String, TreeSet<Integer>> producerWinsByYear) {
        List<ProducerIntervalDTO> intervals = new ArrayList<>();

        for (Map.Entry<String, TreeSet<Integer>> entry : producerWinsByYear.entrySet()) {
            String producer = entry.getKey();
            List<Integer> years = new ArrayList<>(entry.getValue());

            if (years.size() < 2) {
                continue;
            }

            for (int index = 1; index < years.size(); index++) {
                Integer previousWin = years.get(index - 1);
                Integer followingWin = years.get(index);
                Integer interval = followingWin - previousWin;

                intervals.add(new ProducerIntervalDTO(
                        producer,
                        interval,
                        previousWin,
                        followingWin
                ));
            }
        }

        return intervals;
    }

    private List<String> extractProducers(String producers) {
        if (producers == null || producers.isBlank()) {
            return List.of();
        }

        return List.of(producers.split("\\s*,\\s*|\\s+and\\s+"))
                .stream()
                .map(String::trim)
                .filter(producer -> !producer.isBlank())
                .distinct()
                .toList();
    }

    private Comparator<ProducerIntervalDTO> intervalComparator() {
        return Comparator
                .comparing(ProducerIntervalDTO::interval)
                .thenComparing(ProducerIntervalDTO::previousWin)
                .thenComparing(ProducerIntervalDTO::followingWin)
                .thenComparing(ProducerIntervalDTO::producer);
    }
}
