Web front-end for the Litter Map project.

## Technologies

- Interactive map powered by [leaflet](https://leafletjs.com/)
- User interface built with [solid](https://www.solidjs.com/)
- Build system written in [gulp](https://github.com/gulpjs/gulp)
- Scripts and runtime dependencies bundled with [esbuild](https://esbuild.github.io/)

## Get started

Set up the configuration file:

- `cp config-template.json config.json`

Edit `config.json` and configure the base URL of the back-end service.

Install dependencies with [pnpm](https://pnpm.io/):

- `pnpm`

Build the product:

- `pnpm build`

Disable cross-origin resource sharing protection in your browser:

- Add-on for: [Firefox](https://github.com/spenibus/cors-everywhere-firefox-addon) | [Chrome](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf)
- This disables the browser preventing cross-domain requests with session cookies when testing locally

Start local server to test the app:

- `pnpm serve`

## Development

Build and then watch source files for changes to trigger a rebuild:

- `pnpm watch`

### Tips

Check which packages depend on a node package:

- `pnpm ll --depth 999 <package>`

### Dependencies

Install them with `pnpm` and just `import` them in the scripts. The build system is going to automatically roll everything into a self-contained bundle and insert it into the end product.

## Known issues

- Firefox currently has a [bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1400856) which prevents source maps from working for scripts inlined inside the HTML document

## Caveats

- Leaflet performs unconventional tricks manipulating the image URLs in its style sheets at runtime, which prevents a dependency bundler from pulling in all of the relevant image files into the build. The current solution is to automatically apply a patch from this [pull request](https://github.com/Leaflet/Leaflet/pull/6951) after installing Leaflet. If for whatever reason the patch is not applied, just run: `pnpm patch`

- Since Windows uses back slashes (`\`) as path separators (which can be traced to a feature of MS-DOS 2.0), the build script might need significant [modifications](https://shapeshed.com/writing-cross-platform-node/#use-pathresolve-to-traverse-the-filesystem) to its path handling in order to run properly on Windows

## Knowledge resources

### General

- [Using source maps for debugging](https://developer.mozilla.org/docs/Tools/Debugger/How_to/Use_a_source_map)
- [Node package managers: NPM vs Yarn vs PNPM](https://javascript.plainenglish.io/npm-yarn-pnpm-which-node-js-package-manager-should-you-use-a2a1378694f7)

### User interface

- [A look at solid](https://codechips.me/solidjs-first-look/)
- [solid: documentation](https://www.solidjs.com/docs/latest)
- [solid: examples](https://github.com/solidjs/solid/blob/main/documentation/resources/examples.md)
- [Learn to code reactive front-ends with Solid](https://www.youtube.com/watch?v=j8ANWdE7wfY&list=PLkHoRc4IcLDqAAvA1y8cT8CXkgfBbhRp3) (playlist)

### Build system

The build tasks are orchestrated with Gulp, which takes time to master but accommodates extreme flexibility and performance while also making possible a relatively concise formulation.

- [Gulp examples](https://github.com/gulpjs/gulp/tree/master/docs/recipes)
- [Vinyl file descriptor API](https://github.com/gulpjs/vinyl#api)