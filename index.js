let express = require('express');
let app = express();
let Datastore = require('nedb');
// const { Server } = require('http');
let db= new Datastore('info.db');
db.loadDatabase();

app.use(express.json());
app.use('/', express.static('public'));

//add a route on server that is listening for a post request
//and insert data into the database
app.post("/messages", (req,res)=>{
    //console.log(req.body);
    db.insert(req.body, (err, newDocs)=>{
        if(err){
            res.json({task:"task failed"});
        }else{
            res.json({task:"success"});
        }
    })
})

//Send Data Route
app.get('/data', (req, res) => {
    // db.count({}, (err, count) => {
    //     if (err) {
    //         res.json({ task: "task failed" });
    //     } else {
    //         let number = {count};
    //         //console.log(number);
    //         res.json(number);
    //     }
    // })
    db.find({}, (err, docs) => {
        if (err) {
            res.json({ task: "task failed" });
        } else {
            let obj = {docs};
            //console.log(obj);
            res.json(obj);
        }
    });
});

//listen at port 3000
let port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log('listening at', port);
})