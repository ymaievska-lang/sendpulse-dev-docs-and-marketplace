# API scopes

Scopes define which SendPulse tools your app can read and write through the SendPulse REST API on behalf of the installing user. The user approves them during installation. Request only what the app needs: scopes affect moderation.

| Scope | SendPulse tool | What the app can do | API reference |
|---|---|---|---|
| `emails` | Email (bulk) | Mailing lists, campaigns, senders, templates; add/get/edit/delete contacts. | https://sendpulse.com/integrations/api/bulk-email?utm_source=context7&utm_medium=docs&utm_campaign=dev-docs&utm_content=05-scopes |
| `smtp` | SMTP | Send transactional emails, senders and domains, statistics, bounces, unsubscribes. | https://sendpulse.com/integrations/api/smtp?utm_source=context7&utm_medium=docs&utm_campaign=dev-docs&utm_content=05-scopes |
| `automation` | Automation 360 | Flows, series, element statistics, conversions, events. | https://sendpulse.com/integrations/api/a360?utm_source=context7&utm_medium=docs&utm_campaign=dev-docs&utm_content=05-scopes |
| `verifier_service` | Email Verifier | Verify lists, check status and results, verification reports. | https://sendpulse.com/integrations/api/verifier?utm_source=context7&utm_medium=docs&utm_campaign=dev-docs&utm_content=05-scopes |
| `chatbots` | Chatbots | Bots, subscribers, variables, flows, live chats. | https://sendpulse.com/integrations/api/chatbot?utm_source=context7&utm_medium=docs&utm_campaign=dev-docs&utm_content=05-scopes |
| `sms` | SMS | Phone lists and variables, blacklists, campaign cost, transactional SMS. | https://sendpulse.com/integrations/api/bulk-sms?utm_source=context7&utm_medium=docs&utm_campaign=dev-docs&utm_content=05-scopes |
| `viber` | Viber | Campaigns, statistics, recipients, blacklist, sender names. | https://sendpulse.com/integrations/api/viber?utm_source=context7&utm_medium=docs&utm_campaign=dev-docs&utm_content=05-scopes |
| `crm` | CRM | Pipelines, deals, contacts, attributes, tasks, assigned users, tags. | https://sendpulse.com/integrations/api/crm?utm_source=context7&utm_medium=docs&utm_campaign=dev-docs&utm_content=05-scopes |
| `push_service` | Web Push | Campaigns, websites, subscribers, variables, JS code. | https://sendpulse.com/integrations/api/web-push?utm_source=context7&utm_medium=docs&utm_campaign=dev-docs&utm_content=05-scopes |
| `pop_ups` | Pop-ups | Projects, pop-ups, settings and statistics. | https://sendpulse.com/integrations/api/pop-up?utm_source=context7&utm_medium=docs&utm_campaign=dev-docs&utm_content=05-scopes |
| `user_data` | Account | User data not tied to a tool, e.g. pricing plan. | — |

## Examples

| App | Scopes |
|---|---|
| Sync contacts from an online store to mailing lists | `emails` |
| Send order confirmations | `smtp` |
| Click-to-call telephony in CRM | `crm` |
| Push chatbot leads to an external CRM | `chatbots` |
| Reporting dashboard | `emails`, `automation`, `pop_ups` |
