import React, { memo, useState } from "react";
import { View, ScrollView, Text, Pressable, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import { theme } from '../../themes/theme';
import { globalStyles } from "@/themes/globalStyles";

// Chip inner component
const Chip = memo(
    function Chip({ label = '[Label]', selected = false, onPress}) {
        return (
            <Pressable
                style={[
                    chipStyles.chip,
                    selected ? chipStyles.selected : chipStyles.unSelected
                ]}

                onPress={onPress}
            >
                <Text
                    style={[
                        {color: selected ? theme.colors.textPrimary : theme.colors.textSecondary},
                        {fontWeight: selected ? 'bold' : 'regular'}
                    ]}
                >
                    {label}
                </Text>
            </Pressable>
        );
    }
);

Chip.propTypes = {
    label: PropTypes.string,
    selected: PropTypes.bool,
    onPress: PropTypes.func,
};

const chipStyles = StyleSheet.create({
    chip: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,

        borderRadius: theme.borderRadius.full,

        alignSelf: 'flex-start', // make it only take as much space as needed
    },

    selected: {
        backgroundColor: theme.colors.accent,
    },

    unSelected: {
        backgroundColor: theme.colors.surface,
    },
});

const FilterChips = ({ header = '[Header]', categories, selectedId, onChange }) => {

    return (
        <View style={filterChipsStyles.container}>
            <Text style={globalStyles.title}>{header}</Text>
            {/* wrapper for chips */}
            <ScrollView 
                contentContainerStyle={filterChipsStyles.chipContainer} 
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {
                    categories.map(item => (
                        <Chip 
                            key={item.id} 
                            label={item.label} 
                            selected={item.id === selectedId}
                            onPress={() => onChange && onChange(item.id)}
                        />
                    ))
                }
            </ScrollView>
        </View>
    );
};

FilterChips.propTypes = {
    header: PropTypes.string,
    categories: PropTypes.array,
    selectedId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
};

const filterChipsStyles = StyleSheet.create({
    container: {
        display: 'flex',
        gap: theme.spacing.md,
    },

    chipContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing.xs,
    },  
});

export default FilterChips;