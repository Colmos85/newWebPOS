package eu.webpos.entity;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Store {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	private String name;
	private String address1;
	private String address2;
	private String address3;
	private String contactNum;
	
	@OneToOne
    @JoinColumn(name = "company_id")
	private Company company;
	
	@OneToMany(mappedBy = "store")
	@JsonManagedReference(value="store-stock")
	private List<Stock> stock;
	
	@OneToMany(mappedBy = "store")
	@JsonManagedReference(value="store-tills")
	private List<Till> tills;
	
	
	
	public List<Till> getTills() {
		return tills;
	}

	public void setTills(List<Till> tills) {
		this.tills = tills;
	}

	public Long getStoreId() {
		return id;
	}

	public void setStoreId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAddress1() {
		return address1;
	}

	public void setAddress1(String address1) {
		this.address1 = address1;
	}

	public String getAddress2() {
		return address2;
	}

	public void setAddress2(String address2) {
		this.address2 = address2;
	}

	public String getAddress3() {
		return address3;
	}

	public void setAddress3(String address3) {
		this.address3 = address3;
	}

	public String getContactNum() {
		return contactNum;
	}

	public void setContactNum(String contactNum) {
		this.contactNum = contactNum;
	}

	public List<Stock> getStock() {
		return stock;
	}

	public void setStock(List<Stock> stock) {
		this.stock = stock;
	}
	
	

}
