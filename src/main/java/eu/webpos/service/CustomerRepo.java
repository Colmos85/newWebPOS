package eu.webpos.service;

import org.springframework.data.jpa.repository.JpaRepository;

import eu.webpos.entity.Brand;
import eu.webpos.entity.Customer;


public interface CustomerRepo extends JpaRepository<Customer, Integer>{
	
	public int countByUsername(String username);
	public int countByEmail(String email);
	public Customer findById(int id);
	

}
