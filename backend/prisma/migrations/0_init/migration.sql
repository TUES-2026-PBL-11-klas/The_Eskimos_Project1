-- create tables
CREATE TABLE "User" (
    "id"        SERIAL       NOT NULL,
    "email"     TEXT         NOT NULL,
    "password"  TEXT         NOT NULL,
    "name"      TEXT         NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Favorite" (
    "id"          SERIAL       NOT NULL,
    "userId"      INTEGER      NOT NULL,
    "tmdbMovieId" INTEGER      NOT NULL,
    "addedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Watched" (
    "id"          SERIAL       NOT NULL,
    "userId"      INTEGER      NOT NULL,
    "tmdbMovieId" INTEGER      NOT NULL,
    "watched"     BOOLEAN      NOT NULL DEFAULT true,
    "addedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Watched_pkey" PRIMARY KEY ("id")
);

-- create indexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE UNIQUE INDEX "Favorite_userId_tmdbMovieId_key" ON "Favorite"("userId", "tmdbMovieId");

CREATE UNIQUE INDEX "Watched_userId_tmdbMovieId_key" ON "Watched"("userId", "tmdbMovieId");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Watched" ADD CONSTRAINT "Watched_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;