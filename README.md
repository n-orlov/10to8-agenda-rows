# 10to8 Agenda: rows by start time

A small add-on for the 10to8 / Sign In Scheduling **Calendar → Day → Agenda** view:

- bookings with the same start time sit on the **same row** across all staff columns;
- a booking stretches down to the next one, so there are **no small gaps**; breaks of 30 minutes or more stay as gaps;
- bookings that **overlap** in the same column get an **orange outline**.

It only changes how the page looks in your browser. It does not change any bookings.

Extensions blocked on your computer? Use the [bookmark version](https://n-orlov.github.io/10to8-agenda-rows/bookmarklet.html).

## Install (once per computer, about 3 minutes)

These steps are for **Microsoft Edge**, the browser with the blue wave icon.
Using Google Chrome instead? See [Google Chrome](#google-chrome) below.

1. **Install Tampermonkey.** Open
   <https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd>,
   click **Get**, then **Add extension**.

2. **Allow user scripts.** Type `edge://extensions` in the address bar and press Enter.
   Turn on **Developer mode** (switch on the left).
   If you see **Details** under Tampermonkey with an **Allow user scripts** switch, turn that on too.

3. **Install the script.** Open this link and click **Install** on the Tampermonkey page that appears:

   **<https://raw.githubusercontent.com/n-orlov/10to8-agenda-rows/main/10to8-agenda-rows.user.js>**

4. Open (or reload) the 10to8 calendar and choose **Day** and **Agenda**. The rows now line up.

### Google Chrome

1. Install Tampermonkey from
   <https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo>
   (**Add to Chrome**).
2. Open `chrome://extensions`, click **Details** under Tampermonkey and turn on **Allow User Scripts**.
   On older Chrome versions where that switch is missing, turn on **Developer mode** (top right) instead.

Then do steps 3 and 4 from the Edge section.

## Updates

Tampermonkey checks for new versions by itself (about once a day). To update straight away: click the
Tampermonkey icon → **Dashboard**, tick the script, then choose **Check for userscript updates**.

## Turning it off

Click the Tampermonkey icon in the toolbar and switch off **10to8 agenda: rows by start time**, then reload the page.

## If it does not work

- Nothing changes: check steps 2 and 4, and that the script is switched on in the Tampermonkey menu.
- **Get** / **Add to Chrome** is greyed out or "blocked by your organisation": extensions are managed by IT on this
  computer. Use the **[bookmark version](https://n-orlov.github.io/10to8-agenda-rows/bookmarklet.html)** instead
  (no extension needed), or ask IT to allow Tampermonkey.
