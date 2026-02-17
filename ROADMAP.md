# 🗺️ Moneyflow Roadmap

This roadmap outlines the planned optimizations, architectural improvements, and feature tasks for the Moneyflow project.

---

## 🚀 1. Performance & Code Efficiencies

_Optimizations focused on database performance, Next.js best practices, and code quality._

### ⚛️ Next.js & React Optimizations

- [ ] **Implement Streaming with Suspense**
  - **Issue:** Dashboard waits for all data in `Promise.all` before rendering.
  - **Solution:** Break down into smaller components (e.g., `NetWorthChart`, `StatsGrid`) and wrap in `Suspense` with skeleton loaders.

### 🏗️ Architecture & Code Quality

- [ ] **Zod for Form Validation:** Use `zod` schemas for account and balance updates for better type safety and error handling.
- [ ] **Standardized Error Handling:** Implement a consistent strategy using a custom `AppError` class and centralized logging utility.

---

## 🛠️ 2. Development TODO List

_Ongoing tasks for codebase improvement and user experience._

### 📂 Structure & Maintainability

- [ ] **Component Organization:** Organize components by feature (e.g., `src/components/accounts`, `src/components/charts`) with `index.ts` files.
- [ ] **Tremor Customization:** Look at extending Tremor components instead of extracting them.
- [ ] **Consistent Styling:** Use `tailwind-variants` for all style variations and extract common class combinations.
- [ ] **Code Documentation:** Add comments for complex logic, database queries, and calculations.

### 🔄 Data & Security

- [ ] **Robust Error Handling:** Add user-friendly error messages and client-side error boundaries.
- [ ] **Service Layer:** Centralize data fetching logic into a service layer.
- [ ] **Data Caching:** Implement a data caching layer for improved performance.
- [ ] **Schema Validation:** Validate all incoming data against Zod schemas.

### 🎨 User Experience (UX)

- [ ] **Visual Feedback:** Implement loading states and success/error notifications.
- [ ] **Accessibility (a11y):**
  - [ ] Semantic HTML & Keyboard navigation.
  - [ ] ARIA attributes & Color contrast checks.
- [ ] **Navigation:** Implement breadcrumb navigation and refine overall site flow.
- [ ] **Form Handling:** Create a standardized form component with clear labels and custom validation.

### 🧩 Component Enhancements

- [ ] **Input Component:** Add `format` prop, improve state management, and support custom validation.
- [ ] **Card Component:** Support custom behaviors like click events.

### 🧪 Testing & Performance

- [ ] **Unit Testing:** Write tests for utility functions and UI components.
- [ ] **Integration Testing:** Create tests for key user flows (e.g., adding an account).
- [ ] **Profiling:** Implement profiling tools to identify performance bottlenecks.
- [ ] **Asset Optimization:** Ensure all images are optimized for the web.

---

## 📍 Specific Code Fixes

- [ ] **`src/lib/utils.ts`:** Break into smaller, specialized modules and refine typing.
- [ ] **`src/app/page.tsx`:** Organize rendering into modular components.
- [ ] **`src/app/add/balance/page.tsx`:** Improve form and error state management.
