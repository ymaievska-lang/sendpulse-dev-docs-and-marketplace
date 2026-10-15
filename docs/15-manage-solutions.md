# Manage your solutions

Path: **App directory → Home → Created → Applications** (external integrations: **Integrations** tab).

## Statuses

| Status | Meaning | Next step |
|---|---|---|
| Draft | Set right after creation. Only the creator can access it. | Test, then submit for review (public) or add users (private). |
| Under review | Submitted; moderators are checking it. | Wait up to 2 business days; watch the support email. |
| Approved | Passed review and is available in the directory. | Monitor installs and support requests. |
| Needs fix | A moderator returned it for revision. | Apply the requested changes and submit again. |
| Blocked | A moderator blocked it for not complying with SendPulse policies. | Contact SendPulse support. |

```text
Draft ──Submit──▶ Under review ──▶ Approved
                       │
                       ├──▶ Needs fix ──Submit──▶ Under review
                       └──▶ Blocked
```

## Actions (⋯ menu)

| Action | What it does |
|---|---|
| Preview | Shows the listing overview: categories, developer, tags, description. |
| Submit for review | Sends the solution to moderation for publishing. |
| Edit | Changes any field. Edit mode also shows App ID and Secret key to copy. |
| Set up monetization | Opens the Monetization settings. See [Monetization](12-monetization.md). |
| Delete | Permanently removes the solution from the system and the directory. |

## Rotating URLs

When you move your backend, update **Install URL** and **Uninstall URL** in **Edit** and keep the old host running until the new one receives traffic. Migrate stored `client_id` / `client_secret` together with the backend.
