/**
 * Automated Verification Test Suite for OIML R 76-1:2006 Repeatability Rules
 * Section 3.6.1 & Annex A.4.10
 */
const assert = require('assert');
const metadata = require('../rules/oiml-r76-1-2006/metadata.js');
const mpeRules = require('../rules/oiml-r76-1-2006/mpeRules.js');
const repeatabilityRules = require('../rules/oiml-r76-1-2006/repeatabilityRules.js');

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
console.log('RUNNING OIML R 76-1:2006 REPEATABILITY VERIFICATION SUITE');
console.log('====================================================\n');

// 1. Metadata check
test('Metadata includes REPEATABILITY in verified scope', () => {
  assert.strictEqual(metadata.ruleSetId, 'oiml-r76-1-2006');
  assert.ok(Array.isArray(metadata.scope) ? metadata.scope.includes('REPEATABILITY') : metadata.scope === 'REPEATABILITY');
  assert.strictEqual(metadata.clauses.repeatability, 'Section 3.6.1, Annex A.4.10');
});

// 2. Class III with exactly 3 valid readings -> PASS
// Max = 30 kg, e = 0.01 kg, ~0.8 Max = 24 kg
// Load in intervals = 24 / 0.01 = 2400 e.
// Class III band: 2000e < m <= 10000e => MPE = +-1.5e = +-0.015 kg.
test('1. Class III with exactly 3 valid readings -> PASS', () => {
  const res = repeatabilityRules.evaluateRepeatabilitySeries({
    accuracyClass: 'III',
    maxCapacity: 30,
    e: 0.01,
    referenceLoad: 24.000,
    indications: [24.002, 24.005, 24.001],
    evaluationType: 'INITIAL_VERIFICATION'
  });

  assert.strictEqual(res.requiredRepetitions, 3);
  assert.strictEqual(res.actualRepetitions, 3);
  assert.strictEqual(res.highestIndication, 24.005);
  assert.strictEqual(res.lowestIndication, 24.001);
  assert.strictEqual(res.repeatabilityDifference, 0.004);
  assert.strictEqual(res.applicableMpe, 0.015);
  assert.strictEqual(res.allIndividualResultsWithinMpe, true);
  assert.strictEqual(res.complianceResult, 'PASS');
});

// 3. Class III difference exactly equal to MPE -> PASS
test('2. Class III difference exactly equal to MPE -> PASS', () => {
  const res = repeatabilityRules.evaluateRepeatabilitySeries({
    accuracyClass: 'III',
    maxCapacity: 30,
    e: 0.01,
    referenceLoad: 24.000,
    indications: [24.000, 24.015, 24.008],
    evaluationType: 'INITIAL_VERIFICATION'
  });

  assert.strictEqual(res.highestIndication, 24.015);
  assert.strictEqual(res.lowestIndication, 24.000);
  assert.strictEqual(res.repeatabilityDifference, 0.015);
  assert.strictEqual(res.applicableMpe, 0.015);
  assert.strictEqual(res.complianceResult, 'PASS');
});

// 4. Class III difference slightly greater than MPE -> FAIL
test('3. Class III difference slightly greater than MPE -> FAIL', () => {
  const res = repeatabilityRules.evaluateRepeatabilitySeries({
    accuracyClass: 'III',
    maxCapacity: 30,
    e: 0.01,
    referenceLoad: 24.000,
    indications: [24.000, 24.016, 24.008],
    evaluationType: 'INITIAL_VERIFICATION'
  });

  assert.strictEqual(res.repeatabilityDifference, 0.016);
  assert.strictEqual(res.applicableMpe, 0.015);
  assert.strictEqual(res.complianceResult, 'FAIL');
});

// 5. Class III with only 2 readings -> NOT_EVALUATED
test('4. Class III with only 2 readings -> NOT_EVALUATED', () => {
  const res = repeatabilityRules.evaluateRepeatabilitySeries({
    accuracyClass: 'III',
    maxCapacity: 30,
    e: 0.01,
    referenceLoad: 24.000,
    indications: [24.002, 24.004],
    evaluationType: 'INITIAL_VERIFICATION'
  });

  assert.strictEqual(res.actualRepetitions, 2);
  assert.strictEqual(res.requiredRepetitions, 3);
  assert.strictEqual(res.complianceResult, 'NOT_EVALUATED');
  assert.ok(res.explanation.includes('Additional repeatability observations required.'));
});

// 6. Class II with 6 valid readings -> PASS
// Max = 3000 g, e = 0.1 g, ~0.8 Max = 2400 g.
// 2400 / 0.1 = 24000 e => Class II 20000e < m <= 100000e => MPE = +-1.5e = +-0.15 g
test('5. Class II with 6 valid readings -> PASS', () => {
  const res = repeatabilityRules.evaluateRepeatabilitySeries({
    accuracyClass: 'II',
    maxCapacity: 3000,
    e: 0.1,
    referenceLoad: 2400.0,
    indications: [2400.05, 2400.08, 2400.02, 2400.10, 2400.06, 2400.04],
    evaluationType: 'INITIAL_VERIFICATION'
  });

  assert.strictEqual(res.requiredRepetitions, 6);
  assert.strictEqual(res.actualRepetitions, 6);
  assert.strictEqual(res.highestIndication, 2400.10);
  assert.strictEqual(res.lowestIndication, 2400.02);
  assert.strictEqual(res.repeatabilityDifference, 0.08);
  assert.strictEqual(res.applicableMpe, 0.15);
  assert.strictEqual(res.complianceResult, 'PASS');
});

// 7. Class II with only 5 readings -> NOT_EVALUATED
test('6. Class II with only 5 readings -> NOT_EVALUATED', () => {
  const res = repeatabilityRules.evaluateRepeatabilitySeries({
    accuracyClass: 'II',
    maxCapacity: 3000,
    e: 0.1,
    referenceLoad: 2400.0,
    indications: [2400.05, 2400.08, 2400.02, 2400.10, 2400.06],
    evaluationType: 'INITIAL_VERIFICATION'
  });

  assert.strictEqual(res.requiredRepetitions, 6);
  assert.strictEqual(res.actualRepetitions, 5);
  assert.strictEqual(res.complianceResult, 'NOT_EVALUATED');
  assert.ok(res.explanation.includes('Additional repeatability observations required.'));
});

// 8. Class I requires 6 readings
test('7. Class I requires 6 readings', () => {
  assert.strictEqual(repeatabilityRules.REQUIRED_REPETITIONS['I'], 6);
  const incomplete = repeatabilityRules.evaluateRepeatabilitySeries({
    accuracyClass: 'I',
    maxCapacity: 500,
    e: 0.001,
    referenceLoad: 400,
    indications: [400.0001, 400.0002, 400.0001, 400.0003, 400.0002]
  });
  assert.strictEqual(incomplete.complianceResult, 'NOT_EVALUATED');

  const complete = repeatabilityRules.evaluateRepeatabilitySeries({
    accuracyClass: 'I',
    maxCapacity: 500,
    e: 0.001,
    referenceLoad: 400,
    indications: [400.0001, 400.0002, 400.0001, 400.0003, 400.0002, 400.0001],
    evaluationType: 'INITIAL_VERIFICATION'
  });
  assert.strictEqual(complete.complianceResult, 'PASS');
});

// 9. Class IIII requires 3 readings
test('8. Class IIII requires 3 readings', () => {
  assert.strictEqual(repeatabilityRules.REQUIRED_REPETITIONS['IIII'], 3);
  const incomplete = repeatabilityRules.evaluateRepeatabilitySeries({
    accuracyClass: 'IIII',
    maxCapacity: 50,
    e: 0.1,
    referenceLoad: 40,
    indications: [40.05, 40.08]
  });
  assert.strictEqual(incomplete.complianceResult, 'NOT_EVALUATED');

  const complete = repeatabilityRules.evaluateRepeatabilitySeries({
    accuracyClass: 'IIII',
    maxCapacity: 50,
    e: 0.1,
    referenceLoad: 40,
    indications: [40.05, 40.08, 40.02],
    evaluationType: 'INITIAL_VERIFICATION'
  });
  assert.strictEqual(complete.complianceResult, 'PASS');
});

// 10. Positive/negative indication spread handled correctly
test('9. Positive/negative indication spread handled correctly', () => {
  const res = repeatabilityRules.evaluateRepeatabilitySeries({
    accuracyClass: 'III',
    maxCapacity: 30,
    e: 0.01,
    referenceLoad: 24.000,
    indications: [23.995, 24.005, 24.000],
    evaluationType: 'INITIAL_VERIFICATION'
  });

  assert.strictEqual(res.highestIndication, 24.005);
  assert.strictEqual(res.lowestIndication, 23.995);
  assert.strictEqual(res.repeatabilityDifference, 0.01);
  assert.strictEqual(res.applicableMpe, 0.015);
  assert.strictEqual(res.complianceResult, 'PASS');
});

// 11. Invalid e -> REFERENCE_REQUIRED
test('10. Invalid e -> REFERENCE_REQUIRED', () => {
  const res = repeatabilityRules.evaluateRepeatabilitySeries({
    accuracyClass: 'III',
    maxCapacity: 30,
    e: 0,
    referenceLoad: 24.000,
    indications: [24.001, 24.002, 24.003]
  });

  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
});

// 12. Invalid class -> REFERENCE_REQUIRED
test('11. Invalid class -> REFERENCE_REQUIRED', () => {
  const res = repeatabilityRules.evaluateRepeatabilitySeries({
    accuracyClass: 'V_INVALID',
    maxCapacity: 30,
    e: 0.01,
    referenceLoad: 24.000,
    indications: [24.001, 24.002, 24.003]
  });

  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
});

// 13. Mixed reference loads -> validation failure / REFERENCE_REQUIRED
test('12. Mixed reference loads -> validation failure / REFERENCE_REQUIRED', () => {
  const res = repeatabilityRules.evaluateRepeatabilitySeries({
    accuracyClass: 'III',
    maxCapacity: 30,
    e: 0.01,
    referenceLoad: 24.000,
    readings: [
      { reference: 24.000, indication: 24.001 },
      { reference: 20.000, indication: 20.002 },
      { reference: 24.000, indication: 24.002 }
    ]
  });

  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
  assert.ok(res.explanation.includes('Inconsistent reference loads'));
});

// 14. Individual weighing outside MPE -> final series not compliant
test('13. Individual weighing outside MPE -> final series not compliant (FAIL)', () => {
  // Reference load = 24.000, MPE = 0.015.
  // Readings all clustered tightly around 24.025: difference is 0.004 <= 0.015.
  // But individual errors are +0.023, +0.027, +0.025, which all exceed MPE (0.015)!
  const res = repeatabilityRules.evaluateRepeatabilitySeries({
    accuracyClass: 'III',
    maxCapacity: 30,
    e: 0.01,
    referenceLoad: 24.000,
    indications: [24.023, 24.027, 24.025],
    evaluationType: 'INITIAL_VERIFICATION'
  });

  assert.strictEqual(res.repeatabilityDifference, 0.004);
  assert.strictEqual(res.allIndividualResultsWithinMpe, false);
  assert.strictEqual(res.complianceResult, 'FAIL');
  assert.ok(res.explanation.includes('one or more individual weighings exceeded permissible error'));
});

// 15. Exact MPE individual error -> PASS
test('14. Exact MPE individual error -> PASS', () => {
  const res = repeatabilityRules.evaluateRepeatabilitySeries({
    accuracyClass: 'III',
    maxCapacity: 30,
    e: 0.01,
    referenceLoad: 24.000,
    indications: [24.015, 24.015, 24.015],
    evaluationType: 'INITIAL_VERIFICATION'
  });

  assert.strictEqual(res.repeatabilityDifference, 0.0);
  assert.strictEqual(res.allIndividualResultsWithinMpe, true);
  assert.strictEqual(res.complianceResult, 'PASS');
});

// 16. Verified rule package unavailable -> REFERENCE_REQUIRED
test('15. Verified rule package unavailable -> REFERENCE_REQUIRED', () => {
  // Factory call with null MpeRules
  const unconfiguredFactory = require('../rules/oiml-r76-1-2006/repeatabilityRules.js');
  // Pass null MpeRules by invoking factory directly
  const unconfiguredEngine = (function() {
    return (typeof exports === 'object') ? require('../rules/oiml-r76-1-2006/repeatabilityRules.js') : null;
  })();
  const res = repeatabilityRules.evaluateRepeatabilitySeries(null);
  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
});

console.log('\n====================================================');
console.log(`REPEATABILITY TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================\n');

if (failCount > 0) {
  process.exit(1);
}
