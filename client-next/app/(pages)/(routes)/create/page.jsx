"use client"

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from '@/components/ui/select';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ShortUniqueId from 'short-unique-id';
import Stars from '../../_components/Stars';

const CreatePage = () => {
    const [title, setTitle] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [topic, setTopic] = useState("");
    const [rounds, setRounds] = useState("");
    const [disabled, setDisabled] = useState(false);

    // Display on screen after game is generated
    const [code, setCode] = useState("");

    const { isLoaded, isSignedIn, user } = useUser();

    const handleTitle = (event) => {
        setTitle(event.target.value);
    };
    const handleDifficulty = (value) => {
        setDifficulty(value);
    };
    const handleTopic = (value) => {
        setTopic(value);
    };
    const handleRounds = (event) => {
        setRounds(event.target.value);
    };

    const generateGame = async () => {
        if (!title || !difficulty || !topic || !rounds) return;

        setDisabled(true);

        const url = '/api/games';

        const userId = user?.id;
        const { randomUUID } = new ShortUniqueId({ dictionary: 'number', length: 7 });
        const gameId = randomUUID();

        toast.success('Loading...');

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    title: title,
                    difficulty: difficulty,
                    topic: topic,
                    rounds: rounds,
                    gameId: gameId,
                    createdBy: userId,
                }),
            });

            if (!response.ok) {
                toast.error('Something went wrong.');
                throw new Error(`Response status: ${response.status}`);
            } else {
                toast.success('Game created!');
                setCode(gameId);
            }
        } catch (error) {
            toast.error('Something went wrong.');
            throw new Error(`Failed to create game: ${error}`);
        }

        return new Response('Game Created', { status: 201 });
    }

    return (
        <div className="bg-black bg-gradient-to-b from-black to-[#5D2CA8] relative overflow-clip ">
            <Stars />
            {!code ? (
                <div className='flex flex-col items-center justify-center text-center h-screen'>
                    <div className='text-white font-bold text-6xl mb-6'>
                        Create
                    </div>
                    <div className='text-white mb-10'>
                        Generate a custom game for any leetcode topic.
                    </div>
                    <input
                        className='px-28 py-3 text-center rounded-md m-2'
                        placeholder='Enter game title...'
                        onChange={handleTitle}>
                    </input>
                    <input
                        className='px-28 py-3 text-center rounded-md m-2'
                        placeholder='Enter rounds...'
                        onChange={handleRounds}>
                    </input>

                    <div className='flex items-center justify-center gap-6'>
                        <Select onValueChange={handleDifficulty}>
                            <SelectTrigger className="w-[180px] m-2">
                                <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select onValueChange={handleTopic}>
                            <SelectTrigger className="w-[180px] m-2">
                                <SelectValue placeholder="Topic" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="arrays">Arrays</SelectItem>
                                <SelectItem value="strings">Strings</SelectItem>
                                <SelectItem value="linked lists">Linked Lists</SelectItem>
                                <SelectItem value="hash maps">Hash Maps</SelectItem>
                                <SelectItem value="trees">Trees</SelectItem>
                                <SelectItem value="stacks">Stacks</SelectItem>
                                <SelectItem value="queues">Queues</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button className='mt-4 rounded-full' onClick={generateGame} disabled={disabled}>Generate</Button>
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center text-center text-white h-screen'>
                    <div className='text-3xl font-bold pb-4'>
                        Game Code
                    </div>
                    <div className='pb-8'>
                        Share this code to play with your friends.
                    </div>
                    <div className='text-6xl font-bold'>
                        {code}
                    </div>
                </div>
            )}
            <div className="absolute h-[375px] w-[130%] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border border-[#4b2488] bg-[radial-gradient(closest-side,#000000_80%,#47288a)] top-[calc(100%-125px)]"  />
        </div>
    )
}

export default CreatePage