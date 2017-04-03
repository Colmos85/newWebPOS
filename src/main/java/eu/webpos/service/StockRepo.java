package eu.webpos.service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import eu.webpos.entity.Product;
import eu.webpos.entity.Stock;
import eu.webpos.entity.TillSession;

import java.util.List;

public interface StockRepo extends JpaRepository<Stock, Integer>{
	
	public Stock findById(int id);
	
	//@Query(value="SELECT id, quantity, product_id FROM stock t WHERE id= :id", nativeQuery = true)
	//public List<Stock> findWithProductId(@Param("id") Long id);
	
	@Query(value="SELECT * FROM stock s WHERE s.product_id= :product_id AND s.store_id= :storeId", nativeQuery = true)
	public Stock findByProductAndStore(@Param("product_id") int product_id, @Param("storeId") int storeId);

}
