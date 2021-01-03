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

const server = app.listen(process.env.PORT || 80, () => {
    if (isDebug()) {
        console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
    }
});
 
/* Endpoints */
 
app.get('/health', (req, res) => {
    res.status(200).send('Server is running');
});

app.post('/test', (req, res) => {
    if (isDebug()) { 
        console.dir(req.body);
        res.status(200).send(req.body);
    } else {
        res.sendStatus(200);
    }
});
 
const rotateCommand = "rotate:"
app.post('/events', (req, res) => {
    if (isDebug()) {
        console.dir("Event on /events:");
        console.dir(req.body);
    }

    if (req.body.type === 'url_verification') {
        /* Authentication challange from slack, as described here: https://api.slack.com/events/url_verification */
        res.send(req.body.challenge);
    } else if (req.body.type === 'event_callback') {
        res.sendStatus(200);

        if (req.body.event.subtype === 'channel_join' || req.body.event.subtype === 'bot_add' || req.body.event.subtype === 'bot_remove') return;
        
        const { bot_id, text, channel } = req.body.event;
        if (!text) return;
        let regex = /(^\/)/;
        if (bot_id || regex.test(text)) return;

        if (text.includes(rotateCommand)) {
            rotateParticipants(text, channel);
        }
    }
});

const rotateParticipants = (text, channel) => {
    let stringArray = String(text.replace(rotateCommand, ""));

    var arrays;

    try {
        arrays = JSON.parse(fixJSON(stringArray));
      } catch (exception) {
        if (isDebug()) { 
            console.dir(exception); 
        }
        sendCantUndestanRotationdResult(channel, unsuccesfulRotationMessage);
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

const isDebug = () => {
    return (process.env.DEBUG === "true");
}

const fixJSON = (val) => {
    return val.replace(/“/g, '"').replace(/”/g, '"');
}

const sendRotationResult = (channel, users) => {
    axios.post('https://slack.com/api/chat.postMessage?token=' + process.env.SLACK_ACCESS_TOKEN + '&channel=' + channel + '&text= ' + succesfulRotationMessage + ' `' + users + '` ' + '&pretty=1');
}

const sendCantUndestanRotationdResult = (channel, message) => {
    axios.post('https://slack.com/api/chat.postMessage?token=' + process.env.SLACK_ACCESS_TOKEN + '&channel=' + channel + '&text=' + message + '&pretty=1');
}

const succesfulRotationMessage = encodeURIComponent("Thank you for calling me and for showing interest in my capabilities!. I promise I didn’t let my personal preferences interfere with my decision 🤖 \nThe following persons have been selected for the rotation: 🥁🥁🥁...\n");
const unsuccesfulRotationMessage = encodeURIComponent("I'm sorry 🤦, but  Can't understand your intention. Please use the following syntax for a rotation: `rotate:[[\"name1\", \"name2\"], [\"name3\", \"name4\"] {...} ]`");