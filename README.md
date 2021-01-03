# Rotation Slack Bot
a `NodeJS` app that randomaly draws values from lists of strings that are supplied from `Slack` channels.
The app listens on an `/events` endpoint which contains the command `rotate:`.

# Installation
* Run `npm start`.

# Endpoints
* `/events` - main endpoint for bot
* `/health` - will return `200` and a message when program is running
* `/test` - will return content of request as response if `DEBUG='true'` on `.env` file

# Configuration
You will need add a `SLACK_SIGNING_SECRET` and a `SLACK_ACCESS_TOKEN` to the `.env` file.
You can also indicate there if you want to run in `debug` mode to print out to the console.

Please make sure the following is defined on `Slack`:
* Make sure you have [defined or created your bot on slack](https://api.slack.com/apps)
* Make sure to provide the bot with the following permissions: [channels:history ](https://api.slack.com/scopes/channels:history), [chat:write](https://api.slack.com/scopes/chat:write)
    * Under `Scopes` -> `Bot Token Scopes` 
    * `chat:write` (to allow the bot to send messages)
    * `channels:history` (to allow the bot to view messages on public channels that the bot has been added to) 
* Make sure `Slack` is configuerd to send events to `bot.public.ip.address/events` on `Slack Event Subscriptions`

# Testing
* You can send the request described below to validate program output:
```bash
curl --location --request POST 'https://program.public.ip.address/events' \
--header 'Content-Type: application/json' \
--data-raw '{
	"token": "1YWGxENvsIz8P3F2wBlxgMg9",
	"team_id": "T6B3FJK7Y",
	"api_app_id": "A01HT36QJBV",
	"event": {
		"client_msg_id": "ae6396f3-7ad2-4d55-8750-934d5efa588f",
		"type": "message",
		"text": "rotate:[[\"a\", \"b\"]]",
		"user": "U6B9U3D1V",
		"ts": "1609417761.000800",
		"team": "T6B3FJK7Y",
		"blocks": "",
		"channel": "C01HUBJ33U2",
		"event_ts": "1609417761.000800",
		"channel_type": "channel"
	},
	"type": "event_callback",
	"event_id": "Ev01J0GJUVKN",
	"event_time": 1609417761,
	"authorizations": [{
		"enterprise_id": "null",
		"team_id": "T6B3FJK7Y",
		"user_id": "U01HUHCL6NP",
		"is_bot": true,
		"is_enterprise_install": false
	}],
	"is_ext_shared_channel": false,
	"event_context": "1-message-T6B3FJK7Y-C01HUBJ33U2"
}'
```
* You can find your local ip address by hitting `ipconfig getifaddr en0` on terminal.