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
import eu.webpos.entity.Stock;
import eu.webpos.rest.BrandController.CustomErrorType;
import eu.webpos.service.StockRepo;



@RestController
@RequestMapping("/stock")
public class StockController {
	
	
	@Autowired
	private StockRepo rp;
	

	
	/**
	 * Web service for getting all the Stock. with array of products & stores
	 * 
	 * @return list of all Stock
	 */
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public List<Stock> findAll() {
		return rp.findAll();
	}
	
	
	/**
	 * Post a new brand to the database
	 * 
	 * @param brand
	 * @param ucBuilder
	 * @return
	 */
	@RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<?> createBrand(@RequestBody Stock stock, UriComponentsBuilder ucBuilder) {
        //logger.info("Creating Brand : {}", brand);
		Stock newStockRecord = null;
		newStockRecord = rp.save(stock);
        return new ResponseEntity<Stock>(newStockRecord, HttpStatus.CREATED);
    }

}
