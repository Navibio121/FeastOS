-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN "chefNote" TEXT;
ALTER TABLE "MenuItem" ADD COLUMN "moodTags" TEXT;
ALTER TABLE "MenuItem" ADD COLUMN "originStory" TEXT DEFAULT 'This dish was born from a passion for authentic flavors and modern culinary art.';
ALTER TABLE "MenuItem" ADD COLUMN "videoUrl" TEXT;
