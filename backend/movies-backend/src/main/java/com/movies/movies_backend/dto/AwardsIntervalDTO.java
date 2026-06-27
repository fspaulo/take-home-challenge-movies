package com.movies.movies_backend.dto;

import java.util.List;

public record AwardsIntervalDTO(
    List<ProducerIntervalDTO> min,
    List<ProducerIntervalDTO> max
) {
    
}
