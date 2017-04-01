package eu.webpos.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import eu.webpos.entity.Brand;
import eu.webpos.entity.Store;
import eu.webpos.rest.BrandController.CustomErrorType;
import eu.webpos.service.ProductRepo;
import eu.webpos.service.StoreRepo;


@RestController
@RequestMapping("/stores")
public class StoreController {
	
	@Autowired
	private StoreRepo rp;
	
	/**
	 * Web service for getting all the Stores in the application.
	 * 
	 * @return list of all Stores
	 */
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public List<Store> findAll() {
		return rp.findAll();
	}
	
	
	/**
	 * Method to check if a store name already exists
	 * @param brand
	 * @return boolean value
	 */
	@RequestMapping(value = "/exists/{name}", method = RequestMethod.GET)
	public boolean brandNameExists(@PathVariable String name) {
		boolean exists = false;
		if(rp.countByName(name) > 0){
			exists = true;
		}
		return exists;
	}
	
	
	
	/**
	 * Post a new Store to the database
	 * 
	 * @param brand
	 * @param ucBuilder
	 * @return
	 */
	@RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<?> createBrand(@RequestBody Store store, UriComponentsBuilder ucBuilder) {
        //logger.info("Creating Brand : {}", brand);
		Store createdStore = null;
        if (rp.countByName(store.getName()) > 0) {
            return new ResponseEntity(new CustomErrorType("Unable to create. A Store with name " + 
            store.getName() + " already exist."),HttpStatus.CONFLICT);
        }
        createdStore = rp.save(store);
        return new ResponseEntity<Store>(createdStore, HttpStatus.CREATED);
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


	