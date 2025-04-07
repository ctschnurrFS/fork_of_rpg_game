import responses from './responses.json';
import { getLocationData, setUserLocation } from '@/lib/db/queries';

let current_player: { id: number; name: any; location_id: string}

let current_location_data: { location_id: string; description: string; doors: unknown; }
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
    current_location_data = location_data
    current_location_door_data = location_data.doors
    handleLook()
    return location_data
}

const getPlayerLocationData = async (player_location: string) =>{
    let location_data =  await getLocationData(player_location);
    if(!location_data) {
        outputToTerminal(`<span class="text-red-500">Error</span>: No location data found for location id ${player_location}, returning to Castle Courtyard.`)
        location_data =  await getLocationData(`castle_courtyard`);
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
        door_description: string;
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
      door_description: string;
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

    if(splitInput.length == 0){
      switch(firstWord) {
        case '?':
          output = `<span class="font-bold">HELP:</span>
          <p>Try These Commands:</p>
          <div class="flex">
            <ul class="w-[10%] flex-row">
              <li> - SAY</li>
              <li> - WALK</li>
            </ul>
            <ul class="w-[10%] flex-row">
              <li> - CLEAR</li>
            </ul>
          </div>`
          break;
        case 'say':
          output = `What would you like to say?`
          break;
        case 'walk':
          output = `Where would you like to go?`
          break;
      }
    }
    else{
      switch(firstWord) {
        case 'say':
          output = `<span class="text-blue-300"> ${ username } </span> Says: "${ inputRemainder }"`
          break;
        case 'walk':
          output = `You can't walk there.`
          break;
      }
    }

    if(output == '') output = `I don't understand that command. Please enter '?' for help.`

    let gameTerminal = document.getElementById("gameTerminal");
    if(!gameTerminal) return;

    return (
      `<div>» ${ output } </div><br>`
    )
  }