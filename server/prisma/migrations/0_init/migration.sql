-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "owner" UUID,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "parent" VARCHAR(255),

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "balances" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "account" UUID,
    "date" DATE,
    "amount" DECIMAL(10,2),

    CONSTRAINT "balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_owner_fkey" FOREIGN KEY ("owner") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "balances" ADD CONSTRAINT "balances_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

