import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
    const categories = [
        "Alimentos / Bebidas",
        "Áudio / Música / Som",
        "Autopeças",
        "Brinquedos",
        "Calçados",
        "Confecção / Textil",
        "Cosméticos / Perfumaria / Higiene",
        "Decoração / Cama / Mesa / Banho",
        "Eletrônicos / Eletrodomésticos",
        "Embalagens",
        "Informática",
        "Jóias e Bijuterias",
        "Limpeza",
        "Máquinas / Equipamentos",
        "Construção Civil",
        "Medicamentos",
        "Móveis",
        "Pet-Shop",
        "Utilidades",
        "Gráfica Editora",
        "Outros"
    ];

    categories.map(async category => {
        await prisma.category.create({
            data: {
                name: category
            }
        });
    });
};

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        prisma.$disconnect;
    });
