package eu.webpos.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import eu.webpos.entity.Store;
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
	
/*	@GetMapping("/{id}")
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseBody
	public Store findone(@PathVariable("id") int id)
	{
		return rp.findById(id);
	};*/
	
}


	