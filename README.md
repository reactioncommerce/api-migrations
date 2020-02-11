# API Migrations

This project tracks current desired versions for all tracks used by the default Reaction Platform. You can fork it to get started but you will likely diverge as you add, remove, and change the Reaction API plugins you use.

This repo was created by following [these instructions](https://github.com/reactioncommerce/migrator#usage). If you don't want to fork this, you can build your own data version tracking project using those steps.

## Prerequisites

- Only Mac OSX and Linux are supported
- You must either have NodeJS 12.14.1 installed globally, or have [nvm](https://github.com/nvm-sh/nvm) installed and run `nvm use` as described in the instructions.

## Usage

### Migrating a Local Development Database

1. Fork/clone this repo.
2. Check out the branch that corresponds to your version of Reaction Platform. (Only 3.0.0 and higher are supported.)
3. `nvm use` (If prompted, `nvm install` the correct version.)
4. `npm install`
5. Then to see a report of necessary migrations for your local MongoDB database and optionally run them:

    ```sh
    MONGO_URL=mongodb://localhost:27017/reaction npx migrator migrate
    ```

    Use a different `MONGO_URL` to run them on a different database.

    Refer to [https://github.com/reactioncommerce/migrator](https://github.com/reactioncommerce/migrator) docs for other commands. Prefix them with `npx`.
6. Change the versions or add/remove tracks in `migrator.config.js` as necessary based on whatever API plugins you use.

### Migrating Deployment Databases

Option 1: You can follow the above "Migrating a Local Development Database" instructions but specify a remote database if you want. Migrations will run on your computer, which may not be very fast or reliable.

Option 2: You can set up a CI task for this repo:

1. Create different configuration files for each deployed environment. For example, `migrator.config-staging.js` for the "staging" environment.
2. Add the necessary `MONGO_URL`s to your CI environment/secrets.
3. When config file changes are merged to the main branch, run `npx migrator migrate <env> -y` as a CI task or remote function, with `MONGO_URL` set to the correct database for that environment. Do this for each Reaction environment (database) you have.
    - Ensure that your CI Docker image uses at least the version of Node that's in the `.nvmrc` file.

## Adding Migrations to a Plugin

Although you can put ad-hoc migrations directly in this project as needed, we think it's best if migration code lives with the Reaction plugins that rely on those migrations. Thus, whether it is a custom plugin you wrote or an official plugin that you're modifying, the basic process is this:

1. Add one or more data migrations with `up` and optionally `down` functions in your plugin NPM package code. Export these in an object with the name `migrations` with the expected structure.
2. Add data version checking code to your plugin, to ensure the system won't start unless your data is at the correct expected version.
3. `npm install` your plugin package in this project if it isn't already listed in `package.json` dependencies. If it's already listed, `npm update` to the latest version with the necessary migrations in it.
4. Add your plugin track(s) and expected version for each in `migrator.config.js` (and/or in any environment-specific config files you've created).
5. Run `npx migrator report` or `npx migrator migrate` commands to see or run all necessary migrations.

Read on for more details about each step.

### Exporting migrations from an API plugin package

These instructions assume you are following our recommended pattern for Reaction API plugin NPM packages, which includes using ES modules (`"type": "module"` in your `package.json`).

1. If it doesn't already exist, create a `migrations` folder at the root of your NPM package.
2. In the `migrations` folder, create a file `index.js` with the following content:

    ```js
    import migration2 from "2.js";

    export default {
      tracks: [
        {
          namespace: "plugin-name",
          migrations: {
            2: migration2
          }
        }
      ]
    };
    ```

    The value of `namespace` can be any string. We recommend the same name as your plugin, as long as you're reasonably sure no other plugin will use the same string.

3. In the `migrations` folder, create a file `2.js` with the following content:

    ```js
    async function down({ db, progress }) {

    }

    async function up({ db, progress }) {

    }

    export default {
      down,
      up
    };
    ```

    Or if migrating down is unnecessary, then omit the `down` function and change the export to:

    ```js
    export default {
      down: "unnecessary",
      up
    };
    ```

    Or if migrating down is impossible, then omit the `down` function and change the export to:

    ```js
    export default {
      down: "impossible",
      up
    };
    ```

    NOTE: If this is not your first migration, name the file after whatever migration version you are adding, and import it the same way in `migrations/index.js`.

4. Write your migration code in `2.js`. You can import other files or packages. Install any packages you import as normal dependencies of your NPM package. Put utility functions in a `migrations/util` folder (convention) and import them from there. Refer to https://github.com/reactioncommerce/migrator#how-to-publish-a-package-with-migrations for instructions.
5. Finally, you have to export the migrations object as a named export `migrations` from your package. In your root `index.js` file, add:

    ```js
    export { default as migrations } from "./migrations/index.js";
    ```

    For example, your whole root (main) `index.js` file might look like this:

    ```js
    import register from "./src/register.js";
    export { default as migrations } from "./migrations/index.js";
    export default register;
    ```

### Add data version check to your plugin code

We recommend you do data version checks in a `preStartup` function to ensure they interrupt API startup sequence before any database operations happen.

Example of registering a `preStartup` function:

```js
import preStartup from "./preStartup.js";


/**
 * @summary Import and call this function to add this plugin to your API.
 * @param {ReactionAPI} app The ReactionAPI instance
 * @returns {undefined}
 */
export default async function register(app) {
  await app.registerPlugin({
    label: "My Plugin",
    name: "my-plugin-change-this",
    version: "1.0.0",
    functionsByType: {
      preStartup: [preStartup]
    },
    // ...other stuff you are registering
  });
}
```

Example of verifying data version in your `preStartup` function:

```js
import doesDatabaseVersionMatch from "@reactioncommerce/db-version-check";

const expectedVersion = 2;
const namespace = "my-plugin-change-this";

/**
 * @summary Called before startup
 * @param {Object} context Startup context
 * @returns {undefined}
 */
export default async function preStartup(context) {
  const setToExpectedIfMissing = async () => {
    // This function is optional. You can return `true` here
    // if you're able to check something in the data and confirm
    // that it's already at the expected version or it's empty.
    //
    // This is recommended to avoid errors forcing migrations
    // to be run on a new database.
  };

  const ok = await doesDatabaseVersionMatch({
    db: context.app.db,
    expectedVersion,
    namespace,
    setToExpectedIfMissing
  });

  if (!ok) {
    throw new Error(`Database needs migrating. The "${namespace}" namespace must be at version ${expectedVersion}. See docs for more information on migrations: https://github.com/reactioncommerce/api-migrations`);
  }
}
```

Add the latest version of the `@reactioncommerce/db-version-check` NPM package to your package dependencies.

### Test your migrations

Prior to publishing your updated NPM package, you can use `npm link` to locally test migrations.

1. In your package directory, `nvm use` the same version of Node that `api-migrations` project uses.
2. In your package directory, run `npm link`.
3. In the `api-migrations` project, run `npm link <package-name>`. Verify that the link path it prints points to your plugin package directory.
4. In `migrator.config.js`, add a track entry for your migration, or just update the `version` if it's already listed:

    ```js
    {
      namespace: "my-plugin-change-this", // must match the one in your package
      package: "my-plugin", // must match your NPM package name
      version: 2 // whatever data version you just wrote a migration for
    }
    ```

5. Then do `MONGO_URL=mongodb://localhost:27017/reaction npx migrator migrate` to test it. To retest, migrate down to `1` by changing `version` for the track in the config, and then rerunning the `migrate` command. If migrating down isn't possible, you can manually reset the version in the `migrations` collection in MongoDB. Do this only for development and testing purposes.

### Publishing migrations

After migration code is tested, publish a new version of your NPM package and install/update it in the `api-migrations` repo. You can then commit the `migrator.config.js` and `package.json` changes so that others can also run the migration. (In the case of custom plugins, commit to your private fork of this repo.)

## Why does this repo exist?

This repo serves a few purposes:

- A place to `npm install` the [@reactioncommerce/migrator](https://github.com/reactioncommerce/migrator) package and all packages that contain migrations
- A central place to capture the desired/required data version for each release of the Reaction system, and for each individual Reaction component

In some monolith apps that you may be familiar with, the app's codebase repo serves as the place for migrations, too. But there are at least two reasons why we can't do that with Reaction:

- Reaction consists of many plugins and microservices, each of which owns their own data versioning. Running migrations in 10 different places would not be a good user experience.
- When you check out a particular release of a Reaction API component, you don't have any of the `down` migrations from future releases available. To run `down` migrations, you always need the latest migration code.

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
