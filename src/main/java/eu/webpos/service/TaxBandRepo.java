package eu.webpos.service;

import org.springframework.data.jpa.repository.JpaRepository;

import eu.webpos.entity.Brand;
import eu.webpos.entity.TaxBand;


public interface TaxBandRepo extends JpaRepository<TaxBand, Integer>{
	
	public int countByName(String name);
	public TaxBand findByName(String name);
	

}
