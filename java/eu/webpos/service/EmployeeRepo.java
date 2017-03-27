package eu.webpos.service;

import org.springframework.data.jpa.repository.JpaRepository;

import eu.webpos.entity.Employee;

/**
 * @author Colm O Sullivan
 *
 */
public interface EmployeeRepo extends JpaRepository<Employee, Long> {
	
	public Employee findOneByUsername(String username);
	//public Employee findOneByUsernameAndPassword(String username, String password);
	
}
