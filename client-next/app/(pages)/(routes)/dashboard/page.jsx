"use client";
import { motion } from "framer-motion";
import DashboardCard from "../../_components/DashboardCard";
import Stars from "../../_components/Stars";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

const DashboardPage = () => {
  const [games, setGames] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchGame = async () => {
      if (!user) return;

      const url = `/api/games?createdBy=${user.id}`;
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        setGames(data.games);
      } catch (error) {
        console.error("Failed to get games:", error);
      }
    };

    fetchGame();
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5, 
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-black text-white bg-gradient-to-b from-black to-[#5D2CA8] relative overflow-clip min-h-screen">
      <Stars />
      <div className="pt-56"></div>
      <h1 className="flex items-center justify-center mb-6 font-bold text-6xl animate-typewriter">
        Dashboard
      </h1>
      <div className="flex items-center justify-center mb-24 ">
        See all your generated games here.
      </div>
      <div className="flex items-start justify-center mb-12">
        {user && games.length > 0 && (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {games.map((game, index) => (
              <motion.div key={index} variants={itemVariants}>
                <DashboardCard title={game.title} code={game.gameId} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <div className="absolute h-[375px] w-[130%] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border border-[#B48CDE] bg-[radial-gradient(closest-side,#000000_82%,#9560EB)] top-[calc(100%-125px)]" />
    </div>
  );
};

export default DashboardPage;
