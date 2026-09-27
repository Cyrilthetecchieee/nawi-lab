/**
 * Automated Test Suite: OIML R 76-1:2006 Zero Return Verification
 *
 * References:
 * - Section 3.9.4:    Time
 * - Section 3.9.4.2:  Zero return
 * - Annex A.4.11:     Variation of indication with time
 * - Annex A.4.11.2:   Zero return test
 *
 * 33 tests required per specification.
 */

const assert = require('assert');
const Metadata = require('../rules/oiml-r76-1-2006/metadata.js');
const ZeroReturnRules = require('../rules/oiml-r76-1-2006/zeroReturnRules.js');

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log('  ✔ PASS: ' + name);
    passCount++;
  } catch (err) {
    console.error('  ✘ FAIL: ' + name);
    console.error('    ' + err.message);
    failCount++;
  }
}

console.log('====================================================');
console.log('RUNNING OIML R 76-1:2006 ZERO RETURN VERIFICATION SUITE');
console.log('====================================================\n');

// Standard baseline parameters for Class III instrument
const baseParamsClassIII = {
  accuracyClass: 'III',
  appliedLoad: 50,
  maxCapacity: 60,
  loadingDurationMinutes: 30,
  initialZeroIndication: 0.000,
  returnedZeroIndication: 0.002,
  e: 0.01,
  unit: 'kg',
  hasAutomaticZeroSetting: false,
  hasZeroTracking: false
};

// 1. Class III single interval below 0.5e → PASS
runTest('1. Class III single interval below 0.5e → PASS', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    initialZeroIndication: 0.000,
    returnedZeroIndication: 0.002, // deviation = 0.002 <= 0.005 (0.5e)
    e: 0.01
  });
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.standardEvaluation.result, 'PASS');
});

// 2. Class II below 0.5e → PASS
runTest('2. Class II below 0.5e → PASS', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    accuracyClass: 'II',
    e: 0.001,
    initialZeroIndication: 0.0000,
    returnedZeroIndication: 0.0002 // deviation = 0.0002 <= 0.0005 (0.5e)
  });
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.accuracyClass, 'II');
});

// 3. Class IIII below 0.5e → PASS
runTest('3. Class IIII below 0.5e → PASS', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    accuracyClass: 'IIII',
    e: 0.1,
    initialZeroIndication: 0.0,
    returnedZeroIndication: 0.02 // deviation = 0.02 <= 0.05 (0.5e)
  });
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.accuracyClass, 'IIII');
});

// 4. Class I → NOT_APPLICABLE
runTest('4. Class I → NOT_APPLICABLE', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    accuracyClass: 'I',
    e: 0.001
  });
  assert.strictEqual(res.complianceResult, 'NOT_APPLICABLE');
  assert.strictEqual(res.accuracyClass, 'I');
});

// 5. exact +0.5e → PASS
runTest('5. exact +0.5e → PASS', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    initialZeroIndication: 0.000,
    returnedZeroIndication: 0.005, // deviation = +0.005 = 0.5e
    e: 0.01
  });
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.zeroReturnDeviation, 0.005);
});

// 6. exact -0.5e → PASS
runTest('6. exact -0.5e → PASS', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    initialZeroIndication: 0.005,
    returnedZeroIndication: 0.000, // deviation = -0.005, |dev| = 0.005 = 0.5e
    e: 0.01
  });
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.zeroReturnDeviation, -0.005);
  assert.strictEqual(res.absoluteZeroReturnDeviation, 0.005);
});

// 7. above +0.5e → FAIL
runTest('7. above +0.5e → FAIL', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    initialZeroIndication: 0.000,
    returnedZeroIndication: 0.006, // deviation = +0.006 > 0.005
    e: 0.01
  });
  assert.strictEqual(res.complianceResult, 'FAIL');
  assert.strictEqual(res.standardEvaluation.result, 'FAIL');
});

// 8. below -0.5e magnitude → FAIL
runTest('8. below -0.5e magnitude → FAIL', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    initialZeroIndication: 0.006,
    returnedZeroIndication: 0.000, // deviation = -0.006, |dev| = 0.006 > 0.005
    e: 0.01
  });
  assert.strictEqual(res.complianceResult, 'FAIL');
  assert.strictEqual(res.standardEvaluation.result, 'FAIL');
});

// 9. signed deviation preserved
runTest('9. signed deviation preserved', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    initialZeroIndication: 0.003,
    returnedZeroIndication: 0.001, // 0.001 - 0.003 = -0.002
    e: 0.01
  });
  assert.strictEqual(res.zeroReturnDeviation, -0.002);
});

// 10. absolute deviation comparison correct
runTest('10. absolute deviation comparison correct', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    initialZeroIndication: 0.004,
    returnedZeroIndication: 0.001,
    e: 0.01
  });
  assert.strictEqual(res.zeroReturnDeviation, -0.003);
  assert.strictEqual(res.absoluteZeroReturnDeviation, 0.003);
  assert.strictEqual(res.standardEvaluation.allowedDeviation, 0.005);
  assert.strictEqual(res.complianceResult, 'PASS');
});

// 11. multi-interval uses e1
runTest('11. multi-interval uses e1', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    isMultiInterval: true,
    e: 0.01,
    e1: 0.002, // 0.5 * e1 = 0.001
    initialZeroIndication: 0.000,
    returnedZeroIndication: 0.0008
  });
  assert.strictEqual(res.standardEvaluation.intervalUsed, 0.002);
  assert.strictEqual(res.standardEvaluation.allowedDeviation, 0.001);
  assert.strictEqual(res.complianceResult, 'PASS');
});

// 12. multi-interval exact 0.5e1 → PASS
runTest('12. multi-interval exact 0.5e1 → PASS', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    isMultiInterval: true,
    e: 0.01,
    e1: 0.002,
    initialZeroIndication: 0.000,
    returnedZeroIndication: 0.001 // exact 0.5 * 0.002 = 0.001
  });
  assert.strictEqual(res.complianceResult, 'PASS');
  assert.strictEqual(res.absoluteZeroReturnDeviation, 0.001);
});

// 13. multi-interval above 0.5e1 → FAIL
runTest('13. multi-interval above 0.5e1 → FAIL', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    isMultiInterval: true,
    e: 0.01,
    e1: 0.002,
    initialZeroIndication: 0.000,
    returnedZeroIndication: 0.0015 // > 0.001
  });
  assert.strictEqual(res.complianceResult, 'FAIL');
});

// 14. missing e1 → REFERENCE_REQUIRED
runTest('14. missing e1 → REFERENCE_REQUIRED', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    isMultiInterval: true,
    e: 0.01,
    e1: null
  });
  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
  assert.ok(res.explanation.includes('e1'));
});

// 15. multiple-range uses applicable e_i
runTest('15. multiple-range uses applicable e_i', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    isMultipleRange: true,
    ranges: [
      { rangeId: 1, Max_i: 10, e_i: 0.002 },
      { rangeId: 2, Max_i: 30, e_i: 0.010 }
    ],
    activeRange: 2,
    appliedLoad: 10, // <= Max1 so follow-up is not triggered
    initialZeroIndication: 0.000,
    returnedZeroIndication: 0.004 // 0.004 <= 0.5 * 0.010 = 0.005
  });
  assert.strictEqual(res.standardEvaluation.intervalUsed, 0.010);
  assert.strictEqual(res.standardEvaluation.allowedDeviation, 0.005);
  assert.strictEqual(res.complianceResult, 'PASS');
});

// 16. multiple-range exact 0.5e_i → PASS
runTest('16. multiple-range exact 0.5e_i → PASS', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    isMultipleRange: true,
    ranges: [
      { rangeId: 1, Max_i: 10, e_i: 0.002 },
      { rangeId: 2, Max_i: 30, e_i: 0.010 }
    ],
    activeRange: 2,
    appliedLoad: 10,
    initialZeroIndication: 0.000,
    returnedZeroIndication: 0.005 // exact 0.005 = 0.5 * 0.010
  });
  assert.strictEqual(res.complianceResult, 'PASS');
});

// 17. applied load > Max1 triggers 5-minute follow-up
runTest('17. applied load > Max1 triggers 5-minute follow-up', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    isMultipleRange: true,
    ranges: [
      { rangeId: 1, Max_i: 10, e_i: 0.002 },
      { rangeId: 2, Max_i: 30, e_i: 0.010 }
    ],
    activeRange: 2,
    appliedLoad: 25, // > Max1 (10)
    initialZeroIndication: 0.000,
    returnedZeroIndication: 0.003,
    lowestRangeFollowUpObservations: [
      { time: 0, nearZeroIndication: 0.001 },
      { time: 5, nearZeroIndication: 0.002 }
    ]
  });
  assert.strictEqual(res.multipleRangeFollowUp.applicable, true);
});

// 18. follow-up variation below e1 → PASS
runTest('18. follow-up variation below e1 → PASS', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    isMultipleRange: true,
    ranges: [
      { rangeId: 1, Max_i: 10, e_i: 0.002 },
      { rangeId: 2, Max_i: 30, e_i: 0.010 }
    ],
    activeRange: 2,
    appliedLoad: 25,
    initialZeroIndication: 0.000,
    returnedZeroIndication: 0.003,
    lowestRangeFollowUpObservations: [
      { time: 0, nearZeroIndication: 0.0010 },
      { time: 2, nearZeroIndication: 0.0015 },
      { time: 5, nearZeroIndication: 0.0020 } // variation = 0.0020 - 0.0010 = 0.0010 <= 0.002
    ]
  });
  assert.strictEqual(res.multipleRangeFollowUp.result, 'PASS');
  assert.strictEqual(res.complianceResult, 'PASS');
});

// 19. follow-up variation exactly e1 → PASS
runTest('19. follow-up variation exactly e1 → PASS', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    isMultipleRange: true,
    ranges: [
      { rangeId: 1, Max_i: 10, e_i: 0.002 },
      { rangeId: 2, Max_i: 30, e_i: 0.010 }
    ],
    activeRange: 2,
    appliedLoad: 25,
    initialZeroIndication: 0.000,
    returnedZeroIndication: 0.003,
    lowestRangeFollowUpObservations: [
      { time: 0, nearZeroIndication: 0.000 },
      { time: 5, nearZeroIndication: 0.002 } // variation = 0.002 = e1
    ]
  });
  assert.strictEqual(res.multipleRangeFollowUp.result, 'PASS');
  assert.strictEqual(res.complianceResult, 'PASS');
});

// 20. follow-up variation above e1 → FAIL
runTest('20. follow-up variation above e1 → FAIL', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    isMultipleRange: true,
    ranges: [
      { rangeId: 1, Max_i: 10, e_i: 0.002 },
      { rangeId: 2, Max_i: 30, e_i: 0.010 }
    ],
    activeRange: 2,
    appliedLoad: 25,
    initialZeroIndication: 0.000,
    returnedZeroIndication: 0.003,
    lowestRangeFollowUpObservations: [
      { time: 0, nearZeroIndication: 0.000 },
      { time: 5, nearZeroIndication: 0.0025 } // variation = 0.0025 > 0.002
    ]
  });
  assert.strictEqual(res.multipleRangeFollowUp.result, 'FAIL');
  assert.strictEqual(res.complianceResult, 'FAIL');
});

// 21. incomplete follow-up → NOT_EVALUATED
runTest('21. incomplete follow-up → NOT_EVALUATED', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    isMultipleRange: true,
    ranges: [
      { rangeId: 1, Max_i: 10, e_i: 0.002 },
      { rangeId: 2, Max_i: 30, e_i: 0.010 }
    ],
    activeRange: 2,
    appliedLoad: 25,
    initialZeroIndication: 0.000,
    returnedZeroIndication: 0.003,
    lowestRangeFollowUpObservations: [
      { time: 0, nearZeroIndication: 0.001 } // only 1 reading
    ]
  });
  assert.strictEqual(res.multipleRangeFollowUp.result, 'NOT_EVALUATED');
  assert.strictEqual(res.complianceResult, 'NOT_EVALUATED');
});

// 22. load <= Max1 does not require additional follow-up
runTest('22. load <= Max1 does not require additional follow-up', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    isMultipleRange: true,
    ranges: [
      { rangeId: 1, Max_i: 10, e_i: 0.002 },
      { rangeId: 2, Max_i: 30, e_i: 0.010 }
    ],
    activeRange: 1,
    appliedLoad: 8, // <= 10
    initialZeroIndication: 0.000,
    returnedZeroIndication: 0.0008
  });
  assert.strictEqual(res.multipleRangeFollowUp.applicable, false);
  assert.strictEqual(res.complianceResult, 'PASS');
});

// 23. loading duration exactly 30 min accepted
runTest('23. loading duration exactly 30 min accepted', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    loadingDurationMinutes: 30
  });
  assert.strictEqual(res.complianceResult, 'PASS');
});

// 24. loading duration below 30 min → NOT_EVALUATED
runTest('24. loading duration below 30 min → NOT_EVALUATED', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    loadingDurationMinutes: 29.9
  });
  assert.strictEqual(res.complianceResult, 'NOT_EVALUATED');
  assert.ok(res.explanation.includes('30 minutes'));
});

// 25. missing initial zero → NOT_EVALUATED
runTest('25. missing initial zero → NOT_EVALUATED', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    initialZeroIndication: null
  });
  assert.strictEqual(res.complianceResult, 'NOT_EVALUATED');
  assert.ok(res.explanation.includes('Initial zero') || res.explanation.includes('initial zero'));
});

// 26. missing returned zero → NOT_EVALUATED
runTest('26. missing returned zero → NOT_EVALUATED', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    returnedZeroIndication: null
  });
  assert.strictEqual(res.complianceResult, 'NOT_EVALUATED');
  assert.ok(res.explanation.includes('Returned zero') || res.explanation.includes('returned zero') || res.explanation.includes('load removal'));
});

// 27. automatic zero active during test → NOT_EVALUATED
runTest('27. automatic zero active during test → NOT_EVALUATED', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    hasAutomaticZeroSetting: true,
    automaticZeroDisabledDuringTest: false // active!
  });
  assert.strictEqual(res.complianceResult, 'NOT_EVALUATED');
  assert.ok(res.explanation.includes('Automatic zero-setting'));
});

// 28. zero tracking active during test → NOT_EVALUATED
runTest('28. zero tracking active during test → NOT_EVALUATED', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    hasZeroTracking: true,
    zeroTrackingDisabledDuringTest: false // active!
  });
  assert.strictEqual(res.complianceResult, 'NOT_EVALUATED');
  assert.ok(res.explanation.includes('Zero-tracking'));
});

// 29. invalid e → REFERENCE_REQUIRED
runTest('29. invalid e → REFERENCE_REQUIRED', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    e: 0
  });
  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
});

// 30. invalid accuracy class → REFERENCE_REQUIRED
runTest('30. invalid accuracy class → REFERENCE_REQUIRED', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    accuracyClass: 'V'
  });
  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
});

// 31. ambiguous multiple range → REFERENCE_REQUIRED
runTest('31. ambiguous multiple range → REFERENCE_REQUIRED', () => {
  const res = ZeroReturnRules.evaluateZeroReturn({
    ...baseParamsClassIII,
    isMultipleRange: true,
    ranges: [],
    activeRange: null
  });
  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
});

// 32. rule package unavailable → REFERENCE_REQUIRED
runTest('32. rule package unavailable → REFERENCE_REQUIRED', () => {
  const res = ZeroReturnRules.evaluateZeroReturn(null);
  assert.strictEqual(res.complianceResult, 'REFERENCE_REQUIRED');
});

// 33. metadata includes ZERO_RETURN after implementation
runTest('33. metadata includes ZERO_RETURN after implementation', () => {
  assert.ok(Metadata.scope.includes('ZERO_RETURN'), 'Metadata.scope should include ZERO_RETURN');
  assert.ok(Metadata.clauses.zeroReturn, 'Metadata.clauses.zeroReturn should be defined');
});

console.log('\n====================================================');
console.log(`ZERO RETURN TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================\n');

if (failCount > 0) {
  process.exit(1);
}
