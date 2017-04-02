package eu.webpos.rest;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import eu.webpos.entity.Brand;
import eu.webpos.mail.SmtpMailSender;
import eu.webpos.rest.BrandController.CustomErrorType;

@RestController
//@RequestMapping("/register")
public class CustomerRegistrationController {
	
	@Autowired
	private SmtpMailSender stmpMailSender;
	
	@RequestMapping(value = "/register/sendcustomerlink/", method = RequestMethod.POST)
	public ResponseEntity<?> sendCustomerMail(@RequestBody String email) throws MessagingException {
		stmpMailSender.send(email, "Customer Registration", "Here is the link to register - http://52.214.112.241:80/#!/customerRegistration"
									+ "	<a href='http://52.214.112.241:80/#!/customerRegistration'>Register Here!</a>");
		return new ResponseEntity(HttpStatus.OK);
	}
	
	
	@RequestMapping(value = "/register/sendemployeelink", method = RequestMethod.POST)
	public ResponseEntity<?> sendEmployeeMail(@RequestBody String email) throws MessagingException {
		stmpMailSender.send(email, "Register Employee", "Here is the link to register - http://localhost:8080/#!/employeeRegistration");
		return new ResponseEntity<String>(email, HttpStatus.OK);
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
