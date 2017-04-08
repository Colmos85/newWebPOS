package eu.webpos.service;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import eu.webpos.entity.Product;
import eu.webpos.entity.TillSession;


public interface TillSessionRepo extends JpaRepository<TillSession, Integer>{
	
	//public int countByName(String name);
	//public Till findByName(String name);
	public List<TillSession> findByEmployeeUsername(String username);
	
	@Query(value="SELECT * FROM till_session ts WHERE ts.employee_id= :id AND ts.close_date_time IS NULL", nativeQuery = true)
	public TillSession findTillSessionByEmployeeOpenSession(@Param("id") Long id);
	
	
	public List<TillSession> findByEmployeeId(Long id);
	/*@Query(value="SELECT * FROM till_session ts WHERE ts.employee_id= :id", nativeQuery = true)
	public List<TillSession> findTillSessionsByEmployee(@Param("id") Long id);*/
	
	
/*	@Query(value="Select * FROM artists WHERE id = :id", nativeQuery = true)
	public Artist findByIdNative(@Param("id") int id);*/
	
/*	@Query("SELECT a FROM Artist a JOIN a.movements m WHERE m.name = :name")
	public List<Artist> findByMovementsName(@Param("name") String name);*/
	
	
}
