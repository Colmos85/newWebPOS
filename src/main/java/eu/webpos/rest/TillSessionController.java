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

import eu.webpos.dao.TillRepo;
import eu.webpos.dao.TillSessionRepo;
import eu.webpos.entity.Till;
import eu.webpos.entity.TillSession;

@RestController
@RequestMapping("/tillsessions")
public class TillSessionController {
	
	public static final Logger logger = LoggerFactory.getLogger(TillSessionController.class);
	
	@Autowired
	private TillSessionRepo rp;
	
	/**
	 * Web service for getting all the Brands
	 * 
	 * @return list of all Brands
	 */
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public List<TillSession> findAll() {
		return rp.findAll();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public List<TillSession> findAllByEmployee(@PathVariable Long id) {
		return rp.findByEmployeeId(id);
	}
	
	//findTillSessionsByEmployee
	
	
	/**
	 * Method to check if a Till name already exists for a store
	 * @param Till
	 * @return boolean value
	 */
/*	@RequestMapping(value = "/exists/{store_id}/{name}", method = RequestMethod.GET)
	public boolean brandNameExists(@PathVariable int store_id, @PathVariable String name) {
		boolean exists = false;
		if(rp.findTillByNameInStore(name, store_id) != null){
			exists = true;
		}
		return exists;
	}*/
	
}


