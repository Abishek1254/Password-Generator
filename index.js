const inputSlider= document.querySelector('.slider');
const lengthDisplay=document.querySelector('.length-display');

const passwordDisplay=document.querySelector('.display');
const copyBtn= document.querySelector('.copy-btn');
const copyMsg= document.querySelector('.copy-msg');


const upperCaseCheck= document.querySelector('#uppercase');
const lowerCaseCheck= document.querySelector('#lowercase');
const numbersCheck= document.querySelector('#numbers');
const symbolsCheck= document.querySelector('#symbols');

const indicator=document.querySelector('.indicator');
const generateBtn= document.querySelector('.generate-button');
const allCheckbox= document.querySelectorAll('input[type=checkbox]');
const symbols= "~!@#$%^&*()_+{}|:<>?`[]\;,./" ;

// handling password -initial configuration
let password="";
let passwordLength=10;
let checkCount=0;

// set strength circle to grey -initial
setIndicator("#ccc");

handleSlider()
// sets the length of password according to the slider movement
function handleSlider() {
    inputSlider.value= passwordLength;
    lengthDisplay.innerText= passwordLength;

    const mini=inputSlider.min;
    const maxi=inputSlider.max;
    const percentage=(passwordLength-mini)*100/(maxi-mini)  ;
     // Update the slider's background color
     inputSlider.style.background = `linear-gradient(to right,hsl(285,91%,52%) ${percentage}%,hsl(268,47%,21%) ${percentage}%)`;
}


// sets the color of the indicator according to the strength of password
function setIndicator(color) {
    indicator.style.background=color;
    // shadow
    indicator.style.boxShadow=`0px 0px 12px 0px ${color}`;
}

function getRandomInteger(min,max) {
    return Math.floor(Math.random () * (max - min) + min);
}

function generateRandomNumber() {
    return getRandomInteger(0,9);
}

function generateLowercase( ) {
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUppercase( ) {
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol() {
    let i= getRandomInteger(0,symbols.length);
    return symbols[i];
}

function calcStrength() {
let hasUpper=false;
let hasLower=false;
let hasNumber=false;
let hasSymbol=false;

if(upperCaseCheck.checked) hasUpper=true;
if(lowerCaseCheck.checked) hasLower=true;
if(numbersCheck.checked) hasNumber=true;
if(symbolsCheck.checked) hasSymbol=true;

if ((hasUpper && hasLower && hasNumber && hasSymbol) && passwordLength>=8)
    setIndicator('#0f0');

else if((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength>=6)
    setIndicator('#ff0');

else
setIndicator('#f00');

}

async function copyContent() {
    try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.textContent='Copied';
    }

    catch(e) {
        copyMsg.textContent="Failed";
    }
    // to make copy wala msg visible
    copyMsg.classList.add('active');
    setTimeout( ()=> {
        copyMsg.classList.remove('active');
    },2000) ;
}

inputSlider.addEventListener('input', (e)=> {
    passwordLength = e.target.value;
    handleSlider() ;
}) ;

copyBtn.addEventListener('click',()=> {
    if(passwordDisplay.value)
        copyContent();
}) ;


function handleCheckboxChange() {
    checkCount=0;
    allCheckbox.forEach( (checkbox) => {
        if(checkbox.checked) checkCount++;
    });
    
    // special condition
    if(passwordLength<checkCount) {
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
})


generateBtn.addEventListener('click', ()=> {
    // none of the checkboxes are checked
    if(checkCount==0)  return ;

    if(passwordLength<checkCount) {
     passwordLength=checkCount;
    handleSlider();
    }
    
    console.log("Starting the journey");
    // 1. remove old password
    password="" ;

    // 2. Generate a new password
    let funArr=[];

    if(upperCaseCheck.checked)  funArr.push(generateUppercase);
    if(lowerCaseCheck.checked)  funArr.push(generateLowercase);
    if(numbersCheck.checked)    funArr.push(generateRandomNumber);
    if(symbolsCheck.checked)    funArr.push(generateSymbol);
    
    // compulsory addition
    for (let i=0;i<funArr.length; i++) {
        password+=funArr[i]();
    }

    console.log("Compulsory addition done");
    
    // remaining additon
    for (let i=0; i<passwordLength-funArr.length; i++) {
        let randIndex=getRandomInteger(0,funArr.length);
        password+=funArr[randIndex]();
    }

    console.log("Remaining addition done");

    // shuffle the characters of the password to ensure randomness
    password=shuffle(Array.from(password));

    // 3. display the new password on UI
    passwordDisplay.value=password;

    // 4.Calculate and dispplay strength of new password
    calcStrength(password);

    console.log("Finally Completed");
});

function shuffle(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}