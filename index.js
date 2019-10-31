// implement your API here
const express = require("express");
const db = require("./data/db.js");

const server = express();

server.listen(4000, () => {
  console.log(":::Server listening on port 4000:::");
});

// Middleware
server.use(express.json());

server.post("/api/users", (req, res) => {
  const userInfo = req.body;
  db.insert(userInfo)
    .then(user => {
      // Circle back to this logic.
      if (user) {
        res.status(201).json({ success: true, user });
      } else {
        res
          .status(400)
          .json({ errorMessage: "Please provide name and bio for the user." })
          .end();
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({
          error: "There was an error while saving the user to the database",
          err
        })
        .end();
    });
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ message: err, success: false });
    });
});

server.get("/api/users/:id", (req, res) => {
  // If the user with the specified ID is not found ? Return 404 and JSON person doesnt exist.
  const { id } = req.params;
  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json({ success: true, user });
      } else {
        res.status(404).json({ message: `I couldn't find id=${id}` });
      }
    })
    .catch(err => {
      res.status(500).json({ message: err, success: false });
    });
});

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id).then(user => {
    if (user) {
      // Original
      // res.status(204).end();

      // Returning existing users
      res.status(204);
      db.find()
        .then(users => {
          res.status(204).json(users);
        })
        .catch(err => {
          res.status(500).json({ message: err, success: false });
        });
    } else {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist" });
    }
  });
});

server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const userInfo = req.body;
  db.update(id, userInfo)
    .then(user => {
      if (user) {
        res.status(200).json({ success: true, user });
      } else {
        res
          .status(404)
          .json({ success: false, message: `ID ${id} does not exist` });
      }
    })
    .catch(err => {
      res.status(500).json({ success: false, err });
    });
});
