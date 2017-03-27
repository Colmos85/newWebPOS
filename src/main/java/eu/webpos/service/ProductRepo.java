package eu.webpos.service;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import eu.webpos.entity.Brand;
import eu.webpos.entity.Product;

public interface ProductRepo extends JpaRepository<Product, Integer>{

	//public List<Product> findAll(int id);
	public Product findById(int id);
	
	public int countByBarcode(String barcode);
	public Product findByBarcode(String barcode);
	
	
	@Query(value="SELECT * FROM product WHERE active = 1", nativeQuery = true)
	public List<Product> findAllActiveProducts();
	
	//@Query("SELECT * FROM Product p JOIN p.movements m WHERE m.name = :name")
	/*@Query("SELECT * FROM Product p WHERE p.active=1")
	public List<Product> findAllActive(@Param("name") String name);*/
	
}
