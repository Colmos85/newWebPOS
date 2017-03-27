package eu.webpos.service;

import org.springframework.data.jpa.repository.JpaRepository;

import eu.webpos.entity.Stock;

public interface StockRepo extends JpaRepository<Stock, Integer>{

}
