-- CreateTable
CREATE TABLE "users" (
    "userId" SERIAL NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "imagePath" TEXT DEFAULT 'avatar.png',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "notes" (
    "authorId" INTEGER NOT NULL,
    "noteId" SERIAL NOT NULL,
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("noteId")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "otp" TEXT NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "notes_id_key" ON "notes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "verifications_id_key" ON "verifications"("id");

-- CreateIndex
CREATE UNIQUE INDEX "verifications_userId_key" ON "verifications"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "verifications_otp_key" ON "verifications"("otp");

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
