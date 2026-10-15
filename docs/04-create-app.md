# Create an app: every field explained

Path: **App directory → Home → Add solution** (first time: **+ Become developer**).

## General Information tab

| Field | Required | Notes |
|---|---|---|
| Name | Yes | Shown to users. |
| SendPulse tool | Yes | The tool you integrate with. Becomes the listing category. |
| Scopes | Yes for apps | Tools whose data you access via REST API. Shown to the user on install. See [Scopes](05-scopes.md). |
| Description | Yes (English) | What the app does and what the user gets. |
| Key features | Yes | Concrete actions with user data, e.g. "Automatically create tasks for missed calls". |
| Setup guide | Yes | How to install, configure and manage the app. |
| Logo | Yes | 250×250 px, PNG/JPG/JPEG, ≤ 2 MB. |
| Install URL | Yes | HTTPS endpoint accepting both GET and POST. Receives `code` and `lang` each time the user opens the app, and is loaded in an iframe inside SendPulse. See [Authorization flow](06-authorization-flow.md). |
| Uninstall URL | Yes | HTTPS endpoint accepting POST. Receives user and key data on uninstall. See [Uninstall webhook](08-uninstall-webhook.md). |
| Support information | Yes | Email for user questions. SendPulse notifications (including review results) go here. |
| Privacy Policy link | Yes | How you collect and use personal data. |

Click **Save**. The app enters **testing mode**.

## Additional details tab

- **Categories**: tags for discovery.
- **App screenshots**: JPEG/PNG/JPG, up to 1600×900 px. Set the SendPulse UI language to English before taking them.
- **+ Add description in another language**: localized descriptions for languages SendPulse supports (e.g. Spanish for LATAM, Portuguese for Brazil, Ukrainian).

Optional for private apps and when you plan to fill it later.

## Monetization tab

Keep free or enable a one-time payment / annual subscription. See [Monetization](12-monetization.md).

## App availability tab (private apps)

Account emails of SendPulse users who can install the app. See [Add a user to a private app](03-solution-types.md#add-a-user-to-a-private-app).

## Where to find your keys

**App directory → Created → ⋯ next to the app → Edit** → copy **App ID** and **Secret key**. Store them as server-side secrets (`SENDPULSE_APP_ID`, `SENDPULSE_APP_SECRET`). Never ship them to the browser or commit them to git.

## Manage

Statuses and actions (Preview, Submit for review, Edit, Delete): see [Manage your solutions](15-manage-solutions.md).
