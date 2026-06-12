"use client"

import 'regenerator-runtime/runtime';
import React, { useEffect, useState } from 'react'
import LobbyScreen from '../../_screens/LobbyScreen'
import StartScreen from '../../_screens/StartScreen';
import CodeScreen from '../../_screens/CodeScreen';
import FeedbackScreen from '../../_screens/FeedbackScreen';
import WaitingScreen from '../../_screens/WaitingScreen';
import EndScreen from '../../_screens/EndScreen';
import IntermissionScreen from '../../_screens/IntermissionScreen';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { gameFeedback } from '@/models/game-feedback';

let socket;

const PlayPage = () => {
  // Room info
  const [roomId, setRoomId] = useState();
  const [player, setPlayer] = useState();
  const [players, setPlayers] = useState();

  // Game setup
  const [game, setGame] = useState(null);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);

  // Game states
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");j
  const [feedback, setFeedback] = useState(null);
  const [intermission, setIntermission] = useState(false);

  // From database after room code is entered
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [topic, setTopic] = useState("");
  const [rounds, setRounds] = useState("");

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    socket = io(backendUrl);

    socket.on('setNewPlayer', (player) => {
      setPlayer(player);
      toast.success(`${player.name} joined the game`);
    });

    socket.on('broadcastPlayerJoin', (players) => {
      setPlayers(players);
    });

    socket.on('broadcastPlayerLeave', (players) => {
      setPlayers(players);
    });

    socket.on('broadcastGameStart', (question) => {
      setQuestion(question);
      setStarted(true);
    });

    socket.on('broadcastQuestionEnd', () => {
      setTimeout(() => {
        setQuestion("");
      }, 5000);
    });

    socket.on('broadcastIntermission', (players) => {
      setPlayers(players);
      setIntermission(true);
    });

    socket.on('broadcastNewQuestion', (question) => {
      setQuestion(question);
      setAnswer("");
      setFeedback(null);
      setIntermission(false);
    });

    socket.on('broadcastGameEnd', () => {
      setEnded(true);
    });
  }, []);

  // Send message to socket when player joins a room
  useEffect(() => {
    if (!roomId) return;
    socket.emit('playerJoin', roomId, game.content.questions);
  }, [roomId]);

  // Send message to socket when game starts
  useEffect(() => {
    if (!started) return;
    socket.emit('gameStart', roomId);
  }, [started]);

  // Send message to socket when player answers
  useEffect(() => {
    if (!answer) return;
    socket.emit('playerAnswer', roomId);
    handleFeedback();
  }, [answer]);

  // Send message to socket to move on to intermission screen
  useEffect(() => {
    if (!intermission) return;
    socket.emit('setIntermission', roomId);
  }, [intermission]);

  const handleNewQuestion = () => {
    socket.emit('setNewQuestion', roomId);
  }

  const handleFeedback = async () => {
    const FEEDBACK_PROMPT = `You are a coding interviewer judging an applicant's response for the following coding question. Give it a rating on a scale of 1 to 10. Take into account time complexity, space complexity, correct usage of data structures and algorithms, and thoroughness of the approach. Do not score generously, but be nice, uplifting, and encouraging in your feedback. An approach that does not work should be given a 1, while only an optimal response should be given a 10. For each piece of feedback, explain how the user could improve on their response. Feedback should be several sentences long. The applicant is not expected to provide code. Address the applicant as \"you\".\n\nTime complexity: whether the algorithm runs in the optimal time.\nSpace complexity: whether the algorithm uses minimal space.\nData structures and algorithms: whether the approach uses optimal data structures and algorithms in the solution.\nThoroughness: whether the response is thorough and complex, explaining the implementation in depth and explaining the time complexity, space complexity, and structures used to you in an understandable way. More detail is better. If the user does not explicitly state the time and space complexity of their algorithm, points should be taken off. If the user does not explain why their approach is the best approach or how it compares to other approaches, points should be taken off.\n\nThe coding question is as follows:\n${question.question}\n\nThe user response is as follows:\n${answer}\n\nStore the output in a JSON format. Follow the following structure:\n{\nfinal_score: String,\nfeedback: String,\ntime_complexity: {\nscore: String,\nfeedback: String,\n},\nspace_complexity: {\nscore: String,\nfeedback: String,\n},\ndsa: {\nscore: String,\nfeedback: String,\n},\nexplanation: {\nscore: String,\nfeedback: String,\n}\n}`;

    const feedbackResponse = await gameFeedback.sendMessage(FEEDBACK_PROMPT);
    const response = JSON.parse(feedbackResponse.response.text());
    setFeedback(response);

    socket.emit('setScores', roomId, player, response.final_score, response.time_complexity.score, response.space_complexity.score, response.dsa.score, response.explanation.score);
  }

  return (
    <div className='bg-white'>
      {!game ? (
        // Screen to enter game code
        <LobbyScreen setRoomId={setRoomId} setGame={setGame} setTitle={setTitle} setDifficulty={setDifficulty} setTopic={setTopic} setRounds={setRounds} />
      ) : (
        <div>
          {!started ? (
            <div>
              {players && (
                // Screen to start the game
                <StartScreen title={title} difficulty={difficulty} topic={topic} rounds={rounds} player={player} players={players} setStarted={setStarted} />
              )}
            </div>
          ) : (
            <div>
              {!ended ? (
                <div>
                  {question ? (
                    <div>
                      {!answer ? (
                        // Screen displaying the current coding question
                        <CodeScreen question={question} setAnswer={setAnswer} />
                      ) : (
                        // Waiting room
                        <WaitingScreen />
                      )}
                    </div>
                  ) : (
                    // Question will be removed after time is up and show this
                    <div>
                      {feedback ? (
                        <div>
                          {!intermission ? (
                            // Show feedback for user answer
                            <FeedbackScreen feedback={feedback} setIntermission={setIntermission} />
                          ) : (
                            // Score vs opponent etc.
                            <IntermissionScreen players={players} handleNewQuestion={handleNewQuestion} />
                          )}
                        </div>
                      ) : (
                        // Waiting room
                        <WaitingScreen />
                      )}
                    </div>
                  )}
                </div>
              ) : (
                // Game end screen
                <EndScreen players={players} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PlayPage