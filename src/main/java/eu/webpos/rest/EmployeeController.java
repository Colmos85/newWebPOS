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
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;

import eu.webpos.entity.Customer;
import eu.webpos.entity.Employee;
import eu.webpos.rest.CustomerController.CustomErrorType;
import eu.webpos.service.EmployeeRepo;
import eu.webpos.service.TransactionRepo;


@RestController
@RequestMapping(value = "/employees")
public class EmployeeController {
	@Autowired
	private EmployeeRepo employeeRepository;

	@Autowired
	private TransactionRepo transactionRepository;
	
	@Autowired
	private ObjectMapper om;

	
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public List<Employee> users() {
		return employeeRepository.findAll();
	}
	
/*	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/basic/{username}", method = RequestMethod.GET)
	public Employee usersOnly(@PathVariable String username) {
		return employeeRepository.findByUsername(null);
	}*/

	
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/fivetransactions/", method = RequestMethod.GET)
	public List<Employee> usersbasic() {
		List<Employee> emps = employeeRepository.findAll();
		System.out.println("1. Length of : " + emps.get(0).getTransactions().size());
		for(Employee e: emps)
		{
			// set only last 5 transactions..
			e.setTransactions(transactionRepository.findTransactionsByEmployeeIdLimitFive(e.getId()));
		}
		//findTransactionsLimitFive
		System.out.println("2. Length of : " + emps.get(0).getTransactions().size());
		
		//om.
		
		return emps;//employeeRepository.findAllNoTransactions();
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
	
	
	/**
	 * Post a new Employee to the database
	 * 
	 * @param customer
	 * @param ucBuilder
	 * @return
	 */
	@RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<?> createEmployee(@RequestBody Employee employee, UriComponentsBuilder ucBuilder) {
        //logger.info("Creating Brand : {}", brand);
		Employee createdEmployee = null;
        /*if (employeeRepository.countByUsername(employee.getUsername()) > 0) {
            return new ResponseEntity(new CustomErrorType("Unable to create. A Customer with username " + 
            	customer.getUsername() + " already exist."),HttpStatus.CONFLICT);
        }*/
		System.out.println("Employee firstname: " + employee.getFirstName());
		System.out.println("Employee contact: " + employee.getContact());
		System.out.println("Employee roles: " + employee.getRoles());
		
		createdEmployee = employeeRepository.save(employee);
        return new ResponseEntity<Employee>(createdEmployee, HttpStatus.CREATED);
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
