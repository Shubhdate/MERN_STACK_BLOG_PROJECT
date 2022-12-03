const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const {MongoClient} = require("mongodb"); //importing mongo



//initalizing a middleware
//we used to have install body parser but now it is middleware
app.use(express.json({extended:false}));


const withDB = async (operations,res) => {
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017')
        const db = client.db("mernstackproject")
        await operations(db);
        client.close();
    } catch (error) {
        res.status(500).json({message: "error coonecting to database", error});
    }
}

app.get("/api/articles/:name", async (req,res) => {
    withDB(async (db) => {
        const articleName = req.params.name;
        const articleInfo = await db
        .collection('articles')
        .findOne({name: articleName});
        res.status(200).json(articleInfo); 
    }, res);

});




app.post('/api/articles/:name/add-comments', (req,res) => {
    const {username, text} = req.body;
    const articleName = req.params.name;
    
    withDB(async (db) => {
        const articleInfo = await db
        .collection("articles")
        .findOne({name: articleName});
        await db.collection("articles").updateOne(
            {name: articleName},
            {
                $set: {
                    comments: articleInfo.comments.concat({username, text}),
                },
            }
        );
        const updateArticleInfo = await db
        .collection("articles")
        .findOne({name:articleName});
        res.status(200).json(updateArticleInfo);
    }, res);
});




app.listen(PORT, () => console.log(`Server started at port ${PORT}`));















// app.get('/', (req,res)=> res.send("Hello World Shubham get method"));
//getting responses from body techinique
// app.post('/', (req,res)=> res.send(`Hello ${req.body.name}`));

//getting responses with the help of params techinque
// app.get("/hello/:name", (req,res)=>res.send(`Hello ${req.params.name}`));