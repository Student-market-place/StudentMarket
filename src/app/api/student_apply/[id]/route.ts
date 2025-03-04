import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ name: "Student_apply" }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json(
    { message: "Student_apply delete" },
    { status: 201 }
  );
}

export async function PUT(req: NextRequest) {
  return NextResponse.json(
    { message: "Student_apply update" },
    { status: 201 }
  );
}
