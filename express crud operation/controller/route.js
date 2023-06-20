import { products as data } from "../model/dataBase.js";
import { object, string, number, date, array } from "yup";
import  moment  from "moment";
import {uid} from "uid";


let productSchema = object({
    title: string().required(),
    price: number().positive(),
    description: string(),
    images: array(string().url()),
    category: object({
        id: number(),
        name: string(),
        image: string(),
      })
  });

export let controller = (app) => {
    
    app.use("/product", (req, res, next) => {
        if (req.headers["token"] != process.env.Token) throw new Error("not authorized");
        next();
    })

    app.get("/products", (req, res) => {
        res.json(data)
    });

    app.get("/products/:id", (req, res) => {
        let mainProduct = data.filter(obj => obj.id == req.params.id);
        if (mainProduct.length == 0) throw new Error("no products match in dataBase...");
        res.json(mainProduct);
    })

    app.post("/product", (req, res) => {
        let newProduct = productSchema.validateSync(req.body, { strict: true });
        newProduct = { id: uid(4), ...newProduct , created_at:moment().format("llll") , updtaed_at:moment().format("llll") }; 
        data.push(newProduct)
        res.status(201).json(newProduct)
    })

    app.put("/product/update/:id", (req, res) => {
        let updateProduct = productSchema.validateSync(req.body, { strict: true });
        let productIndex = data.findIndex(obj => obj.id == req.params.id);
        if (productIndex == -1) throw new Error("No Data Match In Database....") 
        updateProduct = {
            id: data[productIndex].id,
            ...updateProduct,
            created_at: data[productIndex].created_at,
            updtaed_at: moment().format("llll")
        }
        data[productIndex] = updateProduct;

        res.json(updateProduct);
    })

    app.delete("/product/delete/:id", (req, res) => {
        let productIndex = data.findIndex(obj => obj.id == req.params.id);
        if (productIndex == -1) throw new Error("No Data Match In Database....")
        data.splice(productIndex, 1);
        res.json(data);
    })

    // handle errror
    app.use((err, req, res, next) => {
        res.status(500).send(err.message);
    })

    // handle anthor routes
    app.all("*", (req, res) => {
        res.status(404).send("sorry , page not found .....");
    })
}