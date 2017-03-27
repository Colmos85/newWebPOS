package eu.webpos.service;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import eu.webpos.entity.Transaction;


public interface TransactionRepo extends JpaRepository<Transaction, Integer>{
	
	//public int countByTransaction??(String brandName);
	//public List<Transaction> findByEmployee(Employee employee);
	

}
