# SrVoc

## Publish release
* Change the version in package.json and merge code.
* Create a release draft on github
* Run `npm run electron:build -- -p always`
* Release draft from github repository

Messaging
```vue
import { ipcRenderer } from "electron";

ipcRenderer.on("event_name", (event, args) =>
  action(args)
);
```
Background
```vue
const contextMenu = require("electron-context-menu");

contextMenu({
    prepend: (defaultActions, { selectionText }, browserWindow) => [
      {
        label: "Search Hayyim Dictionary",
        visible: selectionText.trim().length > 0,
        click: () => {
        browserWindow.send("search-hayyim-dictionary", selectionText.trim());
      }
    },
    {
    label: "Search Wiktionary",
    visible: selectionText.trim().length > 0,
    click: () => {
    browserWindow.send(
    "search-wiktionary-dictionary",
    selectionText.trim()
    );
  }
  }
  ]
});
```
