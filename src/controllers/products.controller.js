const formatter = require('../utils/formatter');

const products = [];
const header = {
    'Content-Type': 'application/json'
};

exports.getProducts = (req, res) => {
    res.writeHead(200, header);
    res.end(formatter.formatResponse(products));
}

exports.getProductById = (req, res, id) => {
    const product = products.find(product => product.id === id);
    
    if(product) {
        res.writeHead(200, header);
        res.end(formatter.formatResponse(product));
    } else {
        res.writeHead(404, header);
        res.end(formatter.formatResponse({ message: 'Product not found' }));
    }
}

exports.createProduct = (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const { name, price } = formatter.parse(body);
            const newProduct = { id: products.length + 1, name, price };
            products.push(newProduct);


            res.writeHead(201, header);
            res.end(formatter.formatResponse(newProduct));
        } catch (error) {
            res.writeHead(400, header);
            res.end(formatter.formatResponse({ message: 'invalid data' }));
        }
    })
}

exports.updateProduct = (req, res, id) => {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    })

    req.on('end', () => {
        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex !== -1) {
            const { name, price } = formatter.parse(body);
            products[productIndex] = { id, name, price };

            res.writeHead(200, { 'Content-Type': 'application/json'});
            res.end(formatter.formatResponse(products[productIndex]));
        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "product not found" }));
        }
    })
}

exports.deleteProduct = (req, res, id) => {
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
        products.splice(productIndex, 1);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "product deleted" }));
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "product not found" }));
    }
}