import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Test endpoint working!" })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json({ 
    message: "Test POST endpoint working!",
    received: body
  })
}