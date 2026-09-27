/**
 * Automated Verification Test Suite for OIML R 76-1:2006 MPE Rules
 * Verifies Table 6 boundaries, exact MPE limits, evaluation types, and safety states.
 */
const assert = require('assert');
const metadata = require('../rules/oiml-r76-1-2006/metadata.js');
const mpeRules = require('../rules/oiml-r76-1-2006/mpeRules.js');

let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✔ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ✖ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    failCount++;
  }
}

console.log('====================================================');
console.log('RUNNING OIML R 76-1:2006 TABLE 6 MPE VERIFICATION SUITE');
console.log('====================================================\n');

// 1. Metadata Verification
test('Metadata contains valid OIML R 76-1:2006 configuration', () => {
  assert.strictEqual(metadata.ruleSetId, 'oiml-r76-1-2006');
  assert.strictEqual(metadata.recommendation, 'OIML R 76-1');
  assert.strictEqual(metadata.edition, '2006');
  assert.strictEqual(metadata.status, 'VERIFIED_ACTIVE');
  assert.strictEqual(metadata.verificationStatus, 'VERIFIED');
});

// 2. Class III Boundary Verification (e = 0.01 kg)
// 499e, 500e, 501e, 1999e, 2000e, 2001e
const eClass3 = 0.01;

test('Class III: 499e (4.99 kg) multiplier is ±0.5e (MPE = ±0.005 kg)', () => {
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'III',
    e: eClass3,
    referenceLoad: 4.99,
    scaleReading: 4.99,
    evaluationType: 'INITIAL_VERIFICATION',
    testType: 'WEIGHING_PERFORMANCE'
  });
  assert.strictEqual(res.loadInIntervals, 499);
  assert.strictEqual(res.mpeMultiplier, 0.5);
  assert.strictEqual(res.applicableMpe, 0.005);
  assert.strictEqual(res.complianceResult, 'PASS');
});

test('Class III: 500e (5.00 kg) boundary multiplier is ±0.5e (MPE = ±0.005 kg)', () => {
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'III',
    e: eClass3,
    referenceLoad: 5.00,
    scaleReading: 5.00,
    evaluationType: 'INITIAL_VERIFICATION',
    testType: 'WEIGHING_PERFORMANCE'
  });
  assert.strictEqual(res.loadInIntervals, 500);
  assert.strictEqual(res.mpeMultiplier, 0.5);
  assert.strictEqual(res.applicableMpe, 0.005);
  assert.strictEqual(res.complianceResult, 'PASS');
});

test('Class III: 501e (5.01 kg) step-up multiplier is ±1.0e (MPE = ±0.01 kg)', () => {
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'III',
    e: eClass3,
    referenceLoad: 5.01,
    scaleReading: 5.01,
    evaluationType: 'INITIAL_VERIFICATION',
    testType: 'WEIGHING_PERFORMANCE'
  });
  assert.strictEqual(res.loadInIntervals, 501);
  assert.strictEqual(res.mpeMultiplier, 1.0);
  assert.strictEqual(res.applicableMpe, 0.01);
  assert.strictEqual(res.complianceResult, 'PASS');
});

test('Class III: 1999e (19.99 kg) multiplier is ±1.0e (MPE = ±0.01 kg)', () => {
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'III',
    e: eClass3,
    referenceLoad: 19.99,
    scaleReading: 19.99,
    evaluationType: 'INITIAL_VERIFICATION',
    testType: 'WEIGHING_PERFORMANCE'
  });
  assert.strictEqual(res.loadInIntervals, 1999);
  assert.strictEqual(res.mpeMultiplier, 1.0);
  assert.strictEqual(res.applicableMpe, 0.01);
  assert.strictEqual(res.complianceResult, 'PASS');
});

test('Class III: 2000e (20.00 kg) boundary multiplier is ±1.0e (MPE = ±0.01 kg)', () => {
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'III',
    e: eClass3,
    referenceLoad: 20.00,
    scaleReading: 20.00,
    evaluationType: 'INITIAL_VERIFICATION',
    testType: 'WEIGHING_PERFORMANCE'
  });
  assert.strictEqual(res.loadInIntervals, 2000);
  assert.strictEqual(res.mpeMultiplier, 1.0);
  assert.strictEqual(res.applicableMpe, 0.01);
  assert.strictEqual(res.complianceResult, 'PASS');
});

test('Class III: 2001e (20.01 kg) step-up multiplier is ±1.5e (MPE = ±0.015 kg)', () => {
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'III',
    e: eClass3,
    referenceLoad: 20.01,
    scaleReading: 20.01,
    evaluationType: 'INITIAL_VERIFICATION',
    testType: 'WEIGHING_PERFORMANCE'
  });
  assert.strictEqual(res.loadInIntervals, 2001);
  assert.strictEqual(res.mpeMultiplier, 1.5);
  assert.strictEqual(res.applicableMpe, 0.015);
  assert.strictEqual(res.complianceResult, 'PASS');
});

// 3. Class IIII Boundary Verification (e = 0.1 kg)
// 49e, 50e, 51e, 199e, 200e, 201e
const eClass4 = 0.1;

test('Class IIII: 49e (4.9 kg) multiplier is ±0.5e (MPE = ±0.05 kg)', () => {
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'IIII',
    e: eClass4,
    referenceLoad: 4.9,
    scaleReading: 4.9,
    evaluationType: 'INITIAL_VERIFICATION',
    testType: 'WEIGHING_PERFORMANCE'
  });
  assert.strictEqual(res.loadInIntervals, 49);
  assert.strictEqual(res.mpeMultiplier, 0.5);
  assert.strictEqual(res.applicableMpe, 0.05);
});

test('Class IIII: 50e (5.0 kg) boundary multiplier is ±0.5e (MPE = ±0.05 kg)', () => {
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'IIII',
    e: eClass4,
    referenceLoad: 5.0,
    scaleReading: 5.0,
    evaluationType: 'INITIAL_VERIFICATION',
    testType: 'WEIGHING_PERFORMANCE'
  });
  assert.strictEqual(res.loadInIntervals, 50);
  assert.strictEqual(res.mpeMultiplier, 0.5);
  assert.strictEqual(res.applicableMpe, 0.05);
});

test('Class IIII: 51e (5.1 kg) step-up multiplier is ±1.0e (MPE = ±0.1 kg)', () => {
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'IIII',
    e: eClass4,
    referenceLoad: 5.1,
    scaleReading: 5.1,
    evaluationType: 'INITIAL_VERIFICATION',
    testType: 'WEIGHING_PERFORMANCE'
  });
  assert.strictEqual(res.loadInIntervals, 51);
  assert.strictEqual(res.mpeMultiplier, 1.0);
  assert.strictEqual(res.applicableMpe, 0.1);
});

test('Class IIII: 199e (19.9 kg) multiplier is ±1.0e (MPE = ±0.1 kg)', () => {
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'IIII',
    e: eClass4,
    referenceLoad: 19.9,
    scaleReading: 19.9,
    evaluationType: 'INITIAL_VERIFICATION',
    testType: 'WEIGHING_PERFORMANCE'
  });
  assert.strictEqual(res.loadInIntervals, 199);
  assert.strictEqual(res.mpeMultiplier, 1.0);
  assert.strictEqual(res.applicableMpe, 0.1);
});

test('Class IIII: 200e (20.0 kg) boundary multiplier is ±1.0e (MPE = ±0.1 kg)', () => {
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'IIII',
    e: eClass4,
    referenceLoad: 20.0,
    scaleReading: 20.0,
    evaluationType: 'INITIAL_VERIFICATION',
    testType: 'WEIGHING_PERFORMANCE'
  });
  assert.strictEqual(res.loadInIntervals, 200);
  assert.strictEqual(res.mpeMultiplier, 1.0);
  assert.strictEqual(res.applicableMpe, 0.1);
});

test('Class IIII: 201e (20.1 kg) step-up multiplier is ±1.5e (MPE = ±0.15 kg)', () => {
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'IIII',
    e: eClass4,
    referenceLoad: 20.1,
    scaleReading: 20.1,
    evaluationType: 'INITIAL_VERIFICATION',
    testType: 'WEIGHING_PERFORMANCE'
  });
  assert.strictEqual(res.loadInIntervals, 201);
  assert.strictEqual(res.mpeMultiplier, 1.5);
  assert.strictEqual(res.applicableMpe, 0.15);
});

// 4. Exact MPE Boundary Pass / Fail and Sign Verification
test('Exact MPE boundary: positive Error = +MPE yields PASS', () => {
  // Class III at 5.0 kg, MPE = 0.005 kg. Scale reading = 5.005 kg (error = +0.005)
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'III',
    e: 0.01,
    referenceLoad: 5.000,
    scaleReading: 5.005,
    evaluationType: 'INITIAL_VERIFICATION',
    testType: 'WEIGHING_PERFORMANCE'
  });
  assert.strictEqual(res.calculatedError, 0.005);
  assert.strictEqual(res.applicableMpe, 0.005);
  assert.strictEqual(res.complianceResult, 'PASS');
});

test('Exact MPE boundary: negative Error = -MPE yields PASS', () => {
  // Class III at 5.0 kg, MPE = 0.005 kg. Scale reading = 4.995 kg (error = -0.005)
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'III',
    e: 0.01,
    referenceLoad: 5.000,
    scaleReading: 4.995,
    evaluationType: 'INITIAL_VERIFICATION',
    testType: 'WEIGHING_PERFORMANCE'
  });
  assert.strictEqual(res.calculatedError, -0.005);
  assert.strictEqual(res.applicableMpe, 0.005);
  assert.strictEqual(res.complianceResult, 'PASS');
});

test('Exact MPE boundary + epsilon: Error slightly greater than +MPE yields FAIL', () => {
  // Class III at 5.0 kg, MPE = 0.005 kg. Scale reading = 5.006 kg (error = +0.006)
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'III',
    e: 0.01,
    referenceLoad: 5.000,
    scaleReading: 5.006,
    evaluationType: 'INITIAL_VERIFICATION',
    testType: 'WEIGHING_PERFORMANCE'
  });
  assert.strictEqual(res.calculatedError, 0.006);
  assert.strictEqual(res.applicableMpe, 0.005);
  assert.strictEqual(res.complianceResult, 'FAIL');
});

test('Exact MPE boundary - epsilon: Error slightly greater than -MPE yields FAIL', () => {
  // Class III at 5.0 kg, MPE = 0.005 kg. Scale reading = 4.994 kg (error = -0.006)
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'III',
    e: 0.01,
    referenceLoad: 5.000,
    scaleReading: 4.994,
    evaluationType: 'INITIAL_VERIFICATION',
    testType: 'WEIGHING_PERFORMANCE'
  });
  assert.strictEqual(res.calculatedError, -0.006);
  assert.strictEqual(res.applicableMpe, 0.005);
  assert.strictEqual(res.complianceResult, 'FAIL');
});

// 5. In-Service Inspection Evaluation (Section 3.5.2)
test('In-Service Inspection doubles the Table 6 initial MPE multiplier', () => {
  // Class III at 5.0 kg (500e). Initial is ±0.5e. In-service must be ±1.0e (±0.010 kg)
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'III',
    e: 0.01,
    referenceLoad: 5.000,
    scaleReading: 5.008,
    evaluationType: 'IN_SERVICE_INSPECTION',
    testType: 'WEIGHING_PERFORMANCE'
  });
  assert.strictEqual(res.initialMultiplier, 0.5);
  assert.strictEqual(res.mpeMultiplier, 1.0);
  assert.strictEqual(res.applicableMpe, 0.01);
  // Error +0.008 would fail initial (0.005) but passes in-service (0.010)
  assert.strictEqual(res.complianceResult, 'PASS');
  assert(res.ruleReference.includes('Section 3.5.2'));
});

// 6. Safety States: Unsupported tests must return REFERENCE_REQUIRED
test('Unsupported test REPEATABILITY returns REFERENCE_REQUIRED without fake logic', () => {
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'III',
    e: 0.01,
    referenceLoad: 5.000,
    scaleReading: 5.002,
    evaluationType: 'INITIAL_VERIFICATION',
    testType: 'REPEATABILITY'
  });
  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
  assert.strictEqual(res.applicableMpe, null);
});

test('Unsupported test ECCENTRIC_LOADING returns REFERENCE_REQUIRED', () => {
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'III',
    e: 0.01,
    referenceLoad: 5.000,
    scaleReading: 5.002,
    evaluationType: 'INITIAL_VERIFICATION',
    testType: 'ECCENTRIC_LOADING'
  });
  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
});

// 7. Safety States: Invalid parameters must return REFERENCE_REQUIRED
test('Invalid accuracy class returns REFERENCE_REQUIRED', () => {
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'INVALID_CLASS',
    e: 0.01,
    referenceLoad: 5.000,
    scaleReading: 5.000,
    evaluationType: 'INITIAL_VERIFICATION',
    testType: 'WEIGHING_PERFORMANCE'
  });
  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
});

test('Invalid scale interval e (<= 0) returns REFERENCE_REQUIRED', () => {
  const res = mpeRules.evaluateWeighingPerformance({
    accuracyClass: 'III',
    e: 0,
    referenceLoad: 5.000,
    scaleReading: 5.000,
    evaluationType: 'INITIAL_VERIFICATION',
    testType: 'WEIGHING_PERFORMANCE'
  });
  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
});

console.log(`\n====================================================`);
console.log(`TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log(`====================================================`);

if (failCount > 0) {
  process.exit(1);
}
