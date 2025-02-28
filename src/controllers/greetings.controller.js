exports.getGreeting = (req, res) => {
  res.writeHead(200);
  res.end(JSON.stringify({ message: "hello" }));
};
