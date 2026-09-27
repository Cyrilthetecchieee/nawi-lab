/**
 * OIML R 76-1:2006 Zero-Return Rules Engine
 * Normative Implementation for ZERO_RETURN
 *
 * References (OIML R 76-1 Edition 2006 (E)):
 * - Section 3.9.4:    Time
 * - Section 3.9.4.2:  Zero return
 * - Annex A.4.11:     Variation of indication with time
 * - Annex A.4.11.2:   Zero return test
 *
 * Applicable classes: Class II, Class III, Class IIII
 * Class I: NOT_APPLICABLE under this verified implementation
 *
 * Single interval:
 *   |zeroReturnDeviation| <= 0.5e
 *
 * Multi-interval:
 *   |zeroReturnDeviation| <= 0.5e1
 *
 * Multiple range:
 *   |zeroReturnDeviation| <= 0.5e_i (for return to zero from Max_i)
 *   Plus Section 3.9.4.2 5-minute lowest-range follow-up if applied load > Max1:
 *   Near-zero indication variation <= e1 during following 5 minutes.
 */
(function (root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    const metadata = (typeof require === 'function') ? require('./metadata.js') : null;
    module.exports = factory(metadata);
  } else {
    root.OimlR76ZeroReturnRules = factory(root.OimlR76Metadata);
  }
})(typeof self !== 'undefined' ? self : this, function (Metadata) {
  'use strict';

  const RULE_REFERENCE_BASE = 'OIML R 76-1:2006';
  const RULE_VERSION = (Metadata && Metadata.edition)
    ? ('OIML R 76-1:' + Metadata.edition)
    : 'OIML R 76-1:2006';

  const EPSILON = 1e-9;
  const APPLICABLE_CLASSES = ['II', 'III', 'IIII'];

  // ─────────────────────────────────────────────────────────────────────────
  // DECIMAL-SAFE ARITHMETIC
  // ─────────────────────────────────────────────────────────────────────────
  function getDecimals(n) {
    const s = String(n);
    const i = s.indexOf('.');
    return (i === -1) ? 0 : (s.length - i - 1);
  }

  function safeMultiply(a, b) {
    const decA = getDecimals(a);
    const decB = getDecimals(b);
    const decimals = decA + decB;
    const factor = Math.pow(10, decimals);
    return (Math.round(Number(a) * Math.pow(10, decA)) *
      Math.round(Number(b) * Math.pow(10, decB))) / factor;
  }

  function safeSubtract(a, b) {
    const decA = getDecimals(a);
    const decB = getDecimals(b);
    const maxDec = Math.max(decA, decB, 2);
    const factor = Math.pow(10, Math.min(maxDec, 8));
    const diff = (Math.round(Number(a) * factor) - Math.round(Number(b) * factor)) / factor;
    return Number(diff.toFixed(maxDec));
  }

  function safeRound(n, decimals) {
    if (typeof n !== 'number' || isNaN(n)) return n;
    const d = decimals !== undefined ? decimals : 4;
    return Number(n.toFixed(d));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BADGE HELPER
  // ─────────────────────────────────────────────────────────────────────────
  function badgeFor(state) {
    switch (state) {
      case 'PASS':           return '<span class="badge good">PASS</span>';
      case 'FAIL':           return '<span class="badge bad">FAIL</span>';
      case 'NOT_EVALUATED':  return '<span class="badge warn" style="background:#eaf0f2;color:#355361;">NOT EVALUATED</span>';
      case 'NOT_APPLICABLE': return '<span class="badge" style="background:#e8f0e8;color:#2d5c2d;">NOT APPLICABLE</span>';
      default:               return '<span class="badge warn">REFERENCE REQUIRED</span>';
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CORE EVALUATOR: evaluateZeroReturn
  // ─────────────────────────────────────────────────────────────────────────
  function evaluateZeroReturn(params) {
    const ruleRef = RULE_REFERENCE_BASE + ' Section 3.9.4.2 / Annex A.4.11.2';

    // 1. Parameter presence validation
    if (!params || typeof params !== 'object') {
      return _buildResult({
        testType: 'ZERO_RETURN',
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        explanation: 'Missing or invalid evaluation parameters object.'
      });
    }

    // 2. Class validation
    const rawClass = String(params.accuracyClass || '').trim().toUpperCase().replace(/^CLASS\s+/, '');
    if (!['I', 'II', 'III', 'IIII'].includes(rawClass)) {
      return _buildResult({
        testType: 'ZERO_RETURN',
        accuracyClass: params.accuracyClass || null,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        explanation: 'Invalid or missing accuracy class (' + (params.accuracyClass || 'none') + '). Class II, III, or IIII required per Section 3.9.4.'
      });
    }

    if (rawClass === 'I') {
      return _buildResult({
        testType: 'ZERO_RETURN',
        accuracyClass: 'I',
        appliedLoad: params.appliedLoad !== undefined ? Number(params.appliedLoad) : null,
        maxCapacity: params.maxCapacity !== undefined ? Number(params.maxCapacity) : (params.max !== undefined ? Number(params.max) : null),
        loadingDurationMinutes: params.loadingDurationMinutes !== undefined ? Number(params.loadingDurationMinutes) : null,
        initialZeroIndication: params.initialZeroIndication !== undefined ? Number(params.initialZeroIndication) : null,
        returnedZeroIndication: params.returnedZeroIndication !== undefined ? Number(params.returnedZeroIndication) : null,
        complianceResult: 'NOT_APPLICABLE',
        ruleReference: ruleRef,
        explanation: 'Section 3.9.4 Time requirements (including Section 3.9.4.2 Zero Return) apply only to Class II, Class III, and Class IIII instruments. Class I is NOT_APPLICABLE.'
      });
    }

    // Common fields
    const appliedLoad = (params.appliedLoad !== undefined && params.appliedLoad !== null && params.appliedLoad !== '')
      ? Number(params.appliedLoad)
      : null;
    const maxCapacity = (params.maxCapacity !== undefined && params.maxCapacity !== null && params.maxCapacity !== '')
      ? Number(params.maxCapacity)
      : ((params.max !== undefined && params.max !== null && params.max !== '') ? Number(params.max) : null);
    const unit = params.unit || 'kg';

    const isMultiInterval = !!params.isMultiInterval;
    const isMultipleRange = !!params.isMultipleRange;

    // Automatic zero configuration
    const hasAutoZero = !!params.hasAutomaticZeroSetting;
    const hasZeroTrack = !!params.hasZeroTracking;
    const autoZeroDisabled = !!params.automaticZeroDisabledDuringTest;
    const zeroTrackDisabled = !!params.zeroTrackingDisabledDuringTest;

    const automaticZeroConfig = {
      hasAutomaticZeroSetting: hasAutoZero,
      hasZeroTracking: hasZeroTrack,
      automaticZeroDisabledDuringTest: autoZeroDisabled,
      zeroTrackingDisabledDuringTest: zeroTrackDisabled
    };

    // 3. Verification Scale Interval validation
    const numE = (params.e !== undefined && params.e !== null && params.e !== '') ? Number(params.e) : null;
    if (numE === null || isNaN(numE) || numE <= 0) {
      return _buildResult({
        testType: 'ZERO_RETURN',
        accuracyClass: rawClass,
        appliedLoad,
        maxCapacity,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        explanation: 'Verification scale interval e must be a positive number.'
      });
    }

    // 4. Instrument configuration validation (Multi-interval / Multiple-range)
    let e1 = null;
    let activeRange = null;
    let ranges = null;
    let intervalUsed = numE;
    let intervalLabel = 'e';

    if (isMultiInterval) {
      e1 = (params.e1 !== undefined && params.e1 !== null && params.e1 !== '') ? Number(params.e1) : null;
      if (e1 === null || isNaN(e1) || e1 <= 0) {
        return _buildResult({
          testType: 'ZERO_RETURN',
          accuracyClass: rawClass,
          appliedLoad,
          maxCapacity,
          instrumentConfiguration: { isMultiInterval: true, isMultipleRange: false, e: numE, e1: null, activeRange: null },
          automaticZeroConfiguration: automaticZeroConfig,
          complianceResult: 'REFERENCE_REQUIRED',
          ruleReference: ruleRef,
          explanation: 'Multi-interval instrument requires valid e1 verification scale interval per Section 3.9.4.2.'
        });
      }
      intervalUsed = e1;
      intervalLabel = 'e1';
    } else if (isMultipleRange) {
      ranges = Array.isArray(params.ranges) ? params.ranges : null;
      e1 = (params.e1 !== undefined && params.e1 !== null && params.e1 !== '')
        ? Number(params.e1)
        : (ranges && ranges[0] && ranges[0].e_i !== undefined ? Number(ranges[0].e_i) : null);

      let Max1 = (params.Max1 !== undefined && params.Max1 !== null && params.Max1 !== '')
        ? Number(params.Max1)
        : (ranges && ranges[0] && ranges[0].Max_i !== undefined ? Number(ranges[0].Max_i) : null);

      activeRange = params.activeRange !== undefined && params.activeRange !== null ? params.activeRange : null;

      // Validate range configuration
      if (!ranges || ranges.length === 0) {
        // If no ranges array, check if direct activeRange and e_i provided
        if (params.e_i !== undefined && params.e_i !== null && Number(params.e_i) > 0 && activeRange !== null) {
          intervalUsed = Number(params.e_i);
          intervalLabel = 'e_' + activeRange;
        } else {
          return _buildResult({
            testType: 'ZERO_RETURN',
            accuracyClass: rawClass,
            appliedLoad,
            maxCapacity,
            instrumentConfiguration: { isMultiInterval: false, isMultipleRange: true, e: numE, e1, activeRange },
            automaticZeroConfiguration: automaticZeroConfig,
            complianceResult: 'REFERENCE_REQUIRED',
            ruleReference: ruleRef,
            explanation: 'Multiple-range configuration missing or ambiguous active range and intervals.'
          });
        }
      } else {
        // Find active range in ranges array
        let matchedRange = null;
        if (activeRange !== null && activeRange !== '') {
          matchedRange = ranges.find(r => String(r.rangeId) === String(activeRange) || String(r.rangeIndex) === String(activeRange) || r === activeRange);
        } else if (appliedLoad !== null) {
          // If activeRange not given, check if appliedLoad unambiguously determines range
          const possibleRanges = ranges.filter(r => Number(r.Max_i) >= appliedLoad);
          if (possibleRanges.length === 1) {
            matchedRange = possibleRanges[0];
            activeRange = matchedRange.rangeId || matchedRange.rangeIndex || 1;
          }
        }

        if (!matchedRange) {
          return _buildResult({
            testType: 'ZERO_RETURN',
            accuracyClass: rawClass,
            appliedLoad,
            maxCapacity,
            instrumentConfiguration: { isMultiInterval: false, isMultipleRange: true, e: numE, e1, activeRange, ranges },
            automaticZeroConfiguration: automaticZeroConfig,
            complianceResult: 'REFERENCE_REQUIRED',
            ruleReference: ruleRef,
            explanation: 'Ambiguous multiple-range active range. Cannot resolve active weighing range and e_i.'
          });
        }

        const e_i = Number(matchedRange.e_i);
        if (isNaN(e_i) || e_i <= 0) {
          return _buildResult({
            testType: 'ZERO_RETURN',
            accuracyClass: rawClass,
            appliedLoad,
            maxCapacity,
            instrumentConfiguration: { isMultiInterval: false, isMultipleRange: true, e: numE, e1, activeRange, ranges },
            automaticZeroConfiguration: automaticZeroConfig,
            complianceResult: 'REFERENCE_REQUIRED',
            ruleReference: ruleRef,
            explanation: 'Multiple-range active range has invalid verification scale interval e_i.'
          });
        }

        intervalUsed = e_i;
        intervalLabel = 'e_' + (matchedRange.rangeId || activeRange);
      }
    }

    const instrumentConfig = {
      isMultiInterval,
      isMultipleRange,
      e: numE,
      e1,
      activeRange,
      ranges
    };

    // 5. Loading duration validation (Required >= 30 minutes)
    const duration = (params.loadingDurationMinutes !== undefined && params.loadingDurationMinutes !== null && params.loadingDurationMinutes !== '')
      ? Number(params.loadingDurationMinutes)
      : null;

    if (duration === null || isNaN(duration) || duration < 30) {
      return _buildResult({
        testType: 'ZERO_RETURN',
        accuracyClass: rawClass,
        appliedLoad,
        maxCapacity,
        loadingDurationMinutes: duration,
        instrumentConfiguration: instrumentConfig,
        automaticZeroConfiguration: automaticZeroConfig,
        complianceResult: 'NOT_EVALUATED',
        ruleReference: ruleRef,
        explanation: 'Zero-return test requires the load to remain applied for 30 minutes.' +
          (duration !== null && !isNaN(duration) ? ' Observed duration was ' + duration + ' minutes.' : '')
      });
    }

    // 6. Automatic zero / zero tracking check during test
    if (hasAutoZero && !autoZeroDisabled) {
      return _buildResult({
        testType: 'ZERO_RETURN',
        accuracyClass: rawClass,
        appliedLoad,
        maxCapacity,
        loadingDurationMinutes: duration,
        instrumentConfiguration: instrumentConfig,
        automaticZeroConfiguration: automaticZeroConfig,
        complianceResult: 'NOT_EVALUATED',
        ruleReference: ruleRef,
        explanation: 'Annex A.4.11.2 requirement: Automatic zero-setting device must NOT be in operation during the zero-return test. Device was active during test.'
      });
    }

    if (hasZeroTrack && !zeroTrackDisabled) {
      return _buildResult({
        testType: 'ZERO_RETURN',
        accuracyClass: rawClass,
        appliedLoad,
        maxCapacity,
        loadingDurationMinutes: duration,
        instrumentConfiguration: instrumentConfig,
        automaticZeroConfiguration: automaticZeroConfig,
        complianceResult: 'NOT_EVALUATED',
        ruleReference: ruleRef,
        explanation: 'Annex A.4.11.2 requirement: Zero-tracking device must NOT be in operation during the zero-return test. Device was active during test.'
      });
    }

    // 7. Initial zero & returned zero observations validation
    const initProvided = params.initialZeroIndication !== undefined && params.initialZeroIndication !== null &&
      params.initialZeroIndication !== '' && !isNaN(Number(params.initialZeroIndication));
    const retProvided = params.returnedZeroIndication !== undefined && params.returnedZeroIndication !== null &&
      params.returnedZeroIndication !== '' && !isNaN(Number(params.returnedZeroIndication));

    if (!initProvided) {
      return _buildResult({
        testType: 'ZERO_RETURN',
        accuracyClass: rawClass,
        appliedLoad,
        maxCapacity,
        loadingDurationMinutes: duration,
        initialZeroIndication: null,
        returnedZeroIndication: retProvided ? Number(params.returnedZeroIndication) : null,
        instrumentConfiguration: instrumentConfig,
        automaticZeroConfiguration: automaticZeroConfig,
        complianceResult: 'NOT_EVALUATED',
        ruleReference: ruleRef,
        explanation: 'Missing initial zero indication before loading.'
      });
    }

    if (!retProvided) {
      return _buildResult({
        testType: 'ZERO_RETURN',
        accuracyClass: rawClass,
        appliedLoad,
        maxCapacity,
        loadingDurationMinutes: duration,
        initialZeroIndication: Number(params.initialZeroIndication),
        returnedZeroIndication: null,
        instrumentConfiguration: instrumentConfig,
        automaticZeroConfiguration: automaticZeroConfig,
        complianceResult: 'NOT_EVALUATED',
        ruleReference: ruleRef,
        explanation: 'Missing returned stabilized zero indication after load removal.'
      });
    }

    const initialZero = Number(params.initialZeroIndication);
    const returnedZero = Number(params.returnedZeroIndication);

    // 8. Standard zero-return calculation
    // zeroReturnDeviation = returnedZeroIndication - initialZeroIndication
    const zeroReturnDeviation = safeSubtract(returnedZero, initialZero);
    const absoluteZeroReturnDeviation = Math.abs(zeroReturnDeviation);
    const allowedDeviation = safeMultiply(0.5, intervalUsed);

    const standardPass = absoluteZeroReturnDeviation <= allowedDeviation + EPSILON;
    const standardResult = standardPass ? 'PASS' : 'FAIL';

    const standardEvaluation = {
      intervalUsed,
      intervalLabel,
      allowedDeviation,
      comparison: absoluteZeroReturnDeviation + ' ' + (standardPass ? '<=' : '>') + ' ' + allowedDeviation,
      result: standardResult
    };

    // 9. Multiple-range 5-minute lowest-range follow-up
    // Section 3.9.4.2:
    // "After returning to zero from any load greater than Max1 and immediately switching to the lowest weighing range,
    // the indication near zero must not vary by more than: e1 during the following: 5 minutes."
    let multipleRangeFollowUp = {
      applicable: false,
      observations: [],
      maximumVariation: null,
      allowedVariation: null,
      result: 'NOT_APPLICABLE'
    };

    let followUpRequired = false;
    let followUpPass = true;

    if (isMultipleRange) {
      const Max1Val = (params.Max1 !== undefined && params.Max1 !== null && params.Max1 !== '')
        ? Number(params.Max1)
        : (ranges && ranges[0] && ranges[0].Max_i !== undefined ? Number(ranges[0].Max_i) : null);

      if (Max1Val !== null && appliedLoad !== null && appliedLoad > Max1Val) {
        followUpRequired = true;
        const e1Val = e1 !== null ? e1 : (ranges && ranges[0] && ranges[0].e_i !== undefined ? Number(ranges[0].e_i) : null);

        if (e1Val === null || isNaN(e1Val) || e1Val <= 0) {
          return _buildResult({
            testType: 'ZERO_RETURN',
            accuracyClass: rawClass,
            appliedLoad,
            maxCapacity,
            loadingDurationMinutes: duration,
            initialZeroIndication: initialZero,
            returnedZeroIndication: returnedZero,
            zeroReturnDeviation,
            absoluteZeroReturnDeviation,
            instrumentConfiguration: instrumentConfig,
            automaticZeroConfiguration: automaticZeroConfig,
            standardEvaluation,
            complianceResult: 'REFERENCE_REQUIRED',
            ruleReference: ruleRef,
            explanation: 'Multiple-range 5-minute follow-up requires valid e1 verification scale interval.'
          });
        }

        const obsList = Array.isArray(params.lowestRangeFollowUpObservations)
          ? params.lowestRangeFollowUpObservations
          : (Array.isArray(params.followUpObservations) ? params.followUpObservations : []);

        // Validate observation list: needs at least 2 observations covering duration up to 5 min
        if (!obsList || obsList.length < 2) {
          multipleRangeFollowUp = {
            applicable: true,
            observations: obsList,
            maximumVariation: null,
            allowedVariation: e1Val,
            result: 'NOT_EVALUATED'
          };
          followUpPass = false;
        } else {
          const validObs = obsList.map(o => {
            const ind = (o.nearZeroIndication !== undefined && o.nearZeroIndication !== null)
              ? Number(o.nearZeroIndication)
              : Number(o.indication);
            const t = (o.time !== undefined && o.time !== null)
              ? Number(o.time)
              : Number(o.minute || 0);
            return { time: t, nearZeroIndication: ind };
          }).filter(o => !isNaN(o.nearZeroIndication));

          if (validObs.length < 2) {
            multipleRangeFollowUp = {
              applicable: true,
              observations: obsList,
              maximumVariation: null,
              allowedVariation: e1Val,
              result: 'NOT_EVALUATED'
            };
            followUpPass = false;
          } else {
            // Baseline is first stabilized observation
            const values = validObs.map(o => o.nearZeroIndication);
            const minObs = Math.min(...values);
            const maxObs = Math.max(...values);
            const maxVariation = safeSubtract(maxObs, minObs);

            const isVariationPass = maxVariation <= e1Val + EPSILON;
            const subResult = isVariationPass ? 'PASS' : 'FAIL';
            if (!isVariationPass) followUpPass = false;

            multipleRangeFollowUp = {
              applicable: true,
              observations: validObs,
              baselineIndication: validObs[0].nearZeroIndication,
              maximumVariation: maxVariation,
              allowedVariation: e1Val,
              comparison: maxVariation + ' ' + (isVariationPass ? '<=' : '>') + ' ' + e1Val,
              result: subResult
            };
          }
        }
      }
    }

    // 10. Compliance aggregation (Section 18)
    let finalCompliance = standardResult;
    let explanation = '';

    if (followUpRequired) {
      if (multipleRangeFollowUp.result === 'NOT_EVALUATED') {
        finalCompliance = 'NOT_EVALUATED';
        explanation = 'Standard zero-return deviation ' + standardResult + ' (' + absoluteZeroReturnDeviation + ' ' + (standardPass ? '<=' : '>') + ' ' + allowedDeviation + ' ' + unit + '). ' +
          'Multiple-range 5-minute lowest-range follow-up observations are incomplete. NOT_EVALUATED.';
      } else if (standardResult === 'FAIL' || multipleRangeFollowUp.result === 'FAIL') {
        finalCompliance = 'FAIL';
        const reasons = [];
        if (standardResult === 'FAIL') {
          reasons.push('Standard zero-return deviation |' + zeroReturnDeviation + '| ' + unit + ' exceeds allowed 0.5' + intervalLabel + ' = ' + allowedDeviation + ' ' + unit);
        }
        if (multipleRangeFollowUp.result === 'FAIL') {
          reasons.push('5-minute lowest-range near-zero variation ' + multipleRangeFollowUp.maximumVariation + ' ' + unit + ' exceeds allowed e1 = ' + multipleRangeFollowUp.allowedVariation + ' ' + unit);
        }
        explanation = 'FAIL: ' + reasons.join('; ') + '.';
      } else {
        finalCompliance = 'PASS';
        explanation = 'Standard zero-return deviation |' + zeroReturnDeviation + '| <= 0.5' + intervalLabel + ' (' + allowedDeviation + ' ' + unit + ') PASS. ' +
          '5-minute lowest-range near-zero variation ' + multipleRangeFollowUp.maximumVariation + ' <= e1 (' + multipleRangeFollowUp.allowedVariation + ' ' + unit + ') PASS.';
      }
    } else {
      if (standardPass) {
        explanation = 'Zero-return deviation |' + returnedZero + ' - ' + initialZero + '| = ' +
          absoluteZeroReturnDeviation + ' ' + unit + ' <= 0.5' + intervalLabel + ' (' + allowedDeviation + ' ' + unit + '). PASS.';
      } else {
        explanation = 'Zero-return deviation |' + returnedZero + ' - ' + initialZero + '| = ' +
          absoluteZeroReturnDeviation + ' ' + unit + ' > 0.5' + intervalLabel + ' (' + allowedDeviation + ' ' + unit + '). FAIL.';
      }
    }

    return _buildResult({
      testType: 'ZERO_RETURN',
      accuracyClass: rawClass,
      appliedLoad,
      maxCapacity,
      loadingDurationMinutes: duration,
      loadAppliedTimestamp: params.loadAppliedTimestamp || null,
      loadRemovedTimestamp: params.loadRemovedTimestamp || null,
      initialZeroIndication: initialZero,
      returnedZeroIndication: returnedZero,
      zeroReturnDeviation,
      absoluteZeroReturnDeviation,
      instrumentConfiguration: instrumentConfig,
      automaticZeroConfiguration: automaticZeroConfig,
      standardEvaluation,
      multipleRangeFollowUp,
      complianceResult: finalCompliance,
      ruleReference: ruleRef,
      explanation
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RESULT BUILDER (Consistent structured output)
  // ─────────────────────────────────────────────────────────────────────────
  function _buildResult(r) {
    return {
      testType: 'ZERO_RETURN',
      accuracyClass: r.accuracyClass !== undefined ? r.accuracyClass : null,
      appliedLoad: r.appliedLoad !== undefined ? r.appliedLoad : null,
      maxCapacity: r.maxCapacity !== undefined ? r.maxCapacity : null,
      loadingDurationMinutes: r.loadingDurationMinutes !== undefined ? r.loadingDurationMinutes : null,
      loadAppliedTimestamp: r.loadAppliedTimestamp || null,
      loadRemovedTimestamp: r.loadRemovedTimestamp || null,
      initialZeroIndication: r.initialZeroIndication !== undefined ? r.initialZeroIndication : null,
      returnedZeroIndication: r.returnedZeroIndication !== undefined ? r.returnedZeroIndication : null,
      zeroReturnDeviation: r.zeroReturnDeviation !== undefined ? r.zeroReturnDeviation : null,
      absoluteZeroReturnDeviation: r.absoluteZeroReturnDeviation !== undefined ? r.absoluteZeroReturnDeviation : null,
      instrumentConfiguration: r.instrumentConfiguration || {
        isMultiInterval: false,
        isMultipleRange: false,
        e: null,
        e1: null,
        activeRange: null
      },
      automaticZeroConfiguration: r.automaticZeroConfiguration || {
        hasAutomaticZeroSetting: false,
        hasZeroTracking: false,
        automaticZeroDisabledDuringTest: false,
        zeroTrackingDisabledDuringTest: false
      },
      standardEvaluation: r.standardEvaluation || null,
      multipleRangeFollowUp: r.multipleRangeFollowUp || {
        applicable: false,
        observations: [],
        maximumVariation: null,
        allowedVariation: null,
        result: 'NOT_APPLICABLE'
      },
      complianceResult: r.complianceResult,
      ruleReference: r.ruleReference || (RULE_REFERENCE_BASE + ' Section 3.9.4.2 / Annex A.4.11.2'),
      ruleVersion: RULE_VERSION,
      explanation: r.explanation || '',
      badgeHtml: badgeFor(r.complianceResult),
      complianceMode: 'VERIFIED_R76'
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────────────────────────
  return Object.freeze({
    APPLICABLE_CLASSES,
    evaluateZeroReturn,
    // Helper exports for testing
    safeMultiply,
    safeSubtract,
    safeRound
  });
});
