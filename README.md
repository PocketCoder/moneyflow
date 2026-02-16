<div align="center">
  <img src="public/logo.png" alt="Vantage Logo" width="120" height="120">
  <h1>Vantage</h1>
  <p><strong>Elevate your financial view.</strong></p>
  
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css" alt="Tailwind v4"></a>
  <a href="https://neon.tech"><img src="https://img.shields.io/badge/Neon-Postgres-00e599?style=flat-square&logo=postgresql" alt="Neon DB"></a>
</div>

<br />

> **Note:** This project is currently in **ALPHA**. It is a work in progress and not yet ready for production use.

## About

**Vantage** is a minimalist financial tracker designed to help you ignore the minutiae of daily transactions and focus on the big picture.

Unlike standard budgeting apps that shame you for buying coffee, Vantage focuses on **Net Worth**, **Asset Allocation**, and **Long-term Trends**. It features a "Natural Wealth" design language—using deep forest greens, warm stones, and slate greys—to create a calm, professional environment for managing your financial future.

## ✨ Features

- **Macro Tracking:** Log balances periodically (monthly/weekly) rather than every transaction.
- **Net Worth Visualisation:** Beautiful, interactive area charts showing your wealth trajectory.
- **Trend Analysis:** Automatic calculation of Month-on-Month (MoM) and Year-on-Year (YoY) growth.
- **Asset Allocation:** Breakdown of your portfolio (Cash, Pensions, Investments, Debt).
- **Privacy First:** Self-hostable and owns your data.
- **Responsive Design:** A premium mobile and desktop experience built with Tailwind CSS v4.

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Tailwind Variants](https://www.tailwind-variants.org/)
- **Database:** [Neon](https://neon.tech/) (Serverless Postgres)
- **Auth:** [NextAuth.js v5](https://authjs.dev/)
- **Charts:** [Recharts](https://recharts.org/) (customized for Tremor-like aesthetic)
- **Icons:** [Heroicons](https://heroicons.com/) & [Lucide](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- A Neon Database project (Postgres)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/vantage.git
   cd vantage
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup** Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgres://user:pass@ep-xyz.region.aws.neon.tech/neondb?sslmode=require"
   AUTH_SECRET="your-generated-secret"
   GITHUB_ID="your-github-oauth-id"
   GITHUB_SECRET="your-github-oauth-secret"
   ```

4. **Initialize Database** Run the SQL commands found in `schema.sql` in your Neon SQL editor to create the necessary tables (`users`, `bank_accounts`, `balances`).

5. **Run the development server**
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🎨 Design System

Vantage uses a custom semantic color system defined in `globals.css`:

- **Primary:** Deep Forest Green (`--primary`)
- **Background:** Warm Stone (`--background`)
- **Destructive:** Muted Red (`--destructive`)
- **Accents:** Antique Gold (`--accent`)

## 🤝 Contributing

We welcome contributions! Please check `TODO.md` for a list of architectural improvements and features we are currently prioritizing.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License.

```

```
