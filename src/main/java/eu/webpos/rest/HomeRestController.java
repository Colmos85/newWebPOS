package eu.webpos.rest;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eu.webpos.entity.Employee;
import eu.webpos.service.EmployeeRepo;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

/**
 * All web services in this controller will be available for users 
 * 
 * @author Colm O Sullivan
 *
 */
@CrossOrigin(origins = "http://localhost:8000")
@RestController
public class HomeRestController {
	@Autowired
	private EmployeeRepo employeeRepository;

	/**
	 * This method is used for user registration. Note: user registration is not
	 * require any authentication.
	 * 
	 * @param appUser
	 * @return
	 */
	@RequestMapping(value = "/register", method = RequestMethod.POST)
	public ResponseEntity<Employee> createUser(@RequestBody Employee appUser) {
		if (employeeRepository.findOneByUsername(appUser.getUsername()) != null) {
			throw new RuntimeException("Username already exist");
		}
		List<String> roles = new ArrayList<>();
		roles.add("USER");
		appUser.setRoles(roles);
		return new ResponseEntity<Employee>(employeeRepository.save(appUser), HttpStatus.CREATED);
	}

	/**
	 * This method will return the logged user.
	 * 
	 * @param principal
	 * @return Principal java security principal object
	 */
	@RequestMapping("/user")
	public Employee user(Principal principal) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String loggedUsername = auth.getName();
		return employeeRepository.findOneByUsername(loggedUsername);
	}
	
	/**
	 * This method is used to logout an employee..
	 * 
	 * @param employee
	 * @return
	 */
	@RequestMapping(value = "/logout/", method = RequestMethod.POST)
	public ResponseEntity<Employee> logoutEmployee(@RequestBody String username) {
		Employee emp = employeeRepository.findOneByUsername(username);
		emp.setLoggedIn(false);
		employeeRepository.save(emp);
		return new ResponseEntity<Employee>(emp, HttpStatus.OK);
	}

	/**
	 * @param username
	 * @param password
	 * @param response
	 * @return JSON contains token and user after success authentication.
	 * @throws IOException
	 */
	@RequestMapping(value = "/authenticate", method = RequestMethod.POST)
	public ResponseEntity<Map<String, Object>> login(@RequestParam String username, @RequestParam String password,
			HttpServletResponse response) throws IOException {
		String token = null;
		Employee appUser = employeeRepository.findOneByUsername(username);
		Map<String, Object> tokenMap = new HashMap<String, Object>();
		if (appUser != null && appUser.getPassword().equals(password)) {
			token = Jwts.builder().setSubject(username).claim("roles", appUser.getRoles()).setIssuedAt(new Date())
					.signWith(SignatureAlgorithm.HS256, "secretkey").compact();
			tokenMap.put("token", token);
			tokenMap.put("user", appUser);
			
			if(employeeRepository.isEmployeeLoggedIn(appUser.getId()) == 0 ){	
				appUser.setLoggedIn(true);
				employeeRepository.save(appUser);
			}
			else{ // user is already logged in
				return new ResponseEntity<Map<String, Object>>(tokenMap, HttpStatus.IM_USED); //226
			}
			
			return new ResponseEntity<Map<String, Object>>(tokenMap, HttpStatus.OK);
		} else {
			tokenMap.put("token", null);
			return new ResponseEntity<Map<String, Object>>(tokenMap, HttpStatus.UNAUTHORIZED);
		}

	}
}
