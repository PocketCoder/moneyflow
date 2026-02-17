# Moneyflow Roadmap

This document combines planned optimizations, architectural improvements, and feature tasks for the Moneyflow project.

---

## 1. Code Efficiencies and Optimizations (from EFFICIENCIES.md)

This section outlines potential efficiencies and optimizations focusing on database performance, Next.js best practices, and code quality.

### Database Performance (High Impact)

<details>
<summary><s>Replace N+1 Queries in `calculateNetWorth`</s></summary>

**Current Issue:** The `calculateNetWorth` function in `src/lib/server-utils.ts` performs a database query inside a loop for each unique date. **Optimization:** Use a single `INSERT ... SELECT` statement with `GROUP BY` to calculate and update net worth for all dates in one round-trip.

```sql
-- Example Optimized Query
INSERT INTO balances (bank_account, date, amount)
SELECT
    (SELECT id FROM bank_accounts WHERE owner = $1 AND name = 'Net Worth'),
    date,
    SUM(amount)
FROM balances b
JOIN bank_accounts a ON b.bank_account = a.id
WHERE a.owner = $1 AND a.name <> 'Net Worth' AND b.date = ANY($2)
GROUP BY date
ON CONFLICT (bank_account, date) DO UPDATE SET amount = EXCLUDED.amount;
```

</details>

<details>
<summary><s>Replace N+1 Queries in `DistPieChartData`</s></summary>

**Current Issue:** Loops through all accounts and calls `getBalances` for each, fetching full history just to get the latest balance. **Optimization:** Use `DISTINCT ON` (PostgreSQL) to fetch the latest balance for all accounts in a single query.

```sql
-- Example Optimized Query
SELECT DISTINCT ON (a.id) a.name as account, b.amount as balance
FROM bank_accounts a
JOIN balances b ON a.id = b.bank_account
WHERE a.owner = $1 AND a.name <> 'Net Worth'
ORDER BY a.id, b.date DESC;
```

</details>

<details>
<summary><s>Batch Inserts in `updateBalances`</s></summary>

**Current Issue:** Iterates through `balanceEntries` and performs an `INSERT` for each. **Optimization:** Use a multi-row `INSERT` statement to reduce database overhead.

</details>

### Next.js & React Optimizations

<details>
<summary><s>Consolidate User Lookups</s></summary>

**Current Issue:** Multiple functions (`changeAllTime`, `percentChangeFY`, etc.) called via `Promise.all` in `src/app/page.tsx` independently call `auth()` and query the user ID. **Optimization:** Fetch the User ID once in the page and pass it to the server functions, or use `React.cache` to deduplicate the `auth()` and user lookup calls within a single request.

</details>

#### Implement Streaming with Suspense

**Current Issue:** The entire dashboard waits for all data in `Promise.all` before rendering. **Optimization:** Break down the dashboard into smaller components (e.g., `NetWorthChart`, `StatsGrid`, `AccountDistribution`) and wrap them in `Suspense` with skeleton loaders. This improves perceived performance.

```tsx
// Example Implementation
export default async function Home() {
	return (
		<main className="grid grid-cols-6 gap-4">
			<Suspense fallback={<StatsGridSkeleton />}>
				<StatsGrid />
			</Suspense>
			<Suspense fallback={<ChartSkeleton />}>
				<NetWorthChartSection />
			</Suspense>
		</main>
	);
}
```

<details>
<summary><s>Use Granular Revalidation</s></summary>

**Current Issue:** `revalidatePath('/')` and `revalidatePath('/accounts')` are used broadly. **Optimization:** Use `revalidateTag` for more granular control over data invalidation. This prevents unnecessary re-renders and re-fetches of unrelated data on the same page.

</details>

#### Utilize `es-toolkit`

**Current Issue:** `es-toolkit` is listed in `package.json` but not used. **Optimization:** Replace any potential future lodash usage or complex array/object manipulations with `es-toolkit` functions to keep the bundle size small and performance high.

<details>
<summary><s>Server-Side Sorting</s></summary>

**Current Issue:** `formatBalances` in `src/lib/utils.ts` sorts balances in JavaScript. **Optimization:** Add `ORDER BY date ASC` to the SQL queries in `getBalances` and other fetching functions to offload sorting to the database.

</details>

### Architecture & Code Quality

#### Use Zod for Form Validation

**Current Issue:** Server actions manually extract and cast `FormData` values. **Optimization:** Use `zod` to define schemas for account and balance updates. This provides better type safety, easier validation, and automatic error message generation.

#### Database Views for Net Worth

**Current Issue:** Net worth is manually synchronized as a separate account and balance entries. **Optimization:** Consider creating a PostgreSQL `VIEW` for Net Worth. This ensures data is always consistent and removes the need for `calculateNetWorth` logic entirely.

```sql
CREATE VIEW net_worth_history AS
SELECT owner, date, SUM(amount) as total_net_worth
FROM balances b
JOIN bank_accounts a ON b.bank_account = a.id
WHERE a.name <> 'Net Worth'
GROUP BY owner, date;
```

#### Standardized Error Handling

**Current Issue:** Mix of `console.log`, `console.error`, and `throw new Error`. **Optimization:** Implement a consistent error handling strategy, possibly using a custom `AppError` class and a centralized logging utility that doesn't just print to console but can be integrated with monitoring tools.

---

## 2. Codebase Improvement TODO List (from TODO.md)

### Code Structure and Maintainability

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

### Data Handling and Database Interactions

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

### User Experience (UX)

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

### Components

- [ ] **Input Component:**
  - [ ] Add a `format` prop to handle different types of input values.
  - [ ] Improve state management for better value control.
  - [ ] Implement custom validation messages.
    - [ ] Allow for customisation for styling.
- [ ] **Card Component:**
  - [ ] Allow custom behaviours, such as click events.

### Testing

- [ ] Write unit tests for utility functions and components.
- [ ] Create integration tests for key user flows and interactions.

### Performance

- [ ] Ensure Next.js is performing code splitting effectively
- [ ] Ensure that all images are optimized for the web.
- [ ] Implement profiling tools in order to identify performance bottlenecks

### Specific Code Improvements

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
