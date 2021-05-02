# Donate and Discuss
As seen on [covid.questboo.app](http://covid.questbook.app)

## Pre-requisites
- NodeJS & NPM ([Install Node & NPM](https://www.npmjs.com/get-npm)])
- MongoDB running locally ([Install MongoDB](https://docs.mongodb.com/manual/installation/))

## Configuration
### Twitter Configuration
- Create a [new Twitter App](https://developer.twitter.com/en/portal/apps/new)
- Select your newly created app [here](https://developer.twitter.com/en/portal/projects-and-apps) and tap on the Settings icon next to the app name
- On the settings tab, scroll to **Authentication Settings** and under **Callback Urls** add `http://localhost/oauth-any/twitter/callback` and `https://<YOUR DOMAIN NAME>/oauth-any/twitter/callback`
- Please note, above, only https is supported for all domains other than localhost. If you don't have https setup, see the HTTPS section below
- Go to the keys and tokens tab
- Tab Generate (or Regenerate) under Consumer Keys
- Copy the the `API Key` and `API Secret Key`
- Edit the `.env` file, and edit the following lines with the above copied strings
```
TWITTER_API_KEY=<API Key>
TWITTER_SECRET=<API Secret Key>
```

### Google Configuration
- Open google cloud console [and create a new project](https://console.cloud.google.com/projectcreate) 
- Open the project and select [create Oauth Client Id](https://console.cloud.google.com/apis/credentials) for this new app 
- Application Type, select Web application
- Authorized redirect URI, add `http://localhost/oauth-any/google/callback` and `https://<YOUR DOMAIN NAME>/oauth-any/google/callback` 
- Please note, above, only https is supported for all domains other than localhost. If you don't have https setup, please see the HTTPS section below
- Once created copy the `Client ID` and `Client Secret`
- Edit the `.env` file, change the following lines with the above copied strings
```
GOOGLE_API_KEY=<Client Id>
GOOGLE_SECRET=<Client Secret>
```

### MongoDB Configuration (optional)
If you already have an instance of mongodb running, you can set the mongo connection db
```
MONGO_CONNECTION=<YOUR CONNECTION STRING>
```

### Setting up HTTPS (optional if running on localhost)
- Generate HTTPS keys using [letsencrypt.org](https://letsencrypt.org)
- Copy the generated `fullchain.pem` and `privkey.pem` to `./sslcerts/`
- Uncomment the last few lines related to https options on the `bin/www` file

## Running the server
The server is configured to run on port 80 and 443
- `npm install`
- `sudo npm start`

