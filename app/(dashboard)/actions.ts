
import responses from './responses.json';
import { getLocationData, setUserLocation } from '@/lib/db/queries';

let current_player: { id: number; name: any; location_id: string}

let current_location_data: { location_id: string; description: string; doors: unknown; npc?: string }
let current_location_door_data: any

export const setupActions = async (user: { id: number; name: any; location_id: string; }) => {
    current_player = user
    let player_location_id = user.location_id

    await setCurrentLocationData(player_location_id)
}

const outputToTerminal = (output: any) => {
    if(output == '') output = `I don't understand that command. Please enter '?' for help.`
    
    let gameTerminal = document.getElementById("gameTerminal");
    if(!gameTerminal) return;

    gameTerminal.innerHTML += `<div>» ${ output } </div><br>`;
    gameTerminal.scrollTop = gameTerminal.scrollHeight;
}

const setCurrentLocationData = async (player_location: string) => {
    let location_data =  await getPlayerLocationData(player_location);
    console.log("location_data.npc: " + location_data.npc);
    current_location_data = location_data
    current_location_door_data = location_data.doors
    handleLook()
    return location_data
}

const getPlayerLocationData = async (player_location: string) =>{
    let location_data =  await getLocationData(player_location) as { location_id: string; description: string; doors: unknown; npc?: string };
    if(!location_data) {
        outputToTerminal(`<span class="text-red-500">Error</span>: No location data found for location id ${player_location}, returning to Castle Courtyard.`)
        location_data =  await getLocationData(`castle_courtyard`) as { location_id: string; description: string; doors: unknown; npc?: string };        
        console.log(`location_data - ${location_data}`);
    }
    return location_data
}

const setPlayerLocation = async (userId:number, new_location: string) =>{
    console.log(new_location)
    await setUserLocation(userId, new_location)
    setCurrentLocationData(new_location)
    console.log(current_player.location_id)
    // current_location_door_data = current_location_data.doors
}

const handleWalk = (direction: string)=>{
    let destination_id
    let travel_string
    for (const [door_direction, doorData] of Object.entries(current_location_door_data) as [string, {
        travel_string: string;
        destination_id: string;
        door_description: string
      }][]) {
        if(door_direction == direction){
            destination_id = doorData.destination_id
            travel_string= doorData.travel_string
        }
      }

    if (!destination_id){
        outputToTerminal(`That is not a valid direction.`)
    } else {
        outputToTerminal(`${travel_string}`)
        setPlayerLocation(current_player.id, destination_id)
    }
}

const handleLook = () => {
    let output = `<span>${current_location_data.description}</span><br><br>`
    for (const [direction, doorData] of Object.entries(current_location_door_data) as [string, {
      travel_string: string;
      destination_id: string;
      door_description: string
    }][]) {
      output += `${doorData.door_description} `
    }

    outputToTerminal(output)
}

export const handleUserInput = async (
  player_input: any,
  queryGemini: Function
) => {
    let split_input_array = player_input.split(" ")
    let first_string = split_input_array.shift().toLowerCase()
    let rest_of_input = split_input_array.join(" ")

    if(split_input_array.length == 0){
      switch(first_string) {
        case '?':
            outputToTerminal(responses.help)
          break;
        case 'say':
            outputToTerminal(`What would you like to say?`)
          break;
        case 'walk':
            outputToTerminal(`Where would you like to go?`)
          break;
        case 'look':
            outputToTerminal(`You look around.`)
            handleLook()
          break;
        case 'ask':
            outputToTerminal(`What would you like to ask?`)
          break;
        default:
          outputToTerminal('')
          break;
      }
    } else {
      switch(first_string) {
        case 'say':
            outputToTerminal(`<span class="text-blue-300"> ${ current_player.name } </span> Says: "${ rest_of_input }"`)
          break;
        case 'walk':
            let direction_string = split_input_array[0].toLowerCase()
            handleWalk(direction_string)
          break;
        case "ask": // This triggers the Gemini query

            outputToTerminal("Getting a response from Gemini AI...");
            try {

              if (current_location_data.npc) {
                const geminiResponse = await queryGemini(rest_of_input, current_location_data.npc); // Query Gemini AI
                console.log(`You see ${current_location_data.npc} here.`);
                outputToTerminal(`<span class="font-bold">They respond: </span>   ${geminiResponse} `)
              } else {
                outputToTerminal(`No one is here.`)
                console.log('No one is here.');
              }
              
              // const geminiResponse = await queryGemini(rest_of_input, npc); // Query Gemini AI
              // console.log("geminiResponse: ", geminiResponse);
              //outputToTerminal(`<span class="font-bold">You asked:</span> ${rest_of_input} <br><span class="font-bold">Answer:</span>   ${geminiResponse} `)
            } catch (err) {
              outputToTerminal(`Error: ${ err instanceof Error ? err.message : "An unknown error occurred" }`);
            }
          break;
      }
    }
  }