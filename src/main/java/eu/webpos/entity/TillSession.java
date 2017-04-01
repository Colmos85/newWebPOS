package eu.webpos.entity;

import java.util.Date;
import java.util.List;

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
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class TillSession {
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Date openDateTime;
	
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Date closeDateTime;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "till_id")
	@JsonBackReference(value="tills-sessions")
	private Till till;
	
	@OneToMany(mappedBy = "tillSession")
	@JsonManagedReference(value="session-transactions")
	private List<Transaction> transactions;
	
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employee_id")
	@JsonBackReference(value="employee-sessions")
	private Employee employee;
	
	
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@Column(name = "open_date_time", columnDefinition="DATETIME")
	@Temporal(TemporalType.TIMESTAMP)
	public Date getOpenDateTime() {
		return openDateTime;
	}

	public void setOpenDateTime(Date openDateTime) {
		this.openDateTime = openDateTime;
	}

	@Column(name = "close_date_time", columnDefinition="DATETIME")
	@Temporal(TemporalType.TIMESTAMP)
	public Date getCloseDateTime() {
		return closeDateTime;
	}

	public void setCloseDateTime(Date closeDateTime) {
		this.closeDateTime = closeDateTime;
	}

	public Till getTill() {
		return till;
	}

	public void setTill(Till till) {
		this.till = till;
	}

	public List<Transaction> getTransactions() {
		return transactions;
	}

	public void setTransactions(List<Transaction> transactions) {
		this.transactions = transactions;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}


}
