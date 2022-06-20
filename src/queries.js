export const initialStateQuery = async () => { //App.js
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
	return res_1;
};

export const categoriesQuery = async () => { //Navigation.js
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
	return res_1;
};

export const productAmountQuery = async () => { //Category.js
	const res = await fetch('http://localhost:4000/', {
		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			query: `{
				category {
					products {
						id
						name
						inStock
						gallery
						attributes {
							id
							name
							type
							items {
								displayValue
								value
								id
							}
						}
						category
						prices {
							currency {
								label
								symbol
							}
							amount
						}
						brand
					}
				}
			}`
		})
	});
	const res_1 = await res.json();
	return res_1;
};

export const productQuery = async (product) => { //ProductDescription.js
	const query = `
		query($id: String!) {
			product (id: $id) {
				id
				name
				inStock
				gallery
				description
				attributes {
					id
					name
					type
					items {
						displayValue
						value
						id
					}
				}
				prices {
					currency {
						label
						symbol
					}
					amount
				}
				brand
			}
		}
	`;
	const res = await fetch('http://localhost:4000/', {
		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			query,
			variables: {
				id: product
			}
		})
	});
	const res_1 = await res.json();
	return res_1;
};

export const pricesQuery = async () => { //CurrencySwitcher.js
	const res = await fetch('http://localhost:4000/', {
		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			query: `{
				category {
					products {
						prices {
							currency {
								label
								symbol
							}
						}
					}
				}
			}`
		})
	});
	const res_1 = await res.json();
	return res_1;
};

export const cartProductQuery = async (product) => { //CartProduct.js
	const query = `
		query($id: String!) {
			product (id: $id) {
				gallery
				attributes {
					id
					name
					type
					items {
						displayValue
						value
						id
					}
				}
				prices {
					currency {
						label
						symbol
					}
					amount
				}
			}
		}
	`;
	const res = await fetch('http://localhost:4000/', {
		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			query,
			variables: {
				id: product
			}
		})
	});
	const res_1 = await res.json();
	return res_1;
};