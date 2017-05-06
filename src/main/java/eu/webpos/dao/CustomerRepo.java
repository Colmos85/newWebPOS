package eu.webpos.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import eu.webpos.entity.Brand;
import eu.webpos.entity.Customer;
import eu.webpos.entity.Employee;


public interface CustomerRepo extends JpaRepository<Customer, Integer>{
	
	public Customer findOneByUsername(String username);
	
	public int countByUsername(String username);
	public int countByEmail(String email);
	public Customer findById(int id);
	

}
