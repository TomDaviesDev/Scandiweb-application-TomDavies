import React from "react";
import logo from "./a-logo.png";
import Navigation from "./Navigation.js";
import Actions from "./Actions.js";

class Header extends React.Component {
	
	render() {
		return <div id="header">
			<Navigation {...this.props} />
			<div className="logo-div"><img id="logo" src={logo} alt="Logo" /></div>
			<Actions {...this.props} />
		</div>
	}
};

export default Header;