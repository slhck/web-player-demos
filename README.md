# JW Developer Demos

This repository is for managing the [JW Player Developer Demos](https://www.jwplayer.com/developers/web-player-demos/). It includes demos and code samples from the JW Player team as well as a Developer Showcase highlighting demos submitted by our developer community.

## Demo Setup

All JW Developer demos can be downloaded and run locally. Build instructions and required components are outlined below.

### Build Instructions

If you don't already have Node.js, please [download and install](//nodejs.org/en/download/) it now.

Then, from the project root directory, `web-player-demos/`:

Install node dependencies:

```
yarn install
```

Run Grunt to compile changes:

```
grunt
```

Run Grunt to compile changes and serve locally:

```
yarn start
```

## Contributing a Demo

### Demo Structure

Each demo contains the following elements:

	assets/
	css/
		style.css
	js/
		main.js
	config.json
	index.html

Only `index.html` and `config.json` are required for the build. In a basic setup, `index.html` must contain a single line player embed and `config.json` must include the demo title, description, and license.

Local assets (such as images, .txt files, etc...) referenced within the demo should be saved in the `assets` directory.


#### Please note
By submitting you are agreeing to license your demo under the Apache 2.0 license.

### Config File

The `config.json` file provides metadata about your demo. It will be used to populate information about your demo on the page. Only title, description, and license are required to build the demo, but we ask that you complete all fields for Developer Showcase demo submissions.

```
{
  "title": "",
  "description": "",
  "license": "Free|Premium|Ads|Enterprise",
  "showCode": true|false,
  "layout": "horizontal|vertical",
  "apiCalls": [],
  "author": {
  	"name": "",
  	"githubUsername": ""
  }
}
```

Key | Type | Value Description
:--- | :--- | :---
`title` | `string` | Demo title*
`description` | `string` | A brief description of your demo*
`license` | `string` | The license type necessary to recreate your demo*
`showCode` | `boolean` | Displays demo player with code snippet when `true`, without code snippet when `false`
`layout` | `string` | Displays code snippet to right of demo player on `horizontal` or under demo player on `vertical`
`apiCalls` | `array` | List of JW Player Javascript API calls used in your demo. For example: `.on('ready')`
`author.name` | `string` | Your name
`author.githubUsername` | `string` | Your GitHub username

