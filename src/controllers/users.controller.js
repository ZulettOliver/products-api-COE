const fs = require("fs");
const path = require("path");
const formatter = require("../utils/formatter");
const crypto = require("crypto");

const header = { "Content-Type": "application/json" };
const usersFilePath = path.join(__dirname, "../../data/users.json");

const getUSers = (req, res, withStream) => {
  if (withStream) {
    const readStream = fs.createReadStream(usersFilePath, { encoding: "utf8" });

    res.writeHead(200, header);

    readStream.pipe(res);

    readStream.on("error", (err) => {
      res.writeHead(500, header);
      res.end(formatter.formatResponse({ error: "error reading users" }));
    });
  } else {
    fs.readFile(usersFilePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, header);
        res.end(formatter.formatResponse({ error: "error reading users" }));
        return;
      }

      res.writeHead(200, header);
      res.end(data);
    });
  }
};

const generateUsersFile = (req, res, count) => {
  const names = [
    "Juan",
    "Ana",
    "Luis",
    "María",
    "Carlos",
    "Sofía",
    "Pedro",
    "Elena",
  ];
  const surnames = [
    "García",
    "López",
    "Martínez",
    "Fernández",
    "Pérez",
    "González",
  ];

  const generateUser = () => ({
    id: crypto.randomUUID(),
    name: names[Math.floor(Math.random() * names.length)],
    surname: surnames[Math.floor(Math.random() * surnames.length)],
  });

  fs.access(usersFilePath, fs.constants.F_OK, (err) => {
    if (!err)
      return res.end(
        formatter.formatResponse({ message: "File already exists" })
      );

    const writeStream = fs.createWriteStream(usersFilePath, {
      encoding: "utf-8",
    });

    writeStream.write("[\n");
    for (let i = 0; i < count; i++) {
      const user = formatter.formatResponse(generateUser());
      writeStream.write(user + (i < count - 1 ? ",\n" : "\n"));
    }
    writeStream.write("]\n");

    writeStream.end();

    writeStream.on("finish", () => {
      res.writeHead(201, header);
      res.end(formatter.formatResponse({ message: "users file created" }));
    });

    writeStream.on("error", () => {
      res.writeHead(500, header);
      res.end(
        formatter.formatResponse({ message: "users file already exists" })
      );
    });
  });
};

module.exports = {
  getUSers,
  generateUsersFile,
};
