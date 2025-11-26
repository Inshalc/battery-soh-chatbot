import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { theme } from "@/themes/theme";
import { apiService } from '@/services/api';

const BatteryInputForm = ({ onPredictionComplete, onClose }) => {
  const [cellVoltages, setCellVoltages] = useState(Array(21).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle cell voltage input change
  const handleCellChange = (index, value) => {
    const newVoltages = [...cellVoltages];
    newVoltages[index] = value;
    setCellVoltages(newVoltages);
  };

  // Fill with example data - ONLY TWO OPTIONS NOW
  const fillExampleData = (type = 'healthy') => {
    const examples = {
    healthy: [
        3.68, 3.69, 3.67, 3.70, 3.66, 3.71, 3.68, 3.69, 3.67, 3.70,
        3.68, 3.69, 3.67, 3.70, 3.68, 3.69, 3.67, 3.70, 3.68, 3.69, 3.65
    ],
    unhealthy: [
        // Clearly unhealthy - lower voltages with more spread
        2.85, 2.88, 2.82, 2.90, 2.80, 2.95, 2.83, 2.87, 2.81, 2.89,
        2.79, 2.92, 2.78, 2.94, 2.77, 2.96, 2.76, 2.98, 2.75, 3.00, 2.60
    ]
};

    
    setCellVoltages(examples[type].map(v => v.toString()));
  };

  // Submit battery data for prediction
  const handleSubmit = async () => {
    // Validate inputs
    const voltages = cellVoltages.map(v => parseFloat(v)).filter(v => !isNaN(v));
    if (voltages.length !== 21) {
      Alert.alert('Invalid Input', 'Please enter all 21 cell voltages');
      return;
    }

    // Validate voltage range
    const invalidVoltages = voltages.filter(v => v < 2.5 || v > 4.5);
    if (invalidVoltages.length > 0) {
      Alert.alert('Invalid Voltage', 'Cell voltages should be between 2.5V and 4.5V');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const prediction = await apiService.predictSOH(voltages);
      
      if (prediction.success) {
        // Callback to parent with prediction results
        onPredictionComplete(prediction);
        Alert.alert(
          'Analysis Complete', 
          `SOH: ${prediction.prediction.soh_percentage}%\nStatus: ${prediction.prediction.status}`,
          [{ text: 'OK', onPress: onClose }]
        );
      } else {
        Alert.alert('Prediction Failed', prediction.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      Alert.alert('Error', 'Failed to analyze battery data');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render cell input grid
  const renderCellInputs = () => {
    const rows = [];
    for (let i = 0; i < 21; i += 3) {
      rows.push(
        <View key={i} style={styles.row}>
          {[0, 1, 2].map(offset => {
            const index = i + offset;
            if (index >= 21) return null;
            
            return (
              <View key={index} style={styles.cellContainer}>
                <Text style={styles.cellLabel}>U{index + 1}</Text>
                <TextInput
                  style={styles.input}
                  value={cellVoltages[index]}
                  onChangeText={(value) => handleCellChange(index, value)}
                  placeholder="3.65"
                  keyboardType="decimal-pad"
                  editable={!isSubmitting}
                />
              </View>
            );
          })}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Battery Cell Voltages (U1-U21)</Text>
      
      <ScrollView style={styles.scrollView}>
        {renderCellInputs()}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {/* ONLY TWO EXAMPLE BUTTONS NOW */}
        <TouchableOpacity 
          style={[styles.button, styles.healthyButton]}
          onPress={() => fillExampleData('healthy')}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>Fill Healthy Example</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.unhealthyButton]}
          onPress={() => fillExampleData('unhealthy')}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>Fill Unhealthy Example</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Analyzing...' : 'Analyze Battery Health'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]}
          onPress={onClose}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.surface,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cellContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cellLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 8,
    textAlign: 'center',
    backgroundColor: theme.colors.background,
    color: theme.colors.textPrimary,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  healthyButton: {
    backgroundColor: '#4CAF50', // Green for healthy
  },
  unhealthyButton: {
    backgroundColor: '#FF9800', // Orange for unhealthy
  },
  submitButton: {
    backgroundColor: theme.colors.accent,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
});

export default BatteryInputForm;