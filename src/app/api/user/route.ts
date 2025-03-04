import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Users retrieve " }, { status: 200 });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: "User created" }, { status: 201 });
}
