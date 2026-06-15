# RaceCode

**⭐ Hackathon Winner: Best Use of MongoDB Atlas**

## Inspiration

According to Gemini AI, over 80% of software engineering positions require a technical coding portion as part of the interview process. Because of this, many students use platforms like LeetCode to practice their problem solving skills. The issue, however, is that students often focus only on solving as many questions as possible and forget to practice explaining their thought process, which is equally—if not more—important. That's why we made RaceCode: a multiplayer game platform to nail the technical interview!

## What it does

RaceCode is designed to help players practice explaining their approaches to technical interview problems. Users can choose topics to learn and compete with other coders in a real-time game environment that provides personalized feedback for each player's answers. All content on the platform is generated with AI, providing an unlimited collection of coding problems for players to practice!

## How we built it

Our project was built with the following technologies:
- Next.js
- React.js/Tailwind
- Gemini API
- Express.js
- MongoDB Atlas
- Socket.io
- Livekit
- Clerk Authentication
- React Speech Recognition

**User Authentication**
- We used Clerk webhooks to listen for user sign-up events.
- When a user signs up, the webhook triggers an API request to create a MongoDB database user.

**Game Creation**
- On the Create page, a user has options to set a title, number of rounds, difficulty level, and topic (e.g. arrays, linked lists, etc.) for a new game.
- When the user submits their options, the data is passed to a Gemini API function to generate the game questions.
- The output is returned in a JSON format and then stored in MongoDB via a POST request.
- A game code is generated for players to compete with their friends.

**Gameplay**
- Users can join a lobby by entering a game code in the play page.
- On game start, all players in the lobby are sent to a coding screen. We used Socket.io to broadcast events in real time to the players.
- The coding screen features a question fetched from the database with example outputs, a live camera view of each player using Livekit, and a text and microphone input for users to submit their responses.
- Through the microphone input, players can see a live transcription of their response on the screen. When a user is finished responding, the transcript is parsed into text and sent to Gemini API for evaluation.
- Once all players have responded, each player gets individual feedback for their answer. Each player receives an overall score, as well as scores for time complexity, space complexity, use of data structures and algorithms, and overall effectiveness of their response, as well as feedback on each category.
- The user can then compare their scores against the competition through a leaderboard.
- This cycle continues until all rounds have been exhausted.

**Dashboard**
- The dashboard features all games created by the user to review and play again.

## Challenges we ran into

We ran into several challenges throughout the course of this hackathon. One of these challenges was rendering the Livekit.io streaming platform on our site, as the components were rendering incorrectly and our tokens were misconfigured. Another challenge we faced was integrating speech to text in the coding screen. We had to experiment with a couple of different providers before reaching our current solution.

## Accomplishments that we're proud of

We are really happy with how this project turned out! We were able to implement all of the features we had planned and hope to improve on this project in the future.

## What we learned

We learned to use a ton of new technologies that we weren't familiar with, such as Livekit, Socket.io, and speech recognition. But more importantly, we learned to have fun and to not give up!

## What's next for RaceCode

In the future, we want to improve on RaceCode by adding new game modes, showing more detailed user statistics, and recommending topics to practice based on past game performance.

## Project submission

View our project submission [here](https://youtu.be/DuV20BNjvz4).
/