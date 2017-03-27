package eu.webpos.service;

import org.springframework.data.jpa.repository.JpaRepository;

import eu.webpos.entity.Stock;
import eu.webpos.entity.TransactionItem;

public interface TransactionItemsRepo extends JpaRepository<TransactionItem, Integer>{

}
