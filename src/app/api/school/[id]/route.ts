import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ name: "School by ID" }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ message: "School delete" }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  return NextResponse.json({ message: "School update" }, { status: 201 });
}
