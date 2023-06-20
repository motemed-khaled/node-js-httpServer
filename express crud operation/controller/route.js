import { products as data } from "../model/dataBase.js";
import { object, string, number } from "yup";
import {uid} from "uid";


let productSchema = object({
    name: string().required(),
    price: number().required().positive(),
    image: string().url().nullable().required()
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
        newProduct = { id: uid(4), ...newProduct }; 
        data.push(newProduct)
        res.status(201).json(newProduct)
    })

    app.put("/product/update/:id", (req, res) => {
        let updateProduct = productSchema.validateSync(req.body, { strict: true });
        data.forEach(obj => {
            if (obj.id == req.params.id) {
                obj.name = updateProduct.name;
                obj.price = updateProduct.price;
                obj.image = updateProduct.image;
                updateProduct = obj;
            }
        })

        res.json(updateProduct);
    })

    app.delete("/product/delete/:id", (req, res) => {
        let productIndex = data.findIndex(obj => obj.id == req.params.id);
        if (productIndex == -1) throw new Error("no products match in dataBase...")
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