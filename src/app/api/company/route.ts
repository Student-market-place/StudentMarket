import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Company retrieve " }, { status: 200 });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: "Company created" }, { status: 201 });
}
