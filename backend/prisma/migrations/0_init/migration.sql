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

CREATE TABLE "FavoriteMovie" (
    "id"          SERIAL       NOT NULL,
    "userId"      INTEGER      NOT NULL,
    "tmdbMovieId" INTEGER      NOT NULL,
    "addedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteMovie_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WatchedMovie" (
    "id"          SERIAL       NOT NULL,
    "userId"      INTEGER      NOT NULL,
    "tmdbMovieId" INTEGER      NOT NULL,
    "watched"     BOOLEAN      NOT NULL DEFAULT true,
    "addedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchedMovie_pkey" PRIMARY KEY ("id")
);

-- create indexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE UNIQUE INDEX "FavoriteMovie_userId_tmdbMovieId_key" ON "FavoriteMovie"("userId", "tmdbMovieId");

CREATE UNIQUE INDEX "WatchedMovie_userId_tmdbMovieId_key" ON "WatchedMovie"("userId", "tmdbMovieId");

-- AddForeignKey
ALTER TABLE "FavoriteMovie" ADD CONSTRAINT "FavoriteMovie_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WatchedMovie" ADD CONSTRAINT "WatchedMovie_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;