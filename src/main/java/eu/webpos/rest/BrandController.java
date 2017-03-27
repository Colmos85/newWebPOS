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

import eu.webpos.entity.Brand;
import eu.webpos.service.BrandRepo;

@RestController
@RequestMapping("/brands")
public class BrandController {
	
	public static final Logger logger = LoggerFactory.getLogger(BrandController.class);
	
	@Autowired
	private BrandRepo rp;
	
	/**
	 * Web service for getting all the Brands
	 * 
	 * @return list of all Brands
	 */
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public List<Brand> findAll() {
		return rp.findAll();
	}
	
	
	/**
	 * Method to check if a brand name already exists
	 * @param brand
	 * @return boolean value
	 */
	@RequestMapping(value = "/exists/{brandName}", method = RequestMethod.GET)
	public boolean brandNameExists(@PathVariable String brandName) {
		boolean exists = false;
		if(rp.countByBrandName(brandName) > 0){
			exists = true;
		}
		return exists;
	}
	
	
	
	/**
	 * Post a new brand to the database
	 * 
	 * @param brand
	 * @param ucBuilder
	 * @return
	 */
	@RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<?> createBrand(@RequestBody Brand brand, UriComponentsBuilder ucBuilder) {
        //logger.info("Creating Brand : {}", brand);
		Brand createdBrand = null;
        if (rp.countByBrandName(brand.getBrandName()) > 0) {
            return new ResponseEntity(new CustomErrorType("Unable to create. A Brand with name " + 
            brand.getBrandName() + " already exist."),HttpStatus.CONFLICT);
        }
        createdBrand = rp.save(brand);
        return new ResponseEntity<Brand>(createdBrand, HttpStatus.CREATED);
    }
	
	/**
	 * 
	 * @param brand
	 * @return - SHOULD RETURN id generated from the database
	 */
/*	@RequestMapping(value = "/", method = RequestMethod.POST)
    public Brand createUser(@RequestBody Brand brand) {
		Brand createdBrand = null;
		if (rp.countByBrandName(brand.getBrandName()) >= 1)
		{
			System.out.println("Brand Already Exists:");
		}
		else
		{
			System.out.println("Brand Not Already Exists:");
			createdBrand = rp.save(brand);
			//rp.flush();
			System.out.println("Returned id:" + createdBrand.getId());
		}
        return createdBrand;
	}*/

	
	
/*    @RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<?> createBrand(@RequestBody Brand brand, UriComponentsBuilder ucBuilder) {
        //logger.info("Creating Brand : {}", brand);
        System.out.println("CREATING BRAND ****************");
        if (rp.countByBrandName(brand.getBrandName()) > 0) {
        	System.out.println("BRNAD ALREADY EXISTS *********************");
            //logger.error("Unable to create. A Brand with name {} already exist", brand.getBrandName());
            return new ResponseEntity(new CustomErrorType("Unable to create. A Brand with name " + 
            brand.getBrandName() + " already exist."),HttpStatus.CONFLICT);
        }
        rp.save(brand);
 
        //RestTemplate restTemplate = new RestTemplate();
        	
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ucBuilder.path("/brands/{id}").buildAndExpand(brand.getId()).toUri());
        return new ResponseEntity<String>(headers, HttpStatus.CREATED);
    }*/
	
    
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


