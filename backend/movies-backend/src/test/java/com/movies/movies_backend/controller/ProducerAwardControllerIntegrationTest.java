package com.movies.movies_backend.controller;

import com.movies.movies_backend.model.Movie;
import com.movies.movies_backend.repository.MoviesRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ProducerAwardControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MoviesRepository moviesRepository;

    @BeforeEach
    void setup() {
        moviesRepository.deleteAll();

        moviesRepository.save(new Movie(2000, "Movie A", "Studio A", "Producer A", true));
        moviesRepository.save(new Movie(2001, "Movie B", "Studio B", "Producer A", true));
        moviesRepository.save(new Movie(2000, "Movie C", "Studio C", "Producer B", true));
        moviesRepository.save(new Movie(2005, "Movie D", "Studio D", "Producer B", true));
        moviesRepository.save(new Movie(2010, "Movie E", "Studio E", "Producer C", false));
    }

    @Test
    void shouldReturnAwardIntervalsWithMinAndMaxProducers() throws Exception {
        mockMvc.perform(get("/producers/award-intervals"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.min").isArray())
                .andExpect(jsonPath("$.max").isArray())
                .andExpect(jsonPath("$.min", hasSize(1)))
                .andExpect(jsonPath("$.max", hasSize(1)))
                .andExpect(jsonPath("$.min[0].producer").value("Producer A"))
                .andExpect(jsonPath("$.min[0].interval").value(1))
                .andExpect(jsonPath("$.min[0].previousWin").value(2000))
                .andExpect(jsonPath("$.min[0].followingWin").value(2001))
                .andExpect(jsonPath("$.max[0].producer").value("Producer B"))
                .andExpect(jsonPath("$.max[0].interval").value(5))
                .andExpect(jsonPath("$.max[0].previousWin").value(2000))
                .andExpect(jsonPath("$.max[0].followingWin").value(2005));
    }
}
