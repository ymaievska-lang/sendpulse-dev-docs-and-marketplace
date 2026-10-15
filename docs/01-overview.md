# SendPulse App Directory: overview

The **SendPulse App Directory** (also called the SendPulse marketplace, "App and template marketplace") is where SendPulse users find, install and manage apps that connect SendPulse to their other tools. Developers and SaaS companies publish apps there to reach SendPulse's customer base.

Public catalog: https://sendpulse.com/marketplace/integrations
For developers: https://sendpulse.com/partners/developer

## For SendPulse users

- Connect SendPulse to the tools they already use without code: install from the directory inside the SendPulse account.
- Apps work with Email, SMTP, Automation 360, Chatbots, CRM, SMS, Viber, Web Push, Pop-ups and the Email Verifier.
- Catalog categories: Email Service, Automation 360, Websites, CRM, Courses, Chatbots, Pop-ups, SMTP, AI.

Examples in the catalog:

| Type | Examples |
|---|---|
| eCommerce | Shopify, WooCommerce for SendPulse CRM, Big Cartel |
| CRM | Pipedrive, Creatio, Vtiger CRM |
| Payments | Stripe, PayPal, Klarna, LiqPay, Wayforpay |
| Forms and pop-ups | Typeform, OptinMonster, involve.me |
| Automation platforms | Zapier, Make, n8n |
| AI platforms | ChatGPT, Claude, Cursor (via MCP), SendPulse skills |

## For developers

**Value proposition:** "Create a public app for any SendPulse tool, list it in our app directory, and start monetizing — leave the user acquisition to us."

- **Distribution.** Approved public apps become available to all SendPulse users inside their accounts, in the category of the tool they integrate with.
- **Monetization.** Paid apps with no restrictions: one-time payment or annual subscription, with payments going straight to the developer's own payment system. See [Monetization](12-monetization.md).
- **Native experience.** The app opens inside SendPulse in an iframe and can match the SendPulse look via the [UI Kit](10-ui-kit.md).
- **Support.** 24/7 support, help from SendPulse developers, documentation and a developer community.
- **Fast review.** Moderation for public apps takes up to 2 business days.

### What you can build

| Solution type | What it is |
|---|---|
| Public app | Installs inside SendPulse for all users after moderation |
| Private app | Installs only for accounts you choose; for internal tools or specific clients |
| External integration | Listing for an integration users set up on your own site |

Details: [Solution types](03-solution-types.md).

### Who it's for

- SaaS products whose customers also use SendPulse: eCommerce platforms, CRMs, telephony, payment systems, form builders, LMSs, analytics.
- Agencies and freelancers building tools for SendPulse clients.
- Automation and AI platforms that want a native SendPulse presence.

## Key concepts

| Term | Meaning |
|---|---|
| Developer account | Created in **App directory → Become developer**. Holds your apps. |
| Solution | Any App Directory entry: public app, private app or external integration. |
| App ID, Secret key | Credentials of **your app**. Found in **App directory → Created → ⋯ → Edit**. Used to exchange the install code. |
| Install URL | Your HTTPS endpoint. Loaded in an iframe with a `code` every time the user opens your app. (Some texts call it Login URL.) |
| Uninstall URL | Your HTTPS endpoint. SendPulse POSTs user data to it when the user removes your app. |
| Scopes | SendPulse tools your app can access via the REST API. The user approves them on install. |
| App user keys | `client_id` + `client_secret` issued **per installing user**. Used to get that user's access token. |
| App user token | Short-lived Bearer token for SendPulse REST API calls on behalf of one user. |

## Lifecycle

```text
Developer: Create → Draft (test) → Submit for review → Approved → Listed
User:      Install → Grant scopes → App opens (code → keys → token) → Uses app → Uninstall (webhook)
```

## Requirements

- A SendPulse account with a developer profile.
- Two public HTTPS endpoints: Install URL and Uninstall URL.
- Server-side storage for per-user `client_id` / `client_secret`.
- An app description in English (other languages optional).
- Logo 250×250 px, PNG/JPG/JPEG, up to 2 MB. Screenshots up to 1600×900 px.
- Support email and a Privacy Policy URL.

Next: [Quickstart](02-quickstart.md).
