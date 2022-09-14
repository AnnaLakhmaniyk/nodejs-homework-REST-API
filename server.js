const app = require("./app");
require("dotenv").config();

const { connectMongo } = require("./src/bd/conection");
const PORT = process.env.PORT || 3000;
async function startApp() {
  try {
    await connectMongo();
    app.listen(PORT, () => {
      console.log("Server running. Use our API on port: 3068");
    });
  } catch (error) {
    console.log(error.message);

    process.exit(1);
  }
}
startApp();
