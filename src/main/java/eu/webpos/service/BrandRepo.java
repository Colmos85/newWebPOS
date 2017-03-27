package eu.webpos.service;

import org.springframework.data.jpa.repository.JpaRepository;

import eu.webpos.entity.Brand;


public interface BrandRepo extends JpaRepository<Brand, Integer>{
	
	public int countByBrandName(String brandName);
	public Brand findByBrandName(String brandName);
	

}
