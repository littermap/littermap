# Litter Map

Humanity’s calling for the next hundred years is restoring natural beauty to Mother Earth. We believe that the planet is more of a being to be in communion with, rather than a resource to be extracted. To assist in this mission, we are providing a platform to help with global pollution and litter cleanup. This work belongs to the future of the human race, and therefore, we are using technology to provide community support for the cleanup effort. Its host of features is not just valuable to our users, but also to the planet itself.

## Mission

We are advancing humanity’s mission of waste and plastic-pollution cleanup for the protection of Nature from harm and to improve the lives of human and non-human inhabitants. We provide a hub for the mission of cleaning up the planet for many different individuals and organizations, and we aim to be the ultimate resource and center of the cleanup effort.

## Background

We are a team of deeply devoted environmentalists who have a passion for restoring natural beauty. The planet is our common home, we borrow it from our children, and we inherit it from our parents. Caring for our common home with all living things will call forth into the future a life with less war, famine, destruction, climate disaster, hate, and division.

## Community

Software development live sessions happen on discord https://discord.gg/JvEQMSQaYr.

Litter Map is also a registered nonprofit organization with open board meetings on discord.

# Technical Documentation

Web front-end for the Litter Map application.

## Technologies

- Interactive map powered by [Google Maps](https://developers.google.com/maps/documentation/javascript/)
- User interface built with [solid](https://www.solidjs.com/)
- Build system written in [gulp](https://github.com/gulpjs/gulp)
- Scripts and runtime dependencies bundled with [esbuild](https://esbuild.github.io/)
- SVG icons from [Font Awesome](https://github.com/FortAwesome/Font-Awesome)

## Get started

Set up the configuration file:

- `cp config-example.json config.json`

Edit `config.json` and fill in necessary details.

Install the [pnpm](https://pnpm.io/installation) package manager for managing dependencies and running development scripts.

Install dependencies:

- `pnpm i`

You can run a quick basic check on the configuration file with:

- `pnpm check-config`

Build the app:

- `pnpm build`

Start local server:

- `pnpm serve`

In a separate terminal, start the proxy that combines the front-end and back-end services under one host URL:

- `pnpm proxy`

The app should now be available at http://localhost:9999

If your browser complains about the self-signed SSL certificate, just bypass that warning.

## Development

Build and then monitor source files for changes, which automatically trigger a rebuild:

- `pnpm watch`

### Dependencies

Install them with `pnpm` and just `import` them in the scripts. The build system is going to automatically roll everything into a self-contained bundle and insert it into the end product.

To check if new versions of packages exist:

- `pnpm outdated`

To update the dependencies to the newest versions:

- `pnpm up --latest`

### Local testing

Use [ngrok](https://ngrok.com/) as an internet HTTPS proxy to the local HTTP proxy started with `pnpm proxy` for HTTPS support:

- `ngrok http 9999`

For example, certain browsers may silently [refuse to perform geolocation](https://www.ghacks.net/2017/03/14/firefox-55-geolocation-requires-secure-origin/) in an insecure context.

For Google Sign-in to work, the OAuth URL will need to be white-listed in the Google OAuth client profile settings (see backend documentation).

#### Testing on an Android device while serving from another machine

While the website can be loaded from another machine serving it over a network, Google Sign-in will refuse to log you in if the redirect URL is not from an approved domain. Google OAuth will refuse to white-list a local IP, so the solution is to specify `localhost` as the redirect target (which it does accept) and then to use a local forwarding proxy to fetch the website over the network.

- Install `termux` from the [F-Droid](https://f-droid.org/) repository
- Run `pkg install nodejs openssl-tool`
- Run `npm i -g https-proxy-cli`
- Run `https-proxy -p 9999 -t https://<IP-OF-SERVER-MACHINE>:9999`
- Load website via https://localhost:9999

### Tips

Check which packages depend on a node package:

- `pnpm ll --depth 999 <package>`

## Known issues

- Firefox currently has a [bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1400856) which prevents source maps from working for scripts inlined inside the HTML document

## Caveats

- The final JS and CSS from the build process are injected into the HTML after it is built from the Pug source. The project is at the moment using an experimental update to the `gulp-inject` plugin for `gulp` to do it. See: [klei/gulp-inject#279](https://github.com/klei/gulp-inject/pull/279)

- Since Windows uses back slashes (`\`) as path separators (which can be [traced](https://retrocomputing.stackexchange.com/questions/4695/slash-versus-backslash-as-directory-separator-what-who-caused-this-rift) to a decision made in MS-DOS 2.0), the build script might need significant [modifications](https://shapeshed.com/writing-cross-platform-node/#use-pathresolve-to-traverse-the-filesystem) to its path handling in order to run properly on Windows

## Knowledge resources

### General

- [Introduction to JavaScript](https://developer.mozilla.org/docs/Web/javascript)
- [Using source maps for debugging](https://developer.mozilla.org/docs/Tools/Debugger/How_to/Use_a_source_map)
- [Debugging on mobile with Firefox](https://developer.mozilla.org/docs/Tools/about:debugging)
- [Node package managers: NPM vs Yarn vs PNPM](https://javascript.plainenglish.io/npm-yarn-pnpm-which-node-js-package-manager-should-you-use-a2a1378694f7)

### User interface

- [Stylus cheatsheet](https://devhints.io/stylus)
- [A look at solid](https://codechips.me/solidjs-first-look/)
- [solid: documentation](https://www.solidjs.com/docs/latest)
- [solid: examples](https://github.com/solidjs/solid/blob/main/documentation/resources/examples.md)
- [Learn to code reactive front-ends with Solid](https://www.youtube.com/watch?v=j8ANWdE7wfY&list=PLkHoRc4IcLDqAAvA1y8cT8CXkgfBbhRp3) (playlist)
- [JSX syntax in-depth](https://reactjs.org/docs/jsx-in-depth.html)
- [Dealing with sticky :hover effects on mobile](http://www.javascriptkit.com/dhtmltutors/sticky-hover-issue-solutions.shtml)

### Google Maps API

- [API reference](https://developers.google.com/maps/documentation/javascript/reference)
- [API reference: Info windows](https://developers.google.com/maps/documentation/javascript/infowindows)
- [API reference: Street View](https://developers.google.com/maps/documentation/javascript/streetview)
- [Choosing the Google Maps API release channel](https://developers.google.com/maps/documentation/javascript/versions)
- [Accessibility features in Google Maps API](https://cloud.google.com/blog/products/maps-platform/improved-accessibility-maps-javascript-api)
- [Google Maps API feature requests and issue tracker](https://issuetracker.google.com/issues?q=componentid:188853)

### Build system

The build tasks are orchestrated with Gulp, which takes knowledge to master but enables a high level of flexibility and performance with a concise formulation.

- [Gulp examples](https://github.com/gulpjs/gulp/tree/master/docs/recipes)
- [Vinyl file descriptor API](https://github.com/gulpjs/vinyl#api)