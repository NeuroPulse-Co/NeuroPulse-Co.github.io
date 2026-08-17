(function () {
  var MS_DAY = 86400000;

  function parseDate(str) {
    var parts = str.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function fmtDate(d) {
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  function daysBetween(a, b) {
    return Math.round((b - a) / MS_DAY);
  }

  function monthLabel(d) {
    return d.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
  }

  var phases = window.TIMELINE_PHASES || [];

  var allDates = [];
  phases.forEach(function (p) {
    allDates.push(parseDate(p.start), parseDate(p.end));
    p.tasks.forEach(function (t) {
      allDates.push(parseDate(t.start), parseDate(t.end));
    });
  });

  var rawMin = new Date(Math.min.apply(null, allDates));
  var rawMax = new Date(Math.max.apply(null, allDates));

  var rangeStart = new Date(rawMin.getFullYear(), rawMin.getMonth(), 1);
  var rangeEnd = new Date(rawMax.getFullYear(), rawMax.getMonth() + 1, 0);
  var totalDays = daysBetween(rangeStart, rangeEnd);

  function pct(dateStr) {
    var d = typeof dateStr === "string" ? parseDate(dateStr) : dateStr;
    return (daysBetween(rangeStart, d) / totalDays) * 100;
  }

  function widthPct(startStr, endStr) {
    var w = pct(endStr) - pct(startStr);
    return Math.max(w, 0.6);
  }

  var months = [];
  var cursor = new Date(rangeStart);
  while (cursor <= rangeEnd) {
    months.push(new Date(cursor));
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }

  var root = document.getElementById("gantt-root");
  if (!root) return;

  var today = new Date();
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  var showToday = today >= rangeStart && today <= rangeEnd;

  var totalPhases = phases.length;
  var donePhases = phases.filter(function (p) { return p.done; }).length;

  var html = "";

  html += '<div class="gantt-summary">';
  html += '<div class="gantt-summary-stat"><strong>' + donePhases + ' / ' + totalPhases + '</strong><span>phases complete</span></div>';
  html += '<div class="gantt-legend">';
  html += '<span class="legend-item"><i class="legend-swatch legend-done"></i>Completed</span>';
  html += '<span class="legend-item"><i class="legend-swatch legend-upcoming"></i>Upcoming</span>';
  if (showToday) html += '<span class="legend-item"><i class="legend-swatch legend-today"></i>Today</span>';
  html += "</div></div>";

  html += '<div class="gantt-scroll"><div class="gantt-chart" style="min-width:1100px;">';

  html += '<div class="gantt-months">';
  months.forEach(function (m) {
    var left = pct(m);
    html += '<div class="gantt-month" style="left:' + left + '%">' + monthLabel(m) + "</div>";
  });
  html += "</div>";

  html += '<div class="gantt-grid">';
  months.forEach(function (m) {
    html += '<div class="gantt-gridline" style="left:' + pct(m) + '%"></div>';
  });
  if (showToday) {
    html += '<div class="gantt-today-line" style="left:' + pct(today) + '%"><span>Today</span></div>';
  }
  html += "</div>";

  html += '<div class="gantt-rows">';

  phases.forEach(function (phase, i) {
    var phaseDur = daysBetween(parseDate(phase.start), parseDate(phase.end));
    html +=
      '<div class="gantt-phase" data-phase="' + phase.id + '">' +
      '<button class="gantt-phase-toggle" aria-expanded="true" data-target="' + phase.id + '">' +
      '<svg class="chevron" viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<span class="gantt-phase-name">' + (i + 1) + ". " + phase.name + "</span>" +
      (phase.done ? '<span class="badge badge-teal gantt-phase-badge">Done</span>' : "") +
      "</button>";

    html +=
      '<div class="gantt-bar-row">' +
      '<div class="gantt-bar ' + (phase.done ? "bar-done" : "bar-phase") + '" ' +
      'style="left:' + pct(phase.start) + "%;width:" + widthPct(phase.start, phase.end) + '%" ' +
      'data-tip="' + phase.name + " &mdash; " + fmtDate(parseDate(phase.start)) + " to " + fmtDate(parseDate(phase.end)) + " (" + phaseDur + " days)" + '">' +
      "</div></div>";

    html += '<div class="gantt-tasks" id="' + phase.id + '">';
    phase.tasks.forEach(function (task) {
      var dur = daysBetween(parseDate(task.start), parseDate(task.end));
      html +=
        '<div class="gantt-bar-row gantt-bar-row-task">' +
        '<span class="gantt-task-name">' + task.name + "</span>" +
        '<div class="gantt-track">' +
        '<div class="gantt-bar gantt-bar-task ' + (task.done ? "bar-done" : "bar-task") + '" ' +
        'style="left:' + pct(task.start) + "%;width:" + widthPct(task.start, task.end) + '%" ' +
        'data-tip="' + task.name + " &mdash; " + fmtDate(parseDate(task.start)) + " to " + fmtDate(parseDate(task.end)) + " (" + dur + " days)" + '">' +
        "</div></div></div>";
    });
    html += "</div>"; // .gantt-tasks

    html += "</div>"; // .gantt-phase
  });

  html += "</div></div></div>"; // rows, chart, scroll

  root.innerHTML = html;

  var tooltip = document.createElement("div");
  tooltip.className = "gantt-tooltip";
  document.body.appendChild(tooltip);

  root.querySelectorAll("[data-tip]").forEach(function (bar) {
    bar.addEventListener("mouseenter", function () {
      tooltip.innerHTML = bar.getAttribute("data-tip");
      tooltip.classList.add("visible");
    });
    bar.addEventListener("mousemove", function (e) {
      tooltip.style.left = e.clientX + 14 + "px";
      tooltip.style.top = e.clientY + 14 + "px";
    });
    bar.addEventListener("mouseleave", function () {
      tooltip.classList.remove("visible");
    });
  });

  root.querySelectorAll(".gantt-phase-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.getAttribute("data-target"));
      var open = target.classList.toggle("collapsed");
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      btn.classList.toggle("collapsed", open);
    });
  });
})();
