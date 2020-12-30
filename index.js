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
 
app.post('/events', (req, res) => {
 // App setting validation
    if (req.body.type === 'url_verification') {
        res.send(req.body.challenge);
    } else if (req.body.type === 'event_callback') { 
        res.sendStatus(200);

        const { bot_id, text, channel } = req.body.event;
        if (!text) return;
        let regex = /(^\/)/;
        if (bot_id || regex.test(text)) return;
        if (req.body.event.subtype === 'channel_join' || req.body.event.subtype === 'bot_add' || req.body.event.subtype === 'bot_remove') return;
        sendRotationResult(channel, "Raz, Benji")
    }
});

const sendRotationResult = (channel, users) => {
    axios.post('https://slack.com/api/chat.postMessage?token=' + process.env.SLACK_ACCESS_TOKEN + '&channel=' + channel + '&text= Users for rotation are:' + users + '&pretty=1');
}

const server = app.listen(process.env.PORT || 80, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});