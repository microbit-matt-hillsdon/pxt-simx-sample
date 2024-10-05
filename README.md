
# Simulator Extension Sample

## What is a simulator extension?

Simulator extensions (_simx_ for short) are static web applications that are loaded into the MakeCode editor alongside the main simulator. When an extension containing a _simx_ is added to a MakeCode project, its _simx_ will load into a separate iframe in the MakeCode editor.

Simulator extensions must be implemented as part of a standard MakeCode extension. They exist as a separate project in a subfolder, out of the way of the main extension's implementation.

## Creating a simulator extension

The simplest way to make a simulator extension is to fork this repo, then edit and extend it to suit your purpose.

See [./simx/README.md](./simx/README.md) for detailed instructions.











To be continued...



# README
What follows is the default README common to all MakeCode extensions.

> Open this page at [https://eanders-ms.github.io/simx-sample/](https://eanders-ms.github.io/simx-sample/)

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/eanders-ms/simx-sample** and import

## Edit this project

To edit this repository in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/eanders-ms/simx-sample** and click import

#### Metadata (used for search, rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
