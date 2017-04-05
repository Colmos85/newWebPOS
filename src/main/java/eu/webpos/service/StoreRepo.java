package eu.webpos.service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import eu.webpos.entity.Stock;
import eu.webpos.entity.Store;

public interface StoreRepo extends JpaRepository<Store, Integer>{
	
	public int countByName(String name);
	
	//SELECT DISTINCT * FROM store JOIN till ON store.id = till.store_id WHERE till.id = 1;
	@Query(value="SELECT * FROM store s JOIN till ON s.id = till.store_id WHERE till.id= :till_id", nativeQuery = true) 
	public Store findStoreByTillId(@Param("till_id") int till_id);
	
}
