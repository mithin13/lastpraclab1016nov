package com.example.demo.service;

import com.example.demo.entity.Plant;
import com.example.demo.repository.PlantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlantServiceImpl implements PlantService {

    @Autowired
    private PlantRepository plantRepository;

    @Override
    public Plant addPlant(Plant plant) {
        return plantRepository.save(plant);
    }

    @Override
    public List<Plant> getAllPlants() {
        return plantRepository.findAll();
    }

    @Override
    public Plant getPlantById(int id) {
        return plantRepository.findById(id).orElse(null);
    }

    @Override
    public Plant updatePlant(Plant plant) {
        return plantRepository.save(plant);
    }

    @Override
    public void deletePlantById(int id) {
        plantRepository.deleteById(id);
    }
}