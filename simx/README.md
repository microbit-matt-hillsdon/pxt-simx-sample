# `simx-sample` Simulator Extension

The `simx-sample/simx` webapp was created with [Vite](https://vitejs.dev) + [React](https://react.dev) + [TypeScript](https://typescriptlang.org), though none of these frameworks are required. You are free to use any framework you like, as long as:
* the app is packaged as a static web application.
* the app is published to GitHub Pages.

## Developing and testing your simulator extension

> [!NOTE]
> The following instructions assume your extension targets microbit. If you're developing for a different target (e.g. Arcade), simply replace `pxt-microbit` with the appropriate repository name (e.g. `pxt-arcade`). All other steps remain the same.

### Prerequisite setup

1. **Get setup for local MakeCode development**

    Follow the instructions [here](https://github.com/microsoft/pxt-microbit#local-server-setup) to get setup for local MakeCode development, **with one modification**: Because you will be creating a pull request for your extension registration, **you must fork the target repo** rather than simply cloning it.

> [!IMPORTANT]
> Where the linked instructions say to clone the `pxt-microbit` repo, you will _clone your fork_ of the `pxt-microbit` repo.

2. **Run local MakeCode server**

    Ensure you can successfully host the MakeCode editor locally.

    Continue following the instructions linked above (also [here](https://github.com/microsoft/pxt-microbit#running)) to host the MakeCode editor locally.

    You should see MakeCode open in a browser, served from `http://localhost:3232`.

> [!TIP]
> You may have to restart `pxt serve` occasionally. After you've successfully run it once, the essential packages will have been built. To skip rebuilding them on subsequent runs, add the __--just__ argument.
>
> If you don't want `pxt serve` to open a new browser tab every time you start it, add the __--noBrowser__ argument.
>
> ```bash
> pxt serve --just --noBrowser`
> ```


> [!NOTE]
> The remaining instructions assume you are **using the MakeCode Editor hosted locally**.

### Init your new simulator extension

A MakeCode extension that includes a simulator extension (referred to as 'simx') is actually composed of two separate projects within the same repository. Each of these projects is developed in a different way. The code for the MakeCode extension is written within the MakeCode editor, while the simx is developed using more traditional development tools and workflows.

Start creating a simulator extension by **forking this repo** to your organization's GitHub. At the same time, **rename the repo** to suit your purpose.

  ![fork and rename repo](./assets/fork-sample-repo.png)

### Developing the code extension

As noted earlier, the code portion of the extension is developed in MakeCode. An added caveat is that you must import your project into MakeCode from GitHub. This enables MakeCode to sync changes with the repo.

#### Import repo to MakeCode

Import your newly cloned repo into MakeCode as a new project.

1. On the MakeCode home page, click the **Import** button:
  
  ![new project import repo](./assets/import-project-button.png)

2. Choose the **Import GitHub Repo** option. This will link your local project and the source repo, allowing MakeCode to sync changes from the editor.

  ![import github repo](./assets/import-github-url.png)

3. Chore: Once the project opens, it will still be named 'simx-sample'. Go ahead and **rename the extension**.

  ![rename and push](./assets/rename-and-push.png)

4. Chore: Update the message channel.

  The message channel is a unique string that identifies messages as belonging to your extension. It must be changed to to match your extension name.

  1. Switch to the JavaScript editor
  2. Expand the file explorer below the simulator
  3. Open the `custom.ts` file
  4. Update the value of SIMX_CHANNEL:

      ![simx channel](./assets/cod-ext-message-channel.png)

      Bonus: Update the namespace name as well. This will change the name of the category where your extension's blocks show up in the toolbox.

5. Push your changes to GitHub.

You are now set up to develop the code portion of your extension! See [this page](https://github.com/microsoft/pxt/blob/master/docs/extensions.md) for more information on extension development.


### Developing the simulator extension

As noted earlier, the simulator extension is a web application. As such, development is done using tools and workflows that will be familiar to many developers. To get started:

1. **Clone your new repo**

    Clone the repo to your local machine.

    On a command prompt:

    ```bash
    > git clone https://github.com/your-org/my-extension
    ```

2. **Install simx dependencies**

    On the same command prompt:

    ```bash
    > cd my-extension/simx
    > npm i
    ```

3. **Open cloned folder in your preferred editor**

    These instructions will assume Visual Studio Code, but any editor will do.

    Even though your changes in this repo will be scoped to the `simx` folder, go ahead and open the repo root in your editor.

4. **Chore: Rename the webapp**

    Internally, the webapp will still be named "@eanders-ms/simx-sample". Open the file `simx/package.json` and updated the name (e.g. "@your-org/my-extension"), then push your changes to GitHub.

5. **Run the local dev server**

    On a command prompt open to the `simx` folder, start the dev server.

    ```bash
    > npm run dev
    ```

    This will start a development server. Make note of the localhost URL and port number. For these instructions we will assume `http://localhost:5173`

6. **Register your extension with pxt-microbit**

    1. Open your cloned `pxt-microbit` folder in vscode.

    2. Open the file `targetconfig.json`.

    3. Find the `approvedRepoLib` section.

    4. At the end of this section, add an entry for your new extension:

        ```json
        "your-org/my-extension": {
          "simx": {
            "sha": "", // We'll fill this in later
            "devUrl": "http://localhost:5173"
          }
        }
        ```

    5. For this configuration change to take effect, you must restart `pxt serve` and refresh your MakeCode tabs.


### Developing and testing

To test your extension end to end, you will create a new MakeCode project to integrate them.

1. In your browser, create a new tab and open your locally running MakeCode (e.g. `http://localhost:3232`).

2. Create a new project, name it something like "my extension test".

3. In the editor, add your extension to the project from GitHub URL:

    Click the extensions toolbox category

    ![extensions toolbox category](./assets/extensions-btn.png)

    Enter your GitHub repo URL and press Enter

    ![extension github url](./assets/ext-github-url.png)

    Add your extension to the project

    ![extension load card](./assets/ext-load-card.png)

4. Next, we must instruct MakeCode to load your simulator from the local dev server. Do this by adding the url parameter `simxdev`.

> [!NOTE]
> This parameter only works run hosting MakeCode locally.

5. Once the page reloads, you should see your simulator extension load below the main simulator!


#### Refreshing the code extension

When you make changes to your code extension and push them to GitHub, you will need to pull those changes into your test project. This is done by refreshing the dependency in the File Explorer:

  ![refresh extension](./assets/refresh-ext.png)

> [!NOTE]
> The File Explorer is not accessible from the Blocks editor. Switch to JavaScript to find it.

#### Refreshing the simulator extension

#### Publishing the simulator extension

