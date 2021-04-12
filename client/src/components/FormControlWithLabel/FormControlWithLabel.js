import React, {useState, useEffect} from 'react'
import {FormControl, FormLabel} from'react-bootstrap'

/**
 *  a component that makes the creation of form controls with state changes fast.
 * @param {* string} label - a string that gets passed to the form label component
 * @param {* set state function}  setInputState - function is upon onchange
 */
function FormControlWithLabel(props){
    //extract the label and the setState function and pass the rest of the props to the input
    var {label, ...inputProps} = props;
    return(
        <div>
            <FormLabel>{label}</FormLabel>
            {/* set a timeout so that the state only updates when the user has not typedfor 200 ms */}
            <FormControl {...inputProps}/>
        </div>
    );
}


export default FormControlWithLabel;