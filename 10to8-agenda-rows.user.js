// ==UserScript==
// @name         10to8 agenda: rows by start time
// @namespace    https://github.com/n-orlov
// @version      0.7.0
// @description  In the Agenda view, line bookings up across staff columns so the same start time sits on the same row.
// @match        https://app.10to8.com/apps/ceres/*
// @run-at       document-idle
// @grant        none
// @updateURL    https://raw.githubusercontent.com/n-orlov/10to8-agenda-rows/main/10to8-agenda-rows.user.js
// @downloadURL  https://raw.githubusercontent.com/n-orlov/10to8-agenda-rows/main/10to8-agenda-rows.user.js
// @homepageURL  https://github.com/n-orlov/10to8-agenda-rows
// ==/UserScript==

(function () {
  'use strict';

  // Loaded twice (Tampermonkey and the bookmarklet, or the bookmarklet
  // clicked again): just realign with the copy already running.
  if (window.__agendaRowsAlign) {
    window.__agendaRowsAlign();
    return;
  }

  const TIME_RE = /\b(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/;
  // A free stretch this long (e.g. the staff break) stays an empty gap
  // instead of stretching the booking before it.
  const BREAK_MIN = 30;
  const MARK = 'data-rows-by-time';
  const DOUBLE = 'data-double-booked';
  // Free slots ("07:58 - 08:05: Available for ...") open with the time range.
  const FREE_SLOT_RE = /^\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}:/;

  const style = document.createElement('style');
  // Harnesses are white; keep our added top padding see-through so the
  // column's own background shows instead of white blocks.
  style.textContent = `
    .fc-daygrid-event-harness {
      background-clip: content-box !important;
    }
    [${DOUBLE}] {
      outline: 3px solid #e8590c !important;
      outline-offset: -1px;
      box-shadow: 0 0 0 5px rgba(232, 89, 12, 0.25) !important;
    }`;
  document.head.appendChild(style);

  function times(harness) {
    const m = TIME_RE.exec(harness.innerText || '');
    return m && { start: m[1] * 60 + Number(m[2]), end: m[3] * 60 + Number(m[4]) };
  }

  function startMinute(harness) {
    return times(harness)?.start ?? null;
  }

  function cardOf(harness) {
    return harness.querySelector('.fc-event') || harness;
  }

  // Close a gap above `harness`: stretch the booking before it down to meet
  // it, or pad when there is nothing above or the time between is a break.
  function stretchBefore(harness, gap) {
    let prev = harness.previousElementSibling;
    while (prev && !prev.classList.contains('fc-daygrid-event-harness')) {
      prev = prev.previousElementSibling;
    }
    const before = prev && times(prev);
    const isBreak = before && startMinute(harness) - before.end >= BREAK_MIN;
    const stretch = prev && !isBreak;
    const el = stretch ? cardOf(prev) : harness;
    if (stretch) {
      el.style.setProperty('min-height', el.getBoundingClientRect().height + gap + 'px', 'important');
    } else {
      el.style.setProperty('padding-top', gap + 'px', 'important');
    }
    el.setAttribute(MARK, '');
  }

  // Outline patients in one column whose times overlap (e.g. both 11:00 - 11:07).
  function markDoubleBookings(col) {
    const booked = [...col.querySelectorAll(':scope > .fc-daygrid-event-harness')]
      .filter(h => !FREE_SLOT_RE.test(h.innerText || ''))
      .map(h => ({ h, t: times(h) }))
      .filter(b => b.t)
      .sort((a, b) => a.t.start - b.t.start);
    let runEnd = -1;
    let run = [];
    const flush = () => {
      if (run.length > 1) run.forEach(b => cardOf(b.h).setAttribute(DOUBLE, ''));
    };
    for (const b of booked) {
      if (b.t.start >= runEnd) {
        flush();
        run = [];
      }
      run.push(b);
      runEnd = Math.max(runEnd, b.t.end);
    }
    flush();
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
    for (const el of tr.querySelectorAll(`[${DOUBLE}]`)) el.removeAttribute(DOUBLE);
    cols.forEach(markDoubleBookings);

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
  window.__agendaRowsAlign = alignAll;
  alignAll();
})();
