package eu.webpos.rest;

import java.math.BigDecimal;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

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
import eu.webpos.entity.TillSession;
import eu.webpos.entity.Transaction;
import eu.webpos.rest.CustomerController.CustomErrorType;
import eu.webpos.service.EmployeeRepo;
import eu.webpos.service.TillSessionRepo;
import eu.webpos.service.TransactionRepo;


@RestController
@RequestMapping(value = "/employees")
public class EmployeeController {
	@Autowired
	private EmployeeRepo employeeRepository;

	@Autowired
	private TransactionRepo transactionRepository;

	@Autowired
	private TillSessionRepo tillSessionRepository;
	
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
	
	
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/activetillsession/{id}", method = RequestMethod.GET)
	public ResponseEntity<TillSession> activeTillSession(@PathVariable Long id) {
		TillSession tillSession = tillSessionRepository.findTillSessionByEmployeeOpenSession(id);
		if (tillSession == null) {
			return new ResponseEntity<TillSession>(HttpStatus.NO_CONTENT); //error 204
		} else {
			return new ResponseEntity<TillSession>(tillSession, HttpStatus.OK);
		}
	}
	
	
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/weeklyPerformance/{id}", method = RequestMethod.GET)
	public ResponseEntity<PerformanceObject> weeklyPerformance(@PathVariable Long id) {
		// get transactions for past month?? all time for now
		List<Transaction> transactions = transactionRepository.findByEmployeeId(id);   //.findTillSessionByEmployeeOpenSession(id);
		PerformanceObject obj = new PerformanceObject(new ArrayList<Double>(), new ArrayList<String>());
		
		if (transactions == null) {
			return new ResponseEntity<PerformanceObject>(HttpStatus.NO_CONTENT);
		} else {
			int daysInWeek = 7;
			double weeklyTotal = 0.0; // Accumulate totals for each week
			long diff = 0;
			long numDays = 0;
			
			int counter = 0; // 0 is this week
			int weeklyCounter = 0;
			
			java.util.Date dt = new java.util.Date();
			java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
			String currentTime = sdf.format(dt);
			
			java.util.Date dateTime = null;
			try {
				dateTime = sdf.parse(currentTime);
			} catch (ParseException e) {
				e.printStackTrace();
			}

			for(Transaction t: transactions)
			{
				diff = dateTime.getTime() - t.getTransaction_date().getTime();
				numDays = TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS); // number of days ago the transaction was made
				
				if(numDays > (counter + daysInWeek)){
					Double total =  Math.round(weeklyTotal*100.0)/100.0; // weeklyTotal
					obj.getData().add(total);
					if(weeklyCounter == 0)
						obj.getLabels().add("This Week");
					else
						obj.getLabels().add(weeklyCounter + " Week Ago");
					//reset Weekly Total
					weeklyTotal = 0.0;
					counter +=daysInWeek;
					weeklyCounter ++;
				}
				
				if(numDays <= (counter + daysInWeek))
				{
					weeklyTotal += (t.getPayment1Value() +  t.getPayment2Value() - t.getChangeValue());
				}
			}
			//reverse arrayList order..
			Collections.reverse(obj.getLabels());
			Collections.reverse(obj.getData());
			return new ResponseEntity<PerformanceObject>(obj, HttpStatus.OK);
		}
	}
	
	
	@RequestMapping(value = "/monthlyPerformance/{id}", method = RequestMethod.GET)
	public ResponseEntity<PerformanceObject> monthlyPerformance(@PathVariable Long id) {
		// get transactions for past month?? all time for now
		List<Transaction> transactions = transactionRepository.findByEmployeeId(id);   //.findTillSessionByEmployeeOpenSession(id);
		PerformanceObject obj = new PerformanceObject(new ArrayList<Double>(), new ArrayList<String>());
		
		if (transactions == null) {
			return new ResponseEntity<PerformanceObject>(HttpStatus.NO_CONTENT);
		} else {
			
			String[] months = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};
			
			double monthlyTotal = 0.0;
			int numMonthChanges = 0;
			
			java.util.Date dt = new java.util.Date();
			java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
			String currentTime = sdf.format(dt);
			
			java.util.Date dateTime = null;
			try {
				dateTime = sdf.parse(currentTime);
			} catch (ParseException e) {
				e.printStackTrace();
			}
			
			int calculatingMonth = dateTime.getMonth();
			/*while(numMonthChanges)
			{
				// make sure number of months does not exceed 12
			}*/
			for(Transaction t: transactions)
			{
				if(t.getTransaction_date().getMonth() != calculatingMonth)
				{	
					//month changed
					Double total =  Math.round(monthlyTotal*100.0)/100.0; // weeklyTotal
					obj.getData().add(total);
					obj.getLabels().add(months[calculatingMonth]);
					monthlyTotal = 0.0;
					calculatingMonth = t.getTransaction_date().getMonth();
				}
				else
				{
					System.out.println("Month: " + months[calculatingMonth]);
					monthlyTotal += (t.getPayment1Value() +  t.getPayment2Value() - t.getChangeValue());
				}
			}
			
			//reverse arrayList order..
			Collections.reverse(obj.getLabels());
			Collections.reverse(obj.getData());
			return new ResponseEntity<PerformanceObject>(obj, HttpStatus.OK);
		}
	}
	
	
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/activetillsession/totals/{id}", method = RequestMethod.GET)
	public ResponseEntity<SessionTotals> activeTillSessionTotals(@PathVariable Long id) {
		TillSession tillSession = tillSessionRepository.findTillSessionByEmployeeOpenSession(id);
		SessionTotals sessionTotals = new SessionTotals();
		if (tillSession == null) {
			return new ResponseEntity<SessionTotals>(HttpStatus.NO_CONTENT);
		} else {
			double totalCash = 0.0;
			double totalCard = 0.0;
			for(Transaction t: tillSession.getTransactions())
			{	
				if(t.getPayment1Type().equals("CASH"))
					totalCash += t.getPayment1Value();
					
				if(t.getPayment1Type().equals("CARD"))
					totalCard += t.getPayment1Value();
				
				if(t.getPayment2Type() != null)
				{
					if(t.getPayment2Type().equals("CASH"))
						totalCash += t.getPayment2Value();
					
					if(t.getPayment2Type().equals("CARD"))
						totalCard += t.getPayment2Value();
				}
				
				totalCash -= t.getChangeValue();
			}
			
			System.out.println("Cash Total: " + totalCash);
			System.out.println("Card Total: " + totalCard);
			
			sessionTotals.setCashTotals(Math.round(totalCash*100.0)/100.0);
			sessionTotals.setCardTotals((Math.round(totalCard*100.0)/100.0));
			
			return new ResponseEntity<SessionTotals>(sessionTotals, HttpStatus.OK);
		}
	}

	
	
	/**
	 * Inner class to return totals to front end
	 * @author Colmos
	 *
	 */
	class SessionTotals {
		private double cashTotals;
		private double cardTotals;
		
		public double getCashTotals() {
			return cashTotals;
		}
		public void setCashTotals(double cashTotals) {
			this.cashTotals = cashTotals;
		}
		public double getCardTotals() {
			return cardTotals;
		}
		public void setCardTotals(double cardTotals) {
			this.cardTotals = cardTotals;
		}
	}
	
	/**
	 * Inner class for performance metrix
	 * Will be used on performance chart on Home Screen
	 * @author Colmos
	 *
	 */
	class PerformanceObject {
		private ArrayList<String> labels;
		private ArrayList<Double> data;
		
		public PerformanceObject(ArrayList<Double> data, ArrayList<String> labels)
		{
			this.data = data;
			this.labels = labels;
		}
		public ArrayList<String> getLabels() {
			return labels;
		}
		public void setLabels(ArrayList<String> labels) {
			this.labels = labels;
		}
		public ArrayList<Double> getData() {
			return data;
		}
		public void setData(ArrayList<Double> data) {
			this.data = data;
		}
		
		
		
	}

}
