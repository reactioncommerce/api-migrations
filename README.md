# API Migrations

This project tracks current desired versions for all tracks used by the default Reaction Platform. You can fork it to get started but you will likely diverge as you add, remove, and change the Reaction API plugins you use.

This repo was created by following [these instructions](https://github.com/reactioncommerce/migrator#usage). If you don't want to fork this, you can build your own data version tracking project using those steps.

## Prerequisites

You must either have NodeJS 12.14.1 installed globally, or have [nvm](https://github.com/nvm-sh/nvm) installed and run `nvm use` as described in the instructions.

## Local Development Usage

1. Fork/clone this repo.
2. Check out the [tag](https://github.com/reactioncommerce/api-migrations/tags) that corresponds to your version of Reaction Platform. (Only 3.0.0 and higher are supported.)
3. `nvm use` (If prompted, `nvm install` the correct version.)
4. `npm install`
5. Then to see a report of necessary migrations for your local MongoDB database and optionally run them:

    ```sh
    MONGO_URL=mongodb://localhost:27017/reaction npx migrator migrate
    ```

    Use a different `MONGO_URL` to run them on a different database.

    Refer to [https://github.com/reactioncommerce/migrator](https://github.com/reactioncommerce/migrator) docs for other commands. Prefix them with `npx`.
6. Try to start your API service. If there are database version errors thrown on startup, then change the versions or add/remove tracks in `migrator.config.js` as necessary based on whatever those errors are asking for. Then repeat the previous step. (If you've added new tracks, you'll need to `npm install` the latest version of those packages first.) Keep doing this until the API service starts.

## Migrating Deployment Databases

Option 1: You can follow the above "Local Development Usage" instructions but specify a remote database if you want. Migrations will run on your computer, which may not be very fast or reliable.

Option 2: You can set up a CI task for this repo:

1. Create different configuration files for each deployed environment. For example, `migrator.config-staging.js` for the "staging" environment.
2. Add the necessary `MONGO_URL`s to your CI environment/secrets.
3. When config file changes are merged to the main branch, run `npx migrator migrate <env> -y` as a CI task with `MONGO_URL` set to the correct database for that environment. Do this for each Reaction environment (database) you have.
    - Ensure that your CI Docker image uses at least the version of Node that's in the `.nvmrc` file.

## Why does this repo exist?

This repo serves a few purposes:
- A place to `npm install` the [@reactioncommerce/migrator](https://github.com/reactioncommerce/migrator) package and all packages that contain migrations
- A central place to capture the desired/required data version for each release of the Reaction system, and for each individual Reaction component

In some monolith apps that you may be familiar with, the app's codebase repo serves as the place for migrations, too. But there are at least two reasons why we can't do that with Reaction:
- Reaction consists of many plugins and microservices, each of which owns their own data versioning. Running migrations in 10 different places would not be a good user experience.
- When you check out a particular release of a Reaction API component, you don't have any of the `down` migrations from future releases available. To run `down` migrations, you always need the latest migration code.

## Adding a migration to an API plugin package
To add a migration to an API plugin package, there are four main steps:

1. Add the migration code in the plugin package, in a `migrations` folder alongside the `src` folder.
2. Add `export { default as migrations } from "./migrations/index.js";` in your plugin entry point file.
3. Add the latest version of the `@reactioncommerce/db-version-check` NPM package as a dependency.
4. Add and register a `preStartup` function in the plugin source. In it, call `doesDatabaseVersionMatch` to prevent API startup if the data isn't compatible with the code.

These steps are explained in more detail [here](https://github.com/reactioncommerce/migrator#how-to-publish-a-package-with-migrations), and you can look at the [simple-authorization](https://github.com/reactioncommerce/plugin-simple-authorization) plugin code for an example to follow.

IMPORTANT: If the plugin you added a migration to is one that is built in to the stock Reaction API releases, then at the same time you bump the plugin package version in https://github.com/reactioncommerce/reaction `trunk` branch, you must also update the data version in the trunk branch of `migrator.config.js` in this repo.

## Developer Certificate of Origin
We use the [Developer Certificate of Origin (DCO)](https://developercertificate.org/) in lieu of a Contributor License Agreement for all contributions to Reaction Commerce open source projects. We request that contributors agree to the terms of the DCO and indicate that agreement by signing-off all commits made to Reaction Commerce projects by adding a line with your name and email address to every Git commit message contributed:
```
Signed-off-by: Jane Doe <jane.doe@example.com>
```

You can sign-off your commit automatically with Git by using `git commit -s` if you have your `user.name` and `user.email` set as part of your Git configuration.

We ask that you use your real full name (please no anonymous contributions or pseudonyms) and a real email address. By signing-off your commit you are certifying that you have the right to submit it under the [Apache 2.0 License](./LICENSE).

We use the [Probot DCO GitHub app](https://github.com/apps/dco) to check for DCO sign-offs of every commit.

If you forget to sign-off your commits, the DCO bot will remind you and give you detailed instructions for how to amend your commits to add a signature.

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
