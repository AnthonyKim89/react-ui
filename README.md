# Corva Web Frontend
A React UI for the Corva app

[![CircleCI](https://circleci.com/bb/corva-ai/corva-web-frontend.svg?style=shield&circle-token=157bc597386336266688bfd36597406d6573a078)](https://circleci.com/bb/corva-ai/corva-web-frontend)

## Prerequisites

* A recent Node.js - current standard is Node v6.9.1
* The [Yarn](https://yarnpkg.com/) package manager: `npm install -g yarn`
* [corva-api](https://bitbucket.org/corva-ai/corva-api) running at [http://api.local.corva.ai](http://api.local.corva.ai)
* [corva-subscriptions](https://bitbucket.org/corva-ai/corva-subscriptions) running at [http://subscriptions.local.corva.ai](http://subscriptions.local.corva.ai)

## Running locally

Update your hosts file (/etc/hosts on Mac OS/Linux, c:\Windows\System32\Drivers\etc\hosts on Windows) and add the following line:

```
127.0.0.1 app.local.corva.ai
```

Next, install project dependencies:

```
yarn
```

Then start the development server:

```
npm start
```

The app will automatically launch in a browser. Code changes are picked up automatically and reloaded to the browser. Unit tests will also automatically run whenever the code changes.

## Login Information
The local development version of the API automatically seeds a database with a standard user and an admin user:

* Standard User: U: user@corva.ai P: password
* Admin User: U: admin@corva.ai P: password
