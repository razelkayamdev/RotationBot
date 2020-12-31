const express = require('express');
const app = express();
 
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();
 
const rawBodyBuffer = (req, res, buf, encoding) => {
 if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
 }
};
app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));
 
/* Handling events */
 
app.get('/health', (req, res) => {
    res.send('Server is running');
});

app.post('/test', (req, res) => {

    console.dir("Testing endpoint:");
    console.dir(req.body);
    res.sendStatus(200);
});
 
app.post('/events', (req, res) => {

    console.dir("Event from slack");
    console.dir(req.body);
    console.dir("---------")
 // App setting validation
    if (req.body.type === 'url_verification') {
        res.send(req.body.challenge);
    } else if (req.body.type === 'event_callback') { 
        res.sendStatus(200)
        const { bot_id, text, channel } = req.body.event;
        if (!text) return;
        let regex = /(^\/)/;
        if (bot_id || regex.test(text)) return;
        if (req.body.event.subtype === 'channel_join' || req.body.event.subtype === 'bot_add' || req.body.event.subtype === 'bot_remove') return;

        let stringArray = String(text.replace("rotate:", ""));

        var arrays;

        console.dir("string array: " + stringArray);

        try {
            arrays = JSON.parse(stringArray);
          } catch (exception) {
            console.dir(exception);
            sendCantUndestandResult(channel, "Can't understand the intention. Please ask for a rotatoin with \"`rotate:[[\"name1\", \"name2\"], [\"name3\", \"name4\"] {...} ]`");
            return;
          }

        var names = [];

        arrays.forEach(array => { 
            let random = Math.floor(Math.random() * array.length);
            let name = array[random];
            names.push(name);
        }); 

        sendRotationResult(channel, names.join(", "));
    }
});

const sendRotationResult = (channel, users) => {
    axios.post('https://slack.com/api/chat.postMessage?token=' + process.env.SLACK_ACCESS_TOKEN + '&channel=' + channel + '&text= Users for rotation are :' + users + '&pretty=1');
}

const sendCantUndestandResult = (channel, message) => {
    axios.post('https://slack.com/api/chat.postMessage?token=' + process.env.SLACK_ACCESS_TOKEN + '&channel=' + channel + '&text=' + message + '&pretty=1');
}

const server = app.listen(process.env.PORT || 80, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});