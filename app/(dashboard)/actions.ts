
import responses from './responses.json';
import { getLocationData, setUserLocation, getUserPurchases } from '@/lib/db/queries';

let current_player: { id: number; name: any; location_id: string }

let current_location_data: { location_id: string; description: string; doors: unknown; npc?: string; image_link?: string }
let current_location_door_data: any

export const setupActions = async (user: { id: number; name: any; location_id: string; }) => {
  current_player = user
  let player_location_id = user.location_id

  await setCurrentLocationData(player_location_id)
}

const outputToTerminal = (output: any) => {
  if (output == '') output = `I don't understand that command. Please enter '?' for help.`

  let gameTerminal = document.getElementById("gameTerminal");
  if (!gameTerminal) return;

  gameTerminal.innerHTML += `<div>» ${output} </div><br>`;
  gameTerminal.scrollTop = gameTerminal.scrollHeight;
}

const setCurrentLocationData = async (player_location: string) => {
  let location_data = await getPlayerLocationData(player_location);
  //console.log("location_data.npc: " + location_data.npc);
  current_location_data = location_data
  current_location_door_data = location_data.doors
  handleLook()
  return location_data
}

const getPlayerLocationData = async (player_location: string) => {
  let location_data = await getLocationData(player_location) as { location_id: string; description: string; doors: unknown; npc?: string; image_link?: string };
  if (!location_data) {
    outputToTerminal(`<span class="text-red-500">Error</span>: No location data found for location id ${player_location}, returning to Castle Courtyard.`)
    location_data = await getLocationData(`castle_courtyard`) as { location_id: string; description: string; doors: unknown; npc?: string; image_link?: string };
    console.log(`location_data - ${location_data}`);
  }
  return location_data
}

const setPlayerLocation = async (userId: number, new_location: string) => {
  console.log(new_location)
  await setUserLocation(userId, new_location)
  setCurrentLocationData(new_location)
  console.log(current_player.location_id)
  // current_location_door_data = current_location_data.doors
}

const handleWalk = (direction: string) => {
  let destination_id
  let travel_string
  for (const [door_direction, doorData] of Object.entries(current_location_door_data) as [string, {
    travel_string: string;
    destination_id: string;
    door_description: string
  }][]) {
    if (door_direction == direction) {
      destination_id = doorData.destination_id
      travel_string = doorData.travel_string
    }
  }

  if (!destination_id) {
    outputToTerminal(`That is not a valid direction.`)
  } else {
    outputToTerminal(`${travel_string}`)
    setPlayerLocation(current_player.id, destination_id)
  }
}

const handleLook = (showImage?: string) => {
  let output = `<span>${current_location_data.description}</span><br><br>`
  for (const [direction, doorData] of Object.entries(current_location_door_data) as [string, {
    travel_string: string;
    destination_id: string;
    door_description: string
  }][]) {
    output += `${doorData.door_description} `
  }

  if (showImage && current_location_data.image_link) {


    let returnHtml = "<div style='display: flex; align-items: center; gap: 20px;'>"; // Parent flex container

    // Text Div (Grows and shrinks)
    returnHtml += "<div style='flex-grow: 1; min-width: 0; font-size: 14px;'>";
    returnHtml += "<p>" + output + "</p>";
    returnHtml += "</div>";
    
    // --- MODIFIED IMAGE CONTAINER AND IMAGE STYLES BELOW ---
    // Image Container Div (Set not to shrink)
    returnHtml += `<div style='flex-shrink: 0;'>`; // Prevent this container from shrinking
    returnHtml += `<img src='${current_location_data.image_link}' alt='Generated'
                     style='height: 400px;        /* Target height */
                            width: auto;         /* Calculate width based on height */
                            max-width: 100%;     /* IMPORTANT: Shrink if width exceeds container */
                            display: block;      /* Ensure block behavior */
                            /* Decorative Styles Below */
                            border: 3px solid #5a3e1b;
                            padding: 5px;
                            background-color: #f5f1e8;
                            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
                            filter: contrast(90%) brightness(90%);
                            border-radius: 8px;'
                    />`;
    returnHtml += "</div>"; // Close Image container
    // --- END OF MODIFIED STYLES ---
    
    returnHtml += "</div>"; // Close parent flex container

    output = returnHtml;
  }
  //console.log("output: " + output);
  outputToTerminal(output)
}

const handleInventory = async () => {
  const purchases = await getUserPurchases(current_player.id);

  let output = ''; // Initialize an empty string

  if (purchases && purchases.length > 0) {
    // Start the table structure with headers
    output = `
    
    <table class="purchase-table" style="border-collapse: collapse; width: 350px; /* Adjusted width slightly */">
      <thead>
        <tr>
          <th style="padding: 10px 8px; text-align: left; border-bottom: 1px solid #ccc;"><h2>Your Purchase(s):</h2></th>
          <th style="padding: 10px 8px; text-align: center; border-bottom: 1px solid #ccc;"></th>
        </tr>
      </thead>
      <tbody>
  `;

    purchases.forEach(purchase => {
      // Use fallback values
      const itemName = purchase.itemName || 'Unknown Item';
      const imageUrl = purchase.itemImageLink || '/images/items/default.png';

      // Append a table row for each purchase
      output += `
      <tr>
        <td style="padding: 8px; /* Adds padding around content, creating space between rows */
                   vertical-align: middle; /* Align text vertically */
                   border-bottom: 1px solid #eee; /* Lighter line between rows */">
          ${itemName}
        </td>
        <td style="padding: 8px; /* Adds padding around content */
                   text-align: center; /* Center image horizontally */
                   vertical-align: middle; /* Align image vertically */
                   border-bottom: 1px solid #eee; /* Lighter line between rows */">
          <img src="${imageUrl}" alt="${itemName}"
               style="width: 125px; height: 125px; /* Slightly larger size */
                      border-radius: 20%; /* Makes the image perfectly round */
                      border: 3px solid #1A237E; /* Dark Blue Border (e.g., dark indigo) */
                      box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4); /* Drop Shadow */
                      object-fit: cover; /* Prevents image distortion if not square */
                      display: block; /* Helps with centering/spacing sometimes */
                      margin: auto; /* Another way to center if needed */
                     ">
        </td>
      </tr>
    `;
    });

    // Close the table body and table tags
    output += `
      </tbody>
    </table>
  `;
  } else {
    output = '<p>You have no purchase history.</p>';
  }

  outputToTerminal(output);
}

export const handleUserInput = async (
  player_input: any,
  queryGemini: Function,
  queryGeminiImage: Function
) => {
  let split_input_array = player_input.split(" ")
  let first_string = split_input_array.shift().toLowerCase()
  let rest_of_input = split_input_array.join(" ")

  if (split_input_array.length == 0) {
    switch (first_string) {
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
        handleLook("showImage")
        break;
      case 'ask':
        outputToTerminal(`What would you like to ask?`)
        break;
      case 'show':
        outputToTerminal(`What would you like to see?`)
        break;
      case 'inventory':
        handleInventory()
        break;
      default:
        outputToTerminal('')
        break;
    }
  } else {
    switch (first_string) {
      case 'say':
        outputToTerminal(`<span class="text-blue-300"> ${current_player.name} </span> Says: "${rest_of_input}"`)
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
            outputToTerminal(`<span class="font-bold">They respond: </span>   ${geminiResponse} `)
          } else {
            outputToTerminal(`No one is here.`)
          }

        } catch (err) {
          outputToTerminal(`Error: ${err instanceof Error ? err.message : "An unknown error occurred"}`);
        }
        break;
      case "show": // This triggers the Gemini Image query

        outputToTerminal("Getting a response from Gemini AI...");

        try {

          const geminiResponseImg = await queryGeminiImage(rest_of_input); // Query Gemini Image AI
          outputToTerminal(`<span class="font-bold">You asked to see: </span> ${rest_of_input} <br> ${geminiResponseImg} `)

        } catch (err) {
          outputToTerminal(`Error: ${err instanceof Error ? err.message : "An unknown error occurred"}`);
        }
        break;
    }
  }
}