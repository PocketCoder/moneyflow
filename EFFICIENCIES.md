# Code Efficiencies and Optimizations

This document outlines potential efficiencies and optimizations for the Moneyflow project, focusing on database performance, Next.js best practices, and code quality.

## 1. Database Performance (High Impact)

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

## 2. Next.js & React Optimizations

<details>
<summary><s>Consolidate User Lookups</s></summary>

**Current Issue:** Multiple functions (`changeAllTime`, `percentChangeFY`, etc.) called via `Promise.all` in `src/app/page.tsx` independently call `auth()` and query the user ID. **Optimization:** Fetch the User ID once in the page and pass it to the server functions, or use `React.cache` to deduplicate the `auth()` and user lookup calls within a single request.

</details>

### Implement Streaming with Suspense

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

### Utilize `es-toolkit`

**Current Issue:** `es-toolkit` is listed in `package.json` but not used. **Optimization:** Replace any potential future lodash usage or complex array/object manipulations with `es-toolkit` functions to keep the bundle size small and performance high.

<details>
<summary><s>Server-Side Sorting</s></summary>

**Current Issue:** `formatBalances` in `src/lib/utils.ts` sorts balances in JavaScript. **Optimization:** Add `ORDER BY date ASC` to the SQL queries in `getBalances` and other fetching functions to offload sorting to the database.

</details>

## 3. Architecture & Code Quality

### Use Zod for Form Validation

**Current Issue:** Server actions manually extract and cast `FormData` values. **Optimization:** Use `zod` to define schemas for account and balance updates. This provides better type safety, easier validation, and automatic error message generation.

### Database Views for Net Worth

**Current Issue:** Net worth is manually synchronized as a separate account and balance entries. **Optimization:** Consider creating a PostgreSQL `VIEW` for Net Worth. This ensures data is always consistent and removes the need for `calculateNetWorth` logic entirely.

```sql
CREATE VIEW net_worth_history AS
SELECT owner, date, SUM(amount) as total_net_worth
FROM balances b
JOIN bank_accounts a ON b.bank_account = a.id
WHERE a.name <> 'Net Worth'
GROUP BY owner, date;
```

### Standardized Error Handling

**Current Issue:** Mix of `console.log`, `console.error`, and `throw new Error`. **Optimization:** Implement a consistent error handling strategy, possibly using a custom `AppError` class and a centralized logging utility that doesn't just print to console but can be integrated with monitoring tools.
