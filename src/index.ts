import express from 'express';

const app = express();
app.use(express.json());

const port = 8080;
app.listen(port, () => {
  console.info(`server started at http://localhost:${port}`);
});
