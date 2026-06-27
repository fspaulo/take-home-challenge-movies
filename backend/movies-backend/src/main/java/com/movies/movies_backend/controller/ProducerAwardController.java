package com.movies.movies_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.movies.movies_backend.dto.AwardsIntervalDTO;
import com.movies.movies_backend.service.ProducerAwardService;

@RestController
public class ProducerAwardController {

    private final ProducerAwardService producerAwardService;

    public ProducerAwardController(ProducerAwardService producerAwardService) {
        this.producerAwardService = producerAwardService;
    }

    @GetMapping("/producers/award-intervals")
    public AwardsIntervalDTO getAwardIntervals() {
        return producerAwardService.getAwardIntervals();
    }
}
