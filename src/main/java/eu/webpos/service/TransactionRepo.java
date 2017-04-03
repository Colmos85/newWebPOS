package eu.webpos.service;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import eu.webpos.entity.TillSession;
import eu.webpos.entity.Transaction;


public interface TransactionRepo extends JpaRepository<Transaction, Integer>{
	
	//public int countByTransaction??(String brandName);
	//public List<Transaction> findByEmployee(Employee employee);
	
	@Query(value="SELECT * FROM transaction ts WHERE ts.employee_id= :id AND ts.close_date_time IS NULL", nativeQuery = true)
	public TillSession findTillByEmployeeOpenSession(@Param("id") Long id);
	
	

}
