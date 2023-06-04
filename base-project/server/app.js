const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const aWss = expressWs.getWss('/');
const PORT = 3000;

const path = require('path');

app.use((req, res, next)=>{
    console.log('middleware');
    req.testing = 'testing';
    return next();
});

app.get('/', (req, res, next)=>{
    console.log('get route', req.testing);
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

const broadcastmessage = (msg, ws) => {
    aWss.clients.forEach((client)=>{
        if (client != ws) client.send(msg);
    });
};

app.ws('/', (ws, req)=>{
    ws.on('message', (msg)=>{
        console.log('Received a message from websocket client:',msg);
        broadcastmessage(msg, ws);
    });
    console.log('socket', req.testing);
});

app.listen(PORT, ()=>console.log(`Server is running on port:${PORT}`));