-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqCategory" (
    "id" TEXT NOT NULL,
    "orderBy" INTEGER NOT NULL DEFAULT 0,
    "nameFr" TEXT NOT NULL,
    "nameNl" TEXT NOT NULL,
    "nameDe" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FaqCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqItem" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "orderBy" INTEGER NOT NULL DEFAULT 0,
    "questionFr" TEXT NOT NULL,
    "questionNl" TEXT NOT NULL,
    "questionDe" TEXT NOT NULL,
    "questionEn" TEXT NOT NULL,
    "questionAr" TEXT NOT NULL,
    "answerFr" TEXT NOT NULL,
    "answerNl" TEXT NOT NULL,
    "answerDe" TEXT NOT NULL,
    "answerEn" TEXT NOT NULL,
    "answerAr" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FaqItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsItem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "orderBy" INTEGER NOT NULL DEFAULT 0,
    "titleFr" TEXT NOT NULL,
    "titleNl" TEXT NOT NULL,
    "titleDe" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "bodyFr" TEXT NOT NULL,
    "bodyNl" TEXT NOT NULL,
    "bodyDe" TEXT NOT NULL,
    "bodyEn" TEXT NOT NULL,
    "bodyAr" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '',
    "featuredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReformChange" (
    "id" TEXT NOT NULL,
    "orderBy" INTEGER NOT NULL DEFAULT 0,
    "beforeFr" TEXT NOT NULL,
    "beforeNl" TEXT NOT NULL,
    "beforeDe" TEXT NOT NULL,
    "beforeEn" TEXT NOT NULL,
    "beforeAr" TEXT NOT NULL,
    "afterFr" TEXT NOT NULL,
    "afterNl" TEXT NOT NULL,
    "afterDe" TEXT NOT NULL,
    "afterEn" TEXT NOT NULL,
    "afterAr" TEXT NOT NULL,
    "impactTag" TEXT NOT NULL DEFAULT 'modified',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReformChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReformProfile" (
    "id" TEXT NOT NULL,
    "orderBy" INTEGER NOT NULL DEFAULT 0,
    "nameFr" TEXT NOT NULL,
    "nameNl" TEXT NOT NULL,
    "nameDe" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "descFr" TEXT NOT NULL,
    "descNl" TEXT NOT NULL,
    "descDe" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "descAr" TEXT NOT NULL,
    "impactFr" TEXT NOT NULL,
    "impactNl" TEXT NOT NULL,
    "impactDe" TEXT NOT NULL,
    "impactEn" TEXT NOT NULL,
    "impactAr" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReformProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReformTimeline" (
    "id" TEXT NOT NULL,
    "orderBy" INTEGER NOT NULL DEFAULT 0,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "descFr" TEXT NOT NULL,
    "descNl" TEXT NOT NULL,
    "descDe" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "descAr" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReformTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolItem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "orderBy" INTEGER NOT NULL DEFAULT 0,
    "titleFr" TEXT NOT NULL,
    "titleNl" TEXT NOT NULL,
    "titleDe" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "descFr" TEXT NOT NULL,
    "descNl" TEXT NOT NULL,
    "descDe" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "descAr" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "ctaFr" TEXT NOT NULL DEFAULT 'Utiliser',
    "ctaNl" TEXT NOT NULL DEFAULT 'Gebruiken',
    "ctaDe" TEXT NOT NULL DEFAULT 'Nutzen',
    "ctaEn" TEXT NOT NULL DEFAULT 'Use',
    "ctaAr" TEXT NOT NULL DEFAULT 'استخدم',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToolItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlossaryEntry" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "orderBy" INTEGER NOT NULL DEFAULT 0,
    "shortFr" TEXT NOT NULL,
    "shortNl" TEXT NOT NULL,
    "shortDe" TEXT NOT NULL,
    "shortEn" TEXT NOT NULL,
    "shortAr" TEXT NOT NULL,
    "longFr" TEXT NOT NULL,
    "longNl" TEXT NOT NULL,
    "longDe" TEXT NOT NULL,
    "longEn" TEXT NOT NULL,
    "longAr" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlossaryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UiString" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "valueFr" TEXT NOT NULL,
    "valueNl" TEXT NOT NULL,
    "valueDe" TEXT NOT NULL,
    "valueEn" TEXT NOT NULL,
    "valueAr" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UiString_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NewsItem_slug_key" ON "NewsItem"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ToolItem_slug_key" ON "ToolItem"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GlossaryEntry_term_key" ON "GlossaryEntry"("term");

-- CreateIndex
CREATE UNIQUE INDEX "UiString_key_key" ON "UiString"("key");

-- AddForeignKey
ALTER TABLE "FaqItem" ADD CONSTRAINT "FaqItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FaqCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
