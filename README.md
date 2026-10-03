# owntracks

Location history is only useful when it is legible. This is a React dashboard that reads a GraphQL API over a
web socket and draws what comes back — tables and charts from `antd` and `@ant-design/plots`, and a 3-D
force graph for the shape of the movement between points.

The name follows the data it was built around: OwnTracks-style location records.

## What it does

- Talks to a GraphQL endpoint over HTTP **and** over `graphql-ws`, so new positions arrive without a refresh.
- Renders with `@apollo/client`, `antd`, `dayjs`, `react-router-dom` and `react-force-graph-3d`.
- Reports page views to Google Analytics with `react-ga4`.
- Carries `react-helmet` for per-route document titles.

## Run it

```bash
npm install
cp .env.example .env
npm start        # react-scripts, http://localhost:3000
```

`.env`:

| Variable | What it is |
|---|---|
| `REACT_APP_GRAPHQL_URI` | the GraphQL endpoint the dashboard reads |
| `REACT_APP_GITHUB_ORG` | the organisation shown in the interface |

```bash
npm run build    # production bundle
npm test         # standard --verbose
```

## Layout

```
src/
  App.js               app shell and routing
  GraphqlClient.js     the Apollo client, HTTP and web socket links
  components/          the panels
  layout/              page chrome
  site/                pages
```

## Licence

MIT — see [LICENSE](./LICENSE).
