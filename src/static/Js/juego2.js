const ROCK = "rock";
const PAPER = "paper";
const SCISSOR = "scissors";

const TIE = 0;
const WIN = 1;
const LOSE = 2;

const rockbton = document.getElementById("piedra");
const paperbton = document.getElementById("papel");
const scissorbton = document.getElementById("tijera");
const resultext = document.getElementById("start-text");
const userimg = document.getElementById("user-img");
const machineimg = document.getElementById("machine-img");

rockbton.addEventListener("click", () =>{
    play(ROCK);
});

paperbton.addEventListener("click", () =>{
    play(PAPER);
});

scissorbton.addEventListener("click", () =>{
    play(SCISSOR);
});

function play(userOption){
    userimg.src = "static/Img/" + userOption + ".svg";

    resultext.innerText = "Pensando...";

    const interval = setInterval(function(){
        const machineOption = calcMachineOption();
        machineimg.src = "static/Img/" + machineOption + ".svg";
    }, 100);

    setTimeout(function(){

        clearInterval(interval);

        const machineOption = calcMachineOption();
        const result = calcResult(userOption, machineOption);

        machineimg.src = "static/Img/" + machineOption + ".svg";

        switch(result){
            case TIE:
c
            break;
            case WIN:
                resultext.classList.remove("resultado-negrita");
                resultext.innerText = "Ganaste";
            break;
            case LOSE:
                resultext.classList.remove("resultado-negrita");
                resultext.innerText = "Perdiste";
            break;
        }
    }, 5000)
}

function calcMachineOption(){
    const number = Math.floor(Math.random() * 3);
    switch(number){
        case 0:
            return ROCK;
        case 1:
            return PAPER;
        case 2:
            return SCISSOR;
    }
}

function calcResult(userOption, machineOption){
    if(userOption == machineOption){
        return TIE;

    }else if (userOption === ROCK){

        if (machineOption === PAPER) return LOSE;
        if (machineOption === SCISSOR) return WIN;

    }else if (userOption === PAPER){

        if (machineOption === SCISSOR) return LOSE;
        if (machineOption === ROCK) return WIN;

    }else if(userOption === SCISSOR){

        if(machineOption === ROCK) return LOSE;
        if(machineOption === PAPER) return WIN;
    }
}