-- 1. Update existing 'users' table
-- Add preferences column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{"goal": []}'::jsonb;

-- 2. Create 'bank_accounts' table
-- Note: 'owner' is INTEGER to match the existing 'users.id' type
CREATE TABLE IF NOT EXISTS bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    parent TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- 3. Create 'balances' table
CREATE TABLE IF NOT EXISTS balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_account UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    CONSTRAINT unique_account_date UNIQUE(bank_account, date)
);

-- 4. Create Indexes
CREATE INDEX IF NOT EXISTS idx_bank_accounts_owner ON bank_accounts(owner);
CREATE INDEX IF NOT EXISTS idx_balances_account_date ON balances(bank_account, date DESC);