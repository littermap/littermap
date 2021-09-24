Web front-end for the Litter Map project.

## Built with...

- Interactive map built with [leaflet](https://leafletjs.com/)
- Build system written in [gulp](https://github.com/gulpjs/gulp)
- Front-end dependencies bundled with [browserify](https://github.com/browserify/browserify) and [browserify-css](https://github.com/cheton/browserify-css)

## Get started

Set up the configuration file:

- `cp config-template.json config.json`

Edit `config.json` and configure the base URL of the back-end service.

Install dependencies:

- `yarn`

Build the product:

- `yarn build`

Launch the app in a browser:

- `open build/index.html`

## Development

To see list of available scripts:

- `yarn run`

### Dependencies

Install them with `yarn` and `require()` them in the scripts. The build system is going to automatically roll everything into a self-contained bundle and insert it into the end product.

## Known issues

- Source maps are off by 3 lines (reason not yet established)

## Caveats

- Leaflet performs unconventional tricks with the image URLs in its styles at runtime which prevents a dependency bundler from pulling in all of the image files into the build, so the current solution is to automatically apply a patch from this [pull request](https://github.com/Leaflet/Leaflet/pull/6951) as a post-install step after installing Leaflet
- Since Windows uses back slashes (`\`) as path separators (which can be traced to a feature of MS-DOS 2.0), the build script might need significant [modifications](https://shapeshed.com/writing-cross-platform-node/#use-pathresolve-to-traverse-the-filesystem) to its path handling in order to run properly on Windows

## Knowledge resources

- [Bundling front-end dependencies with Browserify](https://stackoverflow.com/questions/50132531/bundle-leaflet-for-use-in-browser#50139624)
- [Using source maps for debugging](https://developer.mozilla.org/docs/Tools/Debugger/How_to/Use_a_source_map)
- [Gulp examples](https://github.com/gulpjs/gulp/tree/master/docs/recipes)