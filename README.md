# JW Developer Demos

This repository is for managing the [JW Player Developer Demos](https://www.jwplayer.com/developers/web-player-demos/). It includes demos and code samples from the JW Player team as well as a Developer Showcase highlighting demos submitted by our developer community.

## Demo Setup

All JW Developer demos can be downloaded and run locally. Build instructions and required components are outlined below.

### Build Instructions

This project uses [Yarn](https://yarnpkg.com/) and
[Node.js](https://nodejs.org/en/download/). Install Node dependencies with
`yarn install`, then build the project with Grunt with `yarn build`. You can
also start a local server and watch changes locally with `yarn start`.

## Contributing a Demo

### Demo Structure

Each demo contains the following elements:

	assets/
	config.json
	demo.js
	index.html
	style.css

Only `index.html` and `config.json` are required for the build. `index.html`
should contain a single-line player embed and `config.json` must include the
demo `title` and `description`.

You can add a `library` property to your demo's `config.json` to automatically
load a JW Player JavaScript API library. You can then call `jwplayer()` in your
`demo.js` script. Alternatively, you can provide a full player id from a
single-line embed with the `player` property.

Local assets (such as ad schedules or images) referenced within the demo should
be saved in the `assets` directory. You can add additional scripts and
stylesheets to the `scripts` and `stylesheets` arrays, respectively.

#### Please note
By submitting a demo, you are agreeing to license your demo under the Apache 2.0
license.

### Config File
The `config.json` file provides metadata about your demo. It will be used to
populate information about your demo on the page. Only title and description are
required to build the demo, but we ask that you complete all fields for demo
submissions.
```
{
  "title": "",
  "description": "",
  "license": "Free|Premium|Ads|Enterprise",
  "showCode": true|false|"css",
  "apiCalls": [],
  "author": {
  	"name": "",
  	"githubUsername": ""
  },
  "library": "",
  "player": ""
}
```

Key | Type | Value Description
:--- | :--- | :---
`title` | `string` | Demo title*
`description` | `string` | A brief description of your demo*
`license` | `string` | The license type necessary to recreate your demo*
`showCode` | `boolean` \| `string` | Displays demo player with code snippet when `true`, without code snippet when `false`
`layout` | `string` | Displays code snippet to right of demo player on `horizontal` or under demo player on `vertical`
`apiCalls` | `array` | List of JW Player Javascript API calls used in your demo. For example: `.on('ready')`
`author.name` | `string` | Your name
`author.githubUsername` | `string` | Your GitHub username
`library` | `string` | A JW Player library id. It will automatically add a `script` tag and include the library to be used in `demo.js`.
`player` | `string` | A JW Player full id, containing a library id and a media id. This will automatically add a `script` tag containing a single-line embed on the page.

