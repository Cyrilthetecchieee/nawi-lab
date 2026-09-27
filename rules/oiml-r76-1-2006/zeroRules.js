/**
 * OIML R 76-1:2006 Zero Rules Engine
 * Normative Implementation for ZERO_RELATED_TESTS
 *
 * References (OIML R 76-1 Edition 2006 (E)):
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
 *   - A.4.2.3.1:   Non-automatic / semi-automatic procedure
 *   - A.4.2.3.2:   Automatic / zero-tracking procedure
 * - Annex A.4.3:   Setting to zero before loading
 *
 * Does NOT duplicate MPE Table 6 logic. Zero-specific verified
 * requirements only.
 */
(function (root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    const metadata = (typeof require === 'function') ? require('./metadata.js') : null;
    const mpeRules = (typeof require === 'function') ? require('./mpeRules.js') : null;
    module.exports = factory(metadata, mpeRules);
  } else {
    root.OimlR76ZeroRules = factory(root.OimlR76Metadata, root.OimlR76MpeRules);
  }
})(typeof self !== 'undefined' ? self : this, function (Metadata, MpeRules) {
  'use strict';

  const RULE_REFERENCE_BASE = 'OIML R 76-1:2006';
  const RULE_VERSION = (Metadata && Metadata.edition)
    ? ('OIML R 76-1:' + Metadata.edition)
    : 'OIML R 76-1:2006';

  const EPSILON = 1e-9;

  // ─────────────────────────────────────────────────────────────────────────
  // ZERO-SETTING TYPES (Section 4.5)
  // ─────────────────────────────────────────────────────────────────────────
  const ZERO_SETTING_TYPES = Object.freeze({
    NONE: 'NONE',
    NON_AUTOMATIC: 'NON_AUTOMATIC',
    SEMI_AUTOMATIC: 'SEMI_AUTOMATIC',
    AUTOMATIC: 'AUTOMATIC'
  });

  // ─────────────────────────────────────────────────────────────────────────
  // COMPLIANCE STATES
  // ─────────────────────────────────────────────────────────────────────────
  const STATES = Object.freeze({
    PASS: 'PASS',
    FAIL: 'FAIL',
    NOT_EVALUATED: 'NOT_EVALUATED',
    REFERENCE_REQUIRED: 'REFERENCE_REQUIRED',
    NOT_APPLICABLE: 'NOT_APPLICABLE'
  });

  // ─────────────────────────────────────────────────────────────────────────
  // DECIMAL-SAFE ARITHMETIC
  // Consistent with the project's existing style. For zero tests we do NOT
  // call into MpeRules for arithmetic — zero section has no MPE dependency.
  // ─────────────────────────────────────────────────────────────────────────
  function getDecimals(n) {
    const s = String(n);
    const i = s.indexOf('.');
    return (i === -1) ? 0 : (s.length - i - 1);
  }

  function decimalSafe(a, b, op) {
    const decimals = Math.max(getDecimals(a), getDecimals(b));
    const factor = Math.pow(10, decimals);
    const ia = Math.round(Number(a) * factor);
    const ib = Math.round(Number(b) * factor);
    const result = (op === '+') ? (ia + ib) : (ia - ib);
    return result / factor;
  }

  function safeMultiply(a, b) {
    const decA = getDecimals(a);
    const decB = getDecimals(b);
    const decimals = decA + decB;
    const factor = Math.pow(10, decimals);
    return (Math.round(Number(a) * Math.pow(10, decA)) *
      Math.round(Number(b) * Math.pow(10, decB))) / factor;
  }

  function safeSubtract(a, b) { return decimalSafe(a, b, '-'); }
  function safeAdd(a, b) { return decimalSafe(a, b, '+'); }

  // ─────────────────────────────────────────────────────────────────────────
  // BADGE HTML HELPER
  // ─────────────────────────────────────────────────────────────────────────
  function badgeFor(state) {
    switch (state) {
      case STATES.PASS:               return '<span class="badge good">PASS</span>';
      case STATES.FAIL:               return '<span class="badge bad">FAIL</span>';
      case STATES.NOT_EVALUATED:      return '<span class="badge warn" style="background:#eaf0f2;color:#355361;">NOT EVALUATED</span>';
      case STATES.NOT_APPLICABLE:     return '<span class="badge" style="background:#e8f0e8;color:#2d5c2d;">NOT APPLICABLE</span>';
      default:                        return '<span class="badge warn">REFERENCE REQUIRED</span>';
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // VALIDATE COMMON INSTRUMENT PARAMS
  // ─────────────────────────────────────────────────────────────────────────
  function validateE(params) {
    const numE = Number(params.e);
    if (isNaN(numE) || numE <= 0) return null;
    return numE;
  }

  function validateD(params) {
    const numD = Number(params.d);
    if (isNaN(numD) || numD <= 0) return null;
    return numD;
  }

  function validateMax(params) {
    const numMax = Number(params.maxCapacity);
    if (isNaN(numMax) || numMax <= 0) return null;
    return numMax;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SUBTEST A: ZERO_SETTING_RANGE  (Section 4.5.1, Annex A.4.2.1)
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Section 4.5.1 Maximum effect:
   *   - Ordinary (overall + zero-tracking):  ≤ 4% of Max
   *   - Initial zero-setting:                ≤ 20% of Max
   *
   * Wider initial range is allowed under certain conditions (Section 4.5.1
   * qualification). This engine does NOT silently approve exceptions.
   * If standard limit is exceeded and wider-range conditions have NOT been
   * explicitly confirmed, returns REFERENCE_REQUIRED.
   */
  function evaluateZeroSettingRange(params) {
    const ruleRef = RULE_REFERENCE_BASE + '\nSection 4.5.1 (Maximum effect)\nAnnex A.4.2.1 (Range of zero-setting)';

    if (!params) {
      return {
        subtestId: 'ZERO_SETTING_RANGE',
        complianceResult: STATES.REFERENCE_REQUIRED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Missing zero-setting range parameters.',
        badgeHtml: badgeFor(STATES.REFERENCE_REQUIRED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    const numMax = validateMax(params);
    if (!numMax) {
      return {
        subtestId: 'ZERO_SETTING_RANGE',
        complianceResult: STATES.REFERENCE_REQUIRED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'maxCapacity must be a positive number (Section 4.5.1).',
        badgeHtml: badgeFor(STATES.REFERENCE_REQUIRED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Determine range type
    const rangeType = String(params.rangeType || '').toUpperCase().trim();
    const VALID_RANGE_TYPES = ['INITIAL_ZERO_SETTING', 'NON_AUTOMATIC_OR_SEMI_AUTOMATIC_ZERO_SETTING', 'AUTOMATIC_ZERO_SETTING'];
    if (!VALID_RANGE_TYPES.includes(rangeType)) {
      return {
        subtestId: 'ZERO_SETTING_RANGE',
        complianceResult: STATES.REFERENCE_REQUIRED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'rangeType must be one of: INITIAL_ZERO_SETTING, NON_AUTOMATIC_OR_SEMI_AUTOMATIC_ZERO_SETTING, AUTOMATIC_ZERO_SETTING.',
        badgeHtml: badgeFor(STATES.REFERENCE_REQUIRED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Determine regulatory limits per Section 4.5.1
    const isInitial = (rangeType === 'INITIAL_ZERO_SETTING');
    const standardLimitFraction = isInitial ? 0.20 : 0.04;
    const standardLimit = safeMultiply(standardLimitFraction, numMax);
    const limitDescription = isInitial
      ? '20% of Max (Section 4.5.1 — initial zero-setting device)'
      : '4% of Max (Section 4.5.1 — ordinary overall / zero-tracking)';

    // Measured ranges
    const positiveRange = (params.positiveZeroSettingRange !== undefined && params.positiveZeroSettingRange !== null)
      ? Number(params.positiveZeroSettingRange) : null;
    const negativeRange = (params.negativeZeroSettingRange !== undefined && params.negativeZeroSettingRange !== null)
      ? Number(params.negativeZeroSettingRange) : null;

    // Guard: at least positive range must be provided
    if (positiveRange === null || isNaN(positiveRange) || positiveRange < 0) {
      return {
        subtestId: 'ZERO_SETTING_RANGE',
        rangeType,
        maxCapacity: numMax,
        standardLimit,
        limitDescription,
        complianceResult: STATES.NOT_EVALUATED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Positive zero-setting range must be entered (Annex A.4.2.1). Measurement not yet recorded.',
        badgeHtml: badgeFor(STATES.NOT_EVALUATED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Compute overall range
    // If negative portion is unavailable (load receptor cannot be removed), use positive only
    // per A.4.2.1 procedure — do NOT fabricate the unavailable portion.
    const negativeAvailable = (negativeRange !== null && !isNaN(negativeRange) && negativeRange >= 0);
    const overallRange = negativeAvailable
      ? safeAdd(positiveRange, negativeRange)
      : positiveRange;
    const negativeNote = negativeAvailable
      ? null
      : 'Negative portion not available (load receptor cannot readily be removed). A.4.2.1 allows only positive portion to be evaluated in this case.';

    // Check against standard limit
    const withinStandardLimit = overallRange <= standardLimit + EPSILON;

    let complianceResult;
    let explanation;

    if (withinStandardLimit) {
      complianceResult = STATES.PASS;
      explanation = 'Zero-setting range (' + rangeType + '): Overall range '
        + overallRange + ' ≤ ' + limitDescription + ' (' + standardLimit + '). PASS.';
    } else {
      // Exceeded standard limit — check if wider-range exception has been explicitly confirmed
      const widerRangeVerified = !!params.widerRangeExceptionVerified;
      if (widerRangeVerified) {
        // Exception is explicitly configured as verified — still return REFERENCE_REQUIRED per
        // instruction: "Do NOT automatically PASS such exception cases."
        complianceResult = STATES.REFERENCE_REQUIRED;
        explanation = 'Zero-setting range exceeds standard '
          + limitDescription + ' (' + standardLimit + '). A wider-range exception was flagged as verified, '
          + 'however OIML R 76-1 Section 4.5.1 exceptions require regulatory review and cannot be automatically resolved to PASS.';
      } else {
        complianceResult = STATES.REFERENCE_REQUIRED;
        explanation = 'Zero-setting range (' + rangeType + '): Overall range '
          + overallRange + ' exceeds standard limit ' + limitDescription
          + ' (' + standardLimit + '). Regulatory exception conditions from Section 4.5.1 have NOT been explicitly verified. REFERENCE REQUIRED.';
      }
    }

    return {
      subtestId: 'ZERO_SETTING_RANGE',
      rangeType,
      maxCapacity: numMax,
      positiveZeroSettingRange: positiveRange,
      negativeZeroSettingRange: negativeAvailable ? negativeRange : null,
      negativeRangeAvailable: negativeAvailable,
      negativeNote,
      overallZeroSettingRange: overallRange,
      standardLimitFraction,
      standardLimit,
      limitDescription,
      isInitial,
      withinStandardLimit,
      widerRangeExceptionVerified: !!params.widerRangeExceptionVerified,
      complianceResult,
      ruleReference: ruleRef,
      ruleVersion: RULE_VERSION,
      explanation,
      badgeHtml: badgeFor(complianceResult),
      complianceMode: 'VERIFIED_R76'
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SUBTEST B: ZERO_SETTING_ACCURACY  (Section 4.5.2, Annex A.4.2.3)
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Section 4.5.2: After zero-setting, the effect on weighing result ≤ ±0.25e
   * A.4.2.3.1: Non-automatic / semi-automatic procedure
   * A.4.2.3.2: Automatic / zero-tracking procedure
   *
   * Criterion: |zeroDeviation| ≤ 0.25 × e  → PASS
   */
  function evaluateZeroSettingAccuracy(params) {
    const ruleRef = RULE_REFERENCE_BASE + '\nSection 4.5.2 (Accuracy)\nAnnex A.4.2.3 (Accuracy of zero-setting)';

    if (!params) {
      return {
        subtestId: 'ZERO_SETTING_ACCURACY',
        complianceResult: STATES.REFERENCE_REQUIRED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Missing zero-setting accuracy parameters.',
        badgeHtml: badgeFor(STATES.REFERENCE_REQUIRED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    const numE = validateE(params);
    if (!numE) {
      return {
        subtestId: 'ZERO_SETTING_ACCURACY',
        complianceResult: STATES.REFERENCE_REQUIRED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Verification scale interval e must be a positive number (Section 4.5.2).',
        badgeHtml: badgeFor(STATES.REFERENCE_REQUIRED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    const zeroSettingType = String(params.zeroSettingType || '').toUpperCase().trim();
    if (!ZERO_SETTING_TYPES[zeroSettingType] || zeroSettingType === 'NONE') {
      return {
        subtestId: 'ZERO_SETTING_ACCURACY',
        e: numE,
        complianceResult: STATES.REFERENCE_REQUIRED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'zeroSettingType must be one of: NON_AUTOMATIC, SEMI_AUTOMATIC, AUTOMATIC.',
        badgeHtml: badgeFor(STATES.REFERENCE_REQUIRED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Determine applicable procedure annex
    const isAutomatic = (zeroSettingType === 'AUTOMATIC');
    const procedureRef = isAutomatic ? 'Annex A.4.2.3.2' : 'Annex A.4.2.3.1';

    // Measured zero deviation (tester-entered)
    if (params.zeroDeviation === undefined || params.zeroDeviation === null || params.zeroDeviation === '') {
      return {
        subtestId: 'ZERO_SETTING_ACCURACY',
        e: numE,
        zeroSettingType,
        procedureRef,
        allowedZeroDeviation: safeMultiply(0.25, numE),
        complianceResult: STATES.NOT_EVALUATED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Measured zero deviation has not been entered. Tester must record the actual zero error per ' + procedureRef + '.',
        badgeHtml: badgeFor(STATES.NOT_EVALUATED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    const zeroDeviation = Number(params.zeroDeviation);
    if (isNaN(zeroDeviation)) {
      return {
        subtestId: 'ZERO_SETTING_ACCURACY',
        e: numE,
        zeroSettingType,
        procedureRef,
        complianceResult: STATES.REFERENCE_REQUIRED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Zero deviation must be a valid number.',
        badgeHtml: badgeFor(STATES.REFERENCE_REQUIRED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Core criterion: |zeroDeviation| ≤ 0.25 × e
    const allowedZeroDeviation = safeMultiply(0.25, numE);
    const absoluteZeroDeviation = Math.abs(zeroDeviation);
    const isPass = absoluteZeroDeviation <= allowedZeroDeviation + EPSILON;
    const complianceResult = isPass ? STATES.PASS : STATES.FAIL;

    // Raw observations for A.4.2.3.1 traceability (changeover point)
    const rawObservations = params.rawObservations || null;

    const explanation = 'Zero-setting accuracy (' + procedureRef + ' / Section 4.5.2): '
      + 'Allowed deviation = 0.25 × e = 0.25 × ' + numE + ' = ' + allowedZeroDeviation + ' '
      + (params.unit || '') + '. '
      + 'Measured zero deviation = ' + zeroDeviation + ' '
      + (params.unit || '') + '. '
      + '|' + zeroDeviation + '| = ' + absoluteZeroDeviation + ' '
      + (isPass ? '≤' : '>') + ' ' + allowedZeroDeviation + ' → ' + complianceResult + '.';

    return {
      subtestId: 'ZERO_SETTING_ACCURACY',
      zeroSettingType,
      procedureRef,
      isAutomatic,
      e: numE,
      unit: params.unit || '',
      zeroDeviation,
      absoluteZeroDeviation,
      allowedZeroDeviation,
      rawObservations,
      isPass,
      complianceResult,
      ruleReference: ruleRef + '\n' + procedureRef,
      ruleVersion: RULE_VERSION,
      explanation,
      badgeHtml: badgeFor(complianceResult),
      complianceMode: 'VERIFIED_R76'
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SUBTEST C: ZERO_INDICATING_DEVICE  (Section 4.5.5, Annex A.4.2.2)
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Section 4.5.5: The special zero signal corresponds to deviation from zero
   * not greater than ±0.25e.
   *
   * Applicability:
   *   - Required when instrument has a zero indicating device.
   *   - NOT_APPLICABLE when the exemption conditions are met
   *     (auxiliary indicating device OR qualifying zero-tracking).
   *
   * Annex A.4.2.2 procedure:
   *   - Adjust instrument to ~1 scale interval below zero
   *   - Add small weights (~1/10 scale interval)
   *   - Record the range over which zero indicator is active
   */
  function evaluateZeroIndicatingDevice(params) {
    const ruleRef = RULE_REFERENCE_BASE + '\nSection 4.5.5 (Zero indicating devices)\nAnnex A.4.2.2 (Zero indicating device)';

    if (!params) {
      return {
        subtestId: 'ZERO_INDICATING_DEVICE',
        complianceResult: STATES.REFERENCE_REQUIRED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Missing zero-indicating-device parameters.',
        badgeHtml: badgeFor(STATES.REFERENCE_REQUIRED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Check applicability
    const hasZeroIndicatingDevice = !!params.hasZeroIndicatingDevice;
    const hasAuxiliaryIndicatingDevice = !!params.hasAuxiliaryIndicatingDevice;

    // Section 4.5.5: Zero indicating device not mandatory when applicable
    // alternative conditions are met (aux indicating device or qualifying
    // zero-tracking behaviour)
    if (!hasZeroIndicatingDevice) {
      const exemptionConfigured = !!params.exemptionConfigured;
      if (hasAuxiliaryIndicatingDevice || exemptionConfigured) {
        return {
          subtestId: 'ZERO_INDICATING_DEVICE',
          hasZeroIndicatingDevice: false,
          hasAuxiliaryIndicatingDevice,
          exemptionConfigured,
          complianceResult: STATES.NOT_APPLICABLE,
          ruleReference: ruleRef,
          ruleVersion: RULE_VERSION,
          explanation: 'Zero indicating device is not present. Exemption condition per Section 4.5.5 is explicitly configured ('
            + (hasAuxiliaryIndicatingDevice ? 'auxiliary indicating device present' : 'exemption configured')
            + '). This subtest is NOT APPLICABLE.',
          badgeHtml: badgeFor(STATES.NOT_APPLICABLE),
          complianceMode: 'VERIFIED_R76'
        };
      }
      return {
        subtestId: 'ZERO_INDICATING_DEVICE',
        hasZeroIndicatingDevice: false,
        hasAuxiliaryIndicatingDevice: false,
        complianceResult: STATES.REFERENCE_REQUIRED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Zero indicating device is not present but exemption conditions (Section 4.5.5) have not been confirmed. '
          + 'Regulatory review is required to determine whether this instrument qualifies for the exemption.',
        badgeHtml: badgeFor(STATES.REFERENCE_REQUIRED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Device is present — validate e
    const numE = validateE(params);
    if (!numE) {
      return {
        subtestId: 'ZERO_INDICATING_DEVICE',
        hasZeroIndicatingDevice: true,
        complianceResult: STATES.REFERENCE_REQUIRED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Verification scale interval e must be a positive number (Section 4.5.5).',
        badgeHtml: badgeFor(STATES.REFERENCE_REQUIRED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Required: tester-entered observed range of zero indicator
    if (params.observedZeroIndicatorRange === undefined
      || params.observedZeroIndicatorRange === null
      || params.observedZeroIndicatorRange === '') {
      return {
        subtestId: 'ZERO_INDICATING_DEVICE',
        hasZeroIndicatingDevice: true,
        e: numE,
        allowedRange: safeMultiply(0.25, numE),
        complianceResult: STATES.NOT_EVALUATED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Observed zero indicator range has not been entered (Annex A.4.2.2). '
          + 'Tester must adjust to ~1e below zero, add ~1/10 e weights, and record the range.',
        badgeHtml: badgeFor(STATES.NOT_EVALUATED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    const observedRange = Number(params.observedZeroIndicatorRange);
    if (isNaN(observedRange) || observedRange < 0) {
      return {
        subtestId: 'ZERO_INDICATING_DEVICE',
        hasZeroIndicatingDevice: true,
        e: numE,
        complianceResult: STATES.REFERENCE_REQUIRED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Observed zero indicator range must be a non-negative number.',
        badgeHtml: badgeFor(STATES.REFERENCE_REQUIRED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Section 4.5.5 criterion: zero signal active ≤ ±0.25e
    // The total range of the zero indicator = 2 × 0.25e = 0.5e (symmetric)
    // We evaluate the half-range (deviation from zero).
    // If tester records total range: half = range/2.
    // If tester records half-range: use directly.
    // We use half-range interpretation (deviation from zero ≤ 0.25e).
    const useTotalRange = !!params.observedRangeIsTotal;
    const halfRange = useTotalRange ? (observedRange / 2) : observedRange;
    const allowedHalfRange = safeMultiply(0.25, numE);
    const isPass = halfRange <= allowedHalfRange + EPSILON;
    const complianceResult = isPass ? STATES.PASS : STATES.FAIL;

    const explanation = 'Zero indicating device (Section 4.5.5 / Annex A.4.2.2): '
      + 'Observed ' + (useTotalRange ? 'total range' : 'half-range (deviation from zero)')
      + ' = ' + halfRange + ' ' + (params.unit || '') + '. '
      + 'Allowed deviation from zero = ±0.25e = ±0.25 × ' + numE + ' = ±' + allowedHalfRange + ' '
      + (params.unit || '') + '. '
      + halfRange + ' ' + (isPass ? '≤' : '>') + ' ' + allowedHalfRange + ' → ' + complianceResult + '.';

    return {
      subtestId: 'ZERO_INDICATING_DEVICE',
      hasZeroIndicatingDevice: true,
      e: numE,
      unit: params.unit || '',
      observedZeroIndicatorRange: observedRange,
      useTotalRange,
      observedHalfRange: halfRange,
      allowedHalfRange,
      allowedRange: allowedHalfRange,
      isPass,
      complianceResult,
      ruleReference: ruleRef,
      ruleVersion: RULE_VERSION,
      explanation,
      badgeHtml: badgeFor(complianceResult),
      complianceMode: 'VERIFIED_R76'
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SUBTEST D: AUTOMATIC_ZERO_SETTING  (Section 4.5.6)
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Section 4.5.6: An automatic zero-setting device may operate ONLY when:
   *   1. Equilibrium is stable
   *   2. Indication has remained stable below zero for at least 5 seconds
   *
   * Do not fabricate timing observations. Tester records actual conditions.
   */
  function evaluateAutomaticZeroSetting(params) {
    const ruleRef = RULE_REFERENCE_BASE + '\nSection 4.5.6 (Automatic zero-setting devices)';

    if (!params) {
      return {
        subtestId: 'AUTOMATIC_ZERO_SETTING',
        complianceResult: STATES.REFERENCE_REQUIRED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Missing automatic zero-setting parameters.',
        badgeHtml: badgeFor(STATES.REFERENCE_REQUIRED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // NOT_APPLICABLE if instrument has no automatic zero-setting
    if (!params.hasAutomaticZeroSetting) {
      return {
        subtestId: 'AUTOMATIC_ZERO_SETTING',
        hasAutomaticZeroSetting: false,
        complianceResult: STATES.NOT_APPLICABLE,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Instrument does not have an automatic zero-setting device (Section 4.5.6). Subtest NOT APPLICABLE.',
        badgeHtml: badgeFor(STATES.NOT_APPLICABLE),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Required observations must be explicitly entered
    const equilibriumStable = params.equilibriumStable;
    const indicationBelowZero = params.indicationBelowZero;
    const stableBelowZeroDurationSeconds = params.stableBelowZeroDurationSeconds;
    const automaticZeroOperated = params.automaticZeroOperated;

    if (equilibriumStable === undefined || equilibriumStable === null
      || indicationBelowZero === undefined || indicationBelowZero === null
      || stableBelowZeroDurationSeconds === undefined || stableBelowZeroDurationSeconds === null
      || automaticZeroOperated === undefined || automaticZeroOperated === null) {
      return {
        subtestId: 'AUTOMATIC_ZERO_SETTING',
        hasAutomaticZeroSetting: true,
        complianceResult: STATES.NOT_EVALUATED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Required observations not complete (equilibriumStable, indicationBelowZero, '
          + 'stableBelowZeroDurationSeconds, automaticZeroOperated — all required per Section 4.5.6).',
        badgeHtml: badgeFor(STATES.NOT_EVALUATED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    const numDuration = Number(stableBelowZeroDurationSeconds);
    if (isNaN(numDuration) || numDuration < 0) {
      return {
        subtestId: 'AUTOMATIC_ZERO_SETTING',
        hasAutomaticZeroSetting: true,
        complianceResult: STATES.REFERENCE_REQUIRED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'stableBelowZeroDurationSeconds must be a non-negative number.',
        badgeHtml: badgeFor(STATES.REFERENCE_REQUIRED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Section 4.5.6 required conditions for operation:
    // Condition 1: equilibrium must be stable
    const cond1Pass = !!equilibriumStable;
    // Condition 2: indication must be below zero
    const cond2Pass = !!indicationBelowZero;
    // Condition 3: stable below zero for ≥ 5 seconds
    const MIN_STABLE_DURATION_SECONDS = 5.0;
    const cond3Pass = numDuration >= MIN_STABLE_DURATION_SECONDS - EPSILON;

    const operated = !!automaticZeroOperated;
    let complianceResult;
    let explanation;

    if (!operated) {
      // Device did not operate — no violation to evaluate
      complianceResult = STATES.NOT_EVALUATED;
      explanation = 'Automatic zero-setting device did not operate during this test. '
        + 'Operation must be observed to evaluate Section 4.5.6 conditions.';
    } else {
      // Device operated — ALL conditions must have been satisfied
      const allConditionsOk = cond1Pass && cond2Pass && cond3Pass;
      if (allConditionsOk) {
        complianceResult = STATES.PASS;
        explanation = 'Automatic zero-setting device operated under valid conditions (Section 4.5.6): '
          + 'Equilibrium stable, indication below zero, duration '
          + numDuration + ' s ≥ ' + MIN_STABLE_DURATION_SECONDS + ' s. PASS.';
      } else {
        complianceResult = STATES.FAIL;
        const failReasons = [];
        if (!cond1Pass) failReasons.push('Equilibrium was NOT stable when device operated (Section 4.5.6 condition 1 violated)');
        if (!cond2Pass) failReasons.push('Indication was NOT below zero when device operated (Section 4.5.6 condition 2 violated)');
        if (!cond3Pass) failReasons.push('Indication was below zero for only ' + numDuration + ' s < required '
          + MIN_STABLE_DURATION_SECONDS + ' s (Section 4.5.6 condition 3 violated)');
        explanation = 'Automatic zero-setting device operated but required conditions were NOT met: '
          + failReasons.join('; ') + '. FAIL.';
      }
    }

    return {
      subtestId: 'AUTOMATIC_ZERO_SETTING',
      hasAutomaticZeroSetting: true,
      equilibriumStable: !!equilibriumStable,
      indicationBelowZero: !!indicationBelowZero,
      stableBelowZeroDurationSeconds: numDuration,
      minimumRequiredDurationSeconds: MIN_STABLE_DURATION_SECONDS,
      automaticZeroOperated: operated,
      conditionEquilibriumStable: cond1Pass,
      conditionIndicationBelowZero: cond2Pass,
      conditionDurationMet: cond3Pass,
      complianceResult,
      ruleReference: ruleRef,
      ruleVersion: RULE_VERSION,
      explanation,
      badgeHtml: badgeFor(complianceResult),
      complianceMode: 'VERIFIED_R76'
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SUBTEST E: ZERO_TRACKING  (Section 4.5.7)
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Section 4.5.7: Zero-tracking may operate ONLY when:
   *   - Indication at zero OR applicable negative net value (gross zero)
   *   - Equilibrium stable
   *   - Corrections not more than 0.5 d per second
   *
   * Also preserves the tare-zeroing case (Section 4.5.7).
   */
  function evaluateZeroTracking(params) {
    const ruleRef = RULE_REFERENCE_BASE + '\nSection 4.5.7 (Zero-tracking devices)';

    if (!params) {
      return {
        subtestId: 'ZERO_TRACKING',
        complianceResult: STATES.REFERENCE_REQUIRED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Missing zero-tracking parameters.',
        badgeHtml: badgeFor(STATES.REFERENCE_REQUIRED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // NOT_APPLICABLE if instrument has no zero-tracking
    if (!params.hasZeroTracking) {
      return {
        subtestId: 'ZERO_TRACKING',
        hasZeroTracking: false,
        complianceResult: STATES.NOT_APPLICABLE,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Instrument does not have a zero-tracking device (Section 4.5.7). Subtest NOT APPLICABLE.',
        badgeHtml: badgeFor(STATES.NOT_APPLICABLE),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Validate d (actual scale interval) — required for 0.5 d/s criterion
    const numD = validateD(params);
    if (!numD) {
      return {
        subtestId: 'ZERO_TRACKING',
        hasZeroTracking: true,
        complianceResult: STATES.REFERENCE_REQUIRED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Actual scale interval d must be a positive number for zero-tracking rate evaluation (Section 4.5.7: ≤ 0.5 d per second).',
        badgeHtml: badgeFor(STATES.REFERENCE_REQUIRED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Required observations
    const trackingOperating = params.trackingOperating;
    const indicationState = params.indicationState;
    const equilibriumStable = params.equilibriumStable;
    const correctionAmount = params.correctionAmount;
    const correctionDurationSeconds = params.correctionDurationSeconds;

    if (trackingOperating === undefined || trackingOperating === null
      || indicationState === undefined || indicationState === null
      || equilibriumStable === undefined || equilibriumStable === null
      || correctionAmount === undefined || correctionAmount === null
      || correctionDurationSeconds === undefined || correctionDurationSeconds === null) {
      return {
        subtestId: 'ZERO_TRACKING',
        hasZeroTracking: true,
        d: numD,
        allowedCorrectionRate: safeMultiply(0.5, numD),
        complianceResult: STATES.NOT_EVALUATED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Required observations not complete (trackingOperating, indicationState, equilibriumStable, '
          + 'correctionAmount, correctionDurationSeconds — all required per Section 4.5.7).',
        badgeHtml: badgeFor(STATES.NOT_EVALUATED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    const numDuration = Number(correctionDurationSeconds);
    if (isNaN(numDuration) || numDuration <= 0) {
      return {
        subtestId: 'ZERO_TRACKING',
        hasZeroTracking: true,
        d: numD,
        complianceResult: STATES.REFERENCE_REQUIRED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'correctionDurationSeconds must be a positive number. A duration of zero or negative is invalid and cannot be used to compute correction rate.',
        badgeHtml: badgeFor(STATES.REFERENCE_REQUIRED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    const numCorrection = Number(correctionAmount);
    if (isNaN(numCorrection)) {
      return {
        subtestId: 'ZERO_TRACKING',
        hasZeroTracking: true,
        d: numD,
        complianceResult: STATES.REFERENCE_REQUIRED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'correctionAmount must be a valid number.',
        badgeHtml: badgeFor(STATES.REFERENCE_REQUIRED),
        complianceMode: 'VERIFIED_R76'
      };
    }

    const operated = !!trackingOperating;
    const allowedCorrectionRate = safeMultiply(0.5, numD);

    // indicationState: valid values are AT_ZERO, NEGATIVE_NET_AT_GROSS_ZERO, or other
    const normState = String(indicationState).toUpperCase().trim();
    const VALID_INDICATION_STATES = ['AT_ZERO', 'NEGATIVE_NET_AT_GROSS_ZERO'];
    const indicationStateValid = VALID_INDICATION_STATES.includes(normState);

    let complianceResult;
    let explanation;

    if (!operated) {
      complianceResult = STATES.NOT_EVALUATED;
      explanation = 'Zero-tracking device did not operate during this test. '
        + 'Operation must be observed to evaluate Section 4.5.7 conditions.';
    } else {
      // Device operated — evaluate all required conditions
      const cond1Pass = indicationStateValid; // at zero or applicable negative net
      const cond2Pass = !!equilibriumStable;  // equilibrium stable

      // Correction rate: |correctionAmount| / correctionDurationSeconds ≤ 0.5 d/s
      const correctionRate = Math.abs(numCorrection) / numDuration;
      const cond3Pass = correctionRate <= allowedCorrectionRate + EPSILON;

      const allOk = cond1Pass && cond2Pass && cond3Pass;

      if (allOk) {
        complianceResult = STATES.PASS;
        explanation = 'Zero-tracking operated under valid conditions (Section 4.5.7): '
          + 'Indication state = ' + normState + ', equilibrium stable, '
          + 'correction rate = ' + correctionRate.toFixed(6) + ' d/s ≤ allowed 0.5 × '
          + numD + ' = ' + allowedCorrectionRate + ' d/s. PASS.';
      } else {
        complianceResult = STATES.FAIL;
        const failReasons = [];
        if (!cond1Pass) failReasons.push('Indication state \'' + normState + '\' is not a valid condition for zero-tracking operation (Section 4.5.7 — must be AT_ZERO or NEGATIVE_NET_AT_GROSS_ZERO)');
        if (!cond2Pass) failReasons.push('Equilibrium was NOT stable during tracking (Section 4.5.7)');
        if (!cond3Pass) failReasons.push('Correction rate ' + correctionRate.toFixed(6) + ' d/s > allowed 0.5 d/s = ' + allowedCorrectionRate + ' d/s (Section 4.5.7)');
        explanation = 'Zero-tracking operated but required conditions were NOT met: '
          + failReasons.join('; ') + '. FAIL.';
      }

      // Tare-zeroing case (Section 4.5.7)
      const tareCaseNote = (normState === 'NEGATIVE_NET_AT_GROSS_ZERO')
        ? 'Tare-zeroing case: negative net indication equivalent to gross zero is an applicable state per Section 4.5.7. Preserved for traceability.'
        : null;

      const correctionRateFinal = Math.abs(numCorrection) / numDuration;

      return {
        subtestId: 'ZERO_TRACKING',
        hasZeroTracking: true,
        d: numD,
        unit: params.unit || '',
        trackingOperating: operated,
        indicationState: normState,
        indicationStateValid: cond1Pass,
        equilibriumStable: !!equilibriumStable,
        correctionAmount: numCorrection,
        correctionDurationSeconds: numDuration,
        correctionRate: correctionRateFinal,
        allowedCorrectionRate,
        conditionIndicationState: cond1Pass,
        conditionEquilibriumStable: cond2Pass,
        conditionRateMet: cond3Pass,
        tareCaseNote,
        isPass: allOk,
        complianceResult,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation,
        badgeHtml: badgeFor(complianceResult),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Not operated
    return {
      subtestId: 'ZERO_TRACKING',
      hasZeroTracking: true,
      d: numD,
      unit: params.unit || '',
      trackingOperating: operated,
      indicationState: String(indicationState),
      equilibriumStable: !!equilibriumStable,
      correctionAmount: numCorrection,
      correctionDurationSeconds: numDuration,
      correctionRate: null,
      allowedCorrectionRate,
      complianceResult,
      ruleReference: ruleRef,
      ruleVersion: RULE_VERSION,
      explanation,
      badgeHtml: badgeFor(complianceResult),
      complianceMode: 'VERIFIED_R76'
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PARENT AGGREGATOR: evaluateZeroRelatedTests
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Runs all applicable subtests according to instrument configuration.
   * Aggregates to parent ZERO_RELATED_TESTS result.
   *
   * NOT_APPLICABLE subtests: do not cause failure, not counted as PASS.
   * NOT_EVALUATED required subtests: parent → NOT_EVALUATED.
   * Any FAIL: parent → FAIL.
   * Any unresolved REFERENCE_REQUIRED: parent → REFERENCE_REQUIRED.
   * All required applicable subtests PASS: parent → PASS.
   */
  function evaluateZeroRelatedTests(params) {
    const ruleRef = RULE_REFERENCE_BASE
      + '\nSection 4.5 (Zero-setting and zero-tracking devices)'
      + '\nAnnex A.4.2 (Checking of zero)';

    if (!params) {
      return {
        testType: 'ZERO_RELATED_TESTS',
        complianceResult: STATES.REFERENCE_REQUIRED,
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Missing zero test parameters.',
        badgeHtml: badgeFor(STATES.REFERENCE_REQUIRED),
        complianceMode: 'VERIFIED_R76',
        subtests: {}
      };
    }

    const subtests = {};
    const applicableSubtests = [];

    // --- ZERO_SETTING_RANGE (always evaluated when zeroSettingType ≠ NONE)
    const zeroSettingType = String(params.zeroSettingType || '').toUpperCase().trim();
    if (zeroSettingType !== 'NONE') {
      applicableSubtests.push('ZERO_SETTING_RANGE');
      subtests.ZERO_SETTING_RANGE = evaluateZeroSettingRange({
        rangeType: params.zeroSettingRangeType || (zeroSettingType === 'AUTOMATIC' ? 'AUTOMATIC_ZERO_SETTING' : 'NON_AUTOMATIC_OR_SEMI_AUTOMATIC_ZERO_SETTING'),
        maxCapacity: params.maxCapacity,
        positiveZeroSettingRange: params.positiveZeroSettingRange,
        negativeZeroSettingRange: params.negativeZeroSettingRange,
        widerRangeExceptionVerified: params.widerRangeExceptionVerified,
        unit: params.unit
      });

      // --- ZERO_SETTING_RANGE for initial zero-setting (if hasInitialZeroSetting)
      if (params.hasInitialZeroSetting) {
        applicableSubtests.push('ZERO_SETTING_RANGE_INITIAL');
        subtests.ZERO_SETTING_RANGE_INITIAL = evaluateZeroSettingRange({
          rangeType: 'INITIAL_ZERO_SETTING',
          maxCapacity: params.maxCapacity,
          positiveZeroSettingRange: params.initialPositiveZeroSettingRange,
          negativeZeroSettingRange: params.initialNegativeZeroSettingRange,
          widerRangeExceptionVerified: params.widerInitialRangeExceptionVerified,
          unit: params.unit
        });
      }

      // --- ZERO_SETTING_ACCURACY (always when zero device present)
      applicableSubtests.push('ZERO_SETTING_ACCURACY');
      subtests.ZERO_SETTING_ACCURACY = evaluateZeroSettingAccuracy({
        zeroSettingType,
        e: params.e,
        unit: params.unit,
        zeroDeviation: params.zeroDeviation,
        rawObservations: params.zeroAccuracyRawObservations
      });
    }

    // --- ZERO_INDICATING_DEVICE (always attempted — applicability determined internally)
    applicableSubtests.push('ZERO_INDICATING_DEVICE');
    subtests.ZERO_INDICATING_DEVICE = evaluateZeroIndicatingDevice({
      hasZeroIndicatingDevice: params.hasZeroIndicatingDevice,
      hasAuxiliaryIndicatingDevice: params.hasAuxiliaryIndicatingDevice,
      exemptionConfigured: params.zeroIndicatorExemptionConfigured,
      e: params.e,
      unit: params.unit,
      observedZeroIndicatorRange: params.observedZeroIndicatorRange,
      observedRangeIsTotal: params.observedRangeIsTotal
    });

    // --- AUTOMATIC_ZERO_SETTING (only if instrument type is AUTOMATIC)
    if (zeroSettingType === 'AUTOMATIC') {
      applicableSubtests.push('AUTOMATIC_ZERO_SETTING');
      subtests.AUTOMATIC_ZERO_SETTING = evaluateAutomaticZeroSetting({
        hasAutomaticZeroSetting: true,
        equilibriumStable: params.automaticZero_equilibriumStable,
        indicationBelowZero: params.automaticZero_indicationBelowZero,
        stableBelowZeroDurationSeconds: params.automaticZero_stableBelowZeroDurationSeconds,
        automaticZeroOperated: params.automaticZero_operated
      });
    }

    // --- ZERO_TRACKING (only if instrument has zero-tracking)
    if (params.hasZeroTracking) {
      applicableSubtests.push('ZERO_TRACKING');
      subtests.ZERO_TRACKING = evaluateZeroTracking({
        hasZeroTracking: true,
        d: params.d,
        unit: params.unit,
        trackingOperating: params.zeroTracking_trackingOperating,
        indicationState: params.zeroTracking_indicationState,
        equilibriumStable: params.zeroTracking_equilibriumStable,
        correctionAmount: params.zeroTracking_correctionAmount,
        correctionDurationSeconds: params.zeroTracking_correctionDurationSeconds
      });
    } else {
      // Record NOT_APPLICABLE for zero-tracking
      applicableSubtests.push('ZERO_TRACKING');
      subtests.ZERO_TRACKING = evaluateZeroTracking({ hasZeroTracking: false });
    }

    // --- AGGREGATE PARENT RESULT
    const subtestValues = Object.values(subtests);

    // NOT_APPLICABLE subtests: excluded from pass/fail calculation
    const requiredResults = subtestValues.filter(s => s.complianceResult !== STATES.NOT_APPLICABLE);

    let parentResult;
    if (requiredResults.some(s => s.complianceResult === STATES.REFERENCE_REQUIRED)) {
      parentResult = STATES.REFERENCE_REQUIRED;
    } else if (requiredResults.some(s => s.complianceResult === STATES.FAIL)) {
      parentResult = STATES.FAIL;
    } else if (requiredResults.some(s => s.complianceResult === STATES.NOT_EVALUATED)) {
      parentResult = STATES.NOT_EVALUATED;
    } else if (requiredResults.every(s => s.complianceResult === STATES.PASS)) {
      parentResult = STATES.PASS;
    } else {
      parentResult = STATES.REFERENCE_REQUIRED;
    }

    const passCount = requiredResults.filter(s => s.complianceResult === STATES.PASS).length;
    const naCount = subtestValues.filter(s => s.complianceResult === STATES.NOT_APPLICABLE).length;

    return {
      testType: 'ZERO_RELATED_TESTS',
      zeroSettingType,
      hasInitialZeroSetting: !!params.hasInitialZeroSetting,
      hasZeroTracking: !!params.hasZeroTracking,
      hasZeroIndicatingDevice: !!params.hasZeroIndicatingDevice,
      hasAuxiliaryIndicatingDevice: !!params.hasAuxiliaryIndicatingDevice,
      applicableSubtests,
      subtests,
      complianceResult: parentResult,
      passCount,
      requiredCount: requiredResults.length,
      notApplicableCount: naCount,
      ruleReference: ruleRef,
      ruleVersion: RULE_VERSION,
      explanation: 'Parent ZERO_RELATED_TESTS: ' + parentResult + '. '
        + 'Subtests evaluated: ' + subtestValues.length + ' ('
        + requiredResults.length + ' required, ' + naCount + ' not applicable). '
        + 'Passed: ' + passCount + '/' + requiredResults.length + '.',
      badgeHtml: badgeFor(parentResult),
      complianceMode: 'VERIFIED_R76'
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────────────────────────
  return Object.freeze({
    ZERO_SETTING_TYPES,
    STATES,
    // Individual subtests
    evaluateZeroSettingRange,
    evaluateZeroSettingAccuracy,
    evaluateZeroIndicatingDevice,
    evaluateAutomaticZeroSetting,
    evaluateZeroTracking,
    // Parent aggregator
    evaluateZeroRelatedTests,
    // Utility (exposed for test/UI use)
    safeMultiply,
    safeSubtract,
    safeAdd
  });
});
