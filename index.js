const http = require('http');

const bodyParser = require('body-parser');
const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');
const realtime = require('./app/Socket/realtime');
const mongoose = require('mongoose');
const friendAction = require('./app/Socket/FriendAction');

const app = express();

// database
mongoose.connect('mongodb+srv://webfullstack99:Loveguitar99@cluster0.mrjwz.gcp.mongodb.net/chat?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('db connected');
    // we're connected!
});
app.use(bodyParser.json());
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 3000;

realtime(io);
app.use(cors());
app.use('/user', require('./routes/user'));
app.use('/conversation', require('./routes/conversation'));


server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}/`);
})

function startKeepAlive() {
    setInterval(() => {
        axios
            .get("https://pa-chat-api.glitch.me")
            .then(response => {
                console.log("make alive");
                console.log("res", response.data.data);
            })
            .catch(error => {
                console.log("err", error.response.data);
            });
    }, 4 * 60 * 1000);
}
startKeepAlive();
