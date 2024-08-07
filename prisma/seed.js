import prisma from "../lib/prisma.js";
import * as bcrypt from "bcrypt";

async function main() {
  // Hash the password
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Find or create a restaurant owner
  let owner = await prisma.owner.findUnique({
    where: { email: "owner@example.com" }
  });

  if (!owner) {
    owner = await prisma.owner.create({
      data: {
        email: "owner@example.com",
        password: hashedPassword,
        name: "John Doe"
      }
    });
  }

  // Create a restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Delivefy Restaurant",
      address: "Rua Principal, 123, Cidade Qualquer, Brasil",
      phone: "(11) 5555-5555",
      whatsapp: "+5511999999999",
      ownerId: owner.id
    }
  });

  // Create categories
  const imageUrl = "https://media.istockphoto.com/id/520410807/pt/foto/cheeseburguer.jpg?s=612x612&w=0&k=20&c=QHURcOoLU6E1p2_IBG_n_9TFSNiOz-dRC4r9gQqc7PU=";

  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Combos", restaurantId: restaurant.id }
    }),
    prisma.category.create({
      data: { name: "Café da Manhã", restaurantId: restaurant.id }
    }),
    prisma.category.create({
      data: { name: "Pratos Principais", restaurantId: restaurant.id }
    }),
    prisma.category.create({
      data: { name: "Sobremesas", restaurantId: restaurant.id }
    }),
    prisma.category.create({
      data: { name: "Bebidas", restaurantId: restaurant.id }
    })
  ]);

  // Create meals and store their IDs
  const [combo1, combo2, combo3, cafeAmericano, cafeFit, cafeContinental, fileMignon, salmao, risoto, tiramisu, cheesecake, brownie, refrigerante, suco, agua] = await Promise.all([
    prisma.meal.create({
      data: {
        name: "Combo 1 - Hambúrguer Clássico",
        price: 19.99,
        description: "Hambúrguer, batatas fritas e refrigerante.",
        imageUrl: imageUrl,
        categoryId: categories[0].id,
        restaurantId: restaurant.id
      }
    }),
    prisma.meal.create({
      data: {
        name: "Combo 2 - Frango Grelhado",
        price: 22.99,
        description: "Peito de frango grelhado, salada e suco natural.",
        imageUrl: imageUrl,
        categoryId: categories[0].id,
        restaurantId: restaurant.id
      }
    }),
    prisma.meal.create({
      data: {
        name: "Combo 3 - Vegetariano",
        price: 18.99,
        description: "Hambúrguer de grão-de-bico, batata doce frita e chá gelado.",
        imageUrl: imageUrl,
        categoryId: categories[0].id,
        restaurantId: restaurant.id
      }
    }),
    prisma.meal.create({
      data: {
        name: "Café da Manhã Americano",
        price: 15.99,
        description: "Ovos, bacon, panquecas e café.",
        imageUrl: imageUrl,
        categoryId: categories[1].id,
        restaurantId: restaurant.id
      }
    }),
    prisma.meal.create({
      data: {
        name: "Café da Manhã Fit",
        price: 13.99,
        description: "Iogurte, granola, frutas frescas e suco verde.",
        imageUrl: imageUrl,
        categoryId: categories[1].id,
        restaurantId: restaurant.id
      }
    }),
    prisma.meal.create({
      data: {
        name: "Café da Manhã Continental",
        price: 11.99,
        description: "Croissant, geleia, queijo, presunto e café com leite.",
        imageUrl: imageUrl,
        categoryId: categories[1].id,
        restaurantId: restaurant.id
      }
    }),
    prisma.meal.create({
      data: {
        name: "Filé Mignon ao Molho Madeira",
        price: 29.99,
        description: "Filé mignon grelhado, molho madeira, purê de batatas e legumes salteados.",
        imageUrl: imageUrl,
        categoryId: categories[2].id,
        restaurantId: restaurant.id
      }
    }),
    prisma.meal.create({
      data: {
        name: "Salmão Grelhado",
        price: 27.99,
        description: "Salmão grelhado, arroz integral e aspargos.",
        imageUrl: imageUrl,
        categoryId: categories[2].id,
        restaurantId: restaurant.id
      }
    }),
    prisma.meal.create({
      data: {
        name: "Risoto de Funghi",
        price: 24.99,
        description: "Risoto cremoso com mix de cogumelos e parmesão.",
        imageUrl: imageUrl,
        categoryId: categories[2].id,
        restaurantId: restaurant.id
      }
    }),
    prisma.meal.create({
      data: {
        name: "Tiramisu",
        price: 9.99,
        description: "Clássica sobremesa italiana com café e mascarpone.",
        imageUrl: imageUrl,
        categoryId: categories[3].id,
        restaurantId: restaurant.id
      }
    }),
    prisma.meal.create({
      data: {
        name: "Cheesecake de Frutas Vermelhas",
        price: 8.99,
        description: "Cheesecake cremoso com calda de frutas vermelhas.",
        imageUrl: imageUrl,
        categoryId: categories[3].id,
        restaurantId: restaurant.id
      }
    }),
    prisma.meal.create({
      data: {
        name: "Brownie com Sorvete",
        price: 7.99,
        description: "Brownie quente com sorvete de baunilha e calda de chocolate.",
        imageUrl: imageUrl,
        categoryId: categories[3].id,
        restaurantId: restaurant.id
      }
    }),
    prisma.meal.create({
      data: {
        name: "Refrigerante",
        price: 3.99,
        description: "Coca-Cola, Pepsi, Guaraná ou Sprite (lata 350ml).",
        imageUrl: imageUrl,
        categoryId: categories[4].id,
        restaurantId: restaurant.id
      }
    }),
    prisma.meal.create({
      data: {
        name: "Suco Natural",
        price: 5.99,
        description: "Laranja, abacaxi, maracujá ou limão (300ml).",
        imageUrl: imageUrl,
        categoryId: categories[4].id,
        restaurantId: restaurant.id
      }
    }),
    prisma.meal.create({
      data: {
        name: "Água Mineral",
        price: 2.99,
        description: "Água mineral com ou sem gás (500ml).",
        imageUrl: imageUrl,
        categoryId: categories[4].id,
        restaurantId: restaurant.id
      }
    })
  ]);

  // Create extras and store their IDs
  const [ketchup, mayonnaise, queijoExtra, bacon, molhoBBQ, caldaChocolate, gelo] = await Promise.all([
    prisma.extra.create({
      data: {
        name: "Ketchup",
        price: 0.5,
        restaurantId: restaurant.id
      }
    }),
    prisma.extra.create({
      data: {
        name: "Mayonnaise",
        price: 0.5,
        restaurantId: restaurant.id
      }
    }),
    prisma.extra.create({
      data: {
        name: "Queijo Extra",
        price: 1.0,
        restaurantId: restaurant.id
      }
    }),
    prisma.extra.create({
      data: {
        name: "Bacon",
        price: 1.5,
        restaurantId: restaurant.id
      }
    }),
    prisma.extra.create({
      data: {
        name: "Molho BBQ",
        price: 0.75,
        restaurantId: restaurant.id
      }
    }),
    prisma.extra.create({
      data: {
        name: "Calda de Chocolate",
        price: 0.8,
        restaurantId: restaurant.id
      }
    }),
    prisma.extra.create({
      data: {
        name: "Gelo",
        price: 0.2,
        restaurantId: restaurant.id
      }
    })
  ]);

  // Associate extras with meals
  await Promise.all([
    prisma.mealExtra.createMany({
      data: [
        { mealId: combo1.id, extraId: ketchup.id },
        { mealId: combo1.id, extraId: bacon.id },
        { mealId: combo2.id, extraId: molhoBBQ.id },
        { mealId: cafeAmericano.id, extraId: queijoExtra.id },
        { mealId: cafeFit.id, extraId: caldaChocolate.id },
        { mealId: brownie.id, extraId: caldaChocolate.id },
        { mealId: refrigerante.id, extraId: gelo.id },
      ]
    })
  ]);

  console.log("Seed data created successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
