const express = require('express');
const app = express();
const port = 5000;

app.listen(port, ()=>{
    console.log(`Server at ${port}`);
})

app.get('/', (req, res)=>{
    res.send('Hello world')
})

app.post('/user', (req, res)=>{
    res.send("Got a post nigga. Watcha say")
})