package eu.webpos.entity;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;


@Entity
public class Till {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	
	private String name;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "store_id")
	@JsonBackReference(value="store-tills")
	private Store store;

	
	@OneToMany(mappedBy = "till")
	@JsonManagedReference(value="till-transactions")
	private List<Transaction> transactions;
	
	
	
	
	
	
	
	public List<Transaction> getTransactions() {
		return transactions;
	}

	public void setTransactions(List<Transaction> transactions) {
		this.transactions = transactions;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Store getStore() {
		return store;
	}

	public void setStore(Store store) {
		this.store = store;
	}
	

}
