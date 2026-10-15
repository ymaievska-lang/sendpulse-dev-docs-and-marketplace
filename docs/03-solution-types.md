# Solution types

Choose the type when you click **Add solution**. **The type cannot be changed later.**

## Public app

- Available to all SendPulse users after moderation.
- Users find it under **App directory → Integrations**, in the category of the SendPulse tool you selected.
- Must be submitted for review. See [Review and publishing](11-review-and-publishing.md).

## Private app

- Available only to you (the creator) and to the users you add in the **App availability** tab.
- Users are added by their **SendPulse account email**.
- Users find it under **App directory → Available to me**.
- Same install, token and uninstall flows as a public app. No moderation needed, which makes a private app the practical sandbox for testing.
- Submitting a private app for review makes it **public** after approval.

### Add a user to a private app

1. **App directory → Home → Created → Applications → ⋯ → Edit**.
2. Open the **App availability** tab.
3. In **Add new user**, type the user's account email, select it, click **Continue**.

The user finds their account email by clicking their profile picture in the top-right corner of SendPulse; it is shown under their name. The tab lists every user with access and the date access was granted.

## External integration

- Set up and managed on your own site, outside the SendPulse account.
- The listing shows your description, key features, setup guide, screenshots and an **External integration link** to your setup page.
- No Install URL, Uninstall URL, scopes or token flow on the SendPulse side. Your service authenticates with SendPulse the usual way (REST API keys or OAuth as documented at https://sendpulse.com/integrations/api).
- Submitted for review from the **Integrations** tab.

## Which one to pick

| You need | Pick |
|---|---|
| Users install in one click and your app works with their SendPulse data | Public app |
| Internal tool for your company or specific clients | Private app |
| You already have a connector on Zapier/Make/n8n/your own SaaS and want to be listed | External integration |
