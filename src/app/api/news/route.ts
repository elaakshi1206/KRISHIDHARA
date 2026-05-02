import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "News API key not configured" }, { status: 500 });
    }

    const query = "agriculture farming crops india";
    const url = `http://api.mediastack.com/v1/news?access_key=${apiKey}&keywords=${encodeURIComponent(query)}&languages=en&countries=in&limit=15`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("News API error:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
