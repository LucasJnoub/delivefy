// import prisma from "./prisma"
import { PrismaClient  } from "@prisma/client"

const prisma =  new PrismaClient({
  datasources: {
          db: {
            url:"postgres://postgres:abc123@104.248.229.81:8080/websocket"
          }
}
})

export async function getRestaurantData() {
  try {
    const restaurant = await prisma.restaurant.findFirst({
      include: {
        categories: {
          include: {
            meals: true
          }
        },
        extras: true
      }
    })

    if (!restaurant) {
      throw new Error("Restaurant not found")
    }

    console.log(restaurant)
    return restaurant
  } catch (error) {
    console.error("Error fetching restaurant data:", error)
    throw new Error("Error fetching restaurant data")
  }
}
