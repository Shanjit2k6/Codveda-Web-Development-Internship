# Codveda Internship — Level 1, Task 1

## Project: PixelCraft — Static Multi-Page Website

Developed as part of the **Codveda Technologies Web Development Internship**  
**Level 1 · Task 1 — Build a Static Website**

---

## Project Overview

PixelCraft is a clean, modern static website built with HTML5 and CSS3.  
It demonstrates a multi-page layout, CSS Flexbox/Grid, responsive design, and client-side form validation.

---

## Features

- **Three-page site** — Home, About, and Contact
- **Shared navigation** — consistent header and footer across all pages
- **Hero section** — banner image with call-to-action button
- **Services grid** — CSS Grid layout with three service cards
- **Contact form** — HTML5 `required` attributes with native browser validation
- **Fully responsive** — mobile layout with media queries (`max-width: 650px`)
- **No JavaScript** — pure HTML and CSS only

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Page structure and semantics |
| CSS3 | Styling, layouts |
| CSS Flexbox | Navigation bar, header layout |
| CSS Grid | Service cards section |
| Media Queries | Mobile responsiveness |

---

## Project Files

| File | Description |
|------|-------------|
| `index.html` | Home page with hero and services |
| `about.html` | About page with studio description |
| `contact.html` | Contact page with validated form |
| `style.css` | Shared stylesheet for all pages |

---

## How to Run

1. Open the project folder in Visual Studio Code.
2. Right-click `index.html` and select **Open with Live Server**, or open it directly in any browser.
3. Navigate between pages using the header links.

> No build step, server, or dependencies required.

---

## Testing Results

| Test Case | Expected Behaviour | Result |
|-----------|-------------------|--------|
| Home page loads | `index.html` renders with hero and service cards | ✅ Passed |
| Navigation links | Home → About → Contact all resolve correctly | ✅ Passed |
| CSS styling applied | Colors, fonts, shadows render as designed | ✅ Passed |
| Mobile layout (`≤ 650px`) | Header stacks, cards collapse to 1 column | ✅ Passed |
| Contact form – empty submit | Browser blocks submission, shows required message | ✅ Passed |
| Contact form – invalid email | Browser blocks submission, shows email error | ✅ Passed |
| Contact form – valid data | Form submits (demo only; no backend) | ✅ Passed |

---

## Notes

The contact form is a **frontend demonstration only**. It uses native HTML5 validation (`required`, `type="email"`) but does not send data to any server.

---

## Internship Information

| Detail | Value |
|--------|-------|
| Organization | Codveda Technologies |
| Domain | Web Development |
| Level | 1 |
| Task | 1 — Build a Static Website |
