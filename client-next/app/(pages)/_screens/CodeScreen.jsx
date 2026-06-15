"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { Textarea } from '@/components/ui/textarea';
import { FaMicrophone } from "react-icons/fa";
import { LiveKitRoom, GridLayout, ParticipantTile, TrackRefContext, RoomAudioRenderer, ControlBar, useTracks } from "@livekit/components-react";
import '@livekit/components-styles';
import { Track } from 'livekit-client';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';



function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '30vh',
        width: '30vw',
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}>
        <ParticipantTile style={{ flex: 1 }} />
        <ControlBar variation='minimal' />
        </div>
    </GridLayout>
  );
}

const CodeScreen = ({ question, setAnswer }) => {
  const [recording, setRecording] = useState(false);
  const [microphone, setMicrophone] = useState(false);
  const [token, setToken] = useState(null);
  const [join, setJoin] = useState(false);
  const [counter, setCounter] = useState(300);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [textInput, setTextInput] = useState("No Response");
  const mediaRecorderRef = useRef(null);
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  
  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://hi-9p8faniz.livekit.cloud";

// Fetch token logic
useEffect(() => {

  const fetchToken = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/getToken`);
      if (!response.ok) {
        throw new Error("Failed to fetch token");
      }
      const data = await response.json();
      setToken(data.token);
    } catch (error) {
        console.error('Error fetching token', error);
    }
  };

  fetchToken();
}, []);

  // Start recording once on mount
  useEffect(() => {
    startRecording();
    return () => stopRecording();
  }, []);

  // Timer countdown logic - separated from media logic
  useEffect(() => {
    if (counter === 0) {
      stopRecording();
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

// Control speech recognition based on microphone state
useEffect(() => {
    if (microphone) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });

      setRecording(true);
    } else {
      SpeechRecognition.stopListening();

      setRecording(false);
    }
  }, [microphone]);

// Log transcript updates
useEffect(() => {
  if (listening) {
    // Log or handle transcript updates while listening
    // (keep lightweight to avoid performance issues)
    console.log('Transcript updated:', transcript);
  }
}, [transcript, listening]);

// Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        setAudioBlob(event.data);
      });
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  if (!token) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const handleChange = (e) => {
    const newValue = e.target.value;
    setTextInput(newValue);

  }

  const handleSubmit = () => {
    if (microphone) {
      SpeechRecognition.stopListening();
      setRecording(false);
      setAnswer(transcript);

    } else {

      if (!textInput) return;
      setAnswer(textInput);
    }
  }

  return (
    <div className="bg-black bg-gradient-to-b from-black to-[#5D2CA8] relative overflow-clip text-white h-screen text-sm pt-16">
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="rounded-3xl p-1 bg-gradient-to-b from-purple-600 to-purple-400 h-[400px]">
          <div className='flex items-center justify-center h-[390px] rounded-[calc(1.5rem-1px)] p-10 bg-slate-900 '>
            <div className="absolute flex-col items-start justify-center gap-4 overflow-y-auto max-h-[390px] p-16 translate-x-0">
              <div className='font-bold text-xl text-center'>{question.title}</div><br />
              <div>{question.question}</div><br />
              <div>
                <div>Example 1:</div>
                <div>{question.example_1}</div>
              </div><br />
              <div>
                <div>Example 2:</div>
                <div>{question.example_2}</div>
              </div>
            </div>
          </div>
        </div>
        <div className='grid grid-rows-2 gap-4'>
          {!microphone ? (
            <div className='flex items-start justify-start'>
              <Textarea onChange={handleChange} className='bg-slate-900 text-white w-full h-[400px] p-6 text-start border border-transparent rounded-3xl' placeholder='Type here...'></Textarea>
            </div>
          ) : (
            <div className='flex items-start justify-start'>
              <div className='overflow-y-auto max-h-[390px] bg-slate-900 rounded-md text-white w-full h-[400px] p-6 text-start'>{transcript}</div>
            </div>
          )}
          <div className='flex items-start justify-start bg-slate-900 w-full max-h-[200px] rounded-3xl'>
            <div className='flex items-center justify-center text-center h-full w-full text-white gap-16'>
              <button onClick={() => setMicrophone((prev) => !prev)}>
                {microphone ? (
                  <FaMicrophone className='text-6xl text-red-600' />
                ) : (
                  <FaMicrophone className='text-6xl' />
                )}
              </button>
              <Button className="px-12 py-4 bg-white text-black hover:bg-gray-100 m-5"
                onClick={handleSubmit}
              >
                Submit
              </Button>
              
                <LiveKitRoom
                    video={true}
                    audio={true}
                    token={token}
                    serverUrl={serverUrl}
                    style={{ 
                      position: 'fixed',
                      bottom: '0px',
                      left: '0px',
                      height: '35vh',
                      width: '35vw',
                      zIndex: 9999,
                    }}
                  >
                    <MyVideoConference />
                    <RoomAudioRenderer />
                    </LiveKitRoom>
                    {/* Timer display */}
                    <div className="timer" style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', position: 'fixed', bottom: 130, left: 400 }}>
                      <p>
                        Time remaining:<br/> <br/> {String(Math.floor(counter / 60)).padStart(2, '0')}:
                        {String(counter % 60).padStart(2, '0')}
                      </p>
                    </div>
                  
                
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default CodeScreen