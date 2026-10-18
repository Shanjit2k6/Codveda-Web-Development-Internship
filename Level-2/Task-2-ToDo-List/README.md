# TaskFlow To-Do List – Codveda Level 2, Task 2

## Project Overview

Developed as part of the **Codveda Technologies Web Development Internship**  
**Level 2 · Task 2 — To-Do List Application with JavaScript**

**TaskFlow** is a fully functional task management app built with vanilla HTML, CSS, and JavaScript. Tasks persist across page refreshes using `localStorage`.

---

## Features

| Feature | Description |
|---------|-------------|
| Add tasks | Submit with button or Enter key; duplicate empty input blocked |
| Edit tasks | Inline `prompt()` dialog pre-filled with existing text |
| Delete tasks | Confirmation dialog before removal |
| Complete/uncomplete | Checkbox toggles completed state with visual strikethrough |
| Task counters | Live Total / Completed / Pending statistics |
| Filters | All / Pending / Completed filter buttons |
| Clear completed | Bulk-remove all completed tasks with one click |
| localStorage | Tasks saved and restored across browser sessions |
| Status messages | ARIA live region announces every action |
| Responsive | Works on desktop, tablet, and mobile |

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic markup with ARIA attributes |
| CSS3 | Modern card-based UI, responsive layout |
| Vanilla JavaScript (ES6+) | Full CRUD logic, filtering, localStorage |
| localStorage API | Persistent task storage |
| `crypto.randomUUID()` | Unique task IDs |

---

## Project Files

| File | Description |
|------|-------------|
| `index.html` | App structure with form, stats, filters, and task list |
| `style.css` | Full styling including completed-state, filter buttons, responsive |
| `script.js` | Complete task management logic — add, edit, delete, filter, persist |

---

## How to Run

1. Open `index.html` in any modern browser.
2. Add tasks using the input field.
3. Use checkboxes, Edit, Delete buttons, and filter tabs.
4. Refresh the page — tasks should still be there (localStorage).

> No build step, server, or dependencies required.

---

## Testing Results

| Test Case | Expected Behaviour | Result |
|-----------|-------------------|--------|
| Add task | New task appears in list; counter updates | ✅ Passed |
| Empty input blocked | Submitting empty input shows message, no task added | ✅ Passed |
| Edit task | Prompt pre-filled; saving updates task text | ✅ Passed |
| Delete task | Confirmation dialog; task removed on confirm | ✅ Passed |
| Complete task | Checkbox checked → strikethrough; completed counter increments | ✅ Passed |
| Uncomplete task | Uncheck → pending style restored; counter decrements | ✅ Passed |
| Filter – Pending | Only pending tasks visible | ✅ Passed |
| Filter – Completed | Only completed tasks visible | ✅ Passed |
| Filter – All | All tasks visible | ✅ Passed |
| Clear completed | All completed tasks removed with confirmation | ✅ Passed |
| localStorage persist | Tasks remain after page refresh | ✅ Passed |
| No console errors | Browser console clean on load | ✅ Passed |

---

## Internship Information

| Detail | Value |
|--------|-------|
| Organization | Codveda Technologies |
| Domain | Web Development |
| Level | 2 |
| Task | 2 — To-Do List Application |