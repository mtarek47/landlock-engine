package com.landlock;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class LandLockApplication {

    public static void main(String[] args) {
        SpringApplication.run(LandLockApplication.class, args);
    }
}
