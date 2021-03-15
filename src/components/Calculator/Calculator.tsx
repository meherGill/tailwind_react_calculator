import React, { useState , useRef} from 'react';
import Button from './Button'
import ButtonType from '../../Enums/ButtonType';

const numValues : number[] = [7,8,9,4,5,6,1,2,3];
const basicOperands : string[] = ['/' , '*' , '-', '+'];
const restOfOperands: string[] = ['AC' , '+-' , '%'];

const basicOperandsColor = "bg-yellow-700";
const numberButtonColor = "bg-gray-500";
const restOfOperandsColor = "bg-gray-800";


function Calculator() {

    //array to resolve, is the array which we convert to string then use the eval function on
    //to get the output
    const [arrayToResolve , setArrayToResolve] = useState<string[]>([]);

    //lastNumberInput is the most recent number input by the user
    //example if the array looks like [3 , / , 8 ,* ,1 ,2 ,1, 9, - , 4, 2, ., 2]
    //then lastNumberInput.current  = [4,2,.,2] , its mainly used to see if there is a decimal value already in the number
    const lastNumberInputted = useRef<string[]>([]);

    //last result is the last number achieved when the user presses =
    const lastResult = useRef<string[]>([]);

    //do this when a button of type operand is clicked
    const onOperandClick = (val : string) : void => {
        const indexOfLastElementOfArray = arrayToResolve.length-1;
        const lastElementofArray = arrayToResolve[indexOfLastElementOfArray];

        if (lastNumberInputted.current.join('') === '.'){
            showError();
            return;
        }
        let newArrVal = [...arrayToResolve];

        /*
            if the last operation input by the user was an operand, then simply replace that operand
            example:
                lets say the screen shows 1 * 2 / 3 -
                User enters +
                then Instead of showing 1 * 2 / 3 - + , show
                1 * 2 / 3 +
        */
        if (newArrVal.length === 0 && lastResult.current.length > 0){
            newArrVal = [...lastResult.current! , val];
        }
        else if(newArrVal.length === 0 && lastResult.current.length === 0){
            showError();
        }
        else{
            if (basicOperands.includes(lastElementofArray)){
                newArrVal[indexOfLastElementOfArray] = val;
            }
            else{
                newArrVal.push(val);
            }
        }

        setArrayToResolve(newArrVal);   
        lastNumberInputted.current = []; //whenever an operand is inserted, that means that a new last number will be entered
    };

    //when a special operant like +- , % or AC is clicked
    const onSingleOperandClick = (val: string) => {

        // if AC is pressed, then reset state
        if (val === 'AC'){
            clear_ArrayToResolve();
            lastResult.current = [];
            lastNumberInputted.current = [];
            return
        }

        let finalValArr : string[] = [''];
        let evalSuccess : boolean;

        //if there is only on number on the screen
        if (arrayToResolve.length === 1){
            finalValArr = arrayToResolve;
        }
        
        else if (arrayToResolve.length > 1){
            [finalValArr, evalSuccess] = checkAndEvaluateResult();
            if (!evalSuccess){
                return;
            }
        }
        //if there is nothing in our array, then this means one of two things
        //either = was just pressed, hence the output screen is still showing a number (lastResult)
        //or the calculator's state is new, and there is nothing on the screen
        else if (arrayToResolve.length === 0){
            if (lastResult.current[0] === undefined){
                //calculator's state is new, do nothing and showError
                finalValArr = [''];
                showError();
                return;
            }
            else{
                //apply that operation on the lastResult
                finalValArr = [...lastResult.current]
            }
        }
        else{
            showError();
            console.error();
        }

        let finalValString = finalValArr.join('');
        let finalArr : string[] = [];

        switch(val){
            case '%':
                finalValString = (parseFloat(finalValString)/100).toString();
                finalArr = [finalValString];
                break;
            case '+-':
                finalValString = (-1 * parseFloat(finalValString)).toString();
                finalArr = [finalValString];
                break;
            default:
                console.error("this shouldnt happen");
                break;
        }
        setArrayToResolve(finalArr);
    };  

    // made a seperate function here because I am resuing the logic else where
    //it returns an array with 
    //: evaluated result in an array
    //: a bool, true if evaluation was successfull, false otherwise
    const checkAndEvaluateResult = () : [string[], boolean] => {

        //if the last input was an operand or the last number was only a decimal, then showError and dont do anything
        if (lastNumberInputted.current.join('') === '.' || basicOperands.includes(arrayToResolve[arrayToResolve.length-1])){
            showError();
            return [arrayToResolve, false];
        }
        else{
            let result : string = eval(arrayToResolve.join('')).toString();
            if(result === "NaN"){
                showError();
                return [arrayToResolve, false];
            }
            lastNumberInputted.current = result.split('')
            return [[result], true]
        }
    }

    //evaluates the result
    const onResultButtonClick = () : void => {
        let result : [string[], boolean] = checkAndEvaluateResult();
        if (result[1]){
            lastResult.current = result[0];
            clear_ArrayToResolve();
        }
    };

    //simply append the element to the array
    const onNumberButtonClick = (val : string) : void => {
        let oldArr = [...arrayToResolve]
        if (arrayToResolve === ['0']){
            oldArr = [];
            lastResult.current = ['0'];
        }
        else{
            oldArr.push(val);
            lastNumberInputted.current.push(val);
        }
        setArrayToResolve(oldArr);
    }
    
    const onDecimalClick = () : void => {
        if (lastNumberInputted.current.includes('.')){
            showError();
        }
        else{
            onNumberButtonClick('.');
        }
    }

    //making a sperate function just to clear the array because i might be reusing logic adding stuff
    const clear_ArrayToResolve = () : void => {
        setArrayToResolve([]);
    }

    const showError  = () => {
        alert("Invalid Operation")
    }
    
    return (
        <div className="h-full w-full 
            bg-gray-700 shadow-2xl rounded-sm
            grid grid-cols-4 grid-rows-7 gap-px grid-flow-row"> 
            
            <output className="col-span-full row-start-1 row-end-3 text-2xl pr-4  pb-4 flex items-end justify-end text-white">
                {arrayToResolve[0] ? arrayToResolve!.join('') :  lastResult.current }
            </output>

            <div className="row-start-3 row-span-1 col-start-1 col-end-4
            grid grid-rows-1 grid-cols-3 gap-px">
                {
                    restOfOperands.map((val : string) => (
                        <Button key={val} backgroundColor={restOfOperandsColor} type={ButtonType.singleOperands} onClick={onSingleOperandClick}>
                            {val}
                        </Button>
                    ))
                }
            </div>

            <div className="row-start-3 row-end-8 col-start-4 col-end-5
            grid grid-cols-1 grid-rows-5 gap-px">
                {
                    basicOperands.map((val : string) => (
                        <Button key={val} backgroundColor={basicOperandsColor} type={ButtonType.basicOperands} onClick={onOperandClick}>
                            {val}
                        </Button>
                    ))
                }
            </div>

            <div className="row-start-4 row-end-8 col-start-1 col-end-4
                grid grid-cols-3 grid-rows-4 gap-px">
                    {
                        numValues.map((val : number) => (
                            <Button key={val} backgroundColor={numberButtonColor} type={ButtonType.number} onClick={onNumberButtonClick}>
                                {val.toString()}
                            </Button>
                        ))
                    }
                    <Button key='0' backgroundColor={numberButtonColor} type={ButtonType.number} className="col-span-2" onClick={onNumberButtonClick}>
                        0
                    </Button>
                    <Button key='.' backgroundColor={numberButtonColor} type={ButtonType.decimal} onClick={onDecimalClick}>.</Button>
            </div>

            <Button key='=' backgroundColor={basicOperandsColor} type={ButtonType.equals} onClick={onResultButtonClick} className="row-start-7 row-span-1 col-start-4 col-span-1">
                =
            </Button>
        </div>
    );
}

export default Calculator;