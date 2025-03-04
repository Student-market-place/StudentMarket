import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { message: "Company_offer retrieve " },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { message: "Company_offer created" },
    { status: 201 }
  );
}
