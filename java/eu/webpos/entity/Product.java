package eu.webpos.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Product {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;	
	
	private String barcode1;
	private String description;
	private double tradePriceEx;
	private double markup;
	
	
	public Product(int id, String barcode1, String description, double tradePriceEx, double markup) {
		super();
		this.id = id;
		this.barcode1 = barcode1;
		this.description = description;
		this.tradePriceEx = tradePriceEx;
		this.markup = markup;
	}
	
	public Product()
	{
		super();
	}
	


	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getBarcode() {
		return barcode1;
	}

	public void setBarcode(String barcode1) {
		this.barcode1 = barcode1;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public double getTradePriceEx() {
		return tradePriceEx;
	}

	public void setTradePriceEx(double tradePriceEx) {
		this.tradePriceEx = tradePriceEx;
	}

	public double getMarkup() {
		return markup;
	}

	public void setMarkup(double markup) {
		this.markup = markup;
	}
	
}
