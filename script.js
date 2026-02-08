
var elt = document.getElementById('calculator');;
var calculator = Desmos.GraphingCalculator(elt,
    {
        expressions: false, settingsMenu: false, lockViewport: true,
        showXAxis: false, showYAxis: false, showGrid: false,
        pointsOfInterest: false
    });
window.lastID = 0;
function getID() {
    window.lastID += 1
    return window.lastID.toString();
};
function findBidSize(n, m) {
    if (m <= 1) {
        return 1;
    }
    const k_m = Math.floor(Math.log2(m - 1));
    if (n >= Math.pow(2, k_m + 1) + 1) {
        return Math.pow(2, k_m);
    } else {
        return Math.floor(n / 2);
    }
}

calculator.setMathBounds(left = 0, bottom = 0, right = 20, top = 20);
var dfault = calculator.getState();
function plot(expressions, x = 20, y = 20) {
    calculator.setState(dfault);
    calculator.setMathBounds({left: -0.5, bottom: -0.5, right: x+0.5, top: y+0.5});
    for (let expr of expressions) {
        
        if (expr.includes("#")) {
            const parts = expr.split("#");
            expr = parts[0];
            const options = JSON.parse(parts[1].replace(/'/g, '"'));
            calculator.setExpression({ id: getID(), latex: expr, lines: true, color: options.color, lineWidth: options.lineWidth, fillOpacity: options.fillOpacity });
            continue;
        }
        calculator.setExpression({ id: getID(), latex: expr, lines: true,color:"#000000",lineWidth: expr==expressions[0]?3:1 });
    }
}
//plot(["y=x"]);

const boundsInput = document.getElementById("bounds");
const choosenInput = document.getElementById("choosenin");
const randomizeButton = document.getElementById("randomize");
const startButton = document.getElementById("start");
const resetStatsButton = document.getElementById("resetstats");
const question1MinInput = document.getElementById("question1-min");
const question1MaxInput = document.getElementById("question1-max");
const askButton = document.getElementById("ask");
const winnerHuman = document.getElementById("human-winner");
const winnerComputer = document.getElementById("computer-winner");
const question1Display = document.getElementById("question1");
const answer1Display = document.getElementById("answer1");
const question2Display = document.getElementById("question2");
const answer2Display = document.getElementById("answer2");
const remaining1Display = document.getElementById("remaining1");
const choosen1Display = document.getElementById("choosen1");
const remaining2Display = document.getElementById("remaining2");
const choosen2Display = document.getElementById("choosen2");
const autoBtn = document.getElementById("auto");
const btimesInput = document.getElementById("btimes");
const codeInput = document.getElementById("code");
winnerComputer.innerText="";
winnerHuman.innerText="";
remaining1Display.innerText="";
remaining2Display.innerText="";
choosen1Display.innerText="";
choosen2Display.innerText="";
question1Display.innerText="";
answer1Display.innerText="";
question2Display.innerText="why are you not starting the game?";
answer2Display.innerText="press start to start the game";

let totalGames = 0;
let humanWins = 0;
let computerWins = 0;

function updateStats() {
    document.getElementById("total-games").textContent = totalGames.toString();
    document.getElementById("human-wins").textContent = humanWins.toString();
    document.getElementById("computer-wins").textContent = computerWins.toString();
}

function resetStats() {
    totalGames = 0;
    humanWins = 0;
    computerWins = 0;
    updateStats();
}
resetStatsButton.addEventListener("click", resetStats);resetStats();

window.gameStarted = false;
window.humanChoosen = 0;
window.computerChoosen = 0;
window.remainingHuman = [];
window.remainingComputer = [];
window.moves=[]; //format: array of [numhumanRemain,numcomputerRemain]

function updateGraph(){
    
    let exp="[";
    for(let move of moves){
        exp+=`(${move[0]},${move[1]}),`
    }
    exp=exp.slice(0,-1)+"]";
    ubound=boundsInput.value||20;
    plot([exp,"y=x",`y=\\left[0...${ubound}\\right]`,`x=\\left[0...${ubound}\\right]`],x=ubound,y=ubound);
}
updateGraph();
randomizeButton.addEventListener("click", () => {
    const bounds = parseInt(boundsInput.value) || 20;
    const randomNum = Math.floor(Math.random() * bounds) + 1;
    choosenInput.value = randomNum.toString();
})

startButton.addEventListener("click", () => {
    const bounds = parseInt(boundsInput.value) || 20;
    const choosenNum = parseInt(choosenInput.value) || 1;
    if (choosenNum < 1 || choosenNum > bounds ) {
        alert("Please enter a valid number within the bounds.");
        return;
    }
    window.gameStarted = true;
    window.humanChoosen = choosenNum;
    window.computerChoosen = Math.floor(Math.random() * bounds) + 1;
    console.log("Computer choosen:", computerChoosen);
    window.remainingHuman = Array.from({ length: bounds }, (_, i) => i + 1);
    window.remainingComputer = Array.from({ length: bounds }, (_, i) => i + 1);
    window.moves=[[bounds,bounds]];
    document.getElementById("choosen1").textContent = humanChoosen.toString();
    document.getElementById("remaining1").textContent = remainingHuman.join(", ") + ` (${remainingHuman.length} remaining)`;
    document.getElementById("choosen2").textContent = "???";
    document.getElementById("remaining2").textContent = remainingComputer.join(", ") + ` (${remainingComputer.length} remaining)`;
    question1Display.innerText="";
    answer1Display.innerText="";
    question2Display.innerText="";
    answer2Display.innerText="";
    winnerComputer.innerText="";
    winnerHuman.innerText="";
    updateGraph();
})

askButton.addEventListener("click", () => {
    if (!window.gameStarted) {
        alert("Please start the game first.");
        return;
    }
    const bidSize=findBidSize(window.remainingComputer.length,window.remainingHuman.length);
    const computerQmin=window.remainingComputer[0];
    const computerQmax=window.remainingComputer[bidSize-1];
    const computerAnswer = (humanChoosen >= computerQmin && humanChoosen <= computerQmax) ? "YES!" : "NO!";
    question2Display.innerText = `is it between ${computerQmin} and ${computerQmax}?`;
    answer2Display.innerText = computerAnswer;
    if(computerAnswer==="YES!"){
        window.remainingComputer=window.remainingComputer.filter(x=>x>=computerQmin && x<=computerQmax);
    }else{
        window.remainingComputer=window.remainingComputer.filter(x=>x<computerQmin || x>computerQmax);
    }
    document.getElementById("remaining2").textContent = remainingComputer.join(", ") + ` (${remainingComputer.length} remaining)`;
    window.moves.push([window.remainingHuman.length,window.remainingComputer.length]);
    updateGraph();
    if (window.remainingComputer.length === 1) {
        winnerComputer.innerText = "WINNER!";
        choosen2Display.textContent = computerChoosen.toString();
        totalGames += 1;
        computerWins += 1;
        updateStats();
        window.gameStarted = false;
        if(!window.automaticlyPlaying)
            alert("Computer wins!")
        return;
    }
    const qmin = parseInt(question1MinInput.value);
    const qmax = parseInt(question1MaxInput.value);
    if (isNaN(qmin) || isNaN(qmax) || qmin < 1  || qmin > qmax) {
        alert("Please enter valid question bounds.");
        return;
    }
    const answer = (computerChoosen >= qmin && computerChoosen <= qmax) ? "YES!" : "NO!";
    question1Display.innerText = `is it between ${qmin} and ${qmax}?`;
    answer1Display.innerText = answer;
    if(answer==="YES!"){
        window.remainingHuman=window.remainingHuman.filter(x=>x>=qmin && x<=qmax);
    }else{
        window.remainingHuman=window.remainingHuman.filter(x=>x<qmin || x>qmax);
    }
    document.getElementById("remaining1").textContent = remainingHuman.join(", ") + ` (${remainingHuman.length} remaining)`;
    window.moves.push([window.remainingHuman.length,window.remainingComputer.length]);
    updateGraph();
    if (window.remainingHuman.length === 1) {
        winnerHuman.innerText = "WINNER!";
        totalGames += 1;
        humanWins += 1;
        updateStats();
        window.gameStarted = false;
        if(!window.automaticlyPlaying)
            alert("You win!")
        return;
    }
})
/*nvm this is not working!
function plotOptimalBidSize(){
    //mainly a debug function to check if the bid size is correct
    //uses polygon((x1,y1),(x2,y2),...) to plot every grid square with a color corresponding to the bid size, hsv converted to rgb for color
    const bounds = parseInt(boundsInput.value) || 20;
    let expressions=[];
    for(let n=1;n<=bounds;n++){
        for(let m=1;m<=bounds;m++){
            const bidSize=findBidSize(n,m);

            const hue=bidSize/bounds*360;
            //convert hue to rgb with saturation 1 and value 1
            const c = 1;
            const x = 1 - Math.abs((hue / 60) % 2 - 1);
            let r=0,g=0,b=0;
            if(hue<60){
                r=c;g=x;b=0;
            }else if(hue<120){
                r=x;g=c;b=0;
            }else if(hue<180){
                r=0;g=c;b=x;
            }else if(hue<240){
                r=0;g=x;b=c;
            }else if(hue<300){
                r=x;g=0;b=c;
            }else{
                r=c;g=0;b=x;
            }
            //convert to hex
            r=Math.round(r*255);
            g=Math.round(g*255);
            b=Math.round(b*255);
            const color=`#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
            expressions.push(`polygon((${n-1},${m-1}),(${n},${m-1}),(${n},${m}),(${n-1},${m})))#{'color': '${color}', 'lineWidth': 0, 'fillOpacity': 1}`);
        }
    }
    plot(expressions,x=bounds,y=bounds);
}
plotOptimalBidSize
*/
autoBtn.addEventListener("click",async ()=>{
    console.log("automate")
    const btimes = parseInt(btimesInput.value) || 100;
    const code = codeInput.value; //defines a function decideBounds(remainingHuman,remainingComputer) that returns [qmin,qmax] for the computer's question
    window.automaticlyPlaying = true;
    eval(code);
    for(let i=0;i<btimes;i++){
        randomizeButton.click();
        startButton.click();
        console.log(decideBounds.toString());
        while(window.gameStarted){
            const [qmin,qmax]=window.decideBounds(window.remainingHuman,window.remainingComputer);
            question1MinInput.value=qmin;
            question1MaxInput.value=qmax;

            
            askButton.click();
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }
    window.automaticlyPlaying = false;

})

