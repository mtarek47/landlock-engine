package com.landlock;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = LandLockApplication.class)
@ActiveProfiles("test")
class LandLockApplicationTests {

    @Test
    void contextLoads() {
    }
}
