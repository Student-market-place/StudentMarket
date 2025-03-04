import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ name: "Company_offer id" }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json(
    { message: "Company_offery delete" },
    { status: 201 }
  );
}

export async function PUT(req: NextRequest) {
  return NextResponse.json(
    { message: "Company_offer update" },
    { status: 201 }
  );
}
