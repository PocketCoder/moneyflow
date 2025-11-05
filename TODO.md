## Codebase Improvement TODO List

### 1. Code Structure and Maintainability

- [ ] **Component Organization:**
  - [ ] Organize components by feature (e.g., `src/components/accounts`, `src/components/charts`).
  - [ ] Create `index.ts(x)` files in each feature folder to simplify imports.
- [ ] **Tremor Component Customization:**
  - [ ] Look at extending Tremor components instead of extracting them.
- [ ] **Consistent Styling Approach:**
  - [ ] Ensure all style variations use `tailwind-variants`.
  - [ ] Extract commonly used class combinations into utility functions or Tailwind directives.
- [ ] **Code Comments:**
  - [ ] Add comments for complex logic, database queries, and calculations.

### 2. Data Handling and Database Interactions

- [ ] **Error Handling:**
  - [ ] Improve error handling for database operations.
  - [ ] Add user-friendly messages for errors.
  - [ ] Implement client side form validation
    - [ ] Use React error boundaries to handle unexpected errors gracefully.
- [ ] **Data Fetching:**
  - [ ] Centralize data fetching logic into a service layer or module.
  - [ ] Review SQL queries for efficiency and potential caching.
  - [ ] Implement a data caching layer
- [ ] **Data Validation:**
  - [ ] Validate incoming data against a schema (e.g., using Zod).

### 3. User Experience (UX)

- [ ] **Feedback:**
  - [ ] Display loading states when fetching or mutating data.
  - [ ] Provide visual success/error messages.
- [ ] **Input Validation:**
  - [ ] Implement client-side validation using HTML5 attributes and JavaScript.
- [ ] **Accessibility:**
  - [ ] Ensure semantic HTML is being used correctly.
  - [ ] Test and improve keyboard navigation.
  - [ ] Utilize ARIA attributes as required.
  - [ ] Ensure all colour contrasts are sufficient.
- [ ] **Form Handling:**
  - [ ] Provide clear labels for form elements.
  - [ ] Look at creating a form component
- [ ] **Navigation:**
  - [ ] Implement breadcrumb navigation
    - [ ] Look at improving overall site navigation

### 4. Components

- [ ] **Input Component:**
  - [ ] Add a `format` prop to handle different types of input values.
  - [ ] Improve state management for better value control.
  - [ ] Implement custom validation messages.
    - [ ] Allow for customisation for styling.
- [ ] **Card Component:**
  - [ ] Allow custom behaviours, such as click events.

### 5. Testing

- [ ] Write unit tests for utility functions and components.
- [ ] Create integration tests for key user flows and interactions.

### 6. Performance

- [ ] Ensure Next.js is performing code splitting effectively
- [ ] Ensure that all images are optimized for the web.
- [ ] Implement profiling tools in order to identify performance bottlenecks

### 7. Specific Code Improvements

- [ ] **`src/lib/utils.ts`:**
  - [ ] Break into smaller, specialized modules.
  - [ ] Ensure database call results are correctly typed.
- [ ] **`src/components/NavBar.tsx`:**
  - [ ] Refine active link highlighting.
- [ ] **`src/app/page.tsx`:**
  - [ ] Organize chart and data rendering into components.
  - [ ] Implement pie chart.
- [ ] **`src/app/accounts/page.tsx`:**
  - [ ] Review account grouping logic and rendering for all use cases.
- [ ] **`src/components/Tremor/Button.tsx`:**
  - [ ] Make sure loading states display correctly for all button types.
  - [ ] Make button variants more dynamic
- [ ] **`src/app/add/balance/page.tsx`:**
  - [ ] Improve form management, such as error states.
