# Use U1-U21 voltage columns as features
FEATURE_COLS = [f'U{i}' for i in range(1, 22)]
TARGET_COL = 'SOH'
HEALTH_THRESHOLD = 0.6  # SOH < 0.6 = Problem, SOH >= 0.6 = Healthy