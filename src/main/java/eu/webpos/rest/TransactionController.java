package eu.webpos.rest;

import java.text.ParseException;
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

import eu.webpos.entity.Stock;
import eu.webpos.entity.TaxBand;
import eu.webpos.entity.Transaction;
import eu.webpos.entity.TransactionItem;
import eu.webpos.service.TaxBandRepo;
import eu.webpos.service.TransactionItemsRepo;
import eu.webpos.service.TransactionRepo;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

	@Autowired
	private TransactionRepo rp;
	
	@Autowired
	private TransactionItemsRepo itemsRepo;

	
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
		java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String currentTime = sdf.format(dt);
		
		java.util.Date dateTime = null;
		try {
			dateTime = sdf.parse(currentTime);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		transaction.setTransaction_date(dateTime);
		
		createdTransaction = rp.save(transaction);
		
		// now create the transaction items for the transaction
		for(TransactionItem transactionItem : transaction.getTransactionItems())
		{
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
