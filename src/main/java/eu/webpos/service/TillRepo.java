package eu.webpos.service;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import eu.webpos.entity.Product;
import eu.webpos.entity.Till;


public interface TillRepo extends JpaRepository<Till, Integer>{
	
	public int countByName(String name);
	//public Till findByName(String name);
	
	@Query(value="SELECT * FROM till t WHERE t.name= :name AND t.store_id = :id", nativeQuery = true)
	public Till findTillByNameInStore(@Param("name") String name, @Param("id") int id);
	
	
/*	@Query(value="Select * FROM artists WHERE id = :id", nativeQuery = true)
	public Artist findByIdNative(@Param("id") int id);*/
	
/*	@Query("SELECT a FROM Artist a JOIN a.movements m WHERE m.name = :name")
	public List<Artist> findByMovementsName(@Param("name") String name);*/
	
	
}
