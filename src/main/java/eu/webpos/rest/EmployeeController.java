package eu.webpos.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
/*import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;*/
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import eu.webpos.entity.Employee;
import eu.webpos.service.EmployeeRepo;


@RestController
@RequestMapping(value = "/employees")
public class EmployeeController {
	@Autowired
	private EmployeeRepo employeeRepository;


	
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public List<Employee> users() {
		return employeeRepository.findAll();
	}


	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<Employee> userById(@PathVariable Long id) {
		Employee employee = employeeRepository.findOne(id);
		if (employee == null) {
			return new ResponseEntity<Employee>(HttpStatus.NO_CONTENT);
		} else {
			return new ResponseEntity<Employee>(employee, HttpStatus.OK);
		}
	}
	
	@RequestMapping(value = "/{username}", method = RequestMethod.GET)
	public ResponseEntity<Employee> userByUsername(@PathVariable String username) {
		Employee employee = employeeRepository.findOneByUsername(username);
		if (employee == null) {
			return new ResponseEntity<Employee>(HttpStatus.NO_CONTENT);
		} else {
			return new ResponseEntity<Employee>(employee, HttpStatus.OK);
		}
	}
	
/*	@RequestMapping(value = "/{username}", method = RequestMethod.GET)
	public ResponseEntity<Employee> userByUsername(@PathVariable String username) {
		Employee employee = employeeRepository.findOneByUsername(username);
		if (employee == null) {
			return new ResponseEntity<Employee>(HttpStatus.NO_CONTENT);
		} else {
			return new ResponseEntity<Employee>(employee, HttpStatus.OK);
		}
	}*/

}
