"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Stars from "../_components/Stars";

const LobbyScreen = ({ setRoomId, setGame, setTitle, setDifficulty, setTopic, setRounds }) => {
    const [gameCode, setGameCode] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!gameCode) return;

        const url = `/api/games?gameId=${gameCode}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                setError("Something went wrong.");
                throw new Error(`Response status: ${response.status}`);
            }

            const data = await response.json();
            if (data.games.length == 0) {
                setError("Please enter a valid 7-digit game code.");
            } else {
                const game = data.games[0];
                setGame(game);

                setTitle(game.title);
                setDifficulty(game.difficulty);
                setTopic(game.topic);
                setRounds(game.rounds);

                setRoomId(gameCode);

                setError("");
            }
        } catch (error) {
            throw new Error(`Something went wrong: ${error}`);
        }

        // if (/^\\d{7}$/.test(gameCode)) {
        //     setError("");
        //     setRoomId(gameCode);
        //     //   router.push(`/game/${gameCode}`); // Navigate to a dynamic route
        // } else {
        //     setError("Please enter a valid 7-digit game code.");
        // }
    };

    return (
        <div className="bg-black bg-gradient-to-b from-black to-[#5D2CA8] relative overflow-clip ">
            <Stars />
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-sm bg-white shadow-md rounded-lg p-6"
                >
                    <h1 className="text-2xl font-semibold text-center mb-4">
                        Enter Game Code
                    </h1>
                    <div className="mb-4">
                        <Input
                            type="text"
                            placeholder="7-digit game code"
                            value={gameCode}
                            onChange={(e) => setGameCode(e.target.value)}
                            maxLength={7}
                            className="w-full"
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm mb-4">{error}</p>
                    )}
                    <Button
                        type="submit"
                        className="w-full bg-gray-800 text-white hover:bg-gray-900"
                    >
                        Join Game
                    </Button>
                </form>
            </div>
            <div className="absolute h-[375px] w-[130%] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border border-[#4b2488] bg-[radial-gradient(closest-side,#000000_80%,#47288a)] top-[calc(100%-125px)]" />
        </div>
    );
}

export default LobbyScreen

// const LobbyScreen = ({ setRoomId }) => {
//     return (
//         <div className='flex items-center justify-center h-screen'>
//             {/* Screen for user to enter a game code */}

//             <button onClick={(() => setRoomId("8755935"))}>join game</button>
//         </div>
//     )
// }

// export default LobbyScreen