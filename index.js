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
const dataInfo = {
    1: {name: "Name1", description: "Description1"},
    2: {name: "Name2", description: "Description2"},
    3: {name: "Name3", description: "Description3"}
};

app.get('/node/api/info', (request, response) => {
    const json = {
        data: [],
        TotalCount: 0
    };
    const start = request.query.start || 0;
    const page = request.query.page || 1;
    const count = request.query.count || 10;
    for (let key = start * count; key < (start + page) * count; key++) {
        const record = dataInfo[key];
        if (record) {
            record.id = key;
            json.data.push(record);
            json.TotalCount++;
        }
    }
    response.send(json);
});

// Запрос данных с пейджингом
app.get('/node/api/comboStore', (request, response) => {
    const json = {
        items: [],
        total: 0
    };
    const start = request.query.start || 0;
    const page = request.query.page || 1;
    const count = request.query.count || 10;
    for (let key = start * count; key < (start + page) * count; key++) {
        const record = dataInfo[key];
        if (record) {
            record.id = key;
            json.items.push(record);
            json.total++;
        }
    }
    response.send(json);
});
// Добавление/Обновление данных
app.post('/node/api/comboStore', (request, response) => {
    if (!request.body) {
        response.send({result: "Request body is empty"});
        return;
    }
    let id = request.body.id;
    if (id) {
        // У новой записи ИД в формате: "ClearApp.app.model.ComboModel-1", меняем на целое свободное число
        if (isNaN(id)) {
            id = 1;
            const keys = Object.keys(dataInfo);
            for (let i = 0; i < keys.length; i++) {
                if (id <= +keys[i]) {
                    id = +keys[i] + 1;
                }
            }
        }
        let item = dataInfo[id] || {};
        const keys = Object.keys(request.body);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (key !== "id") {
                item[key] = request.body[key];
                //console.log(`id: ${id}, key: ${key}, ${request.body[key]}`);
            }
        }
        dataInfo[id] = item;
    } else {
        request.body.forEach(function (record) {
            let item = dataInfo[record.id] || {};
            const keys = Object.keys(record);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (key !== "id") {
                    item[key] = record[key];
                    //console.log(`id: ${record.id}, key: ${key}, ${record[key]}`);
                }
            }
            dataInfo[record.id] = item;
        });
    }
    response.send({result: "Ok"});
});
