package eu.webpos.rest;

import java.text.ParseException;
import java.time.Instant;
import java.util.List;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import eu.webpos.entity.Employee;
import eu.webpos.entity.Stock;
import eu.webpos.entity.Store;
import eu.webpos.entity.TaxBand;
import eu.webpos.entity.TillSession;
import eu.webpos.entity.Transaction;
import eu.webpos.entity.TransactionItem;
import eu.webpos.service.StockRepo;
import eu.webpos.service.StoreRepo;
import eu.webpos.service.TaxBandRepo;
import eu.webpos.service.TillRepo;
import eu.webpos.service.TillSessionRepo;
import eu.webpos.service.TransactionItemsRepo;
import eu.webpos.service.TransactionRepo;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

	@Autowired
	private TransactionRepo rp;
	
	@Autowired
	private TillSessionRepo sessonrp;
	
	@Autowired
	private TransactionItemsRepo itemsRepo;
	
	@Autowired
	private StockRepo stockRepo;
	
	@Autowired
	private StoreRepo storeRepo;

	
	/**
	 * Web service for getting all the Transactions
	 * 
	 * @return list of all Brands
	 */
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public List<Transaction> findAll() {
		return rp.findAll();
	}
	
	
	/**
	 * Find last 5 transactions most recent
	 * @return
	 */
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value = "/limitfive", method = RequestMethod.GET)
	public List<Transaction> findFive() {
		return rp.findTransactionsLimitFive();
	}
	
	
	
	/**
	 * Get last 20 transactions for till
	 * @param username
	 * @return
	 */
	@RequestMapping(value = "/employeelimittwenty/{id}", method = RequestMethod.GET)
	public ResponseEntity<List<Transaction>> employeeLimitFive(@PathVariable int id) {
		List<Transaction> transactions = rp.findTransactionsLimitTwentyByTillId(id);
		if (transactions == null) {
			return new ResponseEntity<List<Transaction>>(HttpStatus.NO_CONTENT);
		} else {
			/*for(Transaction t: transactions){
				t.setTransaction_date(t.getTransaction_date().toString());
			}*/
			System.out.println("*********************************  Transaction date: " + transactions.get(0).getTransaction_date());
			System.out.println("*********************************  Transaction date: " + transactions.get(0).getTransaction_date().toString());
			return new ResponseEntity<List<Transaction>>(transactions, HttpStatus.OK);
		}
	}
	
	
	
	
	/**
	 * Get last 10 transactions for employee
	 * @param username
	 * @return
	 */
	@RequestMapping(value = "/tilllimitfive/{id}", method = RequestMethod.GET)
	public  ResponseEntity<List<Transaction>> tillLimitFive(@PathVariable Long id) {
		List<Transaction> transactions = rp.findTransactionsLimitTwentyByEmployeeId(id);
		if (transactions == null) {
			return new ResponseEntity<List<Transaction>>(HttpStatus.NO_CONTENT);
		} else {
			return new ResponseEntity<List<Transaction>>(transactions, HttpStatus.OK);
		}
	}
	
	
	
	/**
	 * CUSTOM FOR TESTING????????
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/testjoin/", method = RequestMethod.GET)
	public  ResponseEntity<Object> test() {
		Long transactionID = new Long(1);
		Object transaction = rp.test(transactionID);
		//System.out.println("Transaction - ", transaction.);
		if (transaction == null) {
			return new ResponseEntity<Object>(HttpStatus.NO_CONTENT);
		} else {
			return new ResponseEntity<Object>(transaction, HttpStatus.OK);
		}
	}
	
	
	
	/**
	 * Post a new Transaction to the database
	 * 
	 * @param transaction
	 * @param ucBuilder
	 * @return
	 */
	@RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<?> createTransaction(@RequestBody Transaction transaction, UriComponentsBuilder ucBuilder) {
        //logger.info("Creating Transaction : {}", transaction);
		Transaction createdTransaction = null; 
		
		java.util.Date dt = new java.util.Date();
		java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
		//sdf.setTimeZone(TimeZone.getTimeZone("UTC"));  //.setTimeZone(new SimpleTimeZone(SimpleTimeZone.UTC_TIME, "UTC"));
		String currentTime = sdf.format(dt);
		
		java.util.Date dateTime = null;
		try {
			dateTime = sdf.parse(currentTime);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		System.out.println("Time 2: " + dateTime);
		transaction.setTransaction_date(dateTime);
		
		// find a till session for t
		TillSession ts = sessonrp.findTillSessionByEmployeeOpenSession(transaction.getEmployee().getId());
		if(ts != null)
			transaction.setTillSession(ts);
		else{ // create a till session
			TillSession newTillSession = new TillSession();
			newTillSession.setOpenDateTime(dateTime);
			newTillSession.setEmployee(transaction.getEmployee());
			newTillSession = sessonrp.save(newTillSession);
			transaction.setTillSession(newTillSession);
		}
		
		createdTransaction = rp.save(transaction);
		
		Store activeStore = storeRepo.findStoreByTillId(transaction.getTill().getId());
		Stock stock = null;
		// now create the transaction items for the transaction
		for(TransactionItem transactionItem : transaction.getTransactionItems())
		{
			// reduce stock for each transaction item
			stock = stockRepo.findByProductAndStore(transactionItem.getProduct().getId(), activeStore.getId());
			stock.setQuantity(stock.getQuantity() - transactionItem.getQuantity());
			stockRepo.save(stock);
			
			// set transaction items		
			transactionItem.setTransaction(createdTransaction);
			itemsRepo.save(transactionItem);
		}
		
		
		//update the transaction in database
		//createdTransaction.setTransactionItems(items);
		//rp.save(createdTransaction);
		
        return new ResponseEntity<Transaction>(createdTransaction, HttpStatus.CREATED);
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
