// ==UserScript==
// @name         10to8 agenda: rows by start time
// @namespace    https://github.com/n-orlov
// @version      0.3.0
// @description  In the Agenda view, line bookings up across staff columns so the same start time sits on the same row.
// @match        https://app.10to8.com/apps/ceres/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const TIME_RE = /\b(\d{1,2}):(\d{2})\s*-\s*\d{1,2}:\d{2}/;
  const MARK = 'data-rows-by-time';

  function startMinute(harness) {
    const m = TIME_RE.exec(harness.innerText || '');
    return m ? Number(m[1]) * 60 + Number(m[2]) : null;
  }

  function cardOf(harness) {
    return harness.querySelector('.fc-event') || harness;
  }

  // Close a gap above `harness`: stretch the booking before it down to meet
  // it, or pad the column's first booking when there is nothing above.
  function stretchBefore(harness, gap) {
    let prev = harness.previousElementSibling;
    while (prev && !prev.classList.contains('fc-daygrid-event-harness')) {
      prev = prev.previousElementSibling;
    }
    const el = prev ? cardOf(prev) : harness;
    if (prev) {
      el.style.setProperty('min-height', el.getBoundingClientRect().height + gap + 'px', 'important');
    } else {
      el.style.setProperty('padding-top', gap + 'px', 'important');
    }
    el.setAttribute(MARK, '');
  }

  // One table row of the day grid = one set of side-by-side columns.
  function alignRow(tr) {
    const cols = [...tr.querySelectorAll(':scope > td .fc-daygrid-day-events')];
    if (cols.length < 2) return;

    // Undo the previous pass so heights and order are measured fresh.
    for (const el of tr.querySelectorAll(`[${MARK}]`)) {
      el.style.removeProperty('padding-top');
      el.style.removeProperty('min-height');
      el.removeAttribute(MARK);
    }

    // Per column: first booking of each start time.
    const layout = cols.map(col => {
      const firsts = new Map();
      for (const h of col.querySelectorAll(':scope > .fc-daygrid-event-harness')) {
        const t = startMinute(h);
        if (t != null && !firsts.has(t)) firsts.set(t, h);
      }
      return firsts;
    });

    // Walk the times in order, pushing each column's booking down to the
    // lowest one on that row. Measuring live positions keeps fractional
    // heights and margins exact; later rows follow because the flow shifts.
    const times = [...new Set(layout.flatMap(m => [...m.keys()]))].sort((a, b) => a - b);
    for (const t of times) {
      const row = layout.map(m => m.get(t)).filter(Boolean);
      const tops = row.map(h => h.getBoundingClientRect().top);
      const target = Math.max(...tops);
      row.forEach((h, i) => {
        const gap = target - tops[i];
        if (gap > 0.5) stretchBefore(h, gap);
      });
    }
  }

  function alignAll() {
    observer.disconnect();
    try {
      document.querySelectorAll('.fc-daygrid-body tr').forEach(alignRow);
    } finally {
      observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['style', 'class'] });
    }
  }

  let pending = 0;
  const observer = new MutationObserver(() => {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(alignAll);
  });
  window.addEventListener('resize', () => requestAnimationFrame(alignAll));
  alignAll();
})();
