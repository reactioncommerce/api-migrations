# API Migrations

This project tracks current desired versions for all tracks used by the default Reaction Platform. You can fork it to get started but you will likely diverge as you add, remove, and change the Reaction API plugins you use.

This repo was created by following [these instructions](https://github.com/reactioncommerce/migrator#usage). If you don't want to fork this, you can build your own data version tracking project using those steps.

## Local Development Usage

1. Fork/clone this repo.
2. Check out the branch that corresponds to your version of Reaction Platform. (Only 3.0.0 and higher are supported.)
3. `npm install`
4. Then to see a report of necessary migrations for your local MongoDB database and optionally run them:

    ```sh
    MONGO_URL=mongodb://localhost:27017/reaction migrator migrate
    ```

    Use a different `MONGO_URL` to run them on a different database.
5. Refer to [https://github.com/reactioncommerce/migrator](https://github.com/reactioncommerce/migrator) docs for other commands.

## Migrating Deployment Databases

Option 1: You can follow the above "Local Development Usage" instructions but specify a remote database if you want. Migrations will run on your computer, which may not be very fast or reliable.

Option 2: You can set up a CI task for this repo:

1. Create different configuration files for each deployed environment. For example, `migrator.config-staging.js` for the "staging" environment.
2. Add the necessary `MONGO_URL`s to your CI environment/secrets.
3. When config file changes are merged to the main branch, run `migrator migrate <env> -y` as a CI task with `MONGO_URL` set to the correct database for that environment. Do this for each Reaction environment (database) you have.

## Why does this repo exist?

This repo serves a few purposes:
- A place to `npm install` the [@reactioncommerce/migrator](https://github.com/reactioncommerce/migrator) package and all packages that contain migrations
- A central place to capture the desired/required data version for each release of the Reaction system, and for each individual Reaction component

In some monolith apps that you may be familiar with, the app's codebase repo serves as the place for migrations, too. But there are at least two reasons why we can't do that with Reaction:
- Reaction consists of many plugins and microservices, each of which owns their own data versioning. Running migrations in 10 different places would not be a good user experience.
- When you check out a particular release of a Reaction API component, you don't have any of the `down` migrations from future releases available. To run `down` migrations, you always need the latest migration code.

## License
Copyright 2020 Reaction Commerce

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.
