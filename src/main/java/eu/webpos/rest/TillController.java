package eu.webpos.rest;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import eu.webpos.entity.Till;
import eu.webpos.service.TillRepo;

@RestController
@RequestMapping("/tills")
public class TillController {
	
	public static final Logger logger = LoggerFactory.getLogger(TillController.class);
	
	@Autowired
	private TillRepo rp;
	
	/**
	 * Web service for getting all the Brands
	 * 
	 * @return list of all Brands
	 */
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public List<Till> findAll() {
		return rp.findAll();
	}
	
	
	/**
	 * Method to check if a Till name already exists for a store
	 * @param Till
	 * @return boolean value
	 */
	@RequestMapping(value = "/exists/{store_id}/{name}", method = RequestMethod.GET)
	public boolean brandNameExists(@PathVariable int store_id, @PathVariable String name) {
		boolean exists = false;
		if(rp.findTillByNameInStore(name, store_id) != null){
			exists = true;
		}
		return exists;
	}
	
	
	
	/**
	 * Post a new Till to the database
	 * 
	 * @param brand
	 * @param ucBuilder
	 * @return
	 */
	@RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<?> createTill(@RequestBody Till till, UriComponentsBuilder ucBuilder) {
        //logger.info("Creating Brand : {}", brand);
		Till createdTill = null;
        if (rp.findTillByNameInStore(till.getName(), till.getStore().getStoreId()) == null) {
            return new ResponseEntity(new CustomErrorType("Unable to create. A Till with name " + 
            till.getName() + " already exist for this store."),HttpStatus.CONFLICT);
        }
        createdTill = rp.save(till);
        return new ResponseEntity<Till>(createdTill, HttpStatus.CREATED);
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


