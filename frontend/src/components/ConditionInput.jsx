import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';  

const ConditionInput = ({ condition, index, removeCondition, handleSliderChange }) => {
    const { field, minValue, maxValue } = condition;

    
    const getSliderRange = (field) => {
        if (field === 'total_spending') {
            return [0, 100000];  
        } else if (field === 'visits') {
            return [0, 500];  
        }
    };

    
    const handleSliderChangeInternal = (value) => {
        handleSliderChange(index, value);  
    };

    return (
        <div>
            <div>
                <label>Field: {field}</label>
            </div>

            
            <div>
                <label>Range (Min: {minValue} - Max: {maxValue}):</label>
                <Slider
                    min={getSliderRange(field)[0]}
                    max={getSliderRange(field)[1]}
                    range
                    value={[minValue, maxValue]} 
                    onChange={handleSliderChangeInternal}
                />
            </div>

            <button type="button" onClick={() => removeCondition(index)}>Remove</button>
        </div>
    );
};

export default ConditionInput;
