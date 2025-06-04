-- CreateTable
CREATE TABLE "people" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "linkedin" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "participarSelecaoMindset" TEXT NOT NULL,
    "disponibilidadeHorarioTeste" TEXT NOT NULL,
    "indicacao" TEXT,
    "expectativas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "participant_type" TEXT NOT NULL,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "people_email_key" ON "people"("email");
