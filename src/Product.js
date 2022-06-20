import React from "react";
import addToCartIcon from "./images/add-to-cart-icon.png";

class Product extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			productImage: this.props.image
		};
	};
	
	priceCurrencyDisplay = (prices) => { //Finds the currency currently held in 'App' state and matches the correct amount to display.
		const selectedCurrency = this.props.currency; 
		if (prices) {
			const correctPrice = prices.find(price => price.currency.label === selectedCurrency);
			const amount = correctPrice.amount;
			return amount.toFixed(2);
		};
	};
	
	productMouseEnter = (event) => { //Shows add to cart button when product is hovered.
		const x = event.clientX;
		const y = event.clientY;
		const buttons = document.elementFromPoint(x, y);
		if (!buttons.classList.contains("out-of-stock")) {
			if (buttons.closest(".product")) {
				const buttonSelect = buttons.closest(".product").querySelector(".add-to-cart-icon");
				if (buttonSelect) {
					if (buttonSelect.classList.contains("hidden")) {
						buttonSelect.classList.remove("hidden");
					};
				};
			};
		};
	}; //This is all a bit fiddly because without it scrolling from one product to another breaks the icons.
	
	productMouseLeave = () => { //Hides add to cart button when product is no longer hovered.
		const buttons = document.querySelectorAll(".add-to-cart-icon");
		for (let x = 0; x < buttons.length; x++) {
			if (!buttons[x].classList.contains("hidden")) {
				buttons[x].classList.add("hidden");
			};
		};
	};
	
	productFocus = () => { //Shows add to cart button when product is focused with keyboard.
		if (document.activeElement.classList.contains("product")) {
			const buttonSelect = document.activeElement.querySelector(".add-to-cart-icon");
			if (buttonSelect) {
				buttonSelect.classList.remove("hidden");
			};
		} else if (document.activeElement.classList.contains("add-to-cart-icon")) {
			document.activeElement.classList.remove("hidden");
		};
	};
	
	productBlur = (event) => { //Hides add to cart button when product/add to cart button is blurred with keyboard.
		if (event.relatedTarget) {
			if (event.relatedTarget.classList.contains("add-to-cart-icon")) {
				if (event.target !== event.relatedTarget.parentElement) {
					if (event.target.querySelector(".add-to-cart-icon")) {
						event.target.querySelector(".add-to-cart-icon").classList.add("hidden");	
					};
				};
			} else if (event.target.classList.contains("product") && event.relatedTarget.classList.contains("product")) {
				event.target.querySelector(".add-to-cart-icon").classList.add("hidden");
			} else {
				if (event.target.parentElement !== event.relatedTarget) {
					if (event.target.classList.contains("add-to-cart-icon")) {
						event.target.classList.add("hidden");
					};
				};
				if (!event.relatedTarget.classList.contains("product")) {
					if (event.target.querySelector(".add-to-cart-icon")) {
						event.target.querySelector(".add-to-cart-icon").classList.add("hidden");
					};
				};
			};
		} else {
			if (event.target.classList.contains("add-to-cart-icon")) {
				event.target.classList.add("hidden");
			};
		};
	};
	
	keyPressProduct = (event) => { //Applies onClick effect if the Enter key is pressed for accessibility purposes when selecting a product.
		if (event.key === "Enter") {
			this.productSelect();
		};
	};
	
	keyPressCartButton = (event) => { //Applies onClick effect if the Enter key is pressed for accessibility purposes when selecting the quick add to cart button on a product.
		if (event.key === "Enter") {
			this.addToCart(event);
		};
	}
	
	productSelect = () => { //Updates the page to the selected product's description page.
		this.props.productUpdateHandler(this.props.productID);
		this.props.pageUpdateHandler("description");
	};
	
	addToCart = (event) => {
		event.stopPropagation();
		const id = this.props.productID;
		const brand = this.props.brand;
		const name = this.props.name;
		if (this.props.attributes.length === 0) {
			const attributes = this.props.attributes;
			this.props.cartUpdateHandler(id, brand, name, attributes);
		} else {
			const allAttributes = this.props.attributes;
			let attributes = [];
			for (let x = 0; x < allAttributes.length; x++) {
				attributes.push({name: allAttributes[x].name, value: allAttributes[x].items[0].displayValue}); //Adds to cart with first attributes selected.
			};
			this.props.cartUpdateHandler(id, brand, name, attributes);
		};
	};
	
	productRender = () => { //Controls displaying of products and their details.
		if (this.props.inStock) {
			return <div className="product" role="button" tabIndex={1} onFocus={this.productFocus} onBlur={(event) => this.productBlur(event)} onKeyDown={(event) => this.keyPressProduct(event)} onClick={this.productSelect} onMouseEnter={(event) => this.productMouseEnter(event)} onMouseLeave={this.productMouseLeave} onWheel={(event) => this.productMouseEnter(event)}>
				<img src={this.state.productImage} alt={this.props.name} className="product-preview"></img>
				<img className="add-to-cart-icon hidden" src={addToCartIcon} alt="Add to cart" role="button" tabIndex={1} onKeyDown={(event) => this.keyPressCartButton(event)} onClick={(event) => this.addToCart(event)}></img>
				<div className="product-details">
					<div className="product-name">{this.props.brand} {this.props.name}</div>
					<div className="product-price">{this.props.symbol}{this.priceCurrencyDisplay(this.props.prices)}</div>
				</div>
			</div>
		} else {
			return <div className="product" role="button" tabIndex={1} onKeyDown={(event) => this.keyPressProduct(event)} onClick={this.productSelect}>
				<img src={this.state.productImage} alt={this.props.name} className="product-preview out-of-stock"></img>
				<div className="out-of-stock-text">OUT OF STOCK</div>
				<div className="product-details">
					<div className="product-name out-of-stock">{this.props.brand} {this.props.name}</div>
					<div className="product-price out-of-stock">{this.props.symbol}{this.priceCurrencyDisplay(this.props.prices)}</div>
				</div>
			</div>
		};
	};

	render() {
		return <div className="product-container">
			{this.productRender()}
		</div>
	}
};

export default Product;