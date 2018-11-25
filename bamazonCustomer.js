// required dependencies
var inquirer = require('inquirer');
var mysql = require('mysql');

// define MySQL connection params
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'password',
	database: 'Bamazon'
});

// only positive integers for user inputs
function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Enter a whole non-zero number.';
	}
}

// prompts user to input purchase details
function promptUser() {
	
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Enter Item ID for purchase.',
			validate: validateInput,
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many?',
			validate: validateInput,
			filter: Number
		}
	]).then(function(input) {
		console.log('Customer has selected: \n    item_id = '  + input.item_id + '\n    quantity = ' + input.quantity);

		var item = input.item_id;
		var quantity = input.quantity;

		
		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {item_id: item}, function(err, data) {
			if (err) throw err;

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				displayInv();

			} else {
				var productData = data[0];

				if (quantity <= productData.stock_quantity) {
					console.log('This product is in stock. Currently placing order...');

					var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;

					// update inv
					connection.query(updateQueryStr, function(err, data) {
						if (err) throw err;

						console.log('Your order has been placed. The total is $' + productData.price * quantity);
						console.log('Thank you for shopping with Bamazon.');
						console.log("\n---------------------------------------------------------------------\n");

						// end db connection
						connection.end();
					})
				} else {
					console.log('There is not enough product in stock for you order.');
					console.log('Please modify your order.');
					console.log("\n---------------------------------------------------------------------\n");

					displayInv();
				}
			}
		})
	})
}

// retrieves current inv from db and outputs to console
function displayInv() {
	

	// construct db query string
	queryStr = 'SELECT * FROM products';

	// make db query
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log('Existing Inventory: ');
		console.log('...................\n');

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].item_id + '  //  ';
			strOut += 'Product Name: ' + data[i].product_name + '  //  ';
			strOut += 'Department: ' + data[i].department_name + '  //  ';
			strOut += 'Price: $' + data[i].price + '\n';

			console.log(strOut);
		}

	  	console.log("---------------------------------------------------------------------\n");

	  	
	  	promptUser();
	})
}

function runBamazon() {
	
	displayInv();
}

// run app logic
runBamazon();