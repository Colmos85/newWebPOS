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
	
	
	/**
	 * Find the last 5 transactions for given employee
	 * @param id
	 * @return
	 */
	@Query(value="SELECT * FROM transaction ts WHERE ts.employee_id= :id ORDER BY transaction_date DESC LIMIT 5", nativeQuery = true)
	public List<Transaction> findTransactionsByEmployeeIdLimitFive(@Param("id") Long id);
	
	
	
	@Query(value="SELECT * FROM transaction ORDER BY transaction_date DESC LIMIT 5", nativeQuery = true)
	public List<Transaction> findTransactionsLimitFive();
	
	
	
	@Query(value="SELECT * FROM transaction ORDER BY transaction_date DESC LIMIT 20", nativeQuery = true)
	public List<Transaction> findTransactionsLimitTwenty();
	
	
	
	@Query(value="SELECT * FROM transaction t WHERE t.till_id= :id LIMIT 20 ORDER BY transaction_date DESC", nativeQuery = true)
	public List<Transaction> findTransactionsLimitTwentyByTillId(@Param("id") int id);
	
	
	@Query(value="SELECT * FROM transaction t WHERE t.employee_id= :id LIMIT 20 ORDER BY transaction_date DESC", nativeQuery = true)
	public List<Transaction> findTransactionsLimitTwentyByEmployeeId(@Param("id") Long id);
	
	
	@Query(value="SELECT * FROM transaction ts WHERE ts.employee_id= :id AND ts.close_date_time IS NULL", nativeQuery = true)
	public TillSession findTillByEmployeeOpenSession(@Param("id") Long id);
	
	

}
