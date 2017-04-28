package eu.webpos.rest;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import eu.webpos.entity.Customer;
import eu.webpos.entity.Employee;
import eu.webpos.entity.Transaction;
import eu.webpos.service.CustomerRepo;
import eu.webpos.service.TransactionRepo;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@RestController
@RequestMapping("/customers")
public class CustomerController {
	
	public static final Logger logger = LoggerFactory.getLogger(CustomerController.class);
	
	@Autowired
	private CustomerRepo rp;
	
	@Autowired
	private TransactionRepo transactionrp;
	
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
	 * Get last 10 transactions for customer
	 * @param username
	 * @return
	 */
	@RequestMapping(value = "/transactions/{id}", method = RequestMethod.GET)
	public ResponseEntity<List<Transaction>> tillLimitFive(@PathVariable Long id) {
		System.out.println("GOT TO HERE??? - Customer/transactions/{ID}");
		
		List<Transaction> transactions = transactionrp.findTransactionsLimitTenByCustomerId(id);
		if (transactions == null) {
			return new ResponseEntity<List<Transaction>>(HttpStatus.NO_CONTENT);
		} else {
			return new ResponseEntity<List<Transaction>>(transactions, HttpStatus.OK);
		}
	}
	
	
	
	
	
	/**
	 * @param username
	 * @param password
	 * @param response
	 * @return JSON contains token and user after success authentication.
	 * @throws IOException
	 */
	@RequestMapping(value = "/authenticate/", method = RequestMethod.POST)
	public ResponseEntity<Map<String, Object>> login(@RequestParam String username, @RequestParam String password,
			HttpServletResponse response) throws IOException {
		System.out.println("Made it to hERE???? - in authenticate method customer rest controller");
		String token = null;
		Customer appUser = rp.findOneByUsername(username);
		Map<String, Object> tokenMap = new HashMap<String, Object>();
		if (appUser != null && appUser.getPassword().equals(password)) {
			token = Jwts.builder().setSubject(username)/*.claim("roles", appUser.getRoles()).setIssuedAt(new Date())*/
					.signWith(SignatureAlgorithm.HS256, "secretkey").compact();
			tokenMap.put("token", token);
			tokenMap.put("user", appUser);
			
			return new ResponseEntity<Map<String, Object>>(tokenMap, HttpStatus.OK);
		} else {
			tokenMap.put("token", null);
			return new ResponseEntity<Map<String, Object>>(tokenMap, HttpStatus.UNAUTHORIZED);
		}

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


