package eu.webpos.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Transaction {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Date transaction_date;
	
	private boolean onHold;
	private String payment1Type;
	private String payment2Type;
	private double payment1Value; //BigDecimal payment1Value ??;
	private double payment2Value;
	private double changeValue;
	
	//private String recieptNum;
	
	@OneToMany(mappedBy = "transaction") //
	@JsonManagedReference(value="transaction-items")
	private List<TransactionItem> transactionItems;

	@ManyToOne(fetch = FetchType.LAZY) //(fetch = FetchType.LAZY)
	@JoinColumn(name = "employee_id")
	//@JsonBackReference(value="transactions")
	private Employee employee;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "customer_id")
	//@JsonBackReference(value="customer-transactions")
	private Customer customer;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "till_session_id")
	@JsonBackReference(value="session-transactions")
	private TillSession tillSession;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "till_id")
	@JsonBackReference(value="till-transactions")
	private Till till;
	


	public Till getTill() {
		return till;
	}

	public void setTill(Till till) {
		this.till = till;
	}

	public Customer getCustomer() {
		return customer;
	}

	public void setCustomer(Customer customer) {
		this.customer = customer;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

/*	@Column(name = "transaction_date", columnDefinition="DATETIME")
	@Temporal(TemporalType.TIMESTAMP)*/
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm:ss", timezone="Europe/London")
	public Date getTransaction_date() {
		return transaction_date;
	}

	public void setTransaction_date(Date transaction_date) {
		this.transaction_date = transaction_date;
	}

	public boolean isOnHold() {
		return onHold;
	}

	public void setOnHold(boolean onHold) {
		this.onHold = onHold;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public String getPayment1Type() {
		return payment1Type;
	}

	public void setPayment1Type(String payment1Type) {
		this.payment1Type = payment1Type;
	}

	public double getPayment1Value() {
		return payment1Value;
	}

	public void setPayment1Value(double payment1Value) {
		this.payment1Value = payment1Value;
	}

	public double getPayment2Value() {
		return payment2Value;
	}

	public void setPayment2Value(double payment2Value) {
		this.payment2Value = payment2Value;
	}
	
	public String getPayment2Type() {
		return payment2Type;
	}

	public void setPayment2Type(String payment2Type) {
		this.payment2Type = payment2Type;
	}

	public double getChangeValue() {
		return changeValue;
	}

	public void setChangeValue(double changeValue) {
		this.changeValue = changeValue;
	}

/*	public String getRecieptNum() {
		return recieptNum;
	}

	public void setRecieptNum(String recieptNum) {
		this.recieptNum = recieptNum;
	}*/
	
	public List<TransactionItem> getTransactionItems() {
		return transactionItems;
	}

	public void setTransactionItems(List<TransactionItem> transactionItems) {
		this.transactionItems = transactionItems;
	}
	
	

	public TillSession getTillSession() {
		return tillSession;
	}

	public void setTillSession(TillSession tillSession) {
		this.tillSession = tillSession;
	}
	


}
