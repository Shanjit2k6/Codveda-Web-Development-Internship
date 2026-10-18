# Responsive Web Design – Codveda Level 2, Task 1

## Project Overview

Developed as part of the **Codveda Technologies Web Development Internship**  
**Level 2 · Task 1 — Responsive Web Design**

A single-page responsive website for **PixelCraft Studio** demonstrating advanced CSS layout techniques including Flexbox, CSS Grid, sticky navigation, and multi-breakpoint responsiveness.

---

## Features

| Feature | Description |
|---------|-------------|
| Sticky navigation | Header stays at top while scrolling; Flexbox layout |
| Hero section | Two-column Flexbox layout with decorative design card |
| Services grid | CSS Grid — 3 columns (desktop), 2 (tablet), 1 (mobile) |
| Projects grid | CSS Grid — 2 columns (desktop), 1 (mobile) |
| Contact CTA | Full-width section with `mailto:` link |
| Smooth scrolling | `scroll-behavior: smooth` on `html` |
| Responsive at 3 breakpoints | Desktop (> 900px), Tablet (600–900px), Mobile (< 600px) |

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic page structure |
| CSS3 | Styling, layout |
| CSS Flexbox | Navigation bar, hero section, footer |
| CSS Grid | Services and Projects sections |
| Media Queries | Tablet (≤ 900px) and Mobile (≤ 600px) breakpoints |
| CSS Custom Properties | Design tokens (`--primary`, `--dark`, `--text`) |

---

## Project Files

| File | Description |
|------|-------------|
| `index.html` | Full single-page layout (Nav, Hero, Services, Projects, Contact, Footer) |
| `style.css` | Complete responsive stylesheet with Flexbox, Grid, and media queries |

---

## How to Run

1. Open `index.html` in any browser or via VS Code Live Server.
2. Resize the browser window to test breakpoints at 900px and 600px.

> No build step, server, or dependencies required.

---

## Testing Results

| Test Case | Expected Behaviour | Result |
|-----------|-------------------|--------|
| Desktop layout loads | Hero 2-col Flexbox, services 3-col Grid, projects 2-col Grid | ✅ Passed |
| Sticky navigation | Header remains visible on scroll | ✅ Passed |
| Smooth scroll | Clicking nav links scrolls smoothly to sections | ✅ Passed |
| Tablet (≤ 900px) | Services collapses to 2 columns | ✅ Passed |
| Mobile (≤ 600px) | Navbar stacks, hero stacks, all grids become 1 column | ✅ Passed |
| Design card visible | Decorative card renders in hero on desktop, hidden tilt on mobile | ✅ Passed |
| Contact CTA link | `mailto:` link responds when clicked | ✅ Passed |
| No console errors | Browser console clean on load | ✅ Passed |

---

## Internship Information

| Detail | Value |
|--------|-------|
| Organization | Codveda Technologies |
| Domain | Web Development |
| Level | 2 |
| Task | 1 — Responsive Web Design |