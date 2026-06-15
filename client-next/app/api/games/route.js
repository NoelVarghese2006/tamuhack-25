import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Game from "@/models/game";
import { gameQuestions } from "@/models/game-questions";

function extractAndParseJSON(text) {
    // Try direct parsing first
    try {
        return JSON.parse(text);
    } catch (e) {
        console.warn("Direct JSON parsing failed, attempting to clean/extract JSON: ", e);
    }

    let cleaned = text.trim();
    // Remove markdown code fences
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/,'');
    // Remove leading asterisk bullet lines (e.g., "*   Topic: ...")
    cleaned = cleaned.replace(/^\*\s*/gm, '');
    // Remove any text before the first opening brace
    const firstBrace = cleaned.indexOf('{');
    if (firstBrace > 0) {
        cleaned = cleaned.slice(firstBrace);
    }
    // Ensure we have a closing brace
    const lastBrace = cleaned.lastIndexOf('}');
    if (lastBrace > 0 && lastBrace < cleaned.length - 1) {
        cleaned = cleaned.slice(0, lastBrace + 1);
    }
    try {
        return JSON.parse(cleaned);
    } catch (e) {
        console.error('Failed to parse cleaned JSON:', e);
    }
    // As a last resort, attempt to extract a substring between braces
    const startBrace = cleaned.indexOf('{');
    const endBrace = cleaned.lastIndexOf('}');
    if (startBrace !== -1 && endBrace !== -1 && endBrace > startBrace) {
        const jsonStr = cleaned.substring(startBrace, endBrace + 1);
        try {
            return JSON.parse(jsonStr);
        } catch (e) {
            console.error('Failed to parse extracted JSON substring:', e);
        }
    }
    throw new Error(`Failed to parse response as JSON. Raw text: ${text}`);
}

export async function POST(request) {
    try {
        const { title, difficulty, topic, rounds, gameId, createdBy } = await request.json();

        const GAME_PROMPT = `Generate a set of ${rounds} coding interview questions covering ${topic} with a difficulty level of ${difficulty}. Provide examples of expected output. The question should be thorough and detailed and resemble the style of leetcode questions. The question titles should describe the problem that is being generated. Output the response in JSON format. The text will be placed in an HTML div, so do not format output at all. No asterisks or code blocks. Follow the given structure:\n{\nquestions: [\n{\ntitle: String,\nquestion: String,\nexample_1: String,\nexample_2: String,\n}\n]\n}`;

        const gameResponse = await gameQuestions.sendMessage(GAME_PROMPT);
        const responseText = gameResponse.response.text();
        console.log("Raw Model Response:", responseText);

        const questions = extractAndParseJSON(responseText);

        console.log("Parsed JSON:", questions);

        await connectDB();
        await Game.create({ title, difficulty, topic, rounds, content: questions, gameId, createdBy });
        return NextResponse.json({ message: "Game Created" }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/games:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request) {
    const url = request.nextUrl;
    const createdBy = url.searchParams.get("createdBy");
    const gameId = url.searchParams.get("gameId");

    const query = {};
    if (createdBy) query.createdBy = createdBy;
    if (gameId) query.gameId = gameId;

    await connectDB();

    const games = await Game.find(query);
    return NextResponse.json({ games });
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("gameId");
    await connectDB();
    await Game.findOneAndDelete({ gameId: id });
    return NextResponse.json({ message: "Game Deleted. Refresh the page to get rid of the icon." }, { status: 200 });
}