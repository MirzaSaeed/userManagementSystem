const fs = require("fs");
const userRoutes = require("./Routes/Route");
const readFileAction = (error, data) => {
  if (error) {
    console.error("Error in reading JSON file", error);
  } else {
    try {
      const parseData = JSON.parse(data);
      // * open userRoutes methods to execute routes controller

      userRoutes(parseData);
    } catch (error) {
      console.error("Error parsing JSON Data", error);
    }
  }
};

fs.readFile("db.json", readFileAction);
