import React from "react";
import { Markup } from 'interweave';
import { productQuery } from "./queries";

class ProductDescription extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product: {},
			selectedImage: "",
			selectedAttributes: []
		};
		this.productSetup();
	};
	
	productSetup = async () => {
		const res_1 = await productQuery(this.props.product);
		this.setState({
			product: res_1.data.product,
			selectedImage: res_1.data.product.gallery[0]
		}, this.initAttributes);
	};
	
	initAttributes = () => { //Sets up initial template for selectedAttributes state, ensuring the correct amount of attributes are expected.
		const attributes = this.state.product.attributes;
		let attributesState = [];
		for (let x = 0; x < attributes.length; x++) {
			attributesState.push({name: attributes[x].id, value: undefined});
		};
		this.setState({
			selectedAttributes: attributesState
		});
	};
	
	previewGalleryRender = () => { //Handles rendering of preview gallery.
		const productGallery = this.state.product.gallery;
		let previewGallery = [];
		if (productGallery) {
			for (let x = 0; x < productGallery.length; x++) {
				if (productGallery[x]) {
					previewGallery.push(<div key={productGallery[x]}>
						<img src={productGallery[x]} alt="Preview of item" className="preview-gallery-image" tabIndex={1} key={x} onKeyDown={(event) => this.keyPressGallery(event, productGallery[x])} onClick={() => this.imageUpdate(productGallery[x])}></img>
					</div>);
				};
			};
			return previewGallery
		};
	};
	
	imageUpdate = (src) => { //Updates selected preview image.
		this.setState({
			selectedImage: src
		});
	};
	
	attributeRender = () => { //Handles rendering of title and container for each attribute.
		const att = this.state.product.attributes;
		let display = [];
		if (att) {
			for (let x = 0; x < att.length; x++) {
				display.push(<div className="product-attribute-title" key={att[x].name+" title"}>{att[x].name.toUpperCase()}:</div>);
				display.push(<div className="product-attribute" id={att[x].id} key={att[x].id}>
					{this.attributeItemRender(att[x])}
				</div>)
			};
		};
		return display;
	};
	
	attributeItemRender = (att) => { //Handles rendering of different types of attribute options.
		let itemDisplay = [];
		if (att.type === "swatch") { //For accessibility purposes, this should probably have the colour names written as well, but they're not in the design so I've not included them.
			for (let i = 0; i < att.items.length; i++) {
				if (att.items[i].value === "#FFFFFF") {
					itemDisplay.push(<div className="product-attribute-swatch white" id={att.items[i].id} tabIndex={1} key={att.items[i].id} onKeyDown={(event) => this.keyPressAttribute(event, att.id, att.items[i].id)} onClick={(event) => this.attributeSelect(att.id, att.items[i].id, event)} style={{backgroundColor: att.items[i].value}} ></div>);
				} else {
					itemDisplay.push(<div className="product-attribute-swatch" id={att.items[i].id} tabIndex={1} key={att.items[i].id} onKeyDown={(event) => this.keyPressAttribute(event, att.id, att.items[i].id)} onClick={(event) => this.attributeSelect(att.id, att.items[i].id, event)} style={{backgroundColor: att.items[i].value}} ></div>);
				};
			};
		} else {
			for (let i = 0; i < att.items.length; i++) {
				itemDisplay.push(<div className="product-attribute-text" id={att.items[i].id} tabIndex={1} key={att.items[i].id} onKeyDown={(event) => this.keyPressAttribute(event, att.id, att.items[i].id)} onClick={(event) => this.attributeSelect(att.id, att.items[i].id, event)}>{att.items[i].value}</div>);
			};
		};
		return itemDisplay;
	};
	
	keyPressAttribute = (event, att, value) => { //Applies onClick effect if the Enter key is pressed for accessibility purposes when selecting an attribute.
		if (event.key === "Enter") {
			this.attributeSelect(att, value, event);
		};
	};
	
	keyPressGallery = (event, image) => { //Applies onClick effect if the Enter key is pressed for accessibility purposes when selecting a picture in the gallery.
		if (event.key === "Enter") {
			this.imageUpdate(image);
		};
	};
	
	attributeSelect = (att, value, event) => { //Updates selected attribute on page and updates state.
		const activeElements = event.target.parentElement.getElementsByClassName("selected-attribute");
		for (let x = 0; x < activeElements.length; x++) {
			activeElements[x].classList.remove("selected-attribute");
		};
		event.target.classList.add("selected-attribute");
		const original = this.state.selectedAttributes;
		let attributes = original.map(object => ({...object}));
		const index = attributes.findIndex(element => element.name === att);
		attributes[index].value = value;
		this.setState({
			selectedAttributes: attributes
		});
	};
	
	priceRender = () => { //Handles rendering the correct price based on the user selected currency.
		const selectedCurrency = this.props.currency; 
		const prices = this.state.product.prices;
		if (prices) {
			const correctPrice = prices.find(price => price.currency.label === selectedCurrency);
			const amount = correctPrice.amount;
			return amount.toFixed(2);
		};
	};
	
	cartButtonRender = () => { //Handles conditional rendering of the Add to Cart button.
		if (this.state.product.inStock) {
			const attributes = this.state.selectedAttributes;
			if (attributes.some(att => att.value === undefined)) {
				return <input type="button" className="product-description-add-to-cart-button disabled" value="ADD TO CART" tabIndex={1}></input>
			} else {
				return <input type="button" className="product-description-add-to-cart-button" value="ADD TO CART" tabIndex={1} onClick={() => this.addToCart()}></input>
			};
		} else {
			return <input type="button" className="product-description-add-to-cart-button disabled" value="OUT OF STOCK" tabIndex={1}></input>
		};
	};
	
	addToCart = () => { //Passes properties up to App to be added to cart, and resets to the category page.
		const id = this.state.product.id;
		const brand = this.state.product.brand;
		const name = this.state.product.name;
		const attributes = this.state.selectedAttributes;
		this.props.cartUpdateHandler(id, brand, name, attributes);
	};
	
	render() {
		return <div className="product-description-page">
			<div className="product-description-preview-gallery">
				{this.previewGalleryRender()}
			</div>
			{this.state.product.inStock === true ? 
				<div className="product-description-preview-image-div">
					<img src={this.state.selectedImage} alt={this.state.product.name} className="preview-image"></img>
				</div>
				:
				<div className="product-description-preview-image-div">
					<img src={this.state.selectedImage} alt={this.state.product.name} className="preview-image out-of-stock"></img>
					<div className="preview-image-out-of-stock-text-div">
						<div className="preview-image-out-of-stock-text">OUT OF STOCK</div>
					</div>
				</div>
			}
			<div className="product-description-div">
				<div className="product-description-brand">
					{this.state.product.brand}
				</div>
				<div className="product-description-name">
					{this.state.product.name}
				</div>
				<div>
					{this.attributeRender()}
				</div>
				<div>
					<div className="product-description-price-title">PRICE: </div>
					<div className="product-description-price">
						{this.props.symbol}
						{this.priceRender()}
					</div>
				</div>
				<div>
					{this.cartButtonRender()}
				</div>
				<div className="product-description-text" id="description" tabIndex={1}>
					<Markup content={this.state.product.description} />
				</div>
			</div>
		</div>
	}
};

export default ProductDescription;