import React from "react";
import Header from "./Header.js";
import Category from "./Category.js"
import ProductDescription from "./ProductDescription.js";
import CartPage from "./CartPage.js";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: "category",
			category: "",
			currency: "",
			symbol: "",
			product: "",
			cart: [],
			cartQuantity: 0,
			productPrices: [],
			cartID: 1
		};
		this.initialState();
	};
	
	initialState = async () => {
		const res = await fetch('http://localhost:4000/', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				query: `{
					category {
						name
						products {
							id
							prices {
								currency {
									label
									symbol
								}
								amount
							}
						}
					}
				}`
			})
		});
		const res_1 = await res.json();
		this.setState({
			productPrices: res_1.data.category.products
		});
		//Check local storage for values. If none are found, return/set default.
		const cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
		const cartID = localStorage.getItem("cartID") ? JSON.parse(localStorage.getItem("cartID")) : 1;
		const currency = localStorage.getItem("currency") ? JSON.parse(localStorage.getItem("currency")) : res_1.data.category.products[0].prices[0].currency.label;
		const symbol = localStorage.getItem("symbol") ? JSON.parse(localStorage.getItem("symbol")) : res_1.data.category.products[0].prices[0].currency.symbol;
		const cartQuantity = localStorage.getItem("cartQuantity") ? JSON.parse(localStorage.getItem("cartQuantity")) : 0;
		const category = localStorage.getItem("category") ? JSON.parse(localStorage.getItem("category")) : res_1.data.category.name.toUpperCase();
		const page = localStorage.getItem("page") ? JSON.parse(localStorage.getItem("page")) : "category";
		const product = localStorage.getItem("product") ? JSON.parse(localStorage.getItem("product")) : "";
		this.setState({
			cart: cart,
			cartID: cartID,
			currency: currency,
			symbol: symbol,
			cartQuantity: cartQuantity,
			category: category,
			page: page,
			product: product
		});
	};
	
	currencyUpdate = (label, symbol) => { //Passed down to update the currency label and symbol state.
		this.setState({
			currency: label,
			symbol: symbol
		}, this.localStorageCurrency(label, symbol));
	};
	
	categoryUpdate = (category) => { //Passed down to update the category state.
		this.setState({
			category: category
		}, this.localStorageCategory(category));
		if (this.state.page !== "category") {
			this.setState({
				page: "category"
			}, this.localStoragePage("category"));
		};
	};
	
	pageUpdate = (page) => { //Passed down to update page state.
		this.setState({
			page: page
		}, this.localStoragePage(page));
	};
	
	productUpdate = (product) => { //Passed down to update product state.
		this.setState({
			product: product
		}, this.localStorageProduct(product));
	};
	
	cartUpdate = (id, brand, name, attributes) => { //Passed down to update shopping cart.
		const original = this.state.cart;
		const shoppingCart = original.map(object => ({...object}));
		const cartItem = {id: this.state.cartID, productID: id, brand: brand, name: name, attributes: attributes, quantity: 1};
		const filteredCart = shoppingCart.filter(item => item.productID === cartItem.productID);
		if (filteredCart.length === 0) { //New product added to cart.
			shoppingCart.push(cartItem);
			let newCartID = this.state.cartID;
			newCartID++;
			this.setState({
				cart: shoppingCart,
				cartID: newCartID
			}, this.localStorageCart(shoppingCart, newCartID));
			this.cartQuantityUpdate();
		} else { //Check if product with matching attributes is in the cart.
			const mappedCart = filteredCart.map(item => item.attributes);
			let quantityIncrease = false;
			for (let x = 0; x < mappedCart.length; x++) {
				const totalAttributes = mappedCart[x].length;
				let matches = 0;
				for (let i = 0; i < totalAttributes; i++) {
					if (mappedCart[x][i].value === attributes[i].value) {
						matches++;
						if (matches === totalAttributes) { // Matching attributes found - increase relevant product quantity.
							quantityIncrease = true;
							const index = shoppingCart.findIndex(item => item.id === filteredCart[x].id);
							shoppingCart[index].quantity++;
							this.setState({
								cart: shoppingCart,
							}, this.localStorageCart(shoppingCart, this.state.cartID));
							this.cartQuantityUpdate();
							break;
						};
					};
				};
			};
			if (!quantityIncrease) { //No matching attributes found - add new product.
				shoppingCart.push(cartItem);
				let newCartID = this.state.cartID;
				newCartID++;
				this.setState({
					cart: shoppingCart,
					cartID: newCartID
				}, this.localStorageCart(shoppingCart, newCartID));
				this.cartQuantityUpdate();
			};
		};
	};
	
	cartQuantityUpdate = (operator = "+") => { //Updates cartQuantity state when an item is added or removed.
		let cartTotal = 1;
		if (operator === "-") {
			cartTotal = -1;
		};
		this.state.cart.forEach(item => cartTotal = cartTotal + item.quantity);
		if (cartTotal > 0) {
			this.setState({
				cartQuantity: cartTotal
			}, this.localStorageCartQuantity(cartTotal));
		} else if (this.state.page === "cart") {
			this.setState({
				cartQuantity: cartTotal,
				page: "category",
				product: ""
			}, this.localStorageCartQuantity(cartTotal));
		};
	};
	
	cartItemQuantityUpdate = (id, operator) => { //Updates the quantity of individual items when changed from the cart overlay or cart page.
		const original = this.state.cart;
		const shoppingCart = original.map(object => ({...object}));
		if (operator === "+") {
			shoppingCart.find(item => item.id === id).quantity++;
			this.setState({
				cart: shoppingCart
			}, this.localStorageCart(shoppingCart, this.state.cartID));
			this.cartQuantityUpdate("+");
		} else if (operator === "-") {
			let cartItem = shoppingCart.find(item => item.id === id);
			let index = shoppingCart.findIndex(item => item.id === id);
			cartItem.quantity--;
			if (cartItem.quantity <= 0) {
				shoppingCart.splice(index, 1);
			};
			this.setState({
				cart: shoppingCart
			}, this.localStorageCart(shoppingCart, this.state.cartID));
			this.cartQuantityUpdate("-");
		};
	};
	
	cartTotalPrice = () => { //Calculates total price of items in the cart and passes down to minicart and cart view.
		const products = this.state.productPrices;
		const cart = this.state.cart;
		let total = 0;
		for (let x = 0; x < cart.length; x++) {
			const quantity = cart[x].quantity;
			const item = products.find(item => item.id === cart[x].productID);
			const price = item.prices.find(price => price.currency.label === this.state.currency).amount;
			const finalPrice = (price * quantity);
			total = total + finalPrice;
		};
		return total.toFixed(2);
	};
	
	localStorageCart = (cart, id) => { //Sets the cart to the user's local storage when it is updated.
		const localStorageCart = JSON.stringify(cart);
		const localStorageCartID = JSON.stringify(id);
		localStorage.setItem("cart", localStorageCart);
		localStorage.setItem("cartID", localStorageCartID);
	};
	
	localStorageCurrency = (label, symbol) => { //Sets the currency to the user's local storage when it is updated.
		const localStorageCurrency = JSON.stringify(label);
		const localStorageSymbol = JSON.stringify(symbol);
		localStorage.setItem("currency", localStorageCurrency);
		localStorage.setItem("symbol", localStorageSymbol);
	};
	
	localStorageCartQuantity = (quantity) => { //Sets the cart quantity to the user's local storage when it is updated.
		const localStorageCartQuantity = JSON.stringify(quantity);
		localStorage.setItem("cartQuantity", localStorageCartQuantity);
	};
	
	localStorageCategory = (category) => { //Sets the currently selected category to the user's local storage when it is updated.
		const localStorageCategory = JSON.stringify(category);
		localStorage.setItem("category", localStorageCategory);
	};
	
	localStoragePage = (page) => { //Sets the currently selected page to the user's local storage when it is updated.
		const localStoragePage = JSON.stringify(page);
		localStorage.setItem("page", localStoragePage);
	};
	
	localStorageProduct = (product) => { //Sets the currently selected product to the user's local storage when it is updated.
		const localStorageProduct = JSON.stringify(product);
		localStorage.setItem("product", localStorageProduct);
	};
	
	render() {
		return <div id="app">
			<Header {...this.state} pageUpdateHandler={this.pageUpdate} currencyUpdateHandler={this.currencyUpdate} categoryUpdateHandler={this.categoryUpdate} cartTotalHandler={this.cartTotalPrice} cartItemQuantityHandler={this.cartItemQuantityUpdate} />
			{this.state.page === "category" ? <Category {...this.state} pageUpdateHandler={this.pageUpdate} productUpdateHandler={this.productUpdate} cartUpdateHandler={this.cartUpdate} /> : 
			this.state.page === "description" ? <ProductDescription {...this.state} pageUpdateHandler={this.pageUpdate} productUpdateHandler={this.productUpdate} cartUpdateHandler={this.cartUpdate} /> : 
			this.state.page === "cart" ? <CartPage {...this.state} cartUpdateHandler={this.cartUpdate} cartTotalHandler={this.cartTotalPrice} cartItemQuantityHandler={this.cartItemQuantityUpdate} /> : null}
		</div>
	};
};

export default App;