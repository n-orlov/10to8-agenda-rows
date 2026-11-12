# 10to8 Agenda: rows by start time

A small add-on for the 10to8 / Sign In Scheduling **Calendar → Day → Agenda** view:

- bookings with the same start time sit on the **same row** across all staff columns;
- a booking stretches down to the next one, so there are **no small gaps**; breaks of 30 minutes or more stay as gaps;
- bookings that **overlap** in the same column get an **orange outline**.

It only changes how the page looks in your browser. It does not change any bookings.

## Install (once per computer, about 3 minutes)

You need Google Chrome or Microsoft Edge.

1. **Install Tampermonkey**
   - Chrome: <https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo>
   - Edge: <https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd>

   Click **Add to Chrome** / **Get**, then confirm.

2. **Allow user scripts** (browsers require this for Tampermonkey to work)
   - Chrome: open `chrome://extensions`, click **Details** under Tampermonkey and turn on **Allow User Scripts**.
     On older Chrome versions where that switch is missing, turn on **Developer mode** (top right of the same page) instead.
   - Edge: open `edge://extensions` and turn on **Developer mode** (left side).

3. **Install the script**: open this link and click **Install** on the Tampermonkey page that appears:

   **<https://raw.githubusercontent.com/n-orlov/10to8-agenda-rows/main/10to8-agenda-rows.user.js>**

4. Open (or reload) the 10to8 calendar and choose **Day** and **Agenda**. The rows now line up.

## Updates

Tampermonkey checks for new versions by itself (about once a day). To update straight away: click the
Tampermonkey icon → **Dashboard**, tick the script, then choose **Check for userscript updates**.

## Turning it off

Click the Tampermonkey icon in the toolbar and switch off **10to8 agenda: rows by start time**, then reload the page.

## If it does not work

- Nothing changes: check steps 2 and 4, and that the script is switched on in the Tampermonkey menu.
- "Add to Chrome" is greyed out or blocked: your organisation manages extensions on this computer.
  Ask IT to allow the Tampermonkey extension.
