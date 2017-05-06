package eu.webpos.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import eu.webpos.dao.TaxBandRepo;
import eu.webpos.entity.TaxBand;

@RestController
@RequestMapping("/taxbands")
public class TaxBandController {

	@Autowired
	private TaxBandRepo rp;
	
	/**
	 * Web service for getting all the Brands
	 * 
	 * @return list of all Brands
	 */
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public List<TaxBand> findAll() {
		return rp.findAll();
	}
	
	
	/**
	 * Method to check if a brand name already exists
	 * @param tax band
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
	 * Post a new tax band to the database
	 * 
	 * @param taxBand
	 * @param ucBuilder
	 * @return
	 */
	@RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<?> createBrand(@RequestBody TaxBand taxBand, UriComponentsBuilder ucBuilder) {
        //logger.info("Creating Brand : {}", brand);
		TaxBand createdTaxBand = null;
        if (rp.countByName(taxBand.getName()) > 0) {
            return new ResponseEntity(new CustomErrorType("Unable to create. A Tax Band with name " + 
            taxBand.getName() + " already exist."),HttpStatus.CONFLICT);
        }
        createdTaxBand = rp.save(taxBand);
        return new ResponseEntity<TaxBand>(createdTaxBand, HttpStatus.CREATED);
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
