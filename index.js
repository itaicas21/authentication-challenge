/* write the code to run app.js here */
const app = require("./app");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("👌 App listening on port: " + PORT);
});
