package eu.webpos.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import eu.webpos.entity.Brand;
import eu.webpos.entity.Product;
import eu.webpos.entity.Stock;
import eu.webpos.rest.BrandController.CustomErrorType;
import eu.webpos.service.ProductRepo;
import eu.webpos.service.StockRepo;

//@CrossOrigin(origins = "http://localhost:8000")
@RestController
@RequestMapping("/products")
public class ProductController {

	@Autowired
	private ProductRepo rp;
	
	@Autowired
	private StockRepo stockrp;
	
	/**
	 * Web service for getting all the Products in the application.
	 * 
	 * @return list of all Products
	 */
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public List<Product> findAllActive() {
		return rp.findAllActiveProducts();
	}
	
	@GetMapping("/{id}")
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseBody
	public Product findone(@PathVariable("id") int id)
	{
		return rp.findById(id);
	};
	
	
	@DeleteMapping("/{id}")
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseBody
	public ResponseEntity<?> deleteProduct(@PathVariable("id") int id)
	{
		/*System.out.println("Remove product with this id: " + id);
		//int theid = id.intValue(); // must chnage this to support Long
		Product p = rp.findById(id);
		rp.delete(p);
		return new ResponseEntity(new CustomErrorType("Deleted successfully."),HttpStatus.ACCEPTED);*/
		
		
		Product p = rp.findById(id); // get the product
		p.setActive(false); // set the active to false
		rp.save(p); //
		return new ResponseEntity(new CustomErrorType("Deleted successfully."),HttpStatus.ACCEPTED);
	};
	
	
	/**
	 * Method to check if a Product already exists by checking barcode
	 * @param brand
	 * @return boolean value
	 */
	@RequestMapping(value = "/exists/{barcode}", method = RequestMethod.GET)
	public boolean productExists(@PathVariable String barcode) {
		boolean exists = false;
		if(rp.countByBarcode(barcode) > 0){
			exists = true;
		}
		return exists;
	}
	
	
	/**
	 * Method to update an existing product
	 * by adding a new row with new details
	 * 
	 * @param id - id of product to update
	 * @param product 
	 * @return
	 */
	@RequestMapping(value="/{id}", method=RequestMethod.PUT)
	public Product update(@PathVariable("id") int id, @RequestBody Product product) {
		
		// get product existing product with id
		Product existingProductVersion = rp.findById(id);
		
		// if these values change then a new row is needed // check for brand, tax and category too
		if(!existingProductVersion.getDescription().equalsIgnoreCase(product.getDescription()) || 
				existingProductVersion.getTradePriceEx() != product.getTradePriceEx() ||
				existingProductVersion.getMarkup() != product.getMarkup() ||
				existingProductVersion.getRetailPriceEx() != product.getRetailPriceEx())
		{
			System.out.println("Going to create a new product row!!!!!");
			// set product as inactive
			existingProductVersion.setActive(false);
			// update product  
			rp.save(existingProductVersion); // save will update as the id is already there
			
			
			// create new product
			product.setActive(true);
			Product newProductVersion = rp.save(product); // saves new as there is no id
			
			
			// update the stock 
			for(Stock stock : existingProductVersion.getStock())
	        {
				// update the stock for new product
	        	stock.setProduct(newProductVersion);
	        	stockrp.save(stock);
	        }
			
			for(int i = 0; i < existingProductVersion.getStock().size(); i++)
			{
				int newQuantity = existingProductVersion.getStock().get(i).getQuantity() + product.getStock().get(i).getQuantity();
				existingProductVersion.getStock().get(i).setQuantity(newQuantity);
				stockrp.save(existingProductVersion.getStock().get(i));
			}
			
			// set stock from existing product to new product
			newProductVersion.setStock(existingProductVersion.getStock());
			
		}
		else // no new row needed (might only be stock updated or nothing updated?)
		{
			System.out.println("Going to update product row!!!!!");
			// update product (only quantity changed)
			for(int i = 0; i < existingProductVersion.getStock().size(); i++)
			{
				int newQuantity = existingProductVersion.getStock().get(i).getQuantity() + product.getStock().get(i).getQuantity();
				existingProductVersion.getStock().get(i).setQuantity(newQuantity);
				stockrp.save(existingProductVersion.getStock().get(i));
			}
		}
		
		return null;
	}
	
	
	
	/**
	 * Post a new product to the database
	 * 
	 * @param brand
	 * @param ucBuilder
	 * @return
	 */
	@RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<?> createProduct(@RequestBody Product product, UriComponentsBuilder ucBuilder) {
        //logger.info("Creating Brand : {}", brand);
		Product createdProduct = null;
        if (rp.countByBarcode(product.getBarcode()) > 0) {
            return new ResponseEntity(new CustomErrorType("Unable to create. This Product barcode already exist."),HttpStatus.CONFLICT);
        }
        
        product.setActive(true);
        createdProduct = rp.save(product);
        
        // create stock 
        for(Stock stock : product.getStock())
        {
        	stock.setProduct(createdProduct);
        	Stock s = stockrp.save(stock);
        	System.out.println("stock id" + s.getId());
        	stock.setId(s.getId());
        }
        // set the stock (including ids) to the created product so it can be returned
        createdProduct.setStock(product.getStock());
        
        return new ResponseEntity<Product>(createdProduct, HttpStatus.CREATED);
    }
	
	
	 /**
     * Inner class
     * 
     * @author Colmos
     *
     */
    public class CustomErrorType {
    	 
        private String errorMessage;
     
        public CustomErrorType(String errorMessage){
            this.errorMessage = errorMessage;
        }
     
        public String getErrorMessage() {
            return errorMessage;
        }
     
    }
	

}
