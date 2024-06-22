// Initialize products and bill history from local storage, or empty arrays if not present
const products = JSON.parse(localStorage.getItem('products')) || [];
const billHistory = JSON.parse(localStorage.getItem('billHistory')) || [];

// Function to add product data to the products array
function addProductData() {
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const keywords = document.getElementById('product-keywords').value.split(',').map(kw => kw.trim().toLowerCase());

    if (name && price && keywords.length) {
        products.push({ name, price, keywords });
        localStorage.setItem('products', JSON.stringify(products));
        alert('Product added successfully!');
        document.getElementById('product-name').value = '';
        document.getElementById('product-price').value = '';
        document.getElementById('product-keywords').value = '';
    } else {
        alert('Please fill in all fields.');
    }
}

let totalAmount = 0;
const billItems = [];

// Function to search for a product by keyword
function searchProduct() {
    const keyword = document.getElementById('keyword').value.toLowerCase();
    const productNameElement = document.getElementById('product-name-display');
    const productPriceElement = document.getElementById('product-price-display');
    
    const product = products.find(p => p.keywords.includes(keyword));
    
    if (product) {
        productNameElement.textContent = `Product Name: ${product.name}`;
        productPriceElement.textContent = `Price: PKR ${product.price}`;
    } else {
        productNameElement.textContent = "Product not found";
        productPriceElement.textContent = "";
    }
}

// Function to add a product to the bill
function addProduct() {
    const keyword = document.getElementById('keyword').value.toLowerCase();
    const product = products.find(p => p.keywords.includes(keyword));
    
    if (product) {
        billItems.push(product);
        updateBill();
        document.getElementById('keyword').value = ""; // Clear the input field after adding
    } else {
        alert("Product not found");
    }
}

// Function to update the bill section with current bill items and total amount
function updateBill() {
    const billItemsElement = document.getElementById("bill-items");
    const totalAmountElement = document.getElementById("total-amount");
    billItemsElement.innerHTML = "";
    totalAmount = 0;
    
    billItems.forEach(item => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const priceCell = document.createElement("td");
        
        nameCell.textContent = item.name;
        priceCell.textContent = `PKR ${item.price}`;
        
        row.appendChild(nameCell);
        row.appendChild(priceCell);
        billItemsElement.appendChild(row);
        
        totalAmount += item.price;
    });

    totalAmountElement.textContent = `Total Amount: PKR ${totalAmount}`;
}

// Function to print the current bill
function printBill() {
    saveBillToHistory();
    window.print();
}

// Function to reset the current bill
function resetBill() {
    billItems.length = 0;
    updateBill();
}

// Function to save the current bill to the bill history
function saveBillToHistory() {
    billHistory.push({ date: new Date().toLocaleString(), amount: totalAmount });
    localStorage.setItem('billHistory', JSON.stringify(billHistory));
}

// Function to handle key presses, allowing Enter key to trigger actions in relevant sections
function handleKeyPress(event, section) {
    if (event.key === 'Enter') {
        if (section === 'data-entry') {
            addProductData();
        } else if (section === 'billing') {
            addProduct();
        }
    }
}

// Attach event listeners for Enter key to relevant input fields
document.getElementById('product-name').addEventListener('keypress', event => handleKeyPress(event, 'data-entry'));
document.getElementById('product-price').addEventListener('keypress', event => handleKeyPress(event, 'data-entry'));
document.getElementById('product-keywords').addEventListener('keypress', event => handleKeyPress(event, 'data-entry'));
document.getElementById('keyword').addEventListener('keypress', event => handleKeyPress(event, 'billing'));
