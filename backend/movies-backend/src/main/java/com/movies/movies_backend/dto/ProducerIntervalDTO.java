package com.movies.movies_backend.dto;

public record ProducerIntervalDTO(
        String producer,
        Integer interval,
        Integer previousWin,
        Integer followingWin
) {
    
}
