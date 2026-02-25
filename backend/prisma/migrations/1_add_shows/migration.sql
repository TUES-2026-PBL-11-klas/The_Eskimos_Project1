CREATE TABLE "FavoriteShow" (
    "id"         SERIAL       NOT NULL,
    "userId"     INTEGER      NOT NULL,
    "tmdbShowId" INTEGER      NOT NULL,
    "addedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteShow_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WatchedShow" (
    "id"         SERIAL       NOT NULL,
    "userId"     INTEGER      NOT NULL,
    "tmdbShowId" INTEGER      NOT NULL,
    "watched"    BOOLEAN      NOT NULL DEFAULT true,
    "addedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchedShow_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "FavoriteShow_userId_tmdbShowId_key" ON "FavoriteShow"("userId", "tmdbShowId");
CREATE UNIQUE INDEX "WatchedShow_userId_tmdbShowId_key"  ON "WatchedShow"("userId", "tmdbShowId");

ALTER TABLE "FavoriteShow" ADD CONSTRAINT "FavoriteShow_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WatchedShow" ADD CONSTRAINT "WatchedShow_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
