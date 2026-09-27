/**
 * OIML R 76-1:2006 Tare Rules Engine
 * Normative Implementation for TARE
 *
 * References:
 * - OIML R 76-1 Edition 2006 (E)
 * - Section 3.5.3.3: Maximum permissible errors for net values
 * - Section 3.5.3.4: Tare weighing device
 * - Section 4.6.3:   Accuracy of tare device
 * - Annex A.4.6:     Tare
 *   - Annex A.4.6.1: Weighing test (net weighing with tare)
 *   - Annex A.4.6.2: Accuracy of tare setting
 *   - Annex A.4.6.3: Tare weighing device
 *
 * Reuses the verified Table 6 MPE engine from mpeRules.js.
 * Does NOT duplicate Table 6 constants.
 */
(function(root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    const metadata = (typeof require === 'function') ? require('./metadata.js') : null;
    const mpeRules = (typeof require === 'function') ? require('./mpeRules.js') : null;
    module.exports = factory(metadata, mpeRules);
  } else {
    root.OimlR76TareRules = factory(root.OimlR76Metadata, root.OimlR76MpeRules);
  }
})(typeof self !== 'undefined' ? self : this, function(Metadata, MpeRules) {
  'use strict';

  const RULE_REFERENCE_BASE = 'OIML R 76-1:2006';
  const RULE_VERSION = (Metadata && Metadata.edition) ? `OIML R 76-1:${Metadata.edition}` : 'OIML R 76-1:2006';

  // Supported tare modes (Section 3.5.3.3)
  const TARE_MODES = Object.freeze({
    SUBTRACTIVE: 'SUBTRACTIVE',
    ADDITIVE: 'ADDITIVE'
  });

  // Supported instrument mechanisms (Section 4.6.3)
  const INSTRUMENT_MECHANISMS = Object.freeze({
    ELECTRONIC: 'ELECTRONIC',
    ANALOG: 'ANALOG',
    MECHANICAL_DIGITAL: 'MECHANICAL_DIGITAL'
  });

  // Minimum net weighing load steps required (Annex A.4.6.1)
  const MIN_LOAD_STEPS = 5;

  // ============================================================
  // SAFETY GUARD: MpeRules availability check
  // ============================================================
  function isMpeRulesAvailable() {
    return MpeRules &&
      typeof MpeRules.lookupMpeBand === 'function' &&
      typeof MpeRules.calculateLoadInIntervals === 'function' &&
      typeof MpeRules.safeMultiply === 'function' &&
      typeof MpeRules.decimalSafeSubtract === 'function';
  }

  function safeRefRequired(explanation, specific) {
    return {
      complianceResult: 'REFERENCE_REQUIRED',
      ruleReference: `${RULE_REFERENCE_BASE} Section 3.5.3.3, Annex A.4.6`,
      ruleVersion: RULE_VERSION,
      explanation,
      specific,
      badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
      complianceMode: 'VERIFIED_R76'
    };
  }

  // ============================================================
  // GUIDANCE: Subtractive tare recommended test range
  // Section 3.5.3.3: test tare between 1/3 and 2/3 of max tare
  // ============================================================
  function calculateSubtractiveTareGuidance(maximumTareEffect) {
    const t = Number(maximumTareEffect);
    if (isNaN(t) || t <= 0) return null;
    return {
      lowerBound: Number((t / 3).toFixed(4)),
      upperBound: Number((2 * t / 3).toFixed(4)),
      description: '1/3 to 2/3 of maximum tare effect (Section 3.5.3.3)'
    };
  }

  // ============================================================
  // GUIDANCE: Additive tare recommended test points
  // Annex A.4.6.1: approximately 1/3 and 3/3 of maximum tare
  // ============================================================
  function calculateAdditiveTareGuidance(maximumTareEffect) {
    const t = Number(maximumTareEffect);
    if (isNaN(t) || t <= 0) return null;
    return {
      oneThirdPoint: Number((t / 3).toFixed(4)),
      fullPoint: Number(t.toFixed(4)),
      description: '~1/3 and ~3/3 of maximum tare effect (Annex A.4.6.1)'
    };
  }

  // ============================================================
  // SUBTEST A: TARE_NET_WEIGHING (Annex A.4.6.1)
  // Evaluates net load observations against Table 6 MPE
  // (Section 3.5.3.3: MPE applies to the NET value)
  // ============================================================
  function evaluateTareNetWeighing(params) {
    const ruleRef = `${RULE_REFERENCE_BASE}\nSection 3.5.3.3 (Net MPE)\nAnnex A.4.6.1 (Weighing test)`;

    if (!isMpeRulesAvailable()) {
      return {
        subtestId: 'TARE_NET_WEIGHING',
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Verified rule package (MpeRules) is unavailable or failed to initialize.',
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    if (!params) {
      return {
        subtestId: 'TARE_NET_WEIGHING',
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Missing tare net-weighing parameters.',
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Validate accuracy class
    const normClass = String(params.accuracyClass || '').toUpperCase().trim();
    const VALID_CLASSES = ['I', 'II', 'III', 'IIII'];
    if (!VALID_CLASSES.includes(normClass)) {
      return {
        subtestId: 'TARE_NET_WEIGHING',
        accuracyClass: params.accuracyClass,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: `Accuracy Class "${params.accuracyClass}" is invalid or not recognized under OIML R 76-1. Valid classes: I, II, III, IIII.`,
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Validate verification scale interval e
    const numE = Number(params.e);
    if (isNaN(numE) || numE <= 0) {
      return {
        subtestId: 'TARE_NET_WEIGHING',
        accuracyClass: normClass,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Verification scale interval e must be greater than zero.',
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Validate tare mode
    const tareModeRaw = String(params.tareMode || '').toUpperCase().trim();
    if (!TARE_MODES[tareModeRaw]) {
      return {
        subtestId: 'TARE_NET_WEIGHING',
        accuracyClass: normClass,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: `Tare mode "${params.tareMode}" is invalid. Supported modes: SUBTRACTIVE, ADDITIVE.`,
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Validate maximum tare effect
    const numMaxTare = Number(params.maximumTareEffect);
    if (isNaN(numMaxTare) || numMaxTare < 0) {
      return {
        subtestId: 'TARE_NET_WEIGHING',
        accuracyClass: normClass,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Maximum tare effect must be a non-negative number. Do NOT silently assume tare type or maximum tare effect.',
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Load observation series
    const series = Array.isArray(params.series) ? params.series : [];
    const evalType = params.evaluationType || 'INITIAL_VERIFICATION';
    const unit = params.unit || '';
    const EPSILON = 1e-9;

    // Collect all observations across series
    const allObservations = [];
    for (const s of series) {
      const obs = Array.isArray(s.observations) ? s.observations : [];
      for (const o of obs) {
        allObservations.push({
          seriesId: s.seriesId || 'TARE-SERIES',
          tareValue: Number(s.tareValue),
          direction: String(o.direction || 'LOADING').toUpperCase(),
          referenceNetLoad: Number(o.referenceNetLoad),
          netIndication: Number(o.netIndication)
        });
      }
    }

    // Require minimum 5 load steps (Annex A.4.6.1)
    if (allObservations.length < MIN_LOAD_STEPS) {
      return {
        subtestId: 'TARE_NET_WEIGHING',
        accuracyClass: normClass,
        evaluationType: evalType,
        tareMode: tareModeRaw,
        maximumTareEffect: numMaxTare,
        requiredLoadSteps: MIN_LOAD_STEPS,
        actualLoadSteps: allObservations.length,
        complianceResult: 'NOT_EVALUATED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: `At least ${MIN_LOAD_STEPS} tare weighing load steps are required (Annex A.4.6.1). Only ${allObservations.length} provided.`,
        badgeHtml: '<span class="badge warn" style="background:#eaf0f2;color:#355361;">NOT EVALUATED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Evaluate each observation against Table 6 MPE for the NET LOAD
    const evaluatedObs = [];
    let anyFail = false;
    let anyRefReq = false;

    for (const obs of allObservations) {
      if (isNaN(obs.referenceNetLoad) || isNaN(obs.netIndication)) {
        anyRefReq = true;
        evaluatedObs.push({
          ...obs,
          error: null,
          loadInIntervals: null,
          mpeMultiplier: null,
          applicableMpe: null,
          complianceResult: 'REFERENCE_REQUIRED',
          explanation: 'Invalid numeric observation data.'
        });
        continue;
      }

      const loadInIntervals = MpeRules.calculateLoadInIntervals(obs.referenceNetLoad, numE);
      if (loadInIntervals === null) {
        anyRefReq = true;
        evaluatedObs.push({
          ...obs,
          error: null,
          loadInIntervals: null,
          mpeMultiplier: null,
          applicableMpe: null,
          complianceResult: 'REFERENCE_REQUIRED',
          explanation: `Failed to calculate net load in verification scale intervals (m/e). Net load: ${obs.referenceNetLoad}, e: ${numE}`
        });
        continue;
      }

      const mpeLookup = MpeRules.lookupMpeBand(normClass, loadInIntervals, evalType);
      if (!mpeLookup || !mpeLookup.resolved) {
        anyRefReq = true;
        evaluatedObs.push({
          ...obs,
          error: null,
          loadInIntervals,
          mpeMultiplier: null,
          applicableMpe: null,
          complianceResult: 'REFERENCE_REQUIRED',
          explanation: mpeLookup ? mpeLookup.reason : 'Unable to resolve Table 6 MPE band for net load.'
        });
        continue;
      }

      const applicableMpe = MpeRules.safeMultiply(mpeLookup.multiplier, numE);
      const error = MpeRules.decimalSafeSubtract(obs.netIndication, obs.referenceNetLoad);
      const absError = Math.abs(error);
      const isPass = absError <= applicableMpe + EPSILON;
      if (!isPass) anyFail = true;

      evaluatedObs.push({
        seriesId: obs.seriesId,
        tareValue: obs.tareValue,
        direction: obs.direction,
        referenceNetLoad: obs.referenceNetLoad,
        netIndication: obs.netIndication,
        error,
        errorFormatted: MpeRules.formatError(error, unit),
        absoluteError: absError,
        loadInIntervals,
        mpeMultiplier: mpeLookup.multiplier,
        bandDesc: mpeLookup.bandDesc,
        applicableMpe,
        applicableMpeFormatted: `±${applicableMpe} ${unit}`.trim(),
        mpeRuleReference: mpeLookup.clauseRef,
        isPass,
        complianceResult: isPass ? 'PASS' : 'FAIL',
        explanation: `Net load ${obs.referenceNetLoad} ${unit} / e = ${loadInIntervals} e → Band: ${mpeLookup.bandDesc} → MPE multiplier ±${mpeLookup.multiplier}e → MPE = ±${applicableMpe} ${unit}. Net Error = ${MpeRules.formatError(error, unit)}. |Error| ${isPass ? '≤' : '>'} MPE → ${isPass ? 'PASS' : 'FAIL'}.`
      });
    }

    // Aggregate
    let complianceResult;
    if (anyRefReq) complianceResult = 'REFERENCE_REQUIRED';
    else if (anyFail) complianceResult = 'FAIL';
    else complianceResult = 'PASS';

    const badgeHtml = complianceResult === 'PASS'
      ? '<span class="badge good">PASS</span>'
      : complianceResult === 'FAIL'
        ? '<span class="badge bad">FAIL</span>'
        : '<span class="badge warn">REFERENCE REQUIRED</span>';

    const guide = tareModeRaw === 'SUBTRACTIVE'
      ? calculateSubtractiveTareGuidance(numMaxTare)
      : calculateAdditiveTareGuidance(numMaxTare);

    const failCount = evaluatedObs.filter(o => o.complianceResult === 'FAIL').length;
    const explanation = complianceResult === 'PASS'
      ? `Tare net weighing compliant (OIML R 76-1 Annex A.4.6.1): All ${evaluatedObs.length} net load observations satisfy Table 6 MPE applied to net values (Section 3.5.3.3).`
      : complianceResult === 'FAIL'
        ? `Tare net weighing failed: ${failCount} of ${evaluatedObs.length} observations exceeded the applicable net MPE (Table 6, Section 3.5.3.3 / Annex A.4.6.1).`
        : 'One or more observations could not be evaluated against verified OIML R 76-1 net MPE criteria.';

    return {
      subtestId: 'TARE_NET_WEIGHING',
      accuracyClass: normClass,
      evaluationType: evalType,
      tareMode: tareModeRaw,
      maximumTareEffect: numMaxTare,
      e: numE,
      unit,
      guidance: guide,
      requiredLoadSteps: MIN_LOAD_STEPS,
      actualLoadSteps: allObservations.length,
      observations: evaluatedObs,
      complianceResult,
      ruleReference: ruleRef,
      ruleVersion: RULE_VERSION,
      explanation,
      badgeHtml,
      complianceMode: 'VERIFIED_R76'
    };
  }

  // ============================================================
  // SUBTEST B: TARE_SETTING_ACCURACY (Annex A.4.6.2 / Section 4.6.3)
  // Criterion depends on instrument mechanism and multi-interval
  // ============================================================
  function evaluateTareSettingAccuracy(params) {
    const ruleRef = `${RULE_REFERENCE_BASE}\nSection 4.6.3 (Accuracy of tare device)\nAnnex A.4.6.2 (Accuracy of tare setting)`;

    if (!isMpeRulesAvailable()) {
      return {
        subtestId: 'TARE_SETTING_ACCURACY',
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Verified rule package (MpeRules) is unavailable or failed to initialize.',
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    if (!params) {
      return {
        subtestId: 'TARE_SETTING_ACCURACY',
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Missing tare setting accuracy parameters.',
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Validate mechanism
    const mechanism = String(params.instrumentMechanism || '').toUpperCase().trim();
    const VALID_MECHANISMS = ['ELECTRONIC', 'ANALOG', 'MECHANICAL_DIGITAL'];
    if (!VALID_MECHANISMS.includes(mechanism)) {
      return {
        subtestId: 'TARE_SETTING_ACCURACY',
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: `Instrument mechanism "${params.instrumentMechanism}" is not recognized. Valid values: ELECTRONIC, ANALOG, MECHANICAL_DIGITAL.`,
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    const isMultiInterval = !!params.isMultiInterval;
    const unit = params.unit || '';

    // Determine the scale interval to use for comparison
    let scaleIntervalUsed;
    let scaleIntervalLabel;
    let criterionMultiplier;
    let criterionDescription;
    let ruleClause;

    if (mechanism === 'MECHANICAL_DIGITAL') {
      // Section 4.6.3: criterion is ±0.5 d
      const numD = Number(params.d);
      if (isNaN(numD) || numD <= 0) {
        return {
          subtestId: 'TARE_SETTING_ACCURACY',
          instrumentMechanism: mechanism,
          complianceResult: 'REFERENCE_REQUIRED',
          ruleReference: ruleRef,
          ruleVersion: RULE_VERSION,
          explanation: 'Actual scale interval d must be greater than zero for mechanical digital instruments (Section 4.6.3).',
          badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
          complianceMode: 'VERIFIED_R76'
        };
      }
      scaleIntervalUsed = numD;
      scaleIntervalLabel = 'd';
      criterionMultiplier = 0.5;
      criterionDescription = '±0.5 d';
      ruleClause = 'Section 4.6.3 (Mechanical digital: ±0.5 d)';
    } else {
      // ELECTRONIC or ANALOG: criterion is ±0.25 e (or ±0.25 e1 for multi-interval)
      if (isMultiInterval) {
        // Section 4.6.3: use e1 for multi-interval instruments
        const numE1 = Number(params.e1);
        if (isNaN(numE1) || numE1 <= 0) {
          return {
            subtestId: 'TARE_SETTING_ACCURACY',
            instrumentMechanism: mechanism,
            isMultiInterval: true,
            complianceResult: 'REFERENCE_REQUIRED',
            ruleReference: ruleRef,
            ruleVersion: RULE_VERSION,
            explanation: 'Multi-interval tare setting accuracy requires e1 (Section 4.6.3 states e is replaced by e1 for multi-interval instruments). e1 is not configured or is invalid.',
            badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
            complianceMode: 'VERIFIED_R76'
          };
        }
        scaleIntervalUsed = numE1;
        scaleIntervalLabel = 'e1';
        criterionMultiplier = 0.25;
        criterionDescription = '±0.25 e1';
        ruleClause = 'Section 4.6.3 (Multi-interval: ±0.25 e1)';
      } else {
        const numE = Number(params.e);
        if (isNaN(numE) || numE <= 0) {
          return {
            subtestId: 'TARE_SETTING_ACCURACY',
            instrumentMechanism: mechanism,
            complianceResult: 'REFERENCE_REQUIRED',
            ruleReference: ruleRef,
            ruleVersion: RULE_VERSION,
            explanation: 'Verification scale interval e must be greater than zero for electronic/analog tare setting accuracy (Section 4.6.3).',
            badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
            complianceMode: 'VERIFIED_R76'
          };
        }
        scaleIntervalUsed = numE;
        scaleIntervalLabel = 'e';
        criterionMultiplier = 0.25;
        criterionDescription = '±0.25 e';
        ruleClause = 'Section 4.6.3 (Electronic/Analog: ±0.25 e)';
      }
    }

    // Validate measured zero deviation
    const measuredDeviation = Number(params.measuredZeroDeviation);
    if (isNaN(measuredDeviation)) {
      return {
        subtestId: 'TARE_SETTING_ACCURACY',
        instrumentMechanism: mechanism,
        isMultiInterval,
        scaleIntervalUsed,
        scaleIntervalLabel,
        criterionMultiplier,
        criterionDescription,
        ruleClause,
        complianceResult: 'NOT_EVALUATED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Measured zero deviation after tare setting has not been entered.',
        badgeHtml: '<span class="badge warn" style="background:#eaf0f2;color:#355361;">NOT EVALUATED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Calculate allowed deviation: criterionMultiplier × scaleIntervalUsed
    const allowedDeviation = MpeRules.safeMultiply(criterionMultiplier, scaleIntervalUsed);
    const absoluteDeviation = Math.abs(measuredDeviation);
    const EPSILON = 1e-9;
    const isPass = absoluteDeviation <= allowedDeviation + EPSILON;
    const complianceResult = isPass ? 'PASS' : 'FAIL';

    const explanation = `Tare setting accuracy (${ruleClause} / Annex A.4.6.2): ${criterionDescription} = ${criterionMultiplier} × ${scaleIntervalUsed} ${unit} = ${allowedDeviation} ${unit}. Measured zero deviation after tare = ${measuredDeviation} ${unit}. |Deviation| = ${absoluteDeviation} ${unit} ${isPass ? '≤' : '>'} allowed ${allowedDeviation} ${unit} → ${complianceResult}.`;

    return {
      subtestId: 'TARE_SETTING_ACCURACY',
      instrumentMechanism: mechanism,
      isMultiInterval,
      scaleIntervalUsed,
      scaleIntervalLabel,
      criterionMultiplier,
      criterionDescription,
      allowedDeviation,
      measuredZeroDeviation: measuredDeviation,
      absoluteTareZeroDeviation: absoluteDeviation,
      unit,
      isPass,
      complianceResult,
      ruleClause,
      ruleReference: ruleRef,
      ruleVersion: RULE_VERSION,
      explanation,
      badgeHtml: isPass
        ? '<span class="badge good">PASS</span>'
        : '<span class="badge bad">FAIL</span>',
      complianceMode: 'VERIFIED_R76'
    };
  }

  // ============================================================
  // SUBTEST C: TARE_WEIGHING_DEVICE (Annex A.4.6.3 / Section 3.5.3.4)
  // Only applicable if hasTareWeighingDevice = true
  // Section 3.5.3.4: MPE of tare-weighing device = MPE of instrument for same load
  // ============================================================
  function evaluateTareWeighingDevice(params) {
    const ruleRef = `${RULE_REFERENCE_BASE}\nSection 3.5.3.4 (Tare weighing device MPE)\nAnnex A.4.6.3 (Tare weighing device)`;

    if (!isMpeRulesAvailable()) {
      return {
        subtestId: 'TARE_WEIGHING_DEVICE',
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Verified rule package (MpeRules) is unavailable or failed to initialize.',
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    if (!params) {
      return {
        subtestId: 'TARE_WEIGHING_DEVICE',
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Missing tare weighing device parameters.',
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    const normClass = String(params.accuracyClass || '').toUpperCase().trim();
    const VALID_CLASSES = ['I', 'II', 'III', 'IIII'];
    if (!VALID_CLASSES.includes(normClass)) {
      return {
        subtestId: 'TARE_WEIGHING_DEVICE',
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: `Accuracy Class "${params.accuracyClass}" is invalid or not recognized (Section 3.5.3.4).`,
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    const numE = Number(params.e);
    if (isNaN(numE) || numE <= 0) {
      return {
        subtestId: 'TARE_WEIGHING_DEVICE',
        accuracyClass: normClass,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Verification scale interval e must be greater than zero (Section 3.5.3.4).',
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Validate tare reference load and readings
    const referenceTareLoad = Number(params.referenceTareLoad);
    const tareDeviceIndication = Number(params.tareDeviceIndication);
    const mainDeviceIndication = Number(params.mainDeviceIndication);
    const evalType = params.evaluationType || 'INITIAL_VERIFICATION';
    const unit = params.unit || '';

    if (isNaN(referenceTareLoad) || referenceTareLoad <= 0) {
      return {
        subtestId: 'TARE_WEIGHING_DEVICE',
        accuracyClass: normClass,
        complianceResult: 'NOT_EVALUATED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Tare reference load must be a positive number (Annex A.4.6.3).',
        badgeHtml: '<span class="badge warn" style="background:#eaf0f2;color:#355361;">NOT EVALUATED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    if (isNaN(tareDeviceIndication) || isNaN(mainDeviceIndication)) {
      return {
        subtestId: 'TARE_WEIGHING_DEVICE',
        accuracyClass: normClass,
        referenceTareLoad,
        complianceResult: 'NOT_EVALUATED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Tare device indication and main device indication must both be entered for A.4.6.3 evaluation.',
        badgeHtml: '<span class="badge warn" style="background:#eaf0f2;color:#355361;">NOT EVALUATED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Resolve MPE for the tare load value using existing Table 6 engine
    // Section 3.5.3.4: MPE for tare-weighing device = MPE of instrument for same value of load
    const loadInIntervals = MpeRules.calculateLoadInIntervals(referenceTareLoad, numE);
    if (loadInIntervals === null) {
      return {
        subtestId: 'TARE_WEIGHING_DEVICE',
        accuracyClass: normClass,
        referenceTareLoad,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: `Failed to calculate tare load in verification scale intervals (m/e). Tare load: ${referenceTareLoad}, e: ${numE}.`,
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    const mpeLookup = MpeRules.lookupMpeBand(normClass, loadInIntervals, evalType);
    if (!mpeLookup || !mpeLookup.resolved) {
      return {
        subtestId: 'TARE_WEIGHING_DEVICE',
        accuracyClass: normClass,
        referenceTareLoad,
        loadInIntervals,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: mpeLookup ? mpeLookup.reason : 'Unable to resolve Table 6 MPE band for tare load.',
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    const applicableMpe = MpeRules.safeMultiply(mpeLookup.multiplier, numE);
    const EPSILON = 1e-9;

    // Evaluate tare device indication against MPE (Section 3.5.3.4)
    const tareDeviceError = MpeRules.decimalSafeSubtract(tareDeviceIndication, referenceTareLoad);
    const absTareDeviceError = Math.abs(tareDeviceError);
    const tareDevicePass = absTareDeviceError <= applicableMpe + EPSILON;

    // Evaluate main device indication against MPE
    const mainDeviceError = MpeRules.decimalSafeSubtract(mainDeviceIndication, referenceTareLoad);
    const absMainDeviceError = Math.abs(mainDeviceError);
    const mainDevicePass = absMainDeviceError <= applicableMpe + EPSILON;

    // Comparison between tare device and main device (A.4.6.3 — preserve for traceability)
    // NOTE: The exact regulatory acceptance criterion for the DIFFERENCE is not explicitly
    // stated in a separately verified rule. Store and display the comparison only.
    // PASS/FAIL is based only on explicitly verified criteria (Section 3.5.3.4 individual MPE).
    const differenceDevices = MpeRules.decimalSafeSubtract(tareDeviceIndication, mainDeviceIndication);

    const isPass = tareDevicePass && mainDevicePass;
    const complianceResult = isPass ? 'PASS' : 'FAIL';

    const explanation = `Tare weighing device evaluation (Section 3.5.3.4 / Annex A.4.6.3): ` +
      `Reference tare load = ${referenceTareLoad} ${unit} (${loadInIntervals} e). ` +
      `Table 6 MPE multiplier ±${mpeLookup.multiplier}e → Applicable MPE = ±${applicableMpe} ${unit}. ` +
      `Tare device: indication ${tareDeviceIndication} ${unit}, error ${MpeRules.formatError(tareDeviceError, unit)} ${tareDevicePass ? '≤' : '>'} MPE → ${tareDevicePass ? 'PASS' : 'FAIL'}. ` +
      `Main device: indication ${mainDeviceIndication} ${unit}, error ${MpeRules.formatError(mainDeviceError, unit)} ${mainDevicePass ? '≤' : '>'} MPE → ${mainDevicePass ? 'PASS' : 'FAIL'}.`;

    return {
      subtestId: 'TARE_WEIGHING_DEVICE',
      accuracyClass: normClass,
      evaluationType: evalType,
      referenceTareLoad,
      loadInIntervals,
      mpeMultiplier: mpeLookup.multiplier,
      bandDesc: mpeLookup.bandDesc,
      applicableMpe,
      applicableMpeFormatted: `±${applicableMpe} ${unit}`.trim(),
      unit,
      // Tare device
      tareDeviceIndication,
      tareDeviceError,
      tareDeviceErrorFormatted: MpeRules.formatError(tareDeviceError, unit),
      absTareDeviceError,
      tareDevicePass,
      // Main device
      mainDeviceIndication,
      mainDeviceError,
      mainDeviceErrorFormatted: MpeRules.formatError(mainDeviceError, unit),
      absMainDeviceError,
      mainDevicePass,
      // A.4.6.3 comparison (stored for traceability — regulatory PASS/FAIL uses only Section 3.5.3.4)
      differenceDevices,
      differenceDevicesNote: 'Comparison stored per A.4.6.3 for traceability. Regulatory PASS/FAIL criterion per Section 3.5.3.4 only.',
      mpeRuleReference: mpeLookup.clauseRef,
      isPass,
      complianceResult,
      ruleReference: ruleRef,
      ruleVersion: RULE_VERSION,
      explanation,
      badgeHtml: isPass
        ? '<span class="badge good">PASS</span>'
        : '<span class="badge bad">FAIL</span>',
      complianceMode: 'VERIFIED_R76'
    };
  }

  // ============================================================
  // PARENT TARE AGGREGATOR
  // Aggregates all applicable subtests according to configuration
  // ============================================================
  function evaluateTare(params) {
    const ruleRef = `${RULE_REFERENCE_BASE}\nSection 3.5.3.3, Section 3.5.3.4, Section 4.6.3\nAnnex A.4.6.1, A.4.6.2, A.4.6.3`;

    if (!isMpeRulesAvailable()) {
      return {
        testType: 'TARE',
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Verified rule package (MpeRules) is unavailable or failed to initialize.',
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76',
        subtests: {}
      };
    }

    if (!params) {
      return {
        testType: 'TARE',
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference: ruleRef,
        ruleVersion: RULE_VERSION,
        explanation: 'Missing tare evaluation parameters.',
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76',
        subtests: {}
      };
    }

    const subtests = {};

    // Always evaluate TARE_NET_WEIGHING (Annex A.4.6.1 — always applicable)
    subtests.TARE_NET_WEIGHING = evaluateTareNetWeighing({
      accuracyClass: params.accuracyClass,
      evaluationType: params.evaluationType,
      e: params.e,
      unit: params.unit,
      tareMode: params.tareMode,
      maximumTareEffect: params.maximumTareEffect,
      series: params.netWeighingSeries
    });

    // Always evaluate TARE_SETTING_ACCURACY (Annex A.4.6.2 — always applicable for tare device)
    if (params.hasTareDevice !== false) {
      subtests.TARE_SETTING_ACCURACY = evaluateTareSettingAccuracy({
        instrumentMechanism: params.instrumentMechanism,
        isMultiInterval: params.isMultiInterval,
        e: params.e,
        e1: params.e1,
        d: params.d,
        unit: params.unit,
        measuredZeroDeviation: params.tareSettingAccuracy?.measuredZeroDeviation
      });
    }

    // TARE_WEIGHING_DEVICE only if instrument has a tare weighing device
    if (params.hasTareWeighingDevice) {
      subtests.TARE_WEIGHING_DEVICE = evaluateTareWeighingDevice({
        accuracyClass: params.accuracyClass,
        evaluationType: params.evaluationType,
        e: params.e,
        unit: params.unit,
        referenceTareLoad: params.tareWeighingDeviceComparison?.referenceTareLoad,
        tareDeviceIndication: params.tareWeighingDeviceComparison?.tareDeviceIndication,
        mainDeviceIndication: params.tareWeighingDeviceComparison?.mainDeviceIndication
      });
    }

    // Aggregate parent result
    const completedSubtests = Object.values(subtests);
    let parentResult;

    if (completedSubtests.some(s => s.complianceResult === 'REFERENCE_REQUIRED')) {
      parentResult = 'REFERENCE_REQUIRED';
    } else if (completedSubtests.some(s => s.complianceResult === 'FAIL')) {
      parentResult = 'FAIL';
    } else if (completedSubtests.some(s => s.complianceResult === 'NOT_EVALUATED')) {
      parentResult = 'NOT_EVALUATED';
    } else if (completedSubtests.every(s => s.complianceResult === 'PASS')) {
      parentResult = 'PASS';
    } else {
      parentResult = 'REFERENCE_REQUIRED';
    }

    const badgeHtml = parentResult === 'PASS'
      ? '<span class="badge good">PASS</span>'
      : parentResult === 'FAIL'
        ? '<span class="badge bad">FAIL</span>'
        : parentResult === 'NOT_EVALUATED'
          ? '<span class="badge warn" style="background:#eaf0f2;color:#355361;">NOT EVALUATED</span>'
          : '<span class="badge warn">REFERENCE REQUIRED</span>';

    const passCount = completedSubtests.filter(s => s.complianceResult === 'PASS').length;
    const explanation = `Parent TARE result: ${parentResult}. Subtests evaluated: ${completedSubtests.length}. Passed: ${passCount}/${completedSubtests.length}. Subtests: ${Object.keys(subtests).join(', ')}.`;

    return {
      testType: 'TARE',
      accuracyClass: String(params.accuracyClass || '').toUpperCase().trim(),
      evaluationType: params.evaluationType || 'INITIAL_VERIFICATION',
      tareMode: params.tareMode,
      maximumTareEffect: params.maximumTareEffect,
      hasTareDevice: params.hasTareDevice !== false,
      hasTareWeighingDevice: !!params.hasTareWeighingDevice,
      instrumentMechanism: params.instrumentMechanism,
      isMultiInterval: !!params.isMultiInterval,
      subtests,
      complianceResult: parentResult,
      ruleReference: ruleRef,
      ruleVersion: RULE_VERSION,
      explanation,
      badgeHtml,
      complianceMode: 'VERIFIED_R76'
    };
  }

  return Object.freeze({
    TARE_MODES,
    INSTRUMENT_MECHANISMS,
    MIN_LOAD_STEPS,
    calculateSubtractiveTareGuidance,
    calculateAdditiveTareGuidance,
    evaluateTareNetWeighing,
    evaluateTareSettingAccuracy,
    evaluateTareWeighingDevice,
    evaluateTare
  });
});
