const express = require('express');
const { PythonShell } = require('python-shell');
const path = require('path');
const router = express.Router();

// Path to your Python model
const pythonModelPath = path.join(__dirname, '../../Rmodel/src');

/**
 * Predict Battery SOH
 * POST /api/battery/predict
 * Body: { batteryData: [...] } - array of cell data
 */
router.post('/predict', async (req, res) => {
  try {
    const { batteryData } = req.body;

    if (!batteryData || !Array.isArray(batteryData)) {
      return res.status(400).json({
        error: 'batteryData array is required'
      });
    }

    // Options for Python shell
    const options = {
      mode: 'text',
      pythonPath: 'python3', // or 'python' depending on your system
      pythonOptions: ['-u'], // unbuffered output
      scriptPath: pythonModelPath,
      args: [JSON.stringify(batteryData)]
    };

    // Run Python prediction script
    PythonShell.run('quick_test.py', options, (err, results) => {
      if (err) {
        console.error('Python execution error:', err);
        return res.status(500).json({
          error: 'Prediction failed',
          details: err.message
        });
      }

      try {
        // Parse the result from Python script
        const predictionResult = JSON.parse(results[0]);
        
        res.json({
          success: true,
          prediction: predictionResult
        });
      } catch (parseError) {
        console.error('Error parsing Python result:', parseError);
        res.status(500).json({
          error: 'Failed to parse prediction result',
          details: parseError.message
        });
      }
    });

  } catch (error) {
    console.error('Prediction route error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * Get battery health status based on SOH
 * POST /api/battery/health-status
 * Body: { soh: 0.75 }
 */
router.post('/health-status', (req, res) => {
  try {
    const { soh, threshold = 0.6 } = req.body;

    if (soh === undefined || soh === null) {
      return res.status(400).json({
        error: 'SOH value is required'
      });
    }

    const status = soh >= threshold ? 'healthy' : 'has a problem';
    const message = soh >= threshold 
      ? 'The battery is healthy.' 
      : 'The battery has a problem.';

    res.json({
      soh: soh,
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

module.exports = router;