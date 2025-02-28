const greetingsController = require("../controllers/greetings.controller");
const productsController = require("../controllers/products.controller");
const usersController = require("../controllers/users.controller");

const routes = {
  "/": greetingsController.getGreeting,
  "/products": (req, res) => {
    if (req.method === "GET") productsController.getProducts(req, res);
    else if (req.method === "POST") productsController.createProduct(req, res);
    else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Método no permitido" }));
    }
  },
  "/product/:id": (req, res, id) => {
    if (req.method === "GET") productsController.getProductById(req, res, id);
    else if (req.method === "PUT")
      productsController.updateProduct(req, res, id);
    else if (req.method === "DELETE")
      productsController.deleteProduct(req, res, id);
    else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Método no permitido" }));
    }
  },
  "/generate-users": (req, res, count) => {
    if (req.method === "GET")
      usersController.generateUsersFile(req, res, count);
    else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "method not allowed" }));
    }
  },
  "/users": (req, res, withStream) => {
    if (req.method === "GET") usersController.getUSers(req, res, withStream);
    else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Method not allowed" }));
    }
  },
};

const handleRequest = (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const pathParts = pathname.split("/").filter(Boolean);
  const withStream = parsedUrl.searchParams.get("with-stream") === "true";
  const count = parsedUrl.searchParams.get("count") || 1000;

  if (pathname === "/") {
    routes["/"](req, res);
  } else if (pathParts[0] === "products" && pathParts.length === 1) {
    routes["/products"](req, res);
  } else if (pathParts[0] === "products" && pathParts.length === 2) {
    const id = parseInt(pathParts[1]);
    routes["/product/:id"](req, res, id);
  } else if (pathParts[0] === "generate-users" && pathParts.length === 1) {
    routes["/generate-users"](req, res, count);
  } else if (pathParts[0] === "users" && pathParts.length === 1) {
    routes["/users"](req, res, withStream);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
};

module.exports = { routes, handleRequest };
