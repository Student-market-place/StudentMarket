import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ name: "UploadFile id" }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ message: "UploadFile delete" }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  return NextResponse.json({ message: "UploadFile update" }, { status: 201 });
}
