'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { redirect } from 'next/navigation';
import { setupActions, handleUserInput } from './actions';
import { useGemini } from "@/lib/useGemini";

export function Terminal(props: { player: any; }) {
  const user = props.player
  const TERMINAL_MAX = 100000;
  const { queryGemini } = useGemini();

  useEffect(() => {
    setupActions(user);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const playerInput = formData.get("gameInput") as string;
    event.currentTarget.reset()

    if (playerInput.split(" ").length == 1 && playerInput.split(" ")[0].toLowerCase() == 'clear') {
      clearTerminal()
      return
    }

    let gameTerminal = document.getElementById("gameTerminal");
    if (!gameTerminal) return;

    try {
      // Wait for the result from handleUserInput
      const result = await handleUserInput(playerInput, queryGemini);

      gameTerminal.innerHTML += result;
      gameTerminal.scrollTop = gameTerminal.scrollHeight;

      if (gameTerminal.innerHTML.length > TERMINAL_MAX) {
        if (gameTerminal.firstChild) gameTerminal.firstChild.remove();
      }
      
    } catch (error) {
      console.error("Error handling user input:", error);
    }
  };

  const clearTerminal = () => {
    let gameTerminal = document.getElementById("gameTerminal");
    if (!gameTerminal) return;

    gameTerminal.innerHTML = "<div>» Game Window Cleared «</div><br>"
  }

  return (
    <>
      <div className="w-full h-[100%] rounded-lg shadow-lg overflow-hidden bg-gray-900 text-white font-mono text-sm">
        <div className="p-4 h-[100%]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              Game Terminal:
            </div>
          </div>
          <div id="gameTerminal" className="h-[90%] space-y-2 overflow-y-scroll"></div>
        </div>
      </div>
      <div className="w-full h-auto my-2 rounded-lg shadow-lg overflow-hidden bg-gray-900 text-white font-mono text-sm">
        <form onSubmit={(handleSubmit)} className="my-2" autoComplete="off">
          <label className="w-[5%] float-left px-2" htmlFor="gameInput">Input: </label>
          <input className="w-[95%] m-auto outline-none" type="text" id="gameInput" name="gameInput" />
        </form>
      </div>
    </>
  );
}
