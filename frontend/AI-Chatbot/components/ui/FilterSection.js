import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import FilterChips from './FilterChips.js';
import { FlatList } from 'react-native';
import FilterCard from './FilterCard.js';
import PropTypes from'prop-types';
import { theme } from "@/themes/theme";

const FilterSection = ({categories, cards, header = '[Header]'}) => {

    const [selectedId, setSelectedId] = useState(0);

    const filteredItems = useMemo(() => {
        return selectedId === 0 ? cards : cards.filter(item => item.categoryId === selectedId);
    }, [cards, selectedId]);
    
    return (
        <View style={styles.container}>
            <FilterChips header={header} categories={categories} selectedId={selectedId} onChange={setSelectedId} />
            <FlatList
                contentContainerStyle={styles.cardContainer}

                data={filteredItems}
                keyExtractor={(item, index) => String(index)}
                renderItem={({ item }) => (
                    <FilterCard mainText={item.mainText} subText={item.subText} />
                )}

                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

FilterSection.propTypes = {
    categories: PropTypes.array,
    cards: PropTypes.array, 
    header: PropTypes.string,
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        gap: theme.spacing.md,
    },

    cardContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing.sm,
    }
});

export default FilterSection;