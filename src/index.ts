import app from "./app";
import "reflect-metadata";
import { AppDataSource } from "./data-source";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data source initialized!");
  })
  .catch((err) =>
    console.error("Error during data source initialization!", err)
  );
