package eu.webpos.service;

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
	
	@Query(value="SELECT COUNT(*) FROM employee WHERE logged_in = 1 AND id = :id", nativeQuery = true)
	public int isEmployeeLoggedIn(@Param("id") Long id);
	
	
	
}
