import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Schools retrieve " }, { status: 200 });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: "School created" }, { status: 201 });
}
