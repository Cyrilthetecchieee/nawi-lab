/**
 * OIML R 76-1:2006 Creep Rules Engine
 * Normative Implementation for CREEP
 *
 * References (OIML R 76-1 Edition 2006 (E)):
 * - Section 3.9.4:    Time
 * - Section 3.9.4.1:  Creep
 * - Annex A.4.11.1:   Creep test
 *
 * Applicable classes: II, III, IIII
 * Class I: NOT_APPLICABLE under this verified implementation
 *   (separate regulatory framework applies)
 *
 * Path A — 30-minute acceptance:
 *   |ΔP(t)| ≤ 0.5e for all readings in first 30 min  (Condition A1)
 *   |P(30) − P(15)| ≤ 0.2e                            (Condition A2)
 *
 * Path B — Extended 4-hour acceptance (when Path A not satisfied):
 *   |ΔP(t)| ≤ applicable Table 6 MPE (reused from mpeRules.js)
 *
 * Failure of Path A does NOT produce FAIL — it triggers Path B.
 * Only failure of Path B produces FAIL.
 *
 * Reuses verified Table 6 MPE engine from mpeRules.js.
 * Does NOT duplicate MPE constants.
 */
(function (root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    const metadata = (typeof require === 'function') ? require('./metadata.js') : null;
    const mpeRules = (typeof require === 'function') ? require('./mpeRules.js') : null;
    module.exports = factory(metadata, mpeRules);
  } else {
    root.OimlR76CreepRules = factory(root.OimlR76Metadata, root.OimlR76MpeRules);
  }
})(typeof self !== 'undefined' ? self : this, function (Metadata, MpeRules) {
  'use strict';

  const RULE_REFERENCE_BASE = 'OIML R 76-1:2006';
  const RULE_VERSION = (Metadata && Metadata.edition)
    ? ('OIML R 76-1:' + Metadata.edition)
    : 'OIML R 76-1:2006';

  const EPSILON = 1e-9;

  // ─────────────────────────────────────────────────────────────────────────
  // APPLICABLE ACCURACY CLASSES (Section 3.9.4)
  // Class I is NOT covered by this verified implementation.
  // ─────────────────────────────────────────────────────────────────────────
  const APPLICABLE_CLASSES = ['II', 'III', 'IIII'];

  // ─────────────────────────────────────────────────────────────────────────
  // REQUIRED OBSERVATION TIMELINE
  // ─────────────────────────────────────────────────────────────────────────
  // Path A: first 30 minutes
  const PATH_A_NOMINAL_TIMES = [0, 5, 15, 30]; // minutes
  // Path B: extended, all Path-A times plus additional 4-hour readings
  const PATH_B_ADDITIONAL_TIMES = [60, 120, 180, 240]; // minutes

  // ─────────────────────────────────────────────────────────────────────────
  // DECIMAL-SAFE ARITHMETIC (local, consistent with project style)
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

  // ─────────────────────────────────────────────────────────────────────────
  // BADGE HELPER
  // ─────────────────────────────────────────────────────────────────────────
  function badgeFor(state) {
    switch (state) {
      case 'PASS':               return '<span class="badge good">PASS</span>';
      case 'FAIL':               return '<span class="badge bad">FAIL</span>';
      case 'NOT_EVALUATED':      return '<span class="badge warn" style="background:#eaf0f2;color:#355361;">NOT EVALUATED</span>';
      case 'NOT_APPLICABLE':     return '<span class="badge" style="background:#e8f0e8;color:#2d5c2d;">NOT APPLICABLE</span>';
      default:                   return '<span class="badge warn">REFERENCE REQUIRED</span>';
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MpeRules AVAILABILITY CHECK
  // ─────────────────────────────────────────────────────────────────────────
  function isMpeAvailable() {
    return MpeRules &&
      typeof MpeRules.lookupMpeBand === 'function' &&
      typeof MpeRules.calculateLoadInIntervals === 'function' &&
      typeof MpeRules.safeMultiply === 'function';
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CORRECTED INDICATION P (Section A.4.11.1)
  // P = I + 0.5e − ΔL
  //   I  = indication
  //   e  = verification scale interval
  //   ΔL = additional load used to determine changeover point
  //
  // If the laboratory records direct indications without the changeover
  // method, ΔL must be set explicitly to 0 by the caller — this engine
  // does NOT silently default it.
  // ─────────────────────────────────────────────────────────────────────────
  function calcCorrectedIndication(indication, e, deltaL) {
    // P = I + 0.5e - ΔL
    const halfE = safeMultiply(0.5, e);
    return safeSubtract(safeSubtract(indication + halfE, deltaL), 0); // keep precision
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FIND OBSERVATION AT NOMINAL TIME
  // ─────────────────────────────────────────────────────────────────────────
  function findObsAtTime(observations, nominalMinutes) {
    return observations.find(o => Number(o.nominalTimeMinutes) === nominalMinutes) || null;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // VALIDATE APPLIED LOAD CONSISTENCY
  // Mixed loads across observations → REFERENCE_REQUIRED
  // ─────────────────────────────────────────────────────────────────────────
  function checkLoadConsistency(observations) {
    if (!observations || observations.length === 0) return { consistent: true };
    const firstLoad = Number(observations[0].appliedLoad);
    for (let i = 1; i < observations.length; i++) {
      const thisLoad = Number(observations[i].appliedLoad);
      if (Math.abs(thisLoad - firstLoad) > EPSILON) {
        return {
          consistent: false,
          reason: 'Mixed applied loads detected across creep observations (Load at obs 0: '
            + firstLoad + ', Load at obs ' + i + ': ' + thisLoad
            + '). All observations in a creep series must use the same applied load (Section A.4.11.1).'
        };
      }
    }
    return { consistent: true };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN EVALUATOR: evaluateCreep
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * params:
   *   accuracyClass       {string}   'II'|'III'|'IIII'|'I'
   *   appliedLoad         {number}   load maintained throughout test
   *   e                   {number}   verification scale interval
   *   unit                {string}   e.g. 'kg'
   *   evaluationType      {string}   'INITIAL_VERIFICATION'|'IN_SERVICE_INSPECTION'
   *   measurementMethod   {string}   'CHANGEOVER_POINT'|'DIRECT' (default DIRECT)
   *   observations        {Array}    array of observation objects — see below
   *   environment         {object}   {startTemperature, endTemperature,
   *                                   startRelativeHumidity, endRelativeHumidity}
   *
   * Each observation object:
   *   nominalTimeMinutes  {number}   0|5|15|30|60|120|180|240
   *   actualTimestamp     {string}   ISO timestamp or label (optional)
   *   indication          {number}   recorded indication
   *   additionalLoad      {number}   ΔL — MUST be explicitly 0 if DIRECT method
   *   appliedLoad         {number}   must match parent appliedLoad
   */
  function evaluateCreep(params) {
    const ruleRef = RULE_REFERENCE_BASE
      + '\nSection 3.9.4 (Time)'
      + '\nSection 3.9.4.1 (Creep)'
      + '\nAnnex A.4.11.1 (Creep test)';

    // ── Guard: params ────────────────────────────────────────────────────
    if (!params) {
      return {
        testType: 'CREEP',
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Missing creep evaluation parameters.',
        badgeHtml: badgeFor('REFERENCE_REQUIRED'),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // ── Guard: MpeRules (required for Path B) ────────────────────────────
    if (!isMpeAvailable()) {
      return {
        testType: 'CREEP',
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Verified Table 6 MPE engine (mpeRules.js) is unavailable. '
          + 'Extended 4-hour creep evaluation requires the verified MPE engine.',
        badgeHtml: badgeFor('REFERENCE_REQUIRED'),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // ── Validate accuracy class ──────────────────────────────────────────
    const normClass = String(params.accuracyClass || '').toUpperCase().trim();

    if (normClass === 'I') {
      return {
        testType: 'CREEP',
        accuracyClass: 'I',
        complianceResult: 'NOT_APPLICABLE',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Section 3.9.4 does not apply to Class I instruments under this verified implementation. '
          + 'Class I instruments are subject to separate metrological requirements. '
          + 'This verified CREEP engine covers Class II, III, and IIII only. Result: NOT APPLICABLE.',
        badgeHtml: badgeFor('NOT_APPLICABLE'),
        complianceMode: 'VERIFIED_R76'
      };
    }

    if (!APPLICABLE_CLASSES.includes(normClass)) {
      return {
        testType: 'CREEP',
        accuracyClass: normClass || 'UNKNOWN',
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Invalid accuracy class "' + (params.accuracyClass || '') + '". '
          + 'Section 3.9.4 applies to Class II, III, and IIII. Class I returns NOT_APPLICABLE.',
        badgeHtml: badgeFor('REFERENCE_REQUIRED'),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // ── Validate e ───────────────────────────────────────────────────────
    const numE = Number(params.e);
    if (isNaN(numE) || numE <= 0) {
      return {
        testType: 'CREEP',
        accuracyClass: normClass,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Verification scale interval e must be a positive number (Section 3.9.4.1).',
        badgeHtml: badgeFor('REFERENCE_REQUIRED'),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // ── Validate appliedLoad ─────────────────────────────────────────────
    const numLoad = Number(params.appliedLoad);
    if (isNaN(numLoad) || numLoad < 0) {
      return {
        testType: 'CREEP',
        accuracyClass: normClass,
        e: numE,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Applied load must be a non-negative number (Annex A.4.11.1).',
        badgeHtml: badgeFor('REFERENCE_REQUIRED'),
        complianceMode: 'VERIFIED_R76'
      };
    }

    const unit = String(params.unit || 'kg');
    const evalType = String(params.evaluationType || 'INITIAL_VERIFICATION');
    const observations = Array.isArray(params.observations) ? params.observations : [];
    const measurementMethod = String(params.measurementMethod || 'DIRECT').toUpperCase().trim();

    // ── Validate measurement method ──────────────────────────────────────
    const VALID_METHODS = ['CHANGEOVER_POINT', 'DIRECT'];
    if (!VALID_METHODS.includes(measurementMethod)) {
      return {
        testType: 'CREEP',
        accuracyClass: normClass,
        e: numE,
        appliedLoad: numLoad,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Unsupported measurement method "' + measurementMethod + '". '
          + 'Use CHANGEOVER_POINT (for ΔL-based P calculation) or DIRECT (ΔL = 0).',
        badgeHtml: badgeFor('REFERENCE_REQUIRED'),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // ── Validate load consistency across observations ─────────────────────
    const loadCheck = checkLoadConsistency(observations);
    if (!loadCheck.consistent) {
      return {
        testType: 'CREEP',
        accuracyClass: normClass,
        e: numE,
        appliedLoad: numLoad,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: loadCheck.reason,
        badgeHtml: badgeFor('REFERENCE_REQUIRED'),
        complianceMode: 'VERIFIED_R76'
      };
    }

    // ── Validate and enrich each observation ─────────────────────────────
    const enrichedObs = [];
    for (let i = 0; i < observations.length; i++) {
      const o = observations[i];
      const nomTime = Number(o.nominalTimeMinutes);
      if (isNaN(nomTime)) {
        return {
          testType: 'CREEP',
          accuracyClass: normClass,
          e: numE,
          appliedLoad: numLoad,
          complianceResult: 'REFERENCE_REQUIRED',
          ruleReference: ruleRef,
          ruleVersion: RULE_VERSION,
          explanation: 'Observation #' + i + ' has invalid nominalTimeMinutes: "' + o.nominalTimeMinutes + '".',
          badgeHtml: badgeFor('REFERENCE_REQUIRED'),
          complianceMode: 'VERIFIED_R76'
        };
      }

      const indication = Number(o.indication);
      if (isNaN(indication)) {
        return {
          testType: 'CREEP',
          accuracyClass: normClass,
          e: numE,
          appliedLoad: numLoad,
          complianceResult: 'REFERENCE_REQUIRED',
          ruleReference: ruleRef,
          ruleVersion: RULE_VERSION,
          explanation: 'Observation at ' + nomTime + ' min has invalid indication value: "' + o.indication + '".',
          badgeHtml: badgeFor('REFERENCE_REQUIRED'),
          complianceMode: 'VERIFIED_R76'
        };
      }

      // ΔL: for DIRECT method must be explicitly 0; for CHANGEOVER_POINT must be provided
      let deltaL;
      if (measurementMethod === 'DIRECT') {
        deltaL = 0;
      } else {
        deltaL = Number(o.additionalLoad);
        if (isNaN(deltaL)) {
          return {
            testType: 'CREEP',
            accuracyClass: normClass,
            e: numE,
            appliedLoad: numLoad,
            complianceResult: 'REFERENCE_REQUIRED',
            ruleReference: ruleRef,
            ruleVersion: RULE_VERSION,
            explanation: 'Observation at ' + nomTime + ' min: CHANGEOVER_POINT method requires additionalLoad (ΔL). '
              + 'Do not fabricate ΔL — tester must record actual value.',
            badgeHtml: badgeFor('REFERENCE_REQUIRED'),
            complianceMode: 'VERIFIED_R76'
          };
        }
      }

      // P = I + 0.5e − ΔL  (Annex A.4.11.1)
      const correctedP = calcCorrectedIndication(indication, numE, deltaL);

      enrichedObs.push({
        nominalTimeMinutes: nomTime,
        actualTimestamp: o.actualTimestamp || null,
        indication,
        additionalLoad: deltaL,
        correctedIndication: correctedP,
        // deltaFromStart and absoluteDeltaFromStart filled after baseline is known
        appliedLoad: numLoad
      });
    }

    // Sort observations by nominal time ascending
    enrichedObs.sort((a, b) => a.nominalTimeMinutes - b.nominalTimeMinutes);

    // ── Require 0-minute baseline ────────────────────────────────────────
    const obsAt0 = findObsAtTime(enrichedObs, 0);
    if (!obsAt0) {
      return {
        testType: 'CREEP',
        accuracyClass: normClass,
        e: numE,
        appliedLoad: numLoad,
        unit,
        measurementMethod,
        observations: enrichedObs,
        complianceResult: 'NOT_EVALUATED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Baseline observation at 0 minutes is required to begin creep evaluation (Annex A.4.11.1). '
          + 'Enter the indication immediately after placing the load.',
        badgeHtml: badgeFor('NOT_EVALUATED'),
        complianceMode: 'VERIFIED_R76'
      };
    }

    const baselineP = obsAt0.correctedIndication;

    // ── Compute ΔP for all observations ─────────────────────────────────
    for (let i = 0; i < enrichedObs.length; i++) {
      const delta = safeSubtract(enrichedObs[i].correctedIndication, baselineP);
      enrichedObs[i].deltaFromStart = delta;
      enrichedObs[i].absoluteDeltaFromStart = Math.abs(delta);
    }

    // ── PATH A: 30-minute evaluation ─────────────────────────────────────
    const allowed30 = safeMultiply(0.5, numE);   // 0.5e
    const allowed15to30 = safeMultiply(0.2, numE); // 0.2e

    // Check for required 15 and 30 minute observations
    const obsAt5 = findObsAtTime(enrichedObs, 5);
    const obsAt15 = findObsAtTime(enrichedObs, 15);
    const obsAt30 = findObsAtTime(enrichedObs, 30);

    const has5 = !!obsAt5;
    const has15 = !!obsAt15;
    const has30 = !!obsAt30;

    // Missing required 15 or 30 min → NOT_EVALUATED
    if (!has15) {
      return _buildResult({
        testType: 'CREEP', accuracyClass: normClass, e: numE, appliedLoad: numLoad,
        unit, evalType, measurementMethod, observations: enrichedObs, baselineP,
        complianceResult: 'NOT_EVALUATED',
        thirtyMinuteEvaluation: null,
        extendedEvaluation: null,
        testPath: null,
        ruleRef, explanation: 'Observation at 15 minutes is required for Path A evaluation (Section 3.9.4.1 / Annex A.4.11.1). Enter the 15-minute reading.',
        environment: params.environment || null
      });
    }

    if (!has30) {
      return _buildResult({
        testType: 'CREEP', accuracyClass: normClass, e: numE, appliedLoad: numLoad,
        unit, evalType, measurementMethod, observations: enrichedObs, baselineP,
        complianceResult: 'NOT_EVALUATED',
        thirtyMinuteEvaluation: null,
        extendedEvaluation: null,
        testPath: null,
        ruleRef, explanation: 'Observation at 30 minutes is required for Path A evaluation (Section 3.9.4.1 / Annex A.4.11.1). Enter the 30-minute reading.',
        environment: params.environment || null
      });
    }

    // Condition A1: |ΔP(t)| ≤ 0.5e for all first-30-minute observations
    // Evaluate at 5, 15, and 30 min (all post-0-min readings in first 30 min)
    const first30Obs = enrichedObs.filter(o => o.nominalTimeMinutes > 0 && o.nominalTimeMinutes <= 30);
    const maxDeltaIn30 = first30Obs.reduce((max, o) => Math.max(max, o.absoluteDeltaFromStart), 0);
    const conditionA1 = maxDeltaIn30 <= allowed30 + EPSILON;

    // Condition A2: |P(30) − P(15)| ≤ 0.2e
    const delta15to30 = safeSubtract(obsAt30.correctedIndication, obsAt15.correctedIndication);
    const absDelta15to30 = Math.abs(delta15to30);
    const conditionA2 = absDelta15to30 <= allowed15to30 + EPSILON;

    const pathAPassed = conditionA1 && conditionA2;

    const thirtyMinuteEvaluation = {
      allowedCreep: allowed30,
      maxObservedDelta: maxDeltaIn30,
      delta15to30,
      absDelta15to30,
      allowed15to30,
      conditionA1,
      conditionA2,
      passed: pathAPassed
    };

    // ── PATH A PASS ──────────────────────────────────────────────────────
    if (pathAPassed) {
      return _buildResult({
        testType: 'CREEP', accuracyClass: normClass, e: numE, appliedLoad: numLoad,
        unit, evalType, measurementMethod, observations: enrichedObs, baselineP,
        complianceResult: 'PASS',
        thirtyMinuteEvaluation,
        extendedEvaluation: { required: false, complete: false },
        testPath: '30_MINUTE',
        ruleRef,
        explanation: 'Creep 30-minute acceptance satisfied (Section 3.9.4.1): '
          + 'Condition A1 — Max |ΔP| in 30 min = ' + maxDeltaIn30 + ' ' + unit
          + ' ≤ 0.5e = ' + allowed30 + ' ' + unit + '. '
          + 'Condition A2 — |P(30)−P(15)| = ' + absDelta15to30 + ' ' + unit
          + ' ≤ 0.2e = ' + allowed15to30 + ' ' + unit + '. '
          + 'Test path: 30_MINUTE. PASS.',
        environment: params.environment || null
      });
    }

    // ── PATH A NOT SATISFIED — check extended observations ───────────────
    const failReasons = [];
    if (!conditionA1) {
      failReasons.push('Condition A1: Max |ΔP| in 30 min = ' + maxDeltaIn30
        + ' ' + unit + ' > 0.5e = ' + allowed30 + ' ' + unit);
    }
    if (!conditionA2) {
      failReasons.push('Condition A2: |P(30)−P(15)| = ' + absDelta15to30
        + ' ' + unit + ' > 0.2e = ' + allowed15to30 + ' ' + unit);
    }

    // Resolve MPE for extended evaluation (Path B)
    const loadInIntervals = MpeRules.calculateLoadInIntervals(numLoad, numE);
    if (loadInIntervals === null || loadInIntervals <= 0) {
      return _buildResult({
        testType: 'CREEP', accuracyClass: normClass, e: numE, appliedLoad: numLoad,
        unit, evalType, measurementMethod, observations: enrichedObs, baselineP,
        complianceResult: 'REFERENCE_REQUIRED',
        thirtyMinuteEvaluation,
        extendedEvaluation: { required: true },
        testPath: null,
        ruleRef,
        explanation: 'Path A not satisfied. Extended test required but applied load ('
          + numLoad + ') cannot be resolved into scale intervals for Table 6 MPE lookup.',
        environment: params.environment || null
      });
    }

    const mpeLookup = MpeRules.lookupMpeBand(normClass, loadInIntervals, evalType);
    if (!mpeLookup || !mpeLookup.resolved) {
      return _buildResult({
        testType: 'CREEP', accuracyClass: normClass, e: numE, appliedLoad: numLoad,
        unit, evalType, measurementMethod, observations: enrichedObs, baselineP,
        complianceResult: 'REFERENCE_REQUIRED',
        thirtyMinuteEvaluation,
        extendedEvaluation: { required: true },
        testPath: null,
        ruleRef,
        explanation: 'Path A not satisfied. Extended test required but MPE cannot be resolved: '
          + (mpeLookup && mpeLookup.reason ? mpeLookup.reason : 'MPE lookup failed.'),
        environment: params.environment || null
      });
    }

    const applicableMpe = MpeRules.safeMultiply(mpeLookup.multiplier, numE);

    // Check for required extended observations (60, 120, 180, 240 min)
    const extendedObs = PATH_B_ADDITIONAL_TIMES.map(t => findObsAtTime(enrichedObs, t));
    const hasAllExtended = extendedObs.every(o => o !== null);

    if (!hasAllExtended) {
      const missingTimes = PATH_B_ADDITIONAL_TIMES.filter(t => !findObsAtTime(enrichedObs, t));
      return _buildResult({
        testType: 'CREEP', accuracyClass: normClass, e: numE, appliedLoad: numLoad,
        unit, evalType, measurementMethod, observations: enrichedObs, baselineP,
        complianceResult: 'NOT_EVALUATED',
        thirtyMinuteEvaluation,
        extendedEvaluation: {
          required: true,
          complete: false,
          missingTimes,
          loadInIntervals,
          mpeMultiplier: mpeLookup.multiplier,
          bandDesc: mpeLookup.bandDesc,
          applicableMpe
        },
        testPath: null,
        requiresExtendedTest: true,
        ruleRef,
        explanation: '30-minute creep condition not satisfied (' + failReasons.join('; ')
          + '). Extended 4-hour test is required per Section 3.9.4.1. '
          + 'Missing observations at: ' + missingTimes.join(', ') + ' minutes. '
          + 'Continue test to 4 hours.',
        environment: params.environment || null
      });
    }

    // ── PATH B EVALUATION ────────────────────────────────────────────────
    // All extended observations present — evaluate each against applicable MPE
    const extendedResults = [];
    let anyExtendedFail = false;

    for (const t of PATH_B_ADDITIONAL_TIMES) {
      const obs = findObsAtTime(enrichedObs, t);
      const absDelta = obs.absoluteDeltaFromStart;
      const withinMpe = absDelta <= applicableMpe + EPSILON;
      if (!withinMpe) anyExtendedFail = true;
      extendedResults.push({
        nominalTimeMinutes: t,
        correctedIndication: obs.correctedIndication,
        deltaFromStart: obs.deltaFromStart,
        absoluteDeltaFromStart: absDelta,
        applicableMpe,
        withinMpe
      });
    }

    const pathBPassed = !anyExtendedFail;
    const finalResult = pathBPassed ? 'PASS' : 'FAIL';

    const extendedExpl = pathBPassed
      ? 'Extended 4-hour evaluation (Section 3.9.4.1 Path B): All observations within applicable MPE = '
        + applicableMpe + ' ' + unit + ' (Table 6 Band: ' + mpeLookup.bandDesc
        + ', Multiplier: ×' + mpeLookup.multiplier + '). PASS.'
      : 'Extended 4-hour evaluation (Section 3.9.4.1 Path B): One or more observations exceed applicable MPE = '
        + applicableMpe + ' ' + unit + '. FAIL.';

    return _buildResult({
      testType: 'CREEP', accuracyClass: normClass, e: numE, appliedLoad: numLoad,
      unit, evalType, measurementMethod, observations: enrichedObs, baselineP,
      complianceResult: finalResult,
      thirtyMinuteEvaluation,
      extendedEvaluation: {
        required: true,
        complete: true,
        loadInIntervals,
        mpeMultiplier: mpeLookup.multiplier,
        bandDesc: mpeLookup.bandDesc,
        applicableMpe,
        observationResults: extendedResults,
        observationsWithinMpe: !anyExtendedFail,
        passed: pathBPassed
      },
      testPath: '4_HOUR',
      ruleRef,
      explanation: '30-minute creep condition not satisfied (' + failReasons.join('; ')
        + '). Extended 4-hour alternative evaluated per Section 3.9.4.1. '
        + extendedExpl,
      environment: params.environment || null
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RESULT BUILDER (Consistent structured output)
  // ─────────────────────────────────────────────────────────────────────────
  function _buildResult(r) {
    return {
      testType: r.testType || 'CREEP',
      accuracyClass: r.accuracyClass,
      appliedLoad: r.appliedLoad,
      e: r.e,
      unit: r.unit,
      evaluationType: r.evalType,
      measurementMethod: r.measurementMethod,
      observations: r.observations || [],
      baselineP: r.baselineP !== undefined ? r.baselineP : null,
      environment: r.environment || null,
      thirtyMinuteEvaluation: r.thirtyMinuteEvaluation || null,
      extendedEvaluation: r.extendedEvaluation || null,
      testPath: r.testPath || null,
      requiresExtendedTest: !!r.requiresExtendedTest,
      complianceResult: r.complianceResult,
      ruleReference: r.ruleRef,
      ruleVersion: RULE_VERSION,
      explanation: r.explanation,
      badgeHtml: badgeFor(r.complianceResult),
      complianceMode: 'VERIFIED_R76'
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────────────────────────
  return Object.freeze({
    PATH_A_NOMINAL_TIMES,
    PATH_B_ADDITIONAL_TIMES,
    APPLICABLE_CLASSES,
    evaluateCreep,
    // Exposed for testing
    calcCorrectedIndication,
    safeMultiply,
    safeSubtract
  });
});
