
# Simulator Extension Sample

## What is a simulator extension?

TBD

## Creating a simulator extension

### First create a traditional MakeCode extension

> Simulator extensions are contained within traditional MakeCode "code" extensions. If you're not adding a simulator extension to an existing code extension, then you must first create a new code extension.

Create a new project in MakeCode.

Sync your project to GitHub, making note of the repo name. You will use `"<organization name>/<repo name>"` as the message channel for your simulator extension.

In the JavaScript editor, add a new source file (e.g. custom.ts).

In your new source file, create a function that sends a simulator message on your channel and export it as a block definition. e.g.:

```ts
namespace myext {
    const SIMMSG_CHANNEL = "<organization name>/<repo name>";
    //% block
    export function loadSimulatorExtension() {
        const msg = {
            type: "init",
        };
        control.simmessages.send(SIMMSG_CHANNEL, Buffer.fromUTF8(JSON.stringify(msg)), false);
    }
}
```

Switch to the Blocks editor and notice a new toolbox category containing your new block.

Sync your changes to GitHub.

### Create the simulator extension subproject

On a command line outside of MakeCode, clone your new repo.

```bash
> git clone https://github.com/<organization name>/<repo name>
```

Change directory to your cloned repo.

```bash
> cd <repo name>
```

In this folder, create a subproject for your simulator extension. The example below initializes the subproject to use [Vite](https://vitejs.dev/), [React](https://react.dev/), and [TypeScript](https://www.typescriptlang.org/). **None of these frameworks are required.** Use the famework that best suits your need.

```bash
npm create vite@latest simx -- react-ts
cd simx
```

> The remaining steps assume your main branch is named "master", you initialized your subproject in the `/simx` folder and it has certain npm scripts defined in package.json. Your actual setup may vary. That shouldn't be a problem. Just adapt the instructions to fit your configuration.

Install dependencies

```bash
npm i
```

### Test your simx locally

Start the local development server:

```bash
npm run dev
```

Then load your site in a browser, e.g.: http://localhost:3000

To get the most out of the following steps, first ensure your placeholder simx site is working properly on localhost.

### Fine-tune simulator extension project configuration

Simulator extensions will not be served from site root in production. This may require changes to the build configuration.

If using Vite, add the `base` option to your `vite.config.js` file to specify relative pathing:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [react()],
  base: "./",
})
```

### Create GitHub action for publish

Simulator extensions must be published to GitHub pages.

In the root of your repo, create the subfolder `.github/workflows` and copy this repo's `.github/workflows/build-simx.yml` file to that folder.

Edit anything that looks different from the sample configuration.

### Commit your changes

Commit your changes and push everything to GitHub.

```bash
git add .
git commit -m "add simulator extension"
git push
```

### Run the `Build Simulator Extension` GitHub Action

Back at github.com in your repo, click on the **Actions** tab, then **Build Simulator Extension**.

On the right-hand side of the page click **Run workflow**, and run from `master`.

Wait for the workflow to complete. This will create the `gh-pages` branch.

### Setup GitHub Pages in your repo

On your repo's main page, click on the **Settings** tab, then **Pages**.

Under **Build and deployment** change the branch to `gh-pages` then click **Save**.

Changing the Pages branch will kick off a publish workflow. Wait a minute for it to complete, then click **Visit site** at the top of the page. A new tab will open and you should see your placeholder simx site.


## Testing your simulator extension in MakeCode

### Host MakeCode locally

To test your extension you must be hosting the MakeCode editor locally. Follow the steps [here]() to get setup for MakeCode localhost development.

Once you're successfully serving the MakeCode editor locally, proceed to the next step.

### Configure your extension in `targetconfig.json`

> The following steps assume you have a MakeCode target workspace open in vscode. e.g. for microbit, this means you opened the file `microbit.vscode-workspace` located in your clone of the `pxt-microbit` repo.

Locate the file `targetconfig.json`. It will be in the root of the target repo folder. e.g.: `pxt-microbit/targetconfig.json`

Add your extension to the `approvedRepoLib` section of `targetconfig.json`. The entry key must be your `"<organization name>/<repo name>"`. _(Note there are special exceptions to this for repos containing multiple extensions.)_

```json
{
    "packages": {
        // ...
        "approvedRepoLib": {
            // ...
            "eanders-ms/simx-test": {
                "simx": {
                    "sha": "5695afe18fa692a9327bb06104f2813b38d11542",
                    "devUrl": "http://localhost:5173"
                }
            }
        }
    }
}
```




To be continued...



# README
What follows is the default README common to all MakeCode extensions.

> Open this page at [https://eanders-ms.github.io/simx-test/](https://eanders-ms.github.io/simx-test/)

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/eanders-ms/simx-test** and import

## Edit this project

To edit this repository in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/eanders-ms/simx-test** and click import

#### Metadata (used for search, rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
