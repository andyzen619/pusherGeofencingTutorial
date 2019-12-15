/* server.js */

const cors = require("cors");
const uuid = require("uuid").v4;
const next = require("next");
const Pusher = require("pusher");
const logger = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 8000;

const app = next({ dev });
const handler = app.getRequestHandler();

// Ensure that your pusher credentials are properly set in the .env file
// Using the specified variables
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  encrypted: true
});

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(cors());
    server.use(logger("dev"));
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));

    // server.use() middlewares here ...

    const initializePeople = ({ lat, lng }) => {
      const randomInRange = num => (width = 0.01) =>
        Math.random() * width * 2 + num - width;

      const randomLat = randomInRange(lat);
      const randomLng = randomInRange(lng);

      const people = [
        "Andy",
        "John",
        "Steve",
        "Anna",
        "Margaret",
        "Felix",
        "Chris",
        "Jamie",
        "Rose",
        "Bob",
        "Vanessa",
        "9lad",
        "Bridget",
        "Sebastian",
        "Richard"
      ];

      return people.map(name => ({
        name,
        id: uuid(),
        position: { lat: randomLat(0.0075), lng: randomLng(0.02) },
        online: false
      }));
    };

    const referencePosition = { lat: 43.904035, lng: 79.392043 };

    let people = initializePeople(referencePosition);

    server.get("/people", (req, res, next) => {
      res.json({ status: "success", people });
    });

    //*Trigger a transit event on the map-geofencing Pusher channel to update the position of person :id
    server.post("/transit/:id", (req, res, next) => {
      const id = req.params.id;
      const { lat, lng } = req.body;

      people.forEach((person, index) => {
        if (person.id === id) {
          people[index] = { ...person, position: { lat, lng } };

          pusher.trigger("map-geofencing", "transit", {
            person: people[index],
            people
          });
        }
      });
    });

    /**
     * Sets the presence to either online or offline of person :id
     */
    server.post("/:presence/:id", (req, res, next) => {
      const id = req.params.id;
      const presence = req.params.presence;

      if (["online", "offline"].includes(presence)) {
        people.forEach((person, index) => {
          if (person.id === id) {
            return (people[index] = {
              ...person,
              online: presence === "online"
            });
          }
        });
      }
    });

    /**
     * Updates user with given lat lng
     */
    server.post("/updateLocation/:id", (req, res, next) => {
      const id = req.params.id;
      const location = req.body
      people.forEach((person, index) => {
        if (person.id === id) {
          console.log(`Updated location for ${person.name}`);
          return (people[index] = {
            ...person,
            position: { lat: location.lat, lng: location.lng }
          });
        }
      });
    });

    server.get("*", (req, res) => {
      return handler(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
