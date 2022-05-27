import React from "react";
import CartProduct from "./CartProduct.js";

class CartPage extends React.Component {
	
	cartRender = () => { //Renders individual products in cart.
		let products = []
		const cart = this.props.cart;
		for (let x = 0; x < cart.length; x++) {
			products.push(<CartProduct {...this.props} product={cart[x]} key={cart[x].id} parent="cart-page" />);
		};
		return products;
	};
	
	taxCalculation = () => { //Calculates and returns a provided tax rate of the cart total (in this case 21%).
		const total = this.props.cartTotalHandler();
		let tax = (total / 100) * 21;
		return tax.toFixed(2);
	};
	
	render() {
		return <div className="cart-page">
			<div className="cart-page-title">CART</div>
			<div className="cart-page-product-container">
				{this.cartRender()}
			</div>
			<div className="cart-page-total-container">
				<div className="cart-page-total">
					<span className="cart-page-total-title">Tax 21%:</span>
					<span className="cart-page-total-title">Quantity:</span>
					<span className="cart-page-total-title">Total:</span>
				</div>
				<div className="cart-page-total">
					<span className="cart-page-total-amount">
						{this.props.symbol}{this.taxCalculation()}
					</span>
					<span className="cart-page-total-amount">
						{this.props.cartQuantity}
					</span>
					<span className="cart-page-total-amount">
						{this.props.symbol}{this.props.cartTotalHandler()}
					</span>
				</div>
			</div>
			<div className="cart-page-button">
				<input type="button" value="ORDER" className="cart-page-order-button" tabIndex={1}></input>
			</div>
		</div>
	};
};

export default CartPage;