# Soundtrack Interview Case

This is the Soundtrack interview case for frontend developers. It relies on a number of libraries and tools used at Soundtrack to help you quickly get started:

- [Vite](https://vite.dev/) - Build tooling and bundler, comes with [many features](https://vite.dev/guide/features.html) you can optionally enable (such as SCSS/LESS support)
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [React](https://react.dev/) - Library which we build user interfaces with
- [GraphQL](https://graphql.org/) - Our public APIs are almost exclusively accessed through GraphQL
- [urql](https://github.com/urql-graphql/urql) - Lightweight GraphQL JavaScript client
- [gql.tada](https://github.com/0no-co/gql.tada) - Provides TypeScript types for GraphQL queries and documents

Feel free to access the [Soundtrack API Playground](https://api.soundtrackyourbrand.com/v2/explore)
if you want to quickly explore the API - a lot of queries can be done without authentication.
We also provide additional [GraphQL API docs](https://api.soundtrackyourbrand.com/v2/docs) -
including some information about how to authenticate if you really want to go
wild, but this is usually more work than what we expect from your project.

If you try deploying the app to a domain you'll likely encounter
[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) errors when
attempting to access our APIs. This is expected - as long as you (and we) can
run the app locally you're good to go.

## Getting started

```sh
git clone git@github.com:soundtrackyourbrand/soundtrack-interview-project.git
cd soundtrack-interview-project
npm install
npm start
```

**App entry point: [src/app/App.tsx](src/app/App.tsx).**

## VS Code

If you use VS Code, make sure to allow using the workspace TypeScript version when prompted, as this is needed for `gql.tada`.
Check [the `gql.tada` documentation](https://gql-tada.0no.co/get-started/) if you run into issues.

We also provide a list of [recommended VS Code extensions](.vscode/extensions.json) which should improve your workflow, including providing intellisense for GraphQL queries.

## Possible things to implement

- [ ] Add some style, preferably without integrating an entire CSS framework
- [ ] Make the page and list responsive
- [ ] Add animations (loading spinner, fade/slide in entries, etc.)
- [ ] Fade in album art when loaded, while displaying a placeholder until the image has finished loading (`track.display.colors.*` can be used here)
- [ ] Allow user to change which zone to display (see `SOUNDTRACK_ZONES` for a selection of zone ids)
- [ ] Display the currently playing track with cover art in one column, and a track history list in another
- [ ] Only display the currently playing track in a kiosk-like mode
- [ ] Link tracks/artists to `https://business.soundtrackyourbrand.com/search/{id}`
- [ ] Display entry timestamp in a relative format (X seconds/minutes/hours ago) + extra credits if it stays updated
- [ ] Utilize any other data available in each entry

But don't let these suggestions limit you! Feel free to get creative with the data available via the GraphQL API and make something cool.

## Glossary

- **Account / Company:** A business or company of some sort. An account can have any number of _locations_, _zones_, and _users_.
- **Location:** A place with a specific (street) address, containing any number of _zones_. Locations belong to an _account_. As an example, a chain of five restaurants would have a location for each restaurant.
- **Zone / Sound Zone:** An individual area within a _location_ that can play a unique stream of music. As an example, a hotel might have three zones; bar, lobby and restaurant.
- **User:** A person that has access to any number of _accounts_. Authenticates via email+password, SSO/SAML, or auth/refresh tokens.
