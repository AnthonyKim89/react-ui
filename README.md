# Corova Web Frontend
A React UI for the Corova app

## Prerequisites

* A recent Node.js - current standard is Node v6.9.1
* The [Yarn](https://yarnpkg.com/) package manager: `npm install -g yarn`
* [corova-api] running at [http://api.local.corova.ai](http://api.local.corova.ai)
* [corova-subscriptions] running at [http://subscriptions.local.corova.ai](http://subscriptions.local.corova.ai)

## Running locally

Update your hosts file (/etc/hosts on Mac OS/Linux, c:\Windows\System32\Drivers\etc\hosts on Windows) and add the following line:

```
127.0.0.1 app.local.corova.ai
```

Next, install project dependencies:

```
yarn
```

Then copy .env.sample to .env and change any settings you need to:

```
HOST=app.local.corova.ai
PORT=80
```

Finally, start the development server:

```
sudo npm start
```

The app will automatically launch in a browser. Code changes are picked up automatically and reloaded to the browser. Unit tests will also automatically run whenever the code changes.

## Login Information
The local development version of the API automatically seeds a database with a standard user and an admin user:

* Standard User: U: user@corova.ai P: password
* Admin User: U: admin@corova.ai P: password


## Adding Dependencies

When adding dependencies, use the command `yarn add package-name`.
This will add the package to the `package.json` file, and will trigger a `yarn install` which will update the `yarn.lock` file.
Be sure to commit the changes to both the `package.json` and `yarn.lock` files.


## Branching

Generally speaking, we follow git-flow, except that we use `master` as our integration branch and `production` as our production branch.

* `master` is our current working branch.
* `production` is the current production branch.
* To contribute, make a `fix/` or `feature/` branch off `master` and make a PR on BitBucket when you're ready to merge
* To release, make a `release/X.X.X` branch off master


## How to Deploy
Deployments are automated via CircleCI based on the branch or tag

* `master` - The master branch always deploys automatically to the QA environment, http://app.qa.corova.ai
* `release/X.X.X` - The most recently-created branch in this format automatically deploys to the Staging environment, http://app.staging.corova.ai
* `tag:vX.X.X` - The most recently-created tag in this format, which should correspond with a release branch, automatically deploys to the Production environment, http://app.corova.ai

**End-to-end Example:**

* Develop in a feature branch called `feature/my-new-feature`
* Merge your PR to `master` - this auto-deploys to QA
* Make a branch from `master` called `release/1.4.23` - this auto-deploys to Staging
* Make a tag on `release/1.4.23` called `v1.4.23` - this auto-deploys to Production

