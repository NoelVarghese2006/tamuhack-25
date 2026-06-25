import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
    try {
        // Ensure database connection
        await connectDB();
        
        const dbState = mongoose.connection.readyState;
        
        // Mongoose readyState values:
        // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
        if (dbState !== 1) {
            return NextResponse.json({ 
                status: "down", 
                database: "disconnected",
                readyState: dbState
            }, { status: 500 });
        }

        // Perform a ping command to confirm the DB is responsive
        await mongoose.connection.db.admin().ping();

        return NextResponse.json({ 
            status: "ok", 
            database: "connected",
            readyState: dbState
        }, { status: 200 });
    } catch (error) {
        console.error("Health check failed:", error);
        return NextResponse.json({ 
            status: "error", 
            message: error.message 
        }, { status: 500 });
    }
}
