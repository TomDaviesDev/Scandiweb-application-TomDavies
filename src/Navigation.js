import React from "react";

class Navigation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			categoriesQuery: []
		};
		this.categoriesQuery();
	};
	
	categoriesQuery = async () => {
		const res = await fetch('http://localhost:4000/', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				query: `{
					categories {
						name
					}
				}`
			})
		});
		const res_1 = await res.json();
		this.setState({
			categoriesQuery: res_1.data.categories.map(category => category.name.toUpperCase())
		});
	};
	
	navigationRender = () => { //Controls displaying of Navigation categories.
		let namesDisplay = [];
		const names = this.state.categoriesQuery;
		for (let x = 0; x < names.length; x++) {
			if (names[x] === this.props.category) {
				namesDisplay.push(<div className="category-name active" aria-label={names[x] + " categories button"} tabIndex="1" key={names[x]} onKeyDown={(event) => this.keyPress(event, names[x])} onClick={this.props.page !== "category" ? () => this.props.categoryUpdateHandler(names[x]) : null}>{names[x]}</div>);
			} else {
				namesDisplay.push(<div className="category-name" aria-label={names[x] + " categories button"} tabIndex="1" key={names[x]} onKeyDown={(event) => this.keyPress(event, names[x])} onClick={() => this.props.categoryUpdateHandler(names[x])}>{names[x]}</div>);
			};
		};
		return namesDisplay;
	};
	
	keyPress = (event, names) => { //Applies onClick effect if the Enter key is pressed for accessibility purposes.
		if (event.key === "Enter") {
			this.props.categoryUpdateHandler(names);
		};
	};
	
	render() {
		return <div id="navigation">
			{this.navigationRender()}
		</div>
	}
};

export default Navigation;