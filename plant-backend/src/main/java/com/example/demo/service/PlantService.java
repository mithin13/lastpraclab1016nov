package com.example.demo.service;

import com.example.demo.entity.Plant;
import java.util.List;

public interface PlantService {
    Plant addPlant(Plant plant);
    List<Plant> getAllPlants();
    Plant getPlantById(int id);
    Plant updatePlant(Plant plant);
    void deletePlantById(int id);
}