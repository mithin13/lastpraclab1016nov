package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class PlantBackendApplication extends SpringBootServletInitializer{

	public static void main(String[] args) {
		SpringApplication.run(PlantBackendApplication.class, args);
		System.out.println("Plant Backend Is Runnning");
		
	}

}
