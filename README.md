# SendPulse Developer Docs & Marketplace

What **SendPulse** is and how it positions itself, plus the complete guide to building apps that SendPulse users install from the **SendPulse App Directory** (marketplace). Written for developers and for AI assistants (Context7, Cursor, Claude Code, Copilot, Windsurf and others).

Start with [About SendPulse](docs/00-about-sendpulse.md) and [App Directory overview](docs/01-overview.md).

## What you can build

| Solution type | Where it runs | Installed from SendPulse | Uses install/token flow |
|---|---|---|---|
| Public app | Your server, opened inside a SendPulse account | Yes, after moderation | Yes |
| Private app | Your server, available to SendPulse accounts you add by email | Yes | Yes |
| External integration | Set up and managed on your own site | No (listing links out) | No |

## How an app works in 4 calls

```text
1. User clicks Install → grants scopes
2. SendPulse → GET|POST https://YOUR_INSTALL_URL/?code={code}&lang=en    (in an iframe; code valid 1 min)
3. Your server → POST https://api.sendpulse.com/market-service/oauth/authorize
                  { app_id, secret, code }  →  { client_id, client_secret }
4. Your server → POST https://api.sendpulse.com/oauth/access_token/market
                  { client_id, client_secret, grant_type: "client_credentials" }  →  { access_token, expires_in }
   Then: Authorization: Bearer {access_token} on SendPulse REST API calls.
On uninstall: SendPulse → POST https://YOUR_UNINSTALL_URL  (user + keys JSON), reply 200 OK.
```

## Docs

0. [About SendPulse: positioning, products, AI, audiences](docs/00-about-sendpulse.md)
1. [App Directory overview: for users and developers](docs/01-overview.md)
2. [Quickstart: first app in 15 minutes](docs/02-quickstart.md)
3. [Solution types: public, private, external integration](docs/03-solution-types.md)
4. [Create an app: every field explained](docs/04-create-app.md)
5. [API scopes](docs/05-scopes.md)
6. [Install and user authorization flow](docs/06-authorization-flow.md)
7. [User access token](docs/07-access-token.md)
8. [Uninstall webhook](docs/08-uninstall-webhook.md)
9. [Calling the SendPulse REST API from your app](docs/09-calling-the-api.md)
10. [App Directory UI Kit](docs/10-ui-kit.md)
11. [Review and publishing](docs/11-review-and-publishing.md)
12. [Monetization](docs/12-monetization.md)
13. [Custom Telephony Starter Kit (PHP/Laravel)](docs/13-telephony-starter-kit.md)
14. [Troubleshooting and FAQ](docs/14-troubleshooting.md)
15. [Manage your solutions: statuses and actions](docs/15-manage-solutions.md)
16. [Security checklist](docs/16-security.md)

## Examples

- [Node.js + Express](examples/node-express/) — install, token, uninstall, sample API call
- [Python + Flask](examples/python-flask/) — the same flow in Python

## Links

- App Directory for developers: https://sendpulse.com/partners/developer
- Help Center, developer section: https://sendpulse.com/knowledge-base/app-directory/developers
- SendPulse REST API reference: https://sendpulse.com/integrations/api
- SendPulse MCP server: https://sendpulse.com/features/mcp
- Figma UI Kit: https://www.figma.com/design/35Pifp7O3PssNIutU2JM9Q/SendPulse-App-Marketplace-UI-Kit
- Packagist PHP package: https://packagist.org/packages/sendpulse/market-rest-api
