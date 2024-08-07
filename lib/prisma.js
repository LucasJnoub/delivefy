import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv"
// Carrega as variáveis de ambiente do arquivo .env
dotenv.config()

let prisma

if (!global.prisma) {
  global.prisma = new PrismaClient({
    datasources: {
      db: {
        url:"postgres://postgres:abc123@104.248.229.81:8080/websocket"
      }
    }
  })
}

prisma = global.prisma

export default prisma
