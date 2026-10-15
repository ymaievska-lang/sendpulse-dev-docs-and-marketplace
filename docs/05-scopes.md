# API scopes

Scopes define which SendPulse tools your app can read and write through the SendPulse REST API on behalf of the installing user. The user approves them during installation. Request only what the app needs: scopes affect moderation.

| Scope | SendPulse tool | What the app can do | API reference |
|---|---|---|---|
| `emails` | Email (bulk) | Mailing lists, campaigns, senders, templates; add/get/edit/delete contacts. | https://sendpulse.com/integrations/api/bulk-email |
| `smtp` | SMTP | Send transactional emails, senders and domains, statistics, bounces, unsubscribes. | https://sendpulse.com/integrations/api/smtp |
| `automation` | Automation 360 | Flows, series, element statistics, conversions, events. | https://sendpulse.com/integrations/api/a360 |
| `verifier_service` | Email Verifier | Verify lists, check status and results, verification reports. | https://sendpulse.com/integrations/api/verifier |
| `chatbots` | Chatbots | Bots, subscribers, variables, flows, live chats. | https://sendpulse.com/integrations/api/chatbot |
| `sms` | SMS | Phone lists and variables, blacklists, campaign cost, transactional SMS. | https://sendpulse.com/integrations/api/bulk-sms |
| `viber` | Viber | Campaigns, statistics, recipients, blacklist, sender names. | https://sendpulse.com/integrations/api/viber |
| `crm` | CRM | Pipelines, deals, contacts, attributes, tasks, assigned users, tags. | https://sendpulse.com/integrations/api/crm |
| `push_service` | Web Push | Campaigns, websites, subscribers, variables, JS code. | https://sendpulse.com/integrations/api/web-push |
| `pop_ups` | Pop-ups | Projects, pop-ups, settings and statistics. | https://sendpulse.com/integrations/api/pop-up |
| `user_data` | Account | User data not tied to a tool, e.g. pricing plan. | — |

## Examples

| App | Scopes |
|---|---|
| Sync contacts from an online store to mailing lists | `emails` |
| Send order confirmations | `smtp` |
| Click-to-call telephony in CRM | `crm` |
| Push chatbot leads to an external CRM | `chatbots` |
| Reporting dashboard | `emails`, `automation`, `pop_ups` |
