import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ name: "student_history" }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json(
    { message: "student_history delete" },
    { status: 201 }
  );
}

export async function PUT(req: NextRequest) {
  return NextResponse.json(
    { message: "student_history update" },
    { status: 201 }
  );
}
