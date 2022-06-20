import React from "react";
import Product from "./Product.js";
import { productAmountQuery } from "./queries.js";

class Category extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			productAmountQuery: []
		};
		this.productAmountSetup();
	};
	
	productAmountSetup = async () => {
		const res_1 = await productAmountQuery();
		this.setState({
			productAmountQuery: res_1.data.category.products
		});
	};
	
	categoryRender = () => { //Handles rendering of products within current category.
		let productList = [];
		let products;
		if (this.props.category !== "ALL") {
			products = JSON.parse(JSON.stringify((this.state.productAmountQuery.filter(product => product.category === this.props.category.toLowerCase()))));
		} else {
			products = JSON.parse(JSON.stringify((this.state.productAmountQuery)));
		};
		for (let x = 0; x < products.length; x++) {
			productList.push(<Product key={products[x].id} productID={products[x].id} image={products[x].gallery[0]} name={products[x].name} inStock={products[x].inStock} brand={products[x].brand} prices={products[x].prices} attributes={products[x].attributes} {...this.props} />);
		};
		return productList;
	};
	
	render() {
		return <div className="category-page">
			<div className="category-container">
				<div className="category-title-container">
					<h2 className="category-title">{this.props.category}</h2>
				</div>
				{this.categoryRender()}
			</div>
		</div>
	}
};

export default Category;