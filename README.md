
> Open this page at [https://eanders-ms.github.io/simext-test/](https://eanders-ms.github.io/simext-test/)

# Simulator Extension Sample

## What is a simulator extension?

## Creating a simulator extension

### Create a traditional MakeCode extension

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
npm create vite@latest simext -- react-ts
cd simext
```

> The remaining steps assume your main branch is named "master", you initialized your subproject in the `/simext` folder and it has certain npm scripts defined in package.json. Your actual setup may vary. That shouldn't be a problem. Just adapt the instructions to fit your configuration.

Install dependencies

```bash
npm i
```

Optional: Test your simext locally

```bash
npm run dev
```

### Fine-tune simulator extension project configuration

Simulator extensions will not be served from site root in production. This may require build configuration changes.

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

In the root of your repo, create the subfolder `.github/workflows` and copy this repo's `.github/workflows/build-simext.yml` file to that folder.

Edit anything that looks different from the sample configuration.


### Commit your changes

Commit your changes and push everything to GitHub.

### Setup GitHub Pages in your repo

Back at github.com, enable GitHub Pages for your repo.




# README
What follows is the default README for all MakeCode extensions.

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/eanders-ms/simext-test** and import

## Edit this project

To edit this repository in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/eanders-ms/simext-test** and click import

#### Metadata (used for search, rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
