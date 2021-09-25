Web front-end for the Litter Map project.

## Technologies

- Interactive map built with [leaflet](https://leafletjs.com/)
- Build system written in [gulp](https://github.com/gulpjs/gulp)
- Scripts and runtime dependencies bundled with [esbuild](https://esbuild.github.io/)

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

Build and then watch source files for changes to trigger a rebuild:

- `yarn watch`

### Dependencies

Install them with `yarn` and `import` them in the scripts. The build system is going to automatically roll everything into a self-contained bundle and insert it into the end product.

## Known issues

- Firefox currently has a [bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1400856) which prevents source maps from working for scripts inlined inside the HTML document

## Caveats

- Leaflet performs unconventional rewriting tricks with the image URLs in its styles at runtime which prevents a dependency bundler from pulling in all of the image files into the build, so the current solution is to automatically apply a patch from this [pull request](https://github.com/Leaflet/Leaflet/pull/6951) after installing Leaflet

  If the package manager resets Leaflet without re-patching it (such as after removing a package with `yarn remove`), just run: `yarn patch`

- Since Windows uses back slashes (`\`) as path separators (which can be traced to a feature of MS-DOS 2.0), the build script might need significant [modifications](https://shapeshed.com/writing-cross-platform-node/#use-pathresolve-to-traverse-the-filesystem) to its path handling in order to run properly on Windows

## Knowledge resources

- [Using source maps for debugging](https://developer.mozilla.org/docs/Tools/Debugger/How_to/Use_a_source_map)
- [Node package managers: NPM vs Yarn vs PNPM](https://javascript.plainenglish.io/npm-yarn-pnpm-which-node-js-package-manager-should-you-use-a2a1378694f7)

### Build system

The build tasks are orchestrated with Gulp, which takes time to master but accommodates extreme flexibility and performance while also making possible a relatively concise formulation.

- [Gulp examples](https://github.com/gulpjs/gulp/tree/master/docs/recipes)
- [Vinyl file descriptor API](https://github.com/gulpjs/vinyl#api)