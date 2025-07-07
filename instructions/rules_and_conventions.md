# Rules & Conventions

## 1. General

* **Framework:** Use React with Vite.
* **Language:** JavaScript.
* **State Management:** Use React Hooks (`useState`, `useContext`, `useEffect`). No external state management libraries are needed for this prototype.
* **Data:** All data must be mocked and imported from a central `src/mock-data/` directory.

## 2. Styling

* **Primary Tool:** **Tailwind CSS must be used for all styling.** Do not write custom CSS files.
* **Mobile-First:** All styles must be developed for a mobile viewport first.
* **Layout:** The entire application must be rendered within a centered, fixed-width container that simulates a phone screen.

## 3. Components & File Structure

* **File Naming:** Components should use `PascalCase.jsx`.
* **Directory Structure:** Follow a standard structure (`/src/components`, `/src/pages`, `/src/assets`, etc.).
* **Component Design:** Components should be functional, small, and single-purpose.

## 4. Code & UX Patterns

* **Routing:** Use `react-router-dom` for all page navigation.
* **Icons:** Use a library like `lucide-react` for all icons.
* **Swiping:** Use a library like `react-tinder-card` for the swiping functionality.
* **NO ALERTS:** Do not use `window.alert()`. All user feedback must be part of the UI.
