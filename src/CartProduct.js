import React from "react";
import leftArrow from "./images/left-arrow.png";
import rightArrow from "./images/right-arrow.png";
import { cartProductQuery } from "./queries";

class CartProduct extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cartProductQuery: [],
			displayImage: "",
			imageIndex: 0
		}
		this.cartProductSetup();
	};
	
	cartProductSetup = async () => {
		const res_1 = await cartProductQuery(this.props.product.productID);
		this.setState({
			cartProductQuery: res_1.data.product,
			displayImage: res_1.data.product.gallery[0]
		});
	};
	
	attributeRender = () => { //Handles rendering of title and container for each attribute.
		const att = this.state.cartProductQuery.attributes;
		let display = [];
		if (att) {
			for (let x = 0; x < att.length; x++) {
				display.push(<div className={this.props.parent + "-attribute-title"} key={att[x].name+" title"}>{att[x].name}:</div>);
				display.push(<div className={this.props.parent + "-attribute"} id={att[x].id} key={att[x].id}>
					{this.attributeItemRender(att[x])}
				</div>)
			};
		};
		return display;
	};
	
	attributeItemRender = (att) => { //Handles rendering of different types of attribute options.
		const selectedAttributes = this.props.product.attributes;
		let itemDisplay = [];
		if (att.type === "swatch") { //For accessibility purposes, this should probably have the colour names written as well, but they're not in the design so I've not included them.
			for (let i = 0; i < att.items.length; i++) {
				for (let x = 0; x < selectedAttributes.length; x++) {
					if (att.name === selectedAttributes[x].name) {
						if (selectedAttributes[x].value === att.items[i].displayValue) {
							itemDisplay.push(<div className={this.props.parent + "-attribute-swatch selected-attribute"} key={att.items[i].id + "-" + this.props.product.productID + "-" + i} style={{backgroundColor: att.items[i].value}} ></div>);
						} else { 
							if (att.items[i].displayValue === "White") {
								itemDisplay.push(<div className={this.props.parent + "-attribute-swatch white"} key={att.items[i].id + "-" + this.props.product.productID + i} style={{backgroundColor: att.items[i].value}} ></div>);
							} else {
								itemDisplay.push(<div className={this.props.parent + "-attribute-swatch"} key={att.items[i].id + "-" + this.props.product.productID + i} style={{backgroundColor: att.items[i].value}} ></div>);
							};
						};
					};
				};
			};
		} else {
			for (let i = 0; i < att.items.length; i++) {
				for (let x = 0; x < selectedAttributes.length; x++) {
					if (att.name === selectedAttributes[x].name) {
						if (selectedAttributes[x].value === att.items[i].displayValue) {
							itemDisplay.push(<div className={this.props.parent + "-attribute-text selected-attribute"} key={att.items[i].id + "-" + this.props.product.productID + "-" + i}>{att.items[i].value}</div>);
						} else {
							itemDisplay.push(<div className={this.props.parent + "-attribute-text"} key={att.items[i].id + "-" + this.props.product.productID + i}>{att.items[i].value}</div>);
						};
					};
				};
			};
		};
		return itemDisplay;
	};
	
	priceRender = () => { //Handles rendering the correct price based on the user selected currency.
		const selectedCurrency = this.props.currency; 
		const prices = this.state.cartProductQuery.prices;
		if (prices) {
			const correctPrice = prices.find(price => price.currency.label === selectedCurrency);
			const amount = correctPrice.amount;
			return this.props.symbol + amount.toFixed(2);
		};
	};
	
	increaseQuantity = () => { //Increases the quantity of the selected item in the cart.
		this.props.cartItemQuantityHandler(this.props.product.id, "+")
	};
	
	decreaseQuantity = () => { //Decreases the quantity of the selected item in the cart and removes it entirely if quantity reaches 0.
		this.props.cartItemQuantityHandler(this.props.product.id, "-")
	};
	
	keyPressQuantity = (event, operator) => { //Applies onClick effect if the Enter key is pressed for accessibility purposes when selecting a quantity modifying button.
		if (event.key === "Enter") {
			if (operator === "+") {
				this.increaseQuantity();
			} else {
				this.decreaseQuantity();
			};
		};
	};
	
	keyPressImage = (event, operator) => { //Applies onClick effect if the Enter key is pressed for accessibility purposes when selecting an image-changing arrow.
		if (event.key === "Enter") {
			if (operator === "+") {
				this.imageNext();
			} else {
				this.imagePrevious();
			};
		};
	};
	
	imageGallery = () => { //Renders image gallery for products when viewed on the cart page.
		const gallery = this.state.cartProductQuery.gallery;
		let imageGallery = [];
		if (gallery) {
			for (let x = 0; x < gallery.length; x++) {
				imageGallery.push(<img src={gallery[x]} alt={this.props.product.name} key={x} className={this.props.parent + "-product-image"}></img>)
			};
			return imageGallery[this.state.imageIndex];
		};
	};
	
	imageNext = () => { //Cycles forward through images on cart page.
		let index = this.state.imageIndex;
		if (index < this.state.cartProductQuery.gallery.length-1) {
			index++;
			this.setState({
				imageIndex: index
			});
		} else {
			this.setState({
				imageIndex: 0
			});
		};
	};
	
	imagePrevious = () => { //Cycles backwards through images on cart page.
		let index = this.state.imageIndex;
		if (index > 0) {
			index--;
			this.setState({
				imageIndex: index
			});
		} else {
			this.setState({
				imageIndex: this.state.cartProductQuery.gallery.length-1
			});
		};
	};
	
	render() {
		return <div className={this.props.parent + "-product"}>
			<div className={this.props.parent + "-product-info-container"}>
				<div className={this.props.parent + "-brand"}>{this.props.product.brand}</div>
				<div className={this.props.parent + "-name"}>{this.props.product.name}</div>
				<div className={this.props.parent + "-price"}>{this.priceRender()}</div>
				<div className={this.props.parent + "-attributes"}>{this.attributeRender()}</div>
			</div>
			<div className={this.props.parent + "-product-image-container"}>
				<div className={this.props.parent + "-product-quantity"}>
					<span className={this.props.parent + "-product-quantity-button"} aria-label="Increase quantity" tabIndex={1} onKeyDown={(event) => this.keyPressQuantity(event, "+")} onClick={this.increaseQuantity}>+</span>
					<span className={this.props.parent + "-product-quantity-amount"} aria-label="Current quantity" tabIndex={1}>{this.props.product.quantity}</span>
					<span className={this.props.parent + "-product-quantity-button"} aria-label="Decrease quantity" tabIndex={1} onKeyDown={(event) => this.keyPressQuantity(event, "-")} onClick={this.decreaseQuantity}>-</span>
				</div>
				{this.props.parent === "cart-overlay" ? 
					<img src={this.state.displayImage} alt={this.props.product.name} className={this.props.parent + "-product-image"}></img>
					: 
					<div className="cart-page-product-image-position">
						{this.imageGallery()}
						{this.state.cartProductQuery.gallery ?
							this.state.cartProductQuery.gallery.length > 1 ? <div className="cart-page-product-image-arrow-container">
								<img className="cart-page-product-image-arrow" src={leftArrow} alt="Previous" tabIndex={1} onKeyDown={(event) => this.keyPressImage(event, "+")} onClick={this.imageNext}></img>
								<img className="cart-page-product-image-arrow" src={rightArrow} alt="Next" tabIndex={1} onKeyDown={(event) => this.keyPressImage(event, "-")} onClick={this.imagePrevious}></img>
							</div> : null
						: null}
					</div>
				}
			</div>
		</div>
	}
};

export default CartProduct;