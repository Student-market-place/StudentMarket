import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Reviews retrieve " }, { status: 200 });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: "Reviews created" }, { status: 201 });
}
