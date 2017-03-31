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

import eu.webpos.entity.Customer;
import eu.webpos.service.CustomerRepo;

@RestController
@RequestMapping("/customers")
public class CustomerController {
	
	public static final Logger logger = LoggerFactory.getLogger(CustomerController.class);
	
	@Autowired
	private CustomerRepo rp;
	
	/**
	 * Web service for getting all the customers
	 * 
	 * @return list of all Customers
	 */
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public List<Customer> findAll() {
		return rp.findAll();
	}
	
	
	/**
	 * Method to check if a customer with this email already exists
	 * @param email
	 * @return boolean value
	 */
	@RequestMapping(value = "/emailexists/{viewValue:.+}", method = RequestMethod.GET)
	public boolean emailExists(@PathVariable String viewValue) {
		boolean exists = false;
		System.out.println("Email received?: " + viewValue);
		if(rp.countByEmail(viewValue) > 0){
			System.out.println("Email exists");
			exists = true;
		}
		return exists;
	}
	
	
	/**
	 * Method to check if a customer with this email already exists
	 * @param username
	 * @return boolean value
	 */
	@RequestMapping(value = "/usernameexists/{viewValue}", method = RequestMethod.GET)
	public boolean usernameExists(@PathVariable String viewValue) {
		boolean exists = false;
		System.out.println("username received?: " + viewValue);
		if(rp.countByUsername(viewValue) > 0){
			System.out.println("username exists");
			exists = true;
		}
		return exists;
	}
	
	
	/**
	 * Post a new Customer to the database
	 * 
	 * @param customer
	 * @param ucBuilder
	 * @return
	 */
	@RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<?> createCustomer(@RequestBody Customer customer, UriComponentsBuilder ucBuilder) {
        //logger.info("Creating Brand : {}", brand);
		Customer createdCustomer = null;
        if (rp.countByUsername(customer.getUsername()) > 0) {
            return new ResponseEntity(new CustomErrorType("Unable to create. A Customer with username " + 
            	customer.getUsername() + " already exist."),HttpStatus.CONFLICT);
        }
        createdCustomer = rp.save(customer);
        return new ResponseEntity<Customer>(createdCustomer, HttpStatus.CREATED);
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


