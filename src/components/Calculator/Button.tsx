import { type } from 'node:os';
import React from 'react';
import ButtonType from '../../Enums/ButtonType';

interface buttonProps  {
    backgroundColor: string; //set the background colour of the button
    type: ButtonType; //set the type of the button (i.e. basic_operand , number, decimal, )
    children: string;
    className?: string;
    onClick: Function;
};


//using React.memo to avoid re rendering the buttons everytime the output screen in calculator updates
const Button = React.memo((props : buttonProps) => {

    //the following chunk of code calculates the tailwind class for hover color
    //from props.backgroundColor
    //example: props.backgroundColor = bg-grey-700, then
    //hoverBgColor = bg-grey-500
    let bgColorArr : string[] = props.backgroundColor.split('-');
    const bgColorNumber : number = parseInt(bgColorArr[2]);
    const hoverBgColorNumber : string = (bgColorNumber-100).toString();
    let hoverBgColorArr : string[] = [...bgColorArr];
    hoverBgColorArr[2] = hoverBgColorNumber;
    const hoverBgColor = hoverBgColorArr.join('-')

    const handleClick = () => {

        //basically if it is a decimal or = button, then the function doesnt accept any paremeters
        if (props.type === ButtonType.decimal || props.type === ButtonType.equals){
            props.onClick();
        }
        else{
            props.onClick(props.children);
        }
    }
    return (
        <button className={`${props.backgroundColor} w-full h-full rounded-none text-2xl text-white
                        hover:${hoverBgColor}
                        ${props.className ? props.className : ''}`}
                onClick={handleClick}>
            {props.children}
        </button>  

    );
})

export default Button