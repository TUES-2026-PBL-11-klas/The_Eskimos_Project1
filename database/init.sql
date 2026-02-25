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
CREATE TABLE IF NOT EXISTS "FavoriteMovie" (
    "id"          SERIAL       NOT NULL,
    "userId"      INTEGER      NOT NULL,
    "tmdbMovieId" INTEGER      NOT NULL,
    "addedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteMovie_pkey"             PRIMARY KEY ("id"),
    CONSTRAINT "FavoriteMovie_userId_fkey"      FOREIGN KEY ("userId")
        REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "FavoriteMovie_userId_tmdbMovieId_key"
    ON "FavoriteMovie"("userId", "tmdbMovieId");

CREATE TABLE IF NOT EXISTS "WatchedMovie" (
    "id"          SERIAL       NOT NULL,
    "userId"      INTEGER      NOT NULL,
    "tmdbMovieId" INTEGER      NOT NULL,
    "watched"     BOOLEAN      NOT NULL DEFAULT true,
    "addedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchedMovie_pkey"        PRIMARY KEY ("id"),
    CONSTRAINT "WatchedMovie_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "WatchedMovie_userId_tmdbMovieId_key"
    ON "WatchedMovie"("userId", "tmdbMovieId");
