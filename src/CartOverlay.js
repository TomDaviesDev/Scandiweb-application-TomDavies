import React from "react";
import CartProduct from "./CartProduct.js";

class CartOverlay extends React.Component {
	
	cartRender = () => { //Renders individual products in cart.
		let products = []
		const cart = this.props.cart;
		for (let x = 0; x < cart.length; x++) {
			products.push(<CartProduct {...this.props} product={cart[x]} key={cart[x].id} parent="cart-overlay" />);
		};
		return products;
	};
	
	cartPage = () => { //Navigates to cart page.
		this.props.pageUpdateHandler("cart");
		this.props.update();
	};
	
	render() {
		return <div className="header-cart-container">
			<div className="cart-overlay">
				{this.props.cartQuantity > 0 ? <div className="cart-overlay-children-container">
					<div className="cart-overlay-title">
						<span className="cart-overlay-title-label">My Bag</span>
						<span className="cart-overlay-title-count">, {this.props.cartQuantity} items</span>
					</div>
					<div className="cart-overlay-product-container">
						{this.cartRender()}
					</div>
					<div className="cart-overlay-total">
						<span className="cart-overlay-total-title">Total</span>
						<span className="cart-overlay-total-amount">
							{this.props.symbol}{this.props.cartTotalHandler()}
						</span>
					</div>
					<div className="cart-overlay-buttons">
						<input type="button" value="VIEW BAG" className="cart-overlay-view-bag-button" tabIndex={1} onClick={this.cartPage}></input>
						<input type="button" value="CHECK OUT" className="cart-overlay-check-out-button" tabIndex={1}></input>
					</div>
				</div> : <div className="cart-overlay-empty">
					Your cart is empty.
				</div>}
			</div>
		</div>
	};
};

export default CartOverlay;