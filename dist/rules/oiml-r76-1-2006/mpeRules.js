/**
 * OIML R 76-1:2006 Table 6 Maximum Permissible Error (MPE) Rules Engine
 * Normative Implementation for WEIGHING_PERFORMANCE
 *
 * References:
 * - OIML R 76-1 Edition 2006 (E)
 * - Section 3.5.1: Maximum permissible errors on initial verification (Table 6)
 * - Section 3.5.2: Maximum permissible errors in service
 */
(function(root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    const metadata = (typeof require === 'function') ? require('./metadata.js') : null;
    module.exports = factory(metadata);
  } else {
    root.OimlR76MpeRules = factory(root.OimlR76Metadata);
  }
})(typeof self !== 'undefined' ? self : this, function(Metadata) {
  'use strict';

  // Table 6: Maximum permissible errors on initial verification (Section 3.5.1)
  const TABLE_6_BANDS = Object.freeze({
    'I': Object.freeze([
      Object.freeze({ maxIntervals: 50000, initialMultiplier: 0.5, bandDesc: '0 ≤ m ≤ 50,000 e' }),
      Object.freeze({ maxIntervals: 200000, initialMultiplier: 1.0, bandDesc: '50,000 e < m ≤ 200,000 e' }),
      Object.freeze({ maxIntervals: Infinity, initialMultiplier: 1.5, bandDesc: 'm > 200,000 e' })
    ]),
    'II': Object.freeze([
      Object.freeze({ maxIntervals: 5000, initialMultiplier: 0.5, bandDesc: '0 ≤ m ≤ 5,000 e' }),
      Object.freeze({ maxIntervals: 20000, initialMultiplier: 1.0, bandDesc: '5,000 e < m ≤ 20,000 e' }),
      Object.freeze({ maxIntervals: 100000, initialMultiplier: 1.5, bandDesc: '20,000 e < m ≤ 100,000 e' })
    ]),
    'III': Object.freeze([
      Object.freeze({ maxIntervals: 500, initialMultiplier: 0.5, bandDesc: '0 ≤ m ≤ 500 e' }),
      Object.freeze({ maxIntervals: 2000, initialMultiplier: 1.0, bandDesc: '500 e < m ≤ 2,000 e' }),
      Object.freeze({ maxIntervals: 10000, initialMultiplier: 1.5, bandDesc: '2,000 e < m ≤ 10,000 e' })
    ]),
    'IIII': Object.freeze([
      Object.freeze({ maxIntervals: 50, initialMultiplier: 0.5, bandDesc: '0 ≤ m ≤ 50 e' }),
      Object.freeze({ maxIntervals: 200, initialMultiplier: 1.0, bandDesc: '50 e < m ≤ 200 e' }),
      Object.freeze({ maxIntervals: 1000, initialMultiplier: 1.5, bandDesc: '200 e < m ≤ 1,000 e' })
    ])
  });

  function getDecimals(num) {
    const str = String(num ?? '').trim();
    const idx = str.indexOf('.');
    return idx === -1 ? 0 : str.length - idx - 1;
  }

  // Exact integer-scaled load in intervals calculation: m / e
  function calculateLoadInIntervals(referenceLoad, e) {
    const numLoad = Number(referenceLoad);
    const numE = Number(e);
    if (isNaN(numLoad) || isNaN(numE) || numE <= 0 || numLoad < 0) {
      return null;
    }
    const maxDec = Math.max(getDecimals(referenceLoad), getDecimals(e), 2);
    const scale = Math.pow(10, Math.min(maxDec, 8));
    const intLoad = Math.round(numLoad * scale);
    const intE = Math.round(numE * scale);
    if (intE === 0) return null;

    const ratio = intLoad / intE;
    return Math.round(ratio * 100000000) / 100000000;
  }

  // Decimal-safe multiplication
  function safeMultiply(a, b) {
    const decA = getDecimals(a);
    const decB = getDecimals(b);
    const factor = Math.pow(10, decA + decB);
    const intA = Math.round(Number(a) * Math.pow(10, decA));
    const intB = Math.round(Number(b) * Math.pow(10, decB));
    const product = (intA * intB) / factor;
    return Number(product.toFixed(Math.max(decA + decB, 2)));
  }

  // Decimal-safe subtraction
  function decimalSafeSubtract(a, b) {
    const decA = getDecimals(a);
    const decB = getDecimals(b);
    const maxDec = Math.max(decA, decB, 2);
    const factor = Math.pow(10, Math.min(maxDec, 8));
    const diff = (Math.round(Number(a) * factor) - Math.round(Number(b) * factor)) / factor;
    return Number(diff.toFixed(maxDec));
  }

  function formatError(val, unit = '') {
    if (val === null || val === undefined || isNaN(Number(val))) return '—';
    const num = Number(val);
    const sign = num > 0 ? '+' : '';
    return `${sign}${val}${unit ? ' ' + unit : ''}`;
  }

  // Lookup applicable Table 6 MPE band
  function lookupMpeBand(accuracyClass, loadInIntervals, evaluationType) {
    const normClass = String(accuracyClass || '').toUpperCase().trim();
    const bands = TABLE_6_BANDS[normClass];
    if (!bands) {
      return {
        resolved: false,
        reason: `Accuracy Class "${accuracyClass}" is not recognized under OIML R 76-1 Table 6 (Valid classes: I, II, III, IIII)`
      };
    }

    const EPSILON = 1e-9;
    let selected = null;
    for (let i = 0; i < bands.length; i++) {
      if (loadInIntervals <= bands[i].maxIntervals + EPSILON) {
        selected = bands[i];
        break;
      }
    }

    if (!selected) {
      return {
        resolved: false,
        reason: `Applied load (${loadInIntervals} e) exceeds maximum verification scale intervals specified for Class ${normClass} in Table 6`
      };
    }

    const isInitial = (evaluationType === 'INITIAL_VERIFICATION');
    const isInService = (evaluationType === 'IN_SERVICE_INSPECTION');

    if (!isInitial && !isInService) {
      return {
        resolved: false,
        reason: `Evaluation Type "${evaluationType}" is not supported under verified OIML R 76-1 rules`
      };
    }

    let multiplier = selected.initialMultiplier;
    let clause = 'Section 3.5.1';
    let clauseRef = 'OIML R 76-1:2006\nSection 3.5.1\nTable 6';
    let typeDesc = 'Initial Verification';

    if (isInService) {
      // Under Section 3.5.2, in-service inspection MPE is twice initial verification MPE
      multiplier = selected.initialMultiplier * 2;
      clause = 'Section 3.5.2';
      clauseRef = 'OIML R 76-1:2006\nSection 3.5.2\nTable 6 (In-Service 2× MPE)';
      typeDesc = 'In-Service Inspection';
    }

    return {
      resolved: true,
      initialMultiplier: selected.initialMultiplier,
      multiplier,
      bandDesc: selected.bandDesc,
      clause,
      clauseRef,
      typeDesc,
      normClass
    };
  }

  // Primary evaluation function for WEIGHING_PERFORMANCE observations
  function evaluateWeighingPerformance(params) {
    const ruleVersion = (Metadata && Metadata.edition) ? `OIML R 76-1:${Metadata.edition}` : 'OIML R 76-1:2006';

    // Safety check 1: Only WEIGHING_PERFORMANCE is implemented in this stage
    if (params.testType !== 'WEIGHING_PERFORMANCE') {
      return {
        calculatedError: calculationServiceDecimalSafe(params.scaleReading, params.referenceLoad),
        errorFormatted: formatError(calculationServiceDecimalSafe(params.scaleReading, params.referenceLoad), params.unit),
        loadInIntervals: calculateLoadInIntervals(params.referenceLoad, params.e) || 0,
        applicableMpe: null,
        applicableMpeFormatted: 'REFERENCE REQUIRED',
        mpeMultiplier: null,
        bandDesc: 'Unsupported Test Procedure',
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: `${ruleVersion} (Procedure Unconfigured)`,
        ruleVersion,
        explanation: `Rule package oiml-r76-1-2006 currently implements Section 3.5.1 Table 6 for WEIGHING_PERFORMANCE only. Test procedure "${params.testType}" requires separate verified normative rule configuration.`,
        isNearLimit: false,
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Safety check 2: Validate numerical input parameters
    const loadInIntervals = calculateLoadInIntervals(params.referenceLoad, params.e);
    if (loadInIntervals === null) {
      return {
        calculatedError: null,
        errorFormatted: '—',
        loadInIntervals: 0,
        applicableMpe: null,
        applicableMpeFormatted: 'REFERENCE REQUIRED',
        mpeMultiplier: null,
        bandDesc: 'Invalid Metrological Parameters',
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: `${ruleVersion} (Parameter Error)`,
        ruleVersion,
        explanation: 'Invalid input: Reference load must be non-negative and verification scale interval e must be greater than zero.',
        isNearLimit: false,
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Safety check 3: Resolve MPE band
    const lookup = lookupMpeBand(params.accuracyClass, loadInIntervals, params.evaluationType);
    if (!lookup.resolved) {
      return {
        calculatedError: decimalSafeSubtract(params.scaleReading, params.referenceLoad),
        errorFormatted: formatError(decimalSafeSubtract(params.scaleReading, params.referenceLoad), params.unit),
        loadInIntervals,
        applicableMpe: null,
        applicableMpeFormatted: 'REFERENCE REQUIRED',
        mpeMultiplier: null,
        bandDesc: 'Outside Table 6 Scope',
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: `${ruleVersion} (Scope Exceeded)`,
        ruleVersion,
        explanation: lookup.reason,
        isNearLimit: false,
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Calculate verified MPE and Error
    const applicableMpe = safeMultiply(lookup.multiplier, params.e);
    const error = decimalSafeSubtract(params.scaleReading, params.referenceLoad);
    const absError = Math.abs(error);

    // Exact boundary comparison (EPSILON guards against IEEE 754 precision noise)
    const EPSILON = 1e-9;
    const isPass = (absError <= applicableMpe + EPSILON);
    const complianceResult = isPass ? 'PASS' : 'FAIL';

    const diffStr = formatError(error, params.unit);
    const explanation = `OIML R 76-1:2006 Table 6 (${lookup.typeDesc}): Class ${lookup.normClass}, load m = ${params.referenceLoad} ${params.unit || ''} (m/e = ${loadInIntervals} e) falls into band ${lookup.bandDesc}. Applicable MPE multiplier = ±${lookup.multiplier} e (MPE = ±${applicableMpe} ${params.unit || ''}). Error = ${params.scaleReading} − ${params.referenceLoad} = ${diffStr}. Absolute error |${diffStr}| (${absError} ${params.unit || ''}) ${isPass ? '≤' : '>'} MPE (${applicableMpe} ${params.unit || ''}) ⟹ ${complianceResult}.`;

    const badgeHtml = isPass
      ? '<span class="badge good">PASS</span>'
      : '<span class="badge bad">FAIL</span>';

    return {
      accuracyClass: lookup.normClass,
      evaluationType: params.evaluationType,
      referenceLoad: params.referenceLoad,
      indication: params.scaleReading,
      e: params.e,
      calculatedError: error,
      absoluteError: absError,
      errorFormatted: diffStr,
      loadInIntervals,
      applicableMpe,
      applicableMpeFormatted: `±${applicableMpe} ${params.unit || ''}`,
      mpeMultiplier: lookup.multiplier,
      initialMultiplier: lookup.initialMultiplier,
      bandDesc: lookup.bandDesc,
      comparison: `|Error| ${isPass ? '≤' : '>'} MPE (${absError} ${isPass ? '≤' : '>'} ${applicableMpe})`,
      complianceResult,
      ruleReference: lookup.clauseRef,
      ruleVersion,
      ruleClause: lookup.clause,
      ruleTable: 'Table 6',
      explanation,
      isNearLimit: false,
      badgeHtml,
      complianceMode: 'VERIFIED_R76'
    };
  }

  function calculationServiceDecimalSafe(a, b) {
    return decimalSafeSubtract(a, b);
  }

  return Object.freeze({
    TABLE_6_BANDS,
    getDecimals,
    calculateLoadInIntervals,
    safeMultiply,
    decimalSafeSubtract,
    formatError,
    lookupMpeBand,
    evaluateWeighingPerformance
  });
});
