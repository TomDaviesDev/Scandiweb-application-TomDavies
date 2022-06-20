import React from "react";
import cartLogo from "./images/empty-cart.png";
import CartOverlay from "./CartOverlay.js";

class CartIcon extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false
		};
	};
	
	update = () => { //Toggles the cart overlay on and off and sets/removes event listeners on other Header elements to toggle the overlay off when they are clicked or tabbed to.
		const categories = document.getElementsByClassName("category-name");
		const currencySwitcher = document.getElementById("currency-switcher");
		if (this.state.active) {
			this.setState({
				active: false
			});
			currencySwitcher.removeEventListener("click", this.update);
			currencySwitcher.removeEventListener("focus", this.update);
			for (let x = 0; x < categories.length; x++) {
				categories[x].removeEventListener("click", this.update);
				categories[x].removeEventListener("focus", this.update);
			};
		} else {
			this.setState({
				active: true
			});
			currencySwitcher.addEventListener("click", this.update);
			currencySwitcher.addEventListener("focus", this.update);
			for (let x = 0; x < categories.length; x++) {
				categories[x].addEventListener("click", this.update);
				categories[x].addEventListener("focus", this.update);
			};
		};
	};
	
	keyPress = (event) => { //Applies onClick effect if the Enter key is pressed for accessibility purposes when selecting the cart icon.
		if (event.key === "Enter") {
			this.update();
		};
	};
	
	render() {
		return <div id="header-cart-container">
			<img id="shopping-cart-icon" src={cartLogo} alt="shopping-cart" tabIndex={1} onKeyDown={(event) => this.keyPress(event)} onClick={() => this.update()}></img>
			{this.props.cartQuantity > 0 ? <div id="cart-quantity" onClick={() => this.update()}>{this.props.cartQuantity}</div> : null}
			{this.state.active ? <CartOverlay {...this.state} {...this.props} update={this.update} /> : null}
			{this.state.active ? <div className="cart-overlay-background" tabIndex={1} onFocus={this.update} onClick={this.update}></div> : null} 
			{/* Closing the overlay when moused over a product does not currently show the add to cart button */}
		</div>
	};
};

export default CartIcon;