'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { redirect } from 'next/navigation';
import { handleUserInput } from './actions';

export function Terminal(props: { player: any; }) {
  const user=props.player
  const TERMINAL_MAX = 100000;

  // const [terminalStep, setTerminalStep] = useState(0);
  // const terminalSteps = [
  //   'Brian Delaney',
  //   'Paul McIsaac',
  //   'Christopher Schnurr',
  //   'Badass RPG Game Developers',
  // ];

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setTerminalStep((prev) =>
  //       prev < terminalSteps.length - 1 ? prev + 1 : prev
  //     );
  //   }, 500);

  //   return () => clearTimeout(timer);
  // }, [terminalStep]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const playerInput = formData.get("gameInput") as string;
    event.currentTarget.reset()

    if(playerInput.split(" ").length==1 && playerInput.split(" ")[0].toLowerCase() == 'clear'){
      clearTerminal()
      return
    }

    let gameTerminal = document.getElementById("gameTerminal");
    if(!gameTerminal) return;

    let playerAction = {
      name: user?.name,
      input: playerInput
    }

    gameTerminal.innerHTML += handleUserInput(playerAction);
    gameTerminal.scrollTop = gameTerminal.scrollHeight;

    if (gameTerminal.innerHTML.length > TERMINAL_MAX){
      if(gameTerminal.firstChild) gameTerminal.firstChild.remove();
    }
  };

  const clearTerminal = () => {
    let gameTerminal = document.getElementById("gameTerminal");
    if(!gameTerminal) return;

    gameTerminal.innerHTML = "<div>» Game Window Cleared «</div>"
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
          <div id="gameTerminal" className="h-[90%] space-y-2 overflow-y-scroll">
            {/* {terminalSteps.map((step, index) => (
              <div
                key={index}
                className={`${index > terminalStep ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
              >
                <span className="text-green-400">:</span> {step}
              </div>
            ))} */}
          </div>
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
