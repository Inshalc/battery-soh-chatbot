import React from 'react';
import FilterChips from './FilterChips.js';
import FilterCard from './FilterCard.js';

const FilterSection = () => {
    const outputs = [
        { id: 1, label: 'R²' },
        { id: 2, label: 'MSE' },
        { id: 3, label: 'MAE' },
        { id: 4, label: 'Training Time' },
    ];
    
    return (
        <>
            <FilterChips header="Output: " categories={outputs} />

            <FilterCard />
        </>
    );
};

export default FilterSection;