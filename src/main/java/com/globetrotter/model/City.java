package com.globetrotter.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cities")
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String country;

    private String region;

    private Double costIndex;

    private Integer popularity;

    private String imageUrl;

    public City() {
    }

    public City(String name, String country, String region,
                Double costIndex, Integer popularity, String imageUrl) {
        this.name = name;
        this.country = country;
        this.region = region;
        this.costIndex = costIndex;
        this.popularity = popularity;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public Double getCostIndex() {
        return costIndex;
    }

    public void setCostIndex(Double costIndex) {
        this.costIndex = costIndex;
    }

    public Integer getPopularity() {
        return popularity;
    }

    public void setPopularity(Integer popularity) {
        this.popularity = popularity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}