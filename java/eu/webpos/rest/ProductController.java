package eu.webpos.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import eu.webpos.entity.Product;
import eu.webpos.service.ProductRepo;

@CrossOrigin(origins = "http://localhost:8000")
@RestController
@RequestMapping("/products")
public class ProductController {

	@Autowired
	private ProductRepo rp;
	
/*	@RequestMapping("/")
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseBody
	public List<Product> findall()
	{
		return rp.findAll();
	};*/
	
	
	/**
	 * Web service for getting all the Products in the application.
	 * 
	 * @return list of all Products
	 */
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public List<Product> findAll() {
		return rp.findAll();
	}
	
	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseBody
	public Product findone(@PathVariable("id") int id)
	{
		return rp.findById(id);
	};
	

}
