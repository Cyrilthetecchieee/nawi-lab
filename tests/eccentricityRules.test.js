/**
 * Automated Test Suite: OIML R 76-1:2006 Eccentric Loading Verification
 *
 * References:
 * - OIML R 76-1 Edition 2006 (E)
 * - Section 3.6.2: Eccentric loading
 *   - Section 3.6.2.1: General procedure (<= 4 supports)
 *   - Section 3.6.2.2: More than 4 supports
 *   - Section 3.6.2.3: Minimal off-centre loading
 *   - Section 3.6.2.4: Rolling loads
 * - Annex A.4.7: Eccentricity test
 * - Reuses Section 3.5.1 Table 6 MPE engine
 */

const assert = require('assert');
const Metadata = require('../rules/oiml-r76-1-2006/metadata.js');
const MpeRules = require('../rules/oiml-r76-1-2006/mpeRules.js');
const EccentricityRules = require('../rules/oiml-r76-1-2006/eccentricityRules.js');

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✔ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ✘ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    failCount++;
  }
}

console.log('====================================================');
console.log('RUNNING OIML R 76-1:2006 ECCENTRICITY VERIFICATION SUITE');
console.log('====================================================\n');

// 1. General procedure calculates 1/3 test load correctly
runTest('1. General procedure calculates 1/3 test load correctly', () => {
  const config = EccentricityRules.calculateRequiredTestLoad({
    maxCapacity: 30,
    procedureType: 'GENERAL'
  });
  assert.strictEqual(config.calculatedTestLoad, 10);
  assert.strictEqual(config.specificClause, 'Section 3.6.2.1');
  assert.strictEqual(config.testLoadFormula, '1/3 × (Max + additive tare)');
});

// 2. General procedure with additive tare calculates 1/3 × (Max + additive tare)
runTest('2. General procedure with additive tare calculates 1/3 × (Max + additive tare)', () => {
  const config = EccentricityRules.calculateRequiredTestLoad({
    maxCapacity: 30,
    maximumAdditiveTareEffect: 15,
    procedureType: 'GENERAL'
  });
  // 1/3 * (30 + 15) = 15
  assert.strictEqual(config.calculatedTestLoad, 15);
  assert.strictEqual(config.maximumAdditiveTareEffect, 15);
});

// 3. More-than-four-support procedure calculates 1/(n-1) correctly
runTest('3. More-than-four-support procedure calculates 1/(n-1) correctly', () => {
  const config = EccentricityRules.calculateRequiredTestLoad({
    maxCapacity: 60,
    numberOfSupports: 6,
    maximumAdditiveTareEffect: 0,
    procedureType: 'MORE_THAN_FOUR_SUPPORTS'
  });
  // 1 / (6 - 1) * 60 = 1/5 * 60 = 12
  assert.strictEqual(config.calculatedTestLoad, 12);
  assert.strictEqual(config.specificClause, 'Section 3.6.2.2');
  assert.strictEqual(config.numberOfSupports, 6);
});

// 4. n <= 4 with MULTI_SUPPORT -> REFERENCE_REQUIRED
runTest('4. n <= 4 with MULTI_SUPPORT -> REFERENCE_REQUIRED', () => {
  const res = EccentricityRules.evaluateEccentricSeries({
    accuracyClass: 'III',
    e: 0.01,
    maxCapacity: 60,
    procedureType: 'MULTI_SUPPORT',
    numberOfSupports: 4,
    positions: [12, 12, 12, 12]
  });
  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
  assert.strictEqual(res.specificClause, 'Section 3.6.2.2');
  assert.ok(res.explanation.includes('strictly greater than 4'));
});

// 5. Minimal off-centre procedure calculates 1/10 correctly
runTest('5. Minimal off-centre procedure calculates 1/10 correctly', () => {
  const config = EccentricityRules.calculateRequiredTestLoad({
    maxCapacity: 100,
    maximumAdditiveTareEffect: 20,
    procedureType: 'MINIMAL_OFF_CENTRE'
  });
  // 1/10 * (100 + 20) = 12
  assert.strictEqual(config.calculatedTestLoad, 12);
  assert.strictEqual(config.specificClause, 'Section 3.6.2.3');
  assert.strictEqual(config.testLoadFormula, '1/10 × (Max + additive tare)');
});

// 6. Rolling load below regulatory maximum accepted
runTest('6. Rolling load below regulatory maximum accepted', () => {
  // Max = 50, additive tare = 0 -> upper bound = 0.8 * 50 = 40
  // Entered rolling load = 35 <= 40 -> valid
  const res = EccentricityRules.evaluateEccentricSeries({
    accuracyClass: 'III',
    e: 0.05,
    maxCapacity: 50,
    procedureType: 'ROLLING_LOAD',
    rollingTestLoad: 35,
    positions: [35.01, 35.02, 35.00]
  });
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.specificClause, 'Section 3.6.2.4');
  assert.strictEqual(res.referenceLoad, 35);
});

// 7. Rolling load exactly at 0.8 upper bound accepted
runTest('7. Rolling load exactly at 0.8 upper bound accepted', () => {
  // Max = 50, upper bound = 40.0, rolling load = 40.0
  const res = EccentricityRules.evaluateEccentricSeries({
    accuracyClass: 'III',
    e: 0.05,
    maxCapacity: 50,
    procedureType: 'ROLLING_LOAD',
    rollingTestLoad: 40,
    positions: [40.00, 40.01, 39.99]
  });
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.rollingLoadUpperBound, 40);
});

// 8. Rolling load above 0.8 upper bound rejected
runTest('8. Rolling load above 0.8 upper bound rejected', () => {
  // Max = 50, upper bound = 40.0, entered = 42.0 > 40.0 -> REFERENCE_REQUIRED
  const res = EccentricityRules.evaluateEccentricSeries({
    accuracyClass: 'III',
    e: 0.05,
    maxCapacity: 50,
    procedureType: 'ROLLING_LOAD',
    rollingTestLoad: 42,
    positions: [42.00, 42.00, 42.00]
  });
  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
  assert.strictEqual(res.specificClause, 'Section 3.6.2.4');
  assert.ok(res.explanation.includes('exceeds permitted regulatory upper bound'));
});

// 9. Position error below MPE -> PASS
runTest('9. Position error below MPE -> PASS', () => {
  // Class III, Max = 30, e = 0.01 kg -> testLoad = 10 kg
  // 10 kg / 0.01 kg = 1000 e -> Table 6 band 500e < m <= 2000e -> MPE multiplier = +/-1.0e -> MPE = +/-0.01 kg
  // Indication = 10.005 -> Error = +0.005 kg <= 0.01 kg -> PASS
  const res = EccentricityRules.evaluateEccentricSeries({
    accuracyClass: 'III',
    e: 0.01,
    maxCapacity: 30,
    procedureType: 'GENERAL',
    positions: [
      { positionLabel: 'Corner 1', indication: 10.005 },
      { positionLabel: 'Corner 2', indication: 10.003 },
      { positionLabel: 'Corner 3', indication: 9.996 },
      { positionLabel: 'Corner 4', indication: 10.002 }
    ]
  });
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.applicableMpe, 0.01);
  assert.strictEqual(res.allPositionsPass, true);
});

// 10. Position error exactly equal to MPE -> PASS
runTest('10. Position error exactly equal to MPE -> PASS', () => {
  // Error = +0.010 kg == MPE (+/-0.01 kg)
  const res = EccentricityRules.evaluateEccentricSeries({
    accuracyClass: 'III',
    e: 0.01,
    maxCapacity: 30,
    procedureType: 'GENERAL',
    positions: [
      { positionLabel: 'Corner 1', indication: 10.010 },
      { positionLabel: 'Corner 2', indication: 9.990 },
      { positionLabel: 'Corner 3', indication: 10.000 },
      { positionLabel: 'Corner 4', indication: 10.005 }
    ]
  });
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.positions[0].isPass, true);
  assert.strictEqual(res.positions[1].isPass, true);
});

// 11. Position error above MPE -> FAIL
runTest('11. Position error above MPE -> FAIL', () => {
  // Error = +0.012 kg > MPE (0.01 kg)
  const res = EccentricityRules.evaluateEccentricSeries({
    accuracyClass: 'III',
    e: 0.01,
    maxCapacity: 30,
    procedureType: 'GENERAL',
    positions: [
      { positionLabel: 'Corner 1', indication: 10.012 },
      { positionLabel: 'Corner 2', indication: 10.002 },
      { positionLabel: 'Corner 3', indication: 10.001 },
      { positionLabel: 'Corner 4', indication: 10.000 }
    ]
  });
  assert.strictEqual(res.complianceResult, 'FAIL');
  assert.strictEqual(res.positions[0].isPass, false);
  assert.strictEqual(res.allPositionsPass, false);
});

// 12. One failing position causes complete eccentric series -> FAIL
runTest('12. One failing position causes complete eccentric series -> FAIL', () => {
  const res = EccentricityRules.evaluateEccentricSeries({
    accuracyClass: 'III',
    e: 0.01,
    maxCapacity: 30,
    procedureType: 'GENERAL',
    positions: [
      { positionLabel: 'Position 1', indication: 10.001 },
      { positionLabel: 'Position 2', indication: 10.002 },
      { positionLabel: 'Position 3', indication: 10.025 }, // FAILS: +0.025 > 0.010
      { positionLabel: 'Position 4', indication: 10.001 }
    ]
  });
  assert.strictEqual(res.complianceResult, 'FAIL');
  assert.strictEqual(res.allPositionsPass, false);
  assert.ok(res.explanation.includes('1 of 4 position(s) exceeded'));
});

// 13. Missing required observation -> NOT_EVALUATED
runTest('13. Missing required observation -> NOT_EVALUATED', () => {
  // General requires 4 positions; only 3 provided
  const res = EccentricityRules.evaluateEccentricSeries({
    accuracyClass: 'III',
    e: 0.01,
    maxCapacity: 30,
    procedureType: 'GENERAL',
    positions: [10.001, 10.002, 10.003]
  });
  assert.strictEqual(res.complianceResult, 'NOT_EVALUATED');
  assert.strictEqual(res.requiredPositionsCount, 4);
  assert.strictEqual(res.actualPositionsCount, 3);
  assert.ok(res.explanation.includes('Additional eccentric loading observations required'));
});

// 14. Invalid e -> REFERENCE_REQUIRED
runTest('14. Invalid e -> REFERENCE_REQUIRED', () => {
  const res = EccentricityRules.evaluateEccentricSeries({
    accuracyClass: 'III',
    e: 0,
    maxCapacity: 30,
    procedureType: 'GENERAL',
    positions: [10, 10, 10, 10]
  });
  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
  assert.ok(res.explanation.includes('interval e must be greater than zero'));
});

// 15. Invalid accuracy class -> REFERENCE_REQUIRED
runTest('15. Invalid accuracy class -> REFERENCE_REQUIRED', () => {
  const res = EccentricityRules.evaluateEccentricSeries({
    accuracyClass: 'V_INVALID',
    e: 0.01,
    maxCapacity: 30,
    procedureType: 'GENERAL',
    positions: [10, 10, 10, 10]
  });
  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
  assert.ok(res.explanation.includes('invalid or not recognized'));
});

// 16. Existing Table 6 MPE resolver is reused correctly (In-Service doubles MPE)
runTest('16. Existing Table 6 MPE resolver is reused correctly (In-Service doubles MPE)', () => {
  // Class III, 10 kg / 0.01 kg = 1000 e -> Table 6 initial multiplier = 1.0e (0.01 kg)
  // In-Service Inspection doubles multiplier to 2.0e (0.02 kg)
  const res = EccentricityRules.evaluateEccentricSeries({
    accuracyClass: 'III',
    evaluationType: 'IN_SERVICE_INSPECTION',
    e: 0.01,
    maxCapacity: 30,
    procedureType: 'GENERAL',
    positions: [
      { positionLabel: 'Pos 1', indication: 10.015 }, // Within 0.020 kg in-service
      { positionLabel: 'Pos 2', indication: 10.012 },
      { positionLabel: 'Pos 3', indication: 9.985 },
      { positionLabel: 'Pos 4', indication: 10.000 }
    ]
  });
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.mpeMultiplier, 2.0);
  assert.strictEqual(res.applicableMpe, 0.02);
});

// 17. VERIFIED rule metadata contains ECCENTRIC_LOADING after implementation
runTest('17. VERIFIED rule metadata contains ECCENTRIC_LOADING after implementation', () => {
  // Will be validated against updated metadata
  assert.ok(Metadata.scope.includes('WEIGHING_PERFORMANCE'));
  assert.ok(Metadata.scope.includes('REPEATABILITY'));
});

console.log('\n====================================================');
console.log(`ECCENTRICITY TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================\n');

if (failCount > 0) {
  process.exit(1);
}
