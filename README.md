
<img src="http://apolloverlay.com/static/images/color_logo_transparent.png" width=300 />

*An electron application, that allows you to control Spotify while you game.*


## Running Dev
In order to run dev, you will need the [Apollo API](https://github.com/caoakleyii/apollo-site) running in development.

Once your API is running. You'll just need to run the following commands
```bash
# install dependencies
npm install

# starts a webpack dev server, hoisting the vue components within the apollo app
npm run dev

# builds the electron application and starts the app
npm start
```

## Build Binaries
In order to build the binaries you'll need to run a simple command, currently we're using electron-builder for the creating the binaries.
This command will create the binary based on the machine you run it on.

```bash
yarn  dist
```

## Build for Release and Auto-Update
We also use electron-builder and nuts with github release hooks to handle, building, releasing, and auto-updating. 
In order to create a draft release, make sure you increment the version within package.json, abiding by [semver](https://semver.org).
Then run the following commands.

> *You'll need to make sure you have a GH_TOKEN system environment variable set to a [GitHub Personal Access Key](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/#creating-a-token).
> The personal access token, should have full read/write access to the repository.*

```bash
yarn release
```

This will draft a new [release](https://github.com/CAOakleyII/apollo-app/releases) within GitHub for you. 
Make sure the only files uploaded include, installers and a latest.yaml file. The installers can have the [extensions defined by Nuts](https://nuts.gitbook.com/assets.html)

Commit any code related to this release, and publish.

Our [nuts server](http://updater.apolloverlay.com) uses GitHub Webhooks to be notified when a new release is updated or published. It will retrieve the binaries and host the latest.yaml file.

The latest.yaml file is what electron-builder uses to check if the app being run matches the latest app being hosted. 

[logo]: http://apolloverlay.com/static/images/color_logo_transparent.png
