const express = require('express');
const { exec } = require('child_process');  // Use child_process instead of PythonShell
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Path to your Python model
const pythonModelPath = path.join(__dirname, '../../Rmodel/src');

/**
 * Calculate Pack SOH features from 21 cell voltages
 * This aggregates the 21 cells into 6 statistical features for the model
 */
function calculatePackFeatures(cellVoltages) {
    if (!cellVoltages || cellVoltages.length !== 21) {
        throw new Error('Expected 21 cell voltages (U1-U21)');
    }
    
    console.log('🔢 Aggregating 21 cells into 6 statistical features...');
    
    // Calculate the 6 statistical features that your model expects
    const mean = cellVoltages.reduce((sum, val) => sum + val, 0) / cellVoltages.length;
    
    const sorted = [...cellVoltages].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    
    const variance = cellVoltages.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / cellVoltages.length;
    const std = Math.sqrt(variance);
    
    const min = Math.min(...cellVoltages);
    const max = Math.max(...cellVoltages);
    
    // Simple skewness calculation (third standardized moment)
    const skew = cellVoltages.reduce((sum, val) => sum + Math.pow((val - mean) / std, 3), 0) / cellVoltages.length;
    
    const features = [
        mean,      // Pack_SOH_mean
        median,    // Pack_SOH_median  
        std,       // Pack_SOH_std
        min,       // Pack_SOH_min
        max,       // Pack_SOH_max
        skew       // Pack_SOH_skew
    ];
    
    console.log('📊 Aggregated Features:', {
        mean: mean.toFixed(4),
        median: median.toFixed(4),
        std: std.toFixed(4),
        min: min.toFixed(4),
        max: max.toFixed(4),
        skew: skew.toFixed(4)
    });
    
    return features;
}

/**
 * Predict Battery SOH from 21 cell data (U1-U21)
 * POST /api/battery/predict
 * Body: { batteryData: [array of 21 cell measurements] }
 */
router.post('/predict', async (req, res) => {
    try {
        const { batteryData } = req.body;

        if (!batteryData || !Array.isArray(batteryData)) {
            return res.status(400).json({
                error: 'batteryData array with 21 cell measurements (U1-U21) is required'
            });
        }

        if (batteryData.length !== 21) {
            return res.status(400).json({
                error: `Expected 21 cell measurements (U1-U21), but got ${batteryData.length}`
            });
        }

        console.log('🔋 Received 21 cell voltages:', batteryData);

        // ✅ AGGREGATE the 21 cells into 6 features (meets project requirement!)
        const features = calculatePackFeatures(batteryData);

        // Escape the features for command line
        const featuresJson = JSON.stringify(features).replace(/'/g, "'\\''");
        const pythonScript = path.join(pythonModelPath, 'quick_test.py');
        
        // Use child_process.exec instead of PythonShell
        const command = `cd "${pythonModelPath}" && python3 quick_test.py '${featuresJson}'`;
        
        console.log('🔧 Running command:', command);
        console.log('🔮 Running SOH prediction with aggregated features...');

        // Execute Python script using child_process
        exec(command, { timeout: 10000 }, (err, stdout, stderr) => {
            if (err) {
                console.error('❌ Python execution error:', err);
                console.error('❌ Stderr:', stderr);
                return res.status(500).json({
                    error: 'Prediction failed',
                    details: err.message
                });
            }

            // Log the raw output for debugging
            console.log('📄 Python stdout:', stdout);
            if (stderr) {
                console.log('⚠️ Python stderr:', stderr);
            }

            try {
                // Parse the result from Python script
                const predictionResult = JSON.parse(stdout.trim());
                
                if (predictionResult.status === 'error') {
                    return res.status(500).json({
                        error: 'Prediction error',
                        details: predictionResult.error
                    });
                }

                // Apply threshold classification
                const soh = predictionResult.soh;
                const threshold = 0.6;
                const status = soh >= threshold ? 'healthy' : 'has a problem';
                const message = soh >= threshold 
                    ? 'The battery is healthy.' 
                    : 'The battery has a problem.';

                console.log(`✅ Prediction successful: SOH=${soh}, Status=${status}`);

                res.json({
                    success: true,
                    prediction: {
                        soh: soh,
                        soh_percentage: (soh * 100).toFixed(1),
                        status: status,
                        message: message,
                        threshold: threshold,
                        isHealthy: soh >= threshold
                    },
                    aggregation: {
                        input_cells: batteryData,
                        calculated_features: {
                            Pack_SOH_mean: features[0],
                            Pack_SOH_median: features[1],
                            Pack_SOH_std: features[2],
                            Pack_SOH_min: features[3],
                            Pack_SOH_max: features[4],
                            Pack_SOH_skew: features[5]
                        }
                    }
                });

            } catch (parseError) {
                console.error('❌ Error parsing Python result:', parseError);
                console.error('❌ Raw output that failed to parse:', stdout);
                res.status(500).json({
                    error: 'Failed to parse prediction result',
                    details: parseError.message
                });
            }
        });

    } catch (error) {
        console.error('❌ Prediction route error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

/**
 * Get battery model metrics and info
 * GET /api/battery/model-info
 */
router.get('/model-info', (req, res) => {
    try {
        const metricsPath = path.join(__dirname, '../../Rmodel/results/model_metrics.json');
        
        if (fs.existsSync(metricsPath)) {
            const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
            res.json({
                model_info: {
                    type: 'Linear Regression',
                    trained: true,
                    features_used: 6,
                    features_description: 'Statistical aggregates from 21 cell voltages',
                    aggregation_method: 'Calculates mean, median, std, min, max, skew from U1-U21',
                    metrics: metrics
                }
            });
        } else {
            res.json({
                model_info: {
                    type: 'Linear Regression',
                    trained: true,
                    features_used: 6,
                    features_description: 'Statistical aggregates from 21 cell voltages',
                    aggregation_method: 'Calculates mean, median, std, min, max, skew from U1-U21',
                    metrics: 'Metrics file not found'
                }
            });
        }
    } catch (error) {
        console.error('Error reading model info:', error);
        res.status(500).json({
            error: 'Failed to read model information'
        });
    }
});

/**
 * Health status classification
 * POST /api/battery/health-status
 * Body: { soh: number, threshold?: number }
 */
router.post('/health-status', (req, res) => {
    try {
        const { soh, threshold = 0.6 } = req.body;

        if (soh === undefined || soh === null) {
            return res.status(400).json({
                error: 'SOH value is required'
            });
        }

        if (soh < 0 || soh > 1) {
            return res.status(400).json({
                error: 'SOH must be between 0 and 1'
            });
        }

        const status = soh >= threshold ? 'healthy' : 'has a problem';
        const message = soh >= threshold 
            ? 'The battery is healthy.' 
            : 'The battery has a problem.';

        res.json({
            soh: soh,
            soh_percentage: (soh * 100).toFixed(1),
            threshold: threshold,
            status: status,
            message: message,
            isHealthy: soh >= threshold
        });

    } catch (error) {
        console.error('Health status error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

/**
 * Test aggregation function
 * POST /api/battery/test-aggregation
 * Body: { batteryData: [array of 21 cell measurements] }
 */
router.post('/test-aggregation', (req, res) => {
    try {
        const { batteryData } = req.body;

        if (!batteryData || !Array.isArray(batteryData)) {
            return res.status(400).json({
                error: 'batteryData array with 21 cell measurements is required'
            });
        }

        if (batteryData.length !== 21) {
            return res.status(400).json({
                error: `Expected 21 cell measurements, but got ${batteryData.length}`
            });
        }

        const features = calculatePackFeatures(batteryData);

        res.json({
            success: true,
            input_cells: batteryData,
            aggregated_features: {
                Pack_SOH_mean: features[0],
                Pack_SOH_median: features[1],
                Pack_SOH_std: features[2],
                Pack_SOH_min: features[3],
                Pack_SOH_max: features[4],
                Pack_SOH_skew: features[5]
            },
            description: '21 cell voltages aggregated into 6 statistical features for SOH prediction'
        });

    } catch (error) {
        console.error('Aggregation test error:', error);
        res.status(500).json({
            error: 'Aggregation failed',
            details: error.message
        });
    }
});

module.exports = router;