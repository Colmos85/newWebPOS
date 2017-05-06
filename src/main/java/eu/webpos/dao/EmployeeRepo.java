package eu.webpos.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import eu.webpos.entity.Employee;
import eu.webpos.entity.Product;
import eu.webpos.entity.Till;

/**
 * @author Colm O Sullivan
 *
 */
public interface EmployeeRepo extends JpaRepository<Employee, Long> {
	
	public Employee findOneByUsername(String username);
	
/*	@Query(value="SELECT id, first_name, last_name, username, password, logged_in "
				+ "FROM employee where username= :username", nativeQuery = true)
	public Employee findByUsername(String username);*/
	
	
/*	@Query(value="SELECT id, first_name, last_name, username, password, logged_in "
			+ "FROM employee", nativeQuery = true)
	public List<Employee> findAllNoTransactions();*/
	
	@Query(value="SELECT COUNT(*) FROM employee WHERE logged_in = 1 AND id = :id", nativeQuery = true)
	public int isEmployeeLoggedIn(@Param("id") Long id);
	
	
	/* Find all employees with transactions limited by 5 */
/*	@Query(value="SELECT * FROM "
			+ "(SELECT * FROM transaction"
			+ "transaction t  ", nativeQuery = true)
	public List<Employee> findAllNoTransactions();*/
	
	
	
	/*
	@Query(value="SELECT id, first_name, last_name, username, password, logged_in "
			+ "FROM employee", nativeQuery = true)
	public List<Employee> findAllNoTransactions();
	*/
}
