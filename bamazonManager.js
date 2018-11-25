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

// present menu options to manager
function promptManager() {
	
	inquirer.prompt([
		{
			type: 'list',
			name: 'option',
			message: 'Please select an option:',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
			filter: function (val) {
				if (val === 'View Products for Sale') {
					return 'sale';
				} else if (val === 'View Low Inventory') {
					return 'lowInventory';
				} else if (val === 'Add to Inventory') {
					return 'addInventory';
				} else if (val === 'Add New Product') {
					return 'newProduct';
				} else {
					console.log('ERROR: Unsupported operation!');
					exit(1);
				}
			}
		}
	]).then(function(input) {
		if (input.option ==='sale') {
			displayInv();
		} else if (input.option === 'lowInventory') {
			displayLowInv();
		} else if (input.option === 'addInventory') {
			addInv();
		} else if (input.option === 'newProduct') {
			createNew();
		} else {
			console.log('ERROR: Unsupported operation!');
			exit(1);
		}
	})
}

// retrieve current inv from db and output to console
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
			strOut += 'Price: $' + data[i].price + '  //  ';
			strOut += 'Quantity: ' + data[i].stock_quantity + '\n';

			console.log(strOut);
		}

	  	console.log("---------------------------------------------------------------------\n");

		// end db connection
		connection.end();
	})
}

// display list of products with qty < 100
function displayLowInv() {
	
	// construct db query string
	queryStr = 'SELECT * FROM products WHERE stock_quantity < 100';

	// make db query
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log('Low Inventory Items (below 100): ');
		console.log('................................\n');

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].item_id + '  //  ';
			strOut += 'Product Name: ' + data[i].product_name + '  //  ';
			strOut += 'Department: ' + data[i].department_name + '  //  ';
			strOut += 'Price: $' + data[i].price + '  //  ';
			strOut += 'Quantity: ' + data[i].stock_quantity + '\n';

			console.log(strOut);
		}

	  	console.log("---------------------------------------------------------------------\n");

		// End db connection
		connection.end();
	})
}

// only positive integers for user inputs
function validateInteger(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Enter a whole non-zero number.';
	}
}

// only positive integers for user inputs
function validateNumeric(value) {
	var number = (typeof parseFloat(value)) === 'number';
	var positive = parseFloat(value) > 0;

	if (number && positive) {
		return true;
	} else {
		return 'Enter a positive number for unit price.'
	}
}

// add additional qty to existing item
function addInv() {
	
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Enter Item ID for stock count update.',
			validate: validateInteger,
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many to add to current stock?',
			validate: validateInteger,
			filter: Number
		}
	]).then(function(input) {
		
		var item = input.item_id;
		var addQuantity = input.quantity;

		// query db to confirm given item ID exists and determine current stock count
		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {item_id: item}, function(err, data) {
			if (err) throw err;

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please choose a valid Item ID.');
				addInv();

			} else {
				var productData = data[0];

				console.log('Updating Inventory...');

				var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity + addQuantity) + ' WHERE item_id = ' + item;

				// update inv
				connection.query(updateQueryStr, function(err, data) {
					if (err) throw err;

					console.log('Stock count for Item ID ' + item + ' has been updated to ' + (productData.stock_quantity + addQuantity) + '.');
					console.log("\n---------------------------------------------------------------------\n");

					// end dbconnection
					connection.end();
				})
			}
		})
	})
}

// guide user adding new product to inv
function createNew() {

	inquirer.prompt([
		{
			type: 'input',
			name: 'product_name',
			message: 'Enter new product name.',
		},
		{
			type: 'input',
			name: 'department_name',
			message: 'Which department will house new product?',
		},
		{
			type: 'input',
			name: 'price',
			message: 'What is price per unit?',
			validate: validateNumeric
		},
		{
			type: 'input',
			name: 'stock_quantity',
			message: 'How many items are in stock?',
			validate: validateInteger
		}
	]).then(function(input) {

		console.log('Adding New Item: \n    product_name = ' + input.product_name + '\n' +  
									   '    department_name = ' + input.department_name + '\n' +  
									   '    price = ' + input.price + '\n' +  
									   '    stock_quantity = ' + input.stock_quantity);

		// create insertion query string
		var queryStr = 'INSERT INTO products SET ?';

		// add new product to db
		connection.query(queryStr, input, function (error, results, fields) {
			if (error) throw error;

			console.log('New product added to inventory as Item ID ' + results.insertId + '.');
			console.log("\n---------------------------------------------------------------------\n");

			// end db connection
			connection.end();
		});
	})
}

function runBamazon() {
	
	promptManager();
}

// run app logic
runBamazon();