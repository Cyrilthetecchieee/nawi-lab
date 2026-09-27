/**
 * OIML R 76-1:2006 Repeatability Rules Engine
 * Normative Implementation for REPEATABILITY
 *
 * References:
 * - OIML R 76-1 Edition 2006 (E)
 * - Section 3.6.1: Repeatability
 * - Annex A.4.10: Repeatability test
 * - Reuses Section 3.5.1 Table 6 MPE Engine
 */
(function(root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    const metadata = (typeof require === 'function') ? require('./metadata.js') : null;
    const mpeRules = (typeof require === 'function') ? require('./mpeRules.js') : null;
    module.exports = factory(metadata, mpeRules);
  } else {
    root.OimlR76RepeatabilityRules = factory(root.OimlR76Metadata, root.OimlR76MpeRules);
  }
})(typeof self !== 'undefined' ? self : this, function(Metadata, MpeRules) {
  'use strict';

  // Annex A.4.10: Required repetitions by Accuracy Class
  const REQUIRED_REPETITIONS = Object.freeze({
    'I': 6,
    'II': 6,
    'III': 3,
    'IIII': 3
  });

  // Calculate target verification test load: ~0.8 Max
  function calculateTargetTestLoad(maxCapacity) {
    const max = Number(maxCapacity);
    if (isNaN(max) || max <= 0) return null;
    return Number((max * 0.8).toFixed(4));
  }

  // Primary evaluation function for a REPEATABILITY series
  function evaluateRepeatabilitySeries(params) {
    const ruleVersion = (Metadata && Metadata.edition) ? `OIML R 76-1:${Metadata.edition}` : 'OIML R 76-1:2006';
    const ruleReference = 'OIML R 76-1:2006 Section 3.6.1, Annex A.4.10';

    // Safety check 1: MpeRules availability
    if (!MpeRules || typeof MpeRules.lookupMpeBand !== 'function') {
      return {
        testType: 'REPEATABILITY',
        seriesId: params?.seriesId || 'RPT-SERIES',
        accuracyClass: params?.accuracyClass,
        evaluationType: params?.evaluationType,
        referenceLoad: params?.referenceLoad,
        maxCapacity: params?.maxCapacity || params?.max,
        targetTestLoad: calculateTargetTestLoad(params?.maxCapacity || params?.max),
        requiredRepetitions: null,
        actualRepetitions: 0,
        indications: [],
        highestIndication: null,
        lowestIndication: null,
        repeatabilityDifference: null,
        loadInIntervals: null,
        mpeMultiplier: null,
        applicableMpe: null,
        applicableMpeFormatted: 'REFERENCE REQUIRED',
        individualResults: [],
        allIndividualResultsWithinMpe: false,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference,
        mpeRuleReference: 'OIML R 76-1:2006 Table 6 (Unavailable)',
        ruleVersion,
        explanation: 'Verified rule package is unavailable or failed to initialize.',
        isNearLimit: false,
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    if (!params) {
      return {
        testType: 'REPEATABILITY',
        seriesId: 'RPT-SERIES',
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference,
        ruleVersion,
        explanation: 'Missing repeatability evaluation parameters.',
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    const normClass = String(params.accuracyClass || '').toUpperCase().trim();
    const requiredRepetitions = REQUIRED_REPETITIONS[normClass];
    const maxCapacity = Number(params.maxCapacity || params.max);
    const targetTestLoad = calculateTargetTestLoad(maxCapacity);

    // Safety check 2: Validate accuracy class
    if (!requiredRepetitions) {
      return {
        testType: 'REPEATABILITY',
        seriesId: params.seriesId || 'RPT-SERIES',
        accuracyClass: params.accuracyClass,
        evaluationType: params.evaluationType,
        referenceLoad: params.referenceLoad,
        maxCapacity,
        targetTestLoad,
        requiredRepetitions: null,
        actualRepetitions: (params.indications || params.readings || []).length,
        indications: params.indications || [],
        highestIndication: null,
        lowestIndication: null,
        repeatabilityDifference: null,
        loadInIntervals: null,
        mpeMultiplier: null,
        applicableMpe: null,
        applicableMpeFormatted: 'REFERENCE REQUIRED',
        individualResults: [],
        allIndividualResultsWithinMpe: false,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference,
        mpeRuleReference: 'OIML R 76-1:2006 Table 6 (Unresolved)',
        ruleVersion,
        explanation: `Accuracy Class "${params.accuracyClass}" is invalid or not recognized under OIML R 76-1. Valid classes: I, II, III, IIII.`,
        isNearLimit: false,
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Safety check 3: Validate verification scale interval e
    const numE = Number(params.e);
    if (isNaN(numE) || numE <= 0) {
      return {
        testType: 'REPEATABILITY',
        seriesId: params.seriesId || 'RPT-SERIES',
        accuracyClass: normClass,
        evaluationType: params.evaluationType,
        referenceLoad: params.referenceLoad,
        maxCapacity,
        targetTestLoad,
        requiredRepetitions,
        actualRepetitions: (params.indications || params.readings || []).length,
        indications: params.indications || [],
        highestIndication: null,
        lowestIndication: null,
        repeatabilityDifference: null,
        loadInIntervals: null,
        mpeMultiplier: null,
        applicableMpe: null,
        applicableMpeFormatted: 'REFERENCE REQUIRED',
        individualResults: [],
        allIndividualResultsWithinMpe: false,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference,
        mpeRuleReference: 'OIML R 76-1:2006 Table 6 (Parameter Error)',
        ruleVersion,
        explanation: 'Verification scale interval e must be greater than zero.',
        isNearLimit: false,
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Safety check 4: Validate reference load and extract readings
    let refLoad = (params.referenceLoad !== undefined && params.referenceLoad !== null && params.referenceLoad !== '')
      ? Number(params.referenceLoad)
      : NaN;

    const rawReadings = params.readings || params.indications || [];
    const indications = [];
    const obsRefLoads = [];

    for (let i = 0; i < rawReadings.length; i++) {
      const item = rawReadings[i];
      if (typeof item === 'object' && item !== null) {
        if (item.reference !== undefined && item.reference !== null && item.reference !== '') {
          obsRefLoads.push(Number(item.reference));
        }
        const val = (item.indication !== undefined && item.indication !== null)
          ? item.indication
          : (item.scaleReading !== undefined ? item.scaleReading : item.reading);
        const indVal = Number(val);
        if (isNaN(indVal)) {
          return {
            testType: 'REPEATABILITY',
            seriesId: params.seriesId || 'RPT-SERIES',
            accuracyClass: normClass,
            evaluationType: params.evaluationType,
            referenceLoad: isNaN(refLoad) ? null : refLoad,
            maxCapacity,
            targetTestLoad,
            requiredRepetitions,
            actualRepetitions: rawReadings.length,
            indications: [],
            highestIndication: null,
            lowestIndication: null,
            repeatabilityDifference: null,
            loadInIntervals: null,
            mpeMultiplier: null,
            applicableMpe: null,
            applicableMpeFormatted: 'REFERENCE REQUIRED',
            individualResults: [],
            allIndividualResultsWithinMpe: false,
            complianceResult: 'REFERENCE_REQUIRED',
            ruleReference,
            mpeRuleReference: 'OIML R 76-1:2006 Table 6',
            ruleVersion,
            explanation: `Reading ${i + 1} contains invalid numeric data.`,
            isNearLimit: false,
            badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
            complianceMode: 'VERIFIED_R76'
          };
        }
        indications.push(indVal);
      } else {
        const indVal = Number(item);
        if (isNaN(indVal)) {
          return {
            testType: 'REPEATABILITY',
            seriesId: params.seriesId || 'RPT-SERIES',
            accuracyClass: normClass,
            evaluationType: params.evaluationType,
            referenceLoad: isNaN(refLoad) ? null : refLoad,
            maxCapacity,
            targetTestLoad,
            requiredRepetitions,
            actualRepetitions: rawReadings.length,
            indications: [],
            highestIndication: null,
            lowestIndication: null,
            repeatabilityDifference: null,
            loadInIntervals: null,
            mpeMultiplier: null,
            applicableMpe: null,
            applicableMpeFormatted: 'REFERENCE REQUIRED',
            individualResults: [],
            allIndividualResultsWithinMpe: false,
            complianceResult: 'REFERENCE_REQUIRED',
            ruleReference,
            mpeRuleReference: 'OIML R 76-1:2006 Table 6',
            ruleVersion,
            explanation: `Reading ${i + 1} contains invalid numeric data.`,
            isNearLimit: false,
            badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
            complianceMode: 'VERIFIED_R76'
          };
        }
        indications.push(indVal);
      }
    }

    // Infer reference load if not explicitly supplied
    if (isNaN(refLoad) && obsRefLoads.length > 0) {
      refLoad = obsRefLoads[0];
    }

    if (isNaN(refLoad) || refLoad < 0) {
      return {
        testType: 'REPEATABILITY',
        seriesId: params.seriesId || 'RPT-SERIES',
        accuracyClass: normClass,
        evaluationType: params.evaluationType,
        referenceLoad: null,
        maxCapacity,
        targetTestLoad,
        requiredRepetitions,
        actualRepetitions: indications.length,
        indications,
        highestIndication: null,
        lowestIndication: null,
        repeatabilityDifference: null,
        loadInIntervals: null,
        mpeMultiplier: null,
        applicableMpe: null,
        applicableMpeFormatted: 'REFERENCE REQUIRED',
        individualResults: [],
        allIndividualResultsWithinMpe: false,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference,
        mpeRuleReference: 'OIML R 76-1:2006 Table 6',
        ruleVersion,
        explanation: 'Reference standard test load must be a non-negative number.',
        isNearLimit: false,
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Safety check 5: Consistency of reference load across observations
    for (let k = 0; k < obsRefLoads.length; k++) {
      if (Math.abs(obsRefLoads[k] - refLoad) > 1e-9) {
        return {
          testType: 'REPEATABILITY',
          seriesId: params.seriesId || 'RPT-SERIES',
          accuracyClass: normClass,
          evaluationType: params.evaluationType,
          referenceLoad: refLoad,
          maxCapacity,
          targetTestLoad,
          requiredRepetitions,
          actualRepetitions: indications.length,
          indications,
          highestIndication: null,
          lowestIndication: null,
          repeatabilityDifference: null,
          loadInIntervals: null,
          mpeMultiplier: null,
          applicableMpe: null,
          applicableMpeFormatted: 'REFERENCE REQUIRED',
          individualResults: [],
          allIndividualResultsWithinMpe: false,
          complianceResult: 'REFERENCE_REQUIRED',
          ruleReference,
          mpeRuleReference: 'OIML R 76-1:2006 Table 6',
          ruleVersion,
          explanation: `Inconsistent reference loads detected in repeatability series. Reading ${k + 1} has load ${obsRefLoads[k]}, expected ${refLoad}. All readings in one repeatability series must use the identical reference load.`,
          isNearLimit: false,
          badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
          complianceMode: 'VERIFIED_R76'
        };
      }
    }

    // Calculate loadInIntervals using verified MpeRules
    const loadInIntervals = MpeRules.calculateLoadInIntervals(refLoad, numE);
    if (loadInIntervals === null) {
      return {
        testType: 'REPEATABILITY',
        seriesId: params.seriesId || 'RPT-SERIES',
        accuracyClass: normClass,
        evaluationType: params.evaluationType,
        referenceLoad: refLoad,
        maxCapacity,
        targetTestLoad,
        requiredRepetitions,
        actualRepetitions: indications.length,
        indications,
        highestIndication: null,
        lowestIndication: null,
        repeatabilityDifference: null,
        loadInIntervals: null,
        mpeMultiplier: null,
        applicableMpe: null,
        applicableMpeFormatted: 'REFERENCE REQUIRED',
        individualResults: [],
        allIndividualResultsWithinMpe: false,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference,
        mpeRuleReference: 'OIML R 76-1:2006 Table 6',
        ruleVersion,
        explanation: 'Failed to calculate load in verification scale intervals (m / e).',
        isNearLimit: false,
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Safety check 6: Resolve Table 6 MPE
    const evalType = params.evaluationType || 'INITIAL_VERIFICATION';
    const mpeLookup = MpeRules.lookupMpeBand(normClass, loadInIntervals, evalType);
    if (!mpeLookup || !mpeLookup.resolved) {
      return {
        testType: 'REPEATABILITY',
        seriesId: params.seriesId || 'RPT-SERIES',
        accuracyClass: normClass,
        evaluationType: evalType,
        referenceLoad: refLoad,
        maxCapacity,
        targetTestLoad,
        requiredRepetitions,
        actualRepetitions: indications.length,
        indications,
        highestIndication: null,
        lowestIndication: null,
        repeatabilityDifference: null,
        loadInIntervals,
        mpeMultiplier: null,
        applicableMpe: null,
        applicableMpeFormatted: 'REFERENCE REQUIRED',
        individualResults: [],
        allIndividualResultsWithinMpe: false,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference,
        mpeRuleReference: 'OIML R 76-1:2006 Table 6 (Scope Exceeded)',
        ruleVersion,
        explanation: mpeLookup ? mpeLookup.reason : 'Unable to resolve Table 6 MPE band for repeatability test load.',
        isNearLimit: false,
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    const applicableMpe = MpeRules.safeMultiply(mpeLookup.multiplier, numE);
    const absApplicableMpe = Math.abs(applicableMpe);
    const unit = params.unit || '';

    // Safety check 7: Incomplete repetitions -> NOT_EVALUATED
    const actualRepetitions = indications.length;
    if (actualRepetitions < requiredRepetitions) {
      return {
        testType: 'REPEATABILITY',
        seriesId: params.seriesId || 'RPT-SERIES',
        accuracyClass: normClass,
        evaluationType: evalType,
        referenceLoad: refLoad,
        maxCapacity,
        targetTestLoad,
        requiredRepetitions,
        actualRepetitions,
        indications,
        highestIndication: indications.length > 0 ? Math.max(...indications) : null,
        lowestIndication: indications.length > 0 ? Math.min(...indications) : null,
        repeatabilityDifference: indications.length > 1 ? MpeRules.decimalSafeSubtract(Math.max(...indications), Math.min(...indications)) : null,
        loadInIntervals,
        mpeMultiplier: mpeLookup.multiplier,
        applicableMpe,
        applicableMpeFormatted: `±${applicableMpe} ${unit}`.trim(),
        individualResults: [],
        allIndividualResultsWithinMpe: false,
        complianceResult: 'NOT_EVALUATED',
        ruleReference,
        mpeRuleReference: mpeLookup.clauseRef,
        ruleVersion,
        explanation: `Additional repeatability observations required. (Completed ${actualRepetitions} of ${requiredRepetitions} required weighings for Class ${normClass} under Annex A.4.10).`,
        isNearLimit: false,
        badgeHtml: '<span class="badge warn" style="background:#eaf0f2;color:#355361;">NOT EVALUATED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Step 8: Calculate highest, lowest, repeatability difference
    const highestIndication = Math.max(...indications);
    const lowestIndication = Math.min(...indications);
    const repeatabilityDifference = MpeRules.decimalSafeSubtract(highestIndication, lowestIndication);

    // Evaluate individual weighing compliance
    const EPSILON = 1e-9;
    const individualResults = indications.map((ind, idx) => {
      const err = MpeRules.decimalSafeSubtract(ind, refLoad);
      const absErr = Math.abs(err);
      const isPass = (absErr <= absApplicableMpe + EPSILON);
      return {
        sequenceNumber: idx + 1,
        indication: ind,
        error: err,
        errorFormatted: MpeRules.formatError(err, unit),
        absoluteError: absErr,
        applicableMpe,
        isPass
      };
    });

    const allIndividualResultsWithinMpe = individualResults.every(r => r.isPass);
    const diffWithinMpe = (repeatabilityDifference <= absApplicableMpe + EPSILON);

    // Final compliance decision
    const isPass = diffWithinMpe && allIndividualResultsWithinMpe;
    const complianceResult = isPass ? 'PASS' : 'FAIL';

    let explanation = '';
    if (isPass) {
      explanation = `Repeatability compliant (OIML R 76-1 Section 3.6.1): Difference between maximum (${highestIndication} ${unit}) and minimum (${lowestIndication} ${unit}) indications is ${repeatabilityDifference} ${unit} ≤ absolute MPE (${absApplicableMpe} ${unit}). All ${actualRepetitions} individual weighings satisfy applicable MPE (±${applicableMpe} ${unit}).`;
    } else if (!diffWithinMpe && !allIndividualResultsWithinMpe) {
      explanation = `Repeatability failed: Difference between indications (${repeatabilityDifference} ${unit}) exceeds absolute MPE (${absApplicableMpe} ${unit}), and one or more individual weighings exceeded applicable MPE.`;
    } else if (!diffWithinMpe) {
      explanation = `Repeatability failed: Difference between highest (${highestIndication} ${unit}) and lowest (${lowestIndication} ${unit}) indication is ${repeatabilityDifference} ${unit}, exceeding absolute MPE (${absApplicableMpe} ${unit}).`;
    } else {
      explanation = `Repeatability failed: Although repeatability difference (${repeatabilityDifference} ${unit}) is within MPE (${absApplicableMpe} ${unit}), one or more individual weighings exceeded permissible error. Series cannot be reported as compliant.`;
    }

    const badgeHtml = isPass
      ? '<span class="badge good">PASS</span>'
      : '<span class="badge bad">FAIL</span>';

    return {
      testType: 'REPEATABILITY',
      seriesId: params.seriesId || 'RPT-SERIES',
      accuracyClass: normClass,
      evaluationType: evalType,
      referenceLoad: refLoad,
      maxCapacity,
      targetTestLoad,
      requiredRepetitions,
      actualRepetitions,
      indications,
      highestIndication,
      lowestIndication,
      repeatabilityDifference,
      loadInIntervals,
      mpeMultiplier: mpeLookup.multiplier,
      applicableMpe,
      applicableMpeFormatted: `±${applicableMpe} ${unit}`.trim(),
      individualResults,
      allIndividualResultsWithinMpe,
      complianceResult,
      ruleReference,
      mpeRuleReference: mpeLookup.clauseRef,
      ruleVersion,
      explanation,
      isNearLimit: false,
      badgeHtml,
      complianceMode: 'VERIFIED_R76'
    };
  }

  return Object.freeze({
    REQUIRED_REPETITIONS,
    calculateTargetTestLoad,
    evaluateRepeatabilitySeries
  });
});
