 CREATE TABLE IF NOT EXISTS "User" (
    "id"        SERIAL       NOT NULL,
    "email"     TEXT         NOT NULL,
    "password"  TEXT         NOT NULL,
    "name"      TEXT         NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
 
-- Stores TMDB movie IDs only – no local movie table needed.
CREATE TABLE IF NOT EXISTS "Favorite" (
    "id"          SERIAL       NOT NULL,
    "userId"      INTEGER      NOT NULL,
    "tmdbMovieId" INTEGER      NOT NULL,
    "addedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey"             PRIMARY KEY ("id"),
    CONSTRAINT "Favorite_userId_fkey"      FOREIGN KEY ("userId")
        REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Favorite_userId_tmdbMovieId_key"
    ON "Favorite"("userId", "tmdbMovieId");

CREATE TABLE IF NOT EXISTS "Watched" (
    "id"          SERIAL       NOT NULL,
    "userId"      INTEGER      NOT NULL,
    "tmdbMovieId" INTEGER      NOT NULL,
    "watched"     BOOLEAN      NOT NULL DEFAULT true,
    "addedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Watched_pkey"        PRIMARY KEY ("id"),
    CONSTRAINT "Watched_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Watched_userId_tmdbMovieId_key"
    ON "Watched"("userId", "tmdbMovieId");
