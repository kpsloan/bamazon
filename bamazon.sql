-- Create a MySQL Database called `bamazon` --
CREATE DATABASE Bamazon;
USE Bamazon;

-- Then create a Table inside of that database called `products` --
CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30) NOT NULL,
	department_name VARCHAR(20) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INTEGER(11) NOT NULL,
	PRIMARY KEY (item_id)
);

-- The products table should have each of the following columns: --
-- item_id (unique id for each product) --
-- product_name (Name of product) --
-- department_name --
-- price (cost to customer) --
-- stock_quantity (how much of the product is available in stores) --
INSERT INTO products (product_name, department_name, price, stock_quantity)


-- Populate this database with around 10 different products --
VALUES  ('Ziploc Sandwich Bags', 'Grocery', 3.99, 816),
		('Almond Breeze Almond Milk', 'Grocery', 4.50, 412),
        ('Crest Toothpaste', 'Pharmacy', 4.00, 630),
		('Cosmic Catnip', 'Pet', 5.25, 213),
		('Motrin', 'Pharmacy', 6.95, 549),
        ('Charmin Ultra Toilet Paper', 'Grocery', 16.98, 774),
        ('Bounty Paper Towels', 'Grocery', 4.25, 625),
		('Haagen Dazs Ice Cream', 'Grocery', 3.25, 369),
        ('Honey Crisp Apples', 'Produce', 0.40, 1537),
        ('Blue Buffalo Wet Cat Food', 'Pet', 22.50, 204),
		('Chiquita Organic Banana', 'Produce', 0.30, 11800),
		('Natures Own Lemonade', 'Grocery', 4.25, 337);