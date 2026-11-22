# Single Page Application (SPA)

This project demonstrates the architectural principles of a Single-Page Application (SPA) built with pure Vanilla JavaScript (ES6+), semantic HTML5, and CSS3 without any third-party frameworks or routing libraries.

## Key Features
* **Client-Side Hash Routing:** Switching between main sections (`Catalog`, `About the Project`, `Feedback`) via `hashchange` without page reloads, supporting browser Back/Forward navigation.
* **Global State Preservation:** A persistent session timer (`window.setInterval`) in the header that continues running uninterrupted during section transitions and UI state changes.
* **Catalog UI State Management (`renderState`):** Mutually exclusive screen states inside the catalog workspace managed non-destructively via the `.is-hidden` utility class:
  * `loading` — animated skeleton placeholders during simulated data fetching;
  * `content` — grid of product cards with real-time search filtering;
  * `empty` — empty state view when no items match the filter query, with a quick reset action;
  * `error` — simulated `ERR-503` service unavailable state with a retry mechanism.

## DevTools Network Audit
During client-side navigation between sections and screen states, the **Network** tab (`Doc` / `Fetch/XHR` filters) confirms **zero additional HTTP requests** for HTML documents after the initial page load.

## Project Structure
* `index.html` — semantic multi-section markup and UI state containers.
* `style.css` — layout styling, `.is-hidden` visibility control, and skeleton shimmer animations.
* `app.js` — session timer, hash router, live search filter, and `renderState()` controller.
