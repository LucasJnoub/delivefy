import { NextResponse } from "next/server"
import { getRestaurantData } from "../../../lib/getRestaurantData"

export async function GET(req) {
  try {
    const restaurant = await getRestaurantData()
    console.log(restaurant);
    
    return NextResponse.json(restaurant, { status: 200 })
  } catch (error) {
    console.error("Error fetching restaurant data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  return NextResponse.json(
    { message: `Method ${req.method} Not Allowed` },
    { status: 405 }
  )
}