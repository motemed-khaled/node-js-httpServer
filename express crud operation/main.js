import  express  from "express";
import dotenv from 'dotenv';
import { controller } from "./controller/route.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

controller(app);

app.listen(port, () => {
    console.log(`app run in port ${port}`)
})