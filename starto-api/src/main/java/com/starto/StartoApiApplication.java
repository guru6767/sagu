package com.starto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class StartoApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(StartoApiApplication.class, args);
    }

}
