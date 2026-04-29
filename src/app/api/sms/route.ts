import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, message } = body;

    let reply = "Welcome to VoteFlow SMS. Reply HELP for options.";

    const cmd = message.trim().toUpperCase();
    if (cmd === "DEADLINE") {
      reply = "Your next deadline: Voter Registration on Oct 24. Reply REGISTER for a link.";
    } else if (cmd === "BOOTH") {
      reply = "Nearest booth: Central High School (0.8mi). Wait time: 15m. Reply MAP for directions.";
    } else if (cmd === "REGISTER") {
      reply = "Register here: https://voteflow.app/register";
    }

    // Edge function ready endpoint
    return NextResponse.json({ success: true, to: phone, reply });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }
}
