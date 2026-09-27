/**
 * Automated Test Suite: OIML R 76-1:2006 Zero Verification
 *
 * References:
 * - Section 4.5:   Zero-setting and zero-tracking devices
 *   - 4.5.1:       Maximum effect
 *   - 4.5.2:       Accuracy
 *   - 4.5.5:       Zero indicating devices
 *   - 4.5.6:       Automatic zero-setting devices
 *   - 4.5.7:       Zero-tracking devices
 * - Annex A.4.2:   Checking of zero
 *   - A.4.2.1:     Range of zero-setting
 *   - A.4.2.2:     Zero indicating device
 *   - A.4.2.3:     Accuracy of zero-setting
 *
 * Never defaults to PASS. 30 tests required.
 * Reference instrument: Class III, Max=30 kg, e=0.01 kg, d=0.01 kg
 */

const assert = require('assert');
const Metadata = require('../rules/oiml-r76-1-2006/metadata.js');
const ZeroRules = require('../rules/oiml-r76-1-2006/zeroRules.js');

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log('  \u2714 PASS: ' + name);
    passCount++;
  } catch (err) {
    console.error('  \u2718 FAIL: ' + name);
    console.error('    ' + err.message);
    failCount++;
  }
}

console.log('====================================================');
console.log('RUNNING OIML R 76-1:2006 ZERO VERIFICATION SUITE');
console.log('====================================================\n');

// Reference instrument: Class III, Max=30 kg, e=0.01 kg, d=0.01 kg
// Zero-setting accuracy allowed: 0.25 × 0.01 = 0.0025 kg
// Zero-tracking allowed rate:    0.5 × 0.01 = 0.005 kg/s
// Ordinary zero-setting limit:   4% × 30 = 1.2 kg
// Initial zero-setting limit:   20% × 30 = 6.0 kg

// ─────────────────────────────────────────────────────────────────────────
// ZERO-SETTING ACCURACY (Section 4.5.2 / Annex A.4.2.3)
// ─────────────────────────────────────────────────────────────────────────

runTest('1. Zero deviation below 0.25e → PASS', () => {
  // e=0.01, allowed=0.0025, deviation=0.002 < 0.0025 → PASS
  const res = ZeroRules.evaluateZeroSettingAccuracy({
    zeroSettingType: 'NON_AUTOMATIC',
    e: 0.01,
    unit: 'kg',
    zeroDeviation: 0.002
  });
  assert.strictEqual(res.subtestId, 'ZERO_SETTING_ACCURACY');
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.allowedZeroDeviation, 0.0025);
  assert.strictEqual(res.absoluteZeroDeviation, 0.002);
});

runTest('2. Zero deviation exactly 0.25e → PASS', () => {
  // deviation = 0.0025 = 0.25 × 0.01 → PASS (exact boundary)
  const res = ZeroRules.evaluateZeroSettingAccuracy({
    zeroSettingType: 'NON_AUTOMATIC',
    e: 0.01,
    unit: 'kg',
    zeroDeviation: 0.0025
  });
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.absoluteZeroDeviation, 0.0025);
  assert.strictEqual(res.isPass, true);
});

runTest('3. Zero deviation above 0.25e → FAIL', () => {
  // deviation = 0.0026 > 0.0025 → FAIL
  const res = ZeroRules.evaluateZeroSettingAccuracy({
    zeroSettingType: 'NON_AUTOMATIC',
    e: 0.01,
    unit: 'kg',
    zeroDeviation: 0.0026
  });
  assert.strictEqual(res.complianceResult, 'FAIL');
  assert.strictEqual(res.isPass, false);
});

runTest('4. Negative deviation uses absolute magnitude correctly', () => {
  // deviation = -0.0025, abs = 0.0025 ≤ 0.0025 → PASS
  const res = ZeroRules.evaluateZeroSettingAccuracy({
    zeroSettingType: 'SEMI_AUTOMATIC',
    e: 0.01,
    unit: 'kg',
    zeroDeviation: -0.0025
  });
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.absoluteZeroDeviation, 0.0025);
  // negative deviation beyond boundary
  const res2 = ZeroRules.evaluateZeroSettingAccuracy({
    zeroSettingType: 'SEMI_AUTOMATIC',
    e: 0.01,
    unit: 'kg',
    zeroDeviation: -0.003
  });
  assert.strictEqual(res2.complianceResult, 'FAIL');
  assert.strictEqual(res2.absoluteZeroDeviation, 0.003);
});

// ─────────────────────────────────────────────────────────────────────────
// ZERO-SETTING RANGE (Section 4.5.1 / Annex A.4.2.1)
// ─────────────────────────────────────────────────────────────────────────

runTest('5. Ordinary zero-setting range below 4% Max → PASS', () => {
  // 4% × 30 = 1.2 kg. Range = 1.0 kg < 1.2 → PASS
  const res = ZeroRules.evaluateZeroSettingRange({
    rangeType: 'NON_AUTOMATIC_OR_SEMI_AUTOMATIC_ZERO_SETTING',
    maxCapacity: 30,
    positiveZeroSettingRange: 0.6,
    negativeZeroSettingRange: 0.4,
    unit: 'kg'
  });
  assert.strictEqual(res.subtestId, 'ZERO_SETTING_RANGE');
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.standardLimit, 1.2);
  assert.strictEqual(res.overallZeroSettingRange, 1.0);
});

runTest('6. Ordinary zero-setting range exactly 4% Max → PASS', () => {
  // Range = 1.2 kg = 4% × 30 → PASS (exact boundary)
  const res = ZeroRules.evaluateZeroSettingRange({
    rangeType: 'AUTOMATIC_ZERO_SETTING',
    maxCapacity: 30,
    positiveZeroSettingRange: 0.7,
    negativeZeroSettingRange: 0.5,
    unit: 'kg'
  });
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.overallZeroSettingRange, 1.2);
  assert.strictEqual(res.standardLimit, 1.2);
});

runTest('7. Ordinary effect above 4% without verified exception → REFERENCE_REQUIRED', () => {
  // Range = 1.5 kg > 1.2 kg, no exception verified → REFERENCE_REQUIRED
  const res = ZeroRules.evaluateZeroSettingRange({
    rangeType: 'NON_AUTOMATIC_OR_SEMI_AUTOMATIC_ZERO_SETTING',
    maxCapacity: 30,
    positiveZeroSettingRange: 0.9,
    negativeZeroSettingRange: 0.6,
    unit: 'kg'
  });
  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
  assert.strictEqual(res.overallZeroSettingRange, 1.5);
  assert.ok(res.explanation.includes('REFERENCE REQUIRED'));
});

runTest('8. Initial zero-setting below 20% Max → PASS', () => {
  // 20% × 30 = 6.0. Range = 5.0 < 6.0 → PASS
  const res = ZeroRules.evaluateZeroSettingRange({
    rangeType: 'INITIAL_ZERO_SETTING',
    maxCapacity: 30,
    positiveZeroSettingRange: 3.0,
    negativeZeroSettingRange: 2.0,
    unit: 'kg'
  });
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.standardLimit, 6.0);
  assert.strictEqual(res.overallZeroSettingRange, 5.0);
  assert.strictEqual(res.isInitial, true);
});

runTest('9. Initial zero-setting exactly 20% Max → PASS', () => {
  // Range = 6.0 = 20% × 30 → PASS
  const res = ZeroRules.evaluateZeroSettingRange({
    rangeType: 'INITIAL_ZERO_SETTING',
    maxCapacity: 30,
    positiveZeroSettingRange: 3.5,
    negativeZeroSettingRange: 2.5,
    unit: 'kg'
  });
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.overallZeroSettingRange, 6.0);
});

runTest('10. Initial zero-setting above 20% without verified wider-range conditions → REFERENCE_REQUIRED', () => {
  // Range = 7.0 > 6.0, no exception → REFERENCE_REQUIRED
  const res = ZeroRules.evaluateZeroSettingRange({
    rangeType: 'INITIAL_ZERO_SETTING',
    maxCapacity: 30,
    positiveZeroSettingRange: 4.0,
    negativeZeroSettingRange: 3.0,
    unit: 'kg'
  });
  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
  assert.ok(res.explanation.includes('REFERENCE REQUIRED'));
});

// ─────────────────────────────────────────────────────────────────────────
// AUTOMATIC ZERO-SETTING (Section 4.5.6)
// ─────────────────────────────────────────────────────────────────────────

runTest('11. Automatic zero operation after exactly 5 seconds under valid conditions → allowed (PASS)', () => {
  // Duration=5.0s, equilibrium stable, below zero, operated → PASS
  const res = ZeroRules.evaluateAutomaticZeroSetting({
    hasAutomaticZeroSetting: true,
    equilibriumStable: true,
    indicationBelowZero: true,
    stableBelowZeroDurationSeconds: 5.0,
    automaticZeroOperated: true
  });
  assert.strictEqual(res.subtestId, 'AUTOMATIC_ZERO_SETTING');
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.minimumRequiredDurationSeconds, 5.0);
  assert.strictEqual(res.conditionDurationMet, true);
});

runTest('12. Automatic zero operation before 5 seconds → FAIL', () => {
  // Duration=4.9s < 5.0s, operated → FAIL
  const res = ZeroRules.evaluateAutomaticZeroSetting({
    hasAutomaticZeroSetting: true,
    equilibriumStable: true,
    indicationBelowZero: true,
    stableBelowZeroDurationSeconds: 4.9,
    automaticZeroOperated: true
  });
  assert.strictEqual(res.complianceResult, 'FAIL');
  assert.strictEqual(res.conditionDurationMet, false);
  assert.ok(res.explanation.includes('4.9'));
});

runTest('13. Automatic zero operation while equilibrium unstable → FAIL', () => {
  // equilibriumStable=false, operated → FAIL
  const res = ZeroRules.evaluateAutomaticZeroSetting({
    hasAutomaticZeroSetting: true,
    equilibriumStable: false,
    indicationBelowZero: true,
    stableBelowZeroDurationSeconds: 6.0,
    automaticZeroOperated: true
  });
  assert.strictEqual(res.complianceResult, 'FAIL');
  assert.strictEqual(res.conditionEquilibriumStable, false);
  assert.ok(res.explanation.includes('NOT stable'));
});

runTest('14. Automatic zero operation when indication condition invalid → FAIL', () => {
  // indicationBelowZero=false means indication is NOT below zero → FAIL
  const res = ZeroRules.evaluateAutomaticZeroSetting({
    hasAutomaticZeroSetting: true,
    equilibriumStable: true,
    indicationBelowZero: false,
    stableBelowZeroDurationSeconds: 5.5,
    automaticZeroOperated: true
  });
  assert.strictEqual(res.complianceResult, 'FAIL');
  assert.strictEqual(res.conditionIndicationBelowZero, false);
});

// ─────────────────────────────────────────────────────────────────────────
// ZERO-TRACKING (Section 4.5.7)
// ─────────────────────────────────────────────────────────────────────────

runTest('15. Zero-tracking correction below 0.5d/s → PASS', () => {
  // d=0.01, allowed=0.005 kg/s. correction=0.003 kg in 1 s → rate=0.003 < 0.005 → PASS
  const res = ZeroRules.evaluateZeroTracking({
    hasZeroTracking: true,
    d: 0.01,
    unit: 'kg',
    trackingOperating: true,
    indicationState: 'AT_ZERO',
    equilibriumStable: true,
    correctionAmount: 0.003,
    correctionDurationSeconds: 1.0
  });
  assert.strictEqual(res.subtestId, 'ZERO_TRACKING');
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.allowedCorrectionRate, 0.005);
  assert.ok(res.correctionRate < 0.005 + 1e-9);
});

runTest('16. Zero-tracking exactly 0.5d/s → PASS', () => {
  // d=0.01, correction=0.005 in 1s → rate=0.005 = 0.5d/s → PASS (exact boundary)
  const res = ZeroRules.evaluateZeroTracking({
    hasZeroTracking: true,
    d: 0.01,
    unit: 'kg',
    trackingOperating: true,
    indicationState: 'AT_ZERO',
    equilibriumStable: true,
    correctionAmount: 0.005,
    correctionDurationSeconds: 1.0
  });
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.ok(Math.abs(res.correctionRate - 0.005) < 1e-9);
  assert.strictEqual(res.conditionRateMet, true);
});

runTest('17. Zero-tracking above 0.5d/s → FAIL', () => {
  // correction=0.006 in 1s → rate=0.006 > 0.005 → FAIL
  const res = ZeroRules.evaluateZeroTracking({
    hasZeroTracking: true,
    d: 0.01,
    unit: 'kg',
    trackingOperating: true,
    indicationState: 'AT_ZERO',
    equilibriumStable: true,
    correctionAmount: 0.006,
    correctionDurationSeconds: 1.0
  });
  assert.strictEqual(res.complianceResult, 'FAIL');
  assert.ok(res.explanation.includes('0.006'));
});

runTest('18. Zero-tracking with unstable equilibrium and operation → FAIL', () => {
  // equilibriumStable=false, operated → FAIL
  const res = ZeroRules.evaluateZeroTracking({
    hasZeroTracking: true,
    d: 0.01,
    unit: 'kg',
    trackingOperating: true,
    indicationState: 'AT_ZERO',
    equilibriumStable: false,
    correctionAmount: 0.003,
    correctionDurationSeconds: 1.0
  });
  assert.strictEqual(res.complianceResult, 'FAIL');
  assert.strictEqual(res.conditionEquilibriumStable, false);
});

runTest('19. Invalid correction duration (≤ 0) → REFERENCE_REQUIRED', () => {
  // duration = 0 → REFERENCE_REQUIRED (cannot compute rate)
  const res = ZeroRules.evaluateZeroTracking({
    hasZeroTracking: true,
    d: 0.01,
    unit: 'kg',
    trackingOperating: true,
    indicationState: 'AT_ZERO',
    equilibriumStable: true,
    correctionAmount: 0.003,
    correctionDurationSeconds: 0
  });
  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
  assert.ok(res.explanation.includes('positive number'));
});

// ─────────────────────────────────────────────────────────────────────────
// ZERO INDICATING DEVICE (Section 4.5.5 / Annex A.4.2.2)
// ─────────────────────────────────────────────────────────────────────────

runTest('20. Zero-indicating device range satisfies ±0.25e', () => {
  // e=0.01, allowed half-range=0.0025. observed half-range=0.002 ≤ 0.0025 → PASS
  const res = ZeroRules.evaluateZeroIndicatingDevice({
    hasZeroIndicatingDevice: true,
    e: 0.01,
    unit: 'kg',
    observedZeroIndicatorRange: 0.002,
    observedRangeIsTotal: false
  });
  assert.strictEqual(res.subtestId, 'ZERO_INDICATING_DEVICE');
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.allowedHalfRange, 0.0025);
  assert.strictEqual(res.observedHalfRange, 0.002);
});

runTest('21. Zero-indicating device range exceeds requirement → FAIL', () => {
  // e=0.01, allowed=0.0025. observed half-range=0.003 > 0.0025 → FAIL
  const res = ZeroRules.evaluateZeroIndicatingDevice({
    hasZeroIndicatingDevice: true,
    e: 0.01,
    unit: 'kg',
    observedZeroIndicatorRange: 0.003,
    observedRangeIsTotal: false
  });
  assert.strictEqual(res.complianceResult, 'FAIL');
  assert.strictEqual(res.isPass, false);
});

runTest('22. Valid configured non-applicable zero-indicator case → NOT_APPLICABLE', () => {
  // No zero indicating device + auxiliary indicating device present → NOT_APPLICABLE
  const res = ZeroRules.evaluateZeroIndicatingDevice({
    hasZeroIndicatingDevice: false,
    hasAuxiliaryIndicatingDevice: true,
    e: 0.01,
    unit: 'kg'
  });
  assert.strictEqual(res.complianceResult, 'NOT_APPLICABLE');
  assert.ok(res.explanation.includes('NOT APPLICABLE'));
});

// ─────────────────────────────────────────────────────────────────────────
// NOT_EVALUATED / REFERENCE_REQUIRED SAFETY STATES
// ─────────────────────────────────────────────────────────────────────────

runTest('23. Missing required zero observation → NOT_EVALUATED', () => {
  // No zeroDeviation entered → NOT_EVALUATED
  const res = ZeroRules.evaluateZeroSettingAccuracy({
    zeroSettingType: 'NON_AUTOMATIC',
    e: 0.01,
    unit: 'kg'
    // zeroDeviation intentionally omitted
  });
  assert.strictEqual(res.complianceResult, 'NOT_EVALUATED');
  assert.ok(res.explanation.includes('not been entered'));
});

runTest('24. Invalid e → REFERENCE_REQUIRED', () => {
  // e = 0 → REFERENCE_REQUIRED
  const res = ZeroRules.evaluateZeroSettingAccuracy({
    zeroSettingType: 'NON_AUTOMATIC',
    e: 0,
    unit: 'kg',
    zeroDeviation: 0.002
  });
  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
  assert.ok(res.explanation.includes('positive number'));
});

runTest('25. Invalid d where zero-tracking requires d → REFERENCE_REQUIRED', () => {
  // d = -1 → REFERENCE_REQUIRED
  const res = ZeroRules.evaluateZeroTracking({
    hasZeroTracking: true,
    d: -1,
    unit: 'kg',
    trackingOperating: true,
    indicationState: 'AT_ZERO',
    equilibriumStable: true,
    correctionAmount: 0.003,
    correctionDurationSeconds: 1.0
  });
  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
  assert.ok(res.explanation.includes('positive number'));
});

// ─────────────────────────────────────────────────────────────────────────
// PARENT AGGREGATION
// ─────────────────────────────────────────────────────────────────────────

runTest('26. Parent result FAIL when any required subtest fails', () => {
  // Zero accuracy FAIL (deviation=0.003 > 0.0025), others PASS
  const res = ZeroRules.evaluateZeroRelatedTests({
    zeroSettingType: 'NON_AUTOMATIC',
    hasInitialZeroSetting: false,
    hasZeroTracking: false,
    hasZeroIndicatingDevice: false,
    hasAuxiliaryIndicatingDevice: true,
    zeroIndicatorExemptionConfigured: true,
    maxCapacity: 30,
    e: 0.01,
    d: 0.01,
    unit: 'kg',
    positiveZeroSettingRange: 0.6,
    negativeZeroSettingRange: 0.4,
    zeroDeviation: 0.003  // FAIL: 0.003 > 0.0025
  });
  assert.strictEqual(res.testType, 'ZERO_RELATED_TESTS');
  assert.strictEqual(res.complianceResult, 'FAIL');
  assert.strictEqual(res.subtests.ZERO_SETTING_ACCURACY.complianceResult, 'FAIL');
});

runTest('27. Parent result NOT_EVALUATED when required subtest incomplete', () => {
  // zeroDeviation not provided → ZERO_SETTING_ACCURACY = NOT_EVALUATED → parent NOT_EVALUATED
  const res = ZeroRules.evaluateZeroRelatedTests({
    zeroSettingType: 'NON_AUTOMATIC',
    hasInitialZeroSetting: false,
    hasZeroTracking: false,
    hasZeroIndicatingDevice: false,
    hasAuxiliaryIndicatingDevice: true,
    zeroIndicatorExemptionConfigured: true,
    maxCapacity: 30,
    e: 0.01,
    d: 0.01,
    unit: 'kg',
    positiveZeroSettingRange: 0.6,
    negativeZeroSettingRange: 0.4
    // zeroDeviation intentionally absent
  });
  assert.strictEqual(res.complianceResult, 'NOT_EVALUATED');
  assert.strictEqual(res.subtests.ZERO_SETTING_ACCURACY.complianceResult, 'NOT_EVALUATED');
});

runTest('28. Parent PASS only when every applicable required subtest passes', () => {
  // All required subtests pass
  const res = ZeroRules.evaluateZeroRelatedTests({
    zeroSettingType: 'NON_AUTOMATIC',
    hasInitialZeroSetting: false,
    hasZeroTracking: false,
    hasZeroIndicatingDevice: true,
    hasAuxiliaryIndicatingDevice: false,
    maxCapacity: 30,
    e: 0.01,
    d: 0.01,
    unit: 'kg',
    positiveZeroSettingRange: 0.6,
    negativeZeroSettingRange: 0.4,
    zeroDeviation: 0.002,           // PASS: 0.002 ≤ 0.0025
    observedZeroIndicatorRange: 0.002,  // PASS: 0.002 ≤ 0.0025
    observedRangeIsTotal: false
  });
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.subtests.ZERO_SETTING_RANGE.complianceResult, 'PASS');
  assert.strictEqual(res.subtests.ZERO_SETTING_ACCURACY.complianceResult, 'PASS');
  assert.strictEqual(res.subtests.ZERO_INDICATING_DEVICE.complianceResult, 'PASS');
  assert.strictEqual(res.subtests.ZERO_TRACKING.complianceResult, 'NOT_APPLICABLE');
});

runTest('29. NOT_APPLICABLE subtest does not become PASS and does not cause failure', () => {
  // No zero-tracking → ZERO_TRACKING = NOT_APPLICABLE
  // This must not count as PASS, must not cause FAIL
  const res = ZeroRules.evaluateZeroRelatedTests({
    zeroSettingType: 'NON_AUTOMATIC',
    hasInitialZeroSetting: false,
    hasZeroTracking: false,  // tracking NOT_APPLICABLE
    hasZeroIndicatingDevice: false,
    hasAuxiliaryIndicatingDevice: true,
    zeroIndicatorExemptionConfigured: true,
    maxCapacity: 30,
    e: 0.01,
    d: 0.01,
    unit: 'kg',
    positiveZeroSettingRange: 0.5,
    negativeZeroSettingRange: 0.3,
    zeroDeviation: 0.001
  });
  // ZERO_TRACKING must be NOT_APPLICABLE
  assert.strictEqual(res.subtests.ZERO_TRACKING.complianceResult, 'NOT_APPLICABLE');
  // ZERO_INDICATING_DEVICE must be NOT_APPLICABLE (auxiliary device present)
  assert.strictEqual(res.subtests.ZERO_INDICATING_DEVICE.complianceResult, 'NOT_APPLICABLE');
  // Parent must PASS (only required subtests pass)
  assert.strictEqual(res.complianceResult, 'PASS');
  // NOT_APPLICABLE count > 0
  assert.ok(res.notApplicableCount >= 2);
});

runTest('30. Metadata contains ZERO_RELATED_TESTS only after verified implementation', () => {
  assert.ok(Metadata.scope.includes('WEIGHING_PERFORMANCE'), 'WEIGHING_PERFORMANCE must remain');
  assert.ok(Metadata.scope.includes('REPEATABILITY'), 'REPEATABILITY must remain');
  assert.ok(Metadata.scope.includes('ECCENTRIC_LOADING'), 'ECCENTRIC_LOADING must remain');
  assert.ok(Metadata.scope.includes('TARE'), 'TARE must remain');
  assert.ok(Metadata.scope.includes('ZERO_RELATED_TESTS'), 'ZERO_RELATED_TESTS must be in verified scope');
});

console.log('\n====================================================');
console.log('ZERO TEST SUMMARY: ' + passCount + ' PASSED, ' + failCount + ' FAILED');
console.log('====================================================\n');

if (failCount > 0) {
  process.exit(1);
}
