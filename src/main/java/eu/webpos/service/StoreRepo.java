package eu.webpos.service;

import org.springframework.data.jpa.repository.JpaRepository;

import eu.webpos.entity.Store;

public interface StoreRepo extends JpaRepository<Store, Integer>{
	
	public int countByName(String name);
}
