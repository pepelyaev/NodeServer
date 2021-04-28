const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 8081;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//-----------------------------------------------------------
app.get('/api/info', (request, response) => {
    // request.query.start = 0
    // request.query.count = 10
    const json = {
        total: 10,
        data: [
            {id: 1, name: "name1"},
            {id: 2, name: "name2"},
            {id: 3, name: "name3"}
        ]
    };
    response.send(json);
});
