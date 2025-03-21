export const handleUserInput = (playerAction: any) => {
    let username = playerAction.name
    let input = playerAction.input

    let output = ''
    let splitInput = input.split(" ")
    let firstWord = splitInput.shift().toLowerCase()
    let inputRemainder = splitInput.join(" ")

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