import React from "react";
import CurrencySwitcher from "./CurrencySwitcher.js";
import CartIcon from "./CartIcon.js";

class Actions extends React.Component {
	
	render() {
		return <div id="actions">
			<CurrencySwitcher currencyUpdateHandler={this.props.currencyUpdateHandler} {...this.props} />
			<CartIcon {...this.props} />
		</div>
	}
};

export default Actions;