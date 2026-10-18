# JavaScript Interactivity – Codveda Level 1, Task 3

## Project Overview

Developed as part of the **Codveda Technologies Web Development Internship**  
**Level 1 · Task 3 — JavaScript Interactivity**

Demonstrates core vanilla JavaScript interactivity: dropdown navigation, modal windows, and client-side form validation — all implemented without any frameworks or libraries.

---

## Features

| Feature | Description |
|---------|-------------|
| Dropdown menu | Opens/closes on button click; closes on link click; ARIA `aria-expanded` updated |
| Modal window | Two buttons open modal; close button, "Got it" button, and backdrop click all close it |
| Form validation | Custom JS validation for name (min 2 chars), email (regex), message (min 5 chars) |
| Validation feedback | Inline error messages below each field; green success message on valid submission |
| Keyboard accessible | Focus management and ARIA roles applied |
| Responsive UI | Mobile-friendly layout with media query at `600px` |

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Page structure and ARIA attributes |
| CSS3 | Styling, positioning, responsive layout |
| Vanilla JavaScript (ES6+) | All interactive behaviour |

---

## Project Files

| File | Description |
|------|-------------|
| `index.html` | Full page structure with dropdown, modal, and contact form |
| `style.css` | Styling including dropdown, modal overlay, error states |
| `script.js` | All event listeners, modal logic, and form validation |

---

## How to Run

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` in a browser, or use the **Live Server** extension.
4. Interact with the dropdown, modal buttons, and contact form.

> No build step, server, or dependencies required.

---

## Testing Results

| Test Case | Expected Behaviour | Result |
|-----------|-------------------|--------|
| Dropdown opens | Click "Explore ▼" — menu appears | ✅ Passed |
| Dropdown closes on link click | Click a menu link — menu hides | ✅ Passed |
| Modal opens (hero button) | Click "Learn More" — modal appears | ✅ Passed |
| Modal opens (features button) | Click "Open Feature Details" — modal appears | ✅ Passed |
| Modal closes (× button) | Click × — modal hides | ✅ Passed |
| Modal closes (Got it button) | Click "Got it" — modal hides | ✅ Passed |
| Modal closes (backdrop click) | Click outside modal box — modal hides | ✅ Passed |
| Name validation (too short) | Name `< 2 chars` → error shown | ✅ Passed |
| Email validation (invalid) | Non-email string → error shown | ✅ Passed |
| Message validation (too short) | Message `< 5 chars` → error shown | ✅ Passed |
| Successful form validation | All fields valid → success message, form reset | ✅ Passed |

---

## Notes

The contact form demonstrates **client-side validation only**. It does not send data to any backend server. After successful validation, a confirmation message is displayed and the form is reset.

---

## Internship Information

| Detail | Value |
|--------|-------|
| Organization | Codveda Technologies |
| Domain | Web Development |
| Level | 1 |
| Task | 3 — JavaScript Interactivity |