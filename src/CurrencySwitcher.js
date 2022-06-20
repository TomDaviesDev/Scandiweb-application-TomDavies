import React from "react";
import downArrow from "./images/down-arrow.png";
import upArrow from "./images/up-arrow.png";
import { pricesQuery } from "./queries";

class CurrencySwitcher extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
			pricesQuery: []
		};
		this.pricesSetup();
	};
	
	pricesSetup = async () => {
		const res_1 = await pricesQuery();
		this.setState({
			pricesQuery: res_1.data.category.products.map(product => product.prices)[0]
		});
	};
	
	currencyOptions = () => { //Compiles and displays the list of available currencies.
		let priceList = []
		let priceListDisplay = [];
		const prices = JSON.parse(JSON.stringify(this.state.pricesQuery));
		priceList.push(prices.map(price => price.currency).map(obj => Object.values(obj)));
		priceList = priceList[0];
		for (let x = 0; x < priceList.length; x++) {
			let priceListSection = [];
			priceListSection.push(priceList[x][1] + " ");
			priceListSection.push(priceList[x][0]);
			priceListDisplay.push(<div className="price-list-div" data-label={priceList[x][0]} data-symbol={priceList[x][1]} key={priceList[x][0]} tabIndex="1" onKeyDown={(event) => this.currencyKeyPress(event)} onClick={this.currencyClick}>{priceListSection}</div>);
		}
		return priceListDisplay;
	};
	
	displayRender = () => { //Controls rendering of elements of the Currency Switcher.
		if (this.state.active === false) { //Switcher off
			return <div id="currency-switcher" tabIndex="1" onKeyDown={(event) => this.keyPress(event)} onClick={() => this.update(true)}>
				<div>
					{this.props.symbol}
				</div>
				<div>
					<img id="currency-switcher-arrow" src={downArrow} alt="Currency switcher"></img>
				</div>
			</div>
		} else { //Switcher on
			return <div>
				<div id="currency-switcher" tabIndex="1" onKeyDown={(event) => this.keyPress(event)} onClick={() => this.update(false)}>
					<div>
						{this.props.symbol}
					</div>
					<div>
						<img id="currency-switcher-arrow" src={upArrow} alt="Currency switcher"></img>
					</div>
				</div>
				<div className="currency-select" id="currency-select" tabIndex="1" onBlur={(event) => this.blurSelector(event)}>
					{this.currencyOptions()}
				</div>
			</div>
		};
	};
	
	keyPress = (event) => { //Applies onClick effect if the Enter key is pressed for accessibility purposes when selecting the currency switcher.
		if (event.key === "Enter") {
			if(this.state.active === true) {
				this.update(false);
			} else {
				this.update(true);
			};
		};
	};
	
	currencyKeyPress = (event) => { //Applies onClick effect if the Enter key is pressed for accessibility purposes when selecting a currency to change to.
		if (event.key === "Enter") {
			this.currencyClick(event);
		};
	};
	
	currencyClick = (event) => { //Updates the active currency label and symbol.
		this.props.currencyUpdateHandler(event.target.dataset.label, event.target.dataset.symbol);
		this.update(false);
	};
	
	blurSelector = (event) => { //Closes the currency selector when clicking or tabbing outside it.
		if (!event.currentTarget.contains(event.relatedTarget)) {
			this.update(false);
		};
	};
	
	update = (bool) => { //Toggles the Currency Switcher on and off.
		this.setState({
			active: bool
		}, function() {
			if (this.state.active === true) {
				document.getElementById("currency-select").focus();
			};
		});
	};
	
	render() {
		return this.displayRender()
	}
};

export default CurrencySwitcher;