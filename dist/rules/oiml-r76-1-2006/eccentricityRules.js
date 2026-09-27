/**
 * OIML R 76-1:2006 Eccentric Loading Rules Engine
 * Normative Implementation for ECCENTRIC_LOADING
 *
 * References:
 * - OIML R 76-1 Edition 2006 (E)
 * - Section 3.6.2: Eccentric loading
 *   - Section 3.6.2.1: Instruments with not more than four points of support (General)
 *   - Section 3.6.2.2: Instruments with more than four points of support
 *   - Section 3.6.2.3: Instruments with load receptor subject to minimal off-centre loading (tanks/hoppers)
 *   - Section 3.6.2.4: Instruments for weighing rolling loads (vehicle scales)
 * - Annex A.4.7: Eccentricity test
 * - Reuses Section 3.5.1 Table 6 MPE Engine
 */
(function(root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    const metadata = (typeof require === 'function') ? require('./metadata.js') : null;
    const mpeRules = (typeof require === 'function') ? require('./mpeRules.js') : null;
    module.exports = factory(metadata, mpeRules);
  } else {
    root.OimlR76EccentricityRules = factory(root.OimlR76Metadata, root.OimlR76MpeRules);
  }
})(typeof self !== 'undefined' ? self : this, function(Metadata, MpeRules) {
  'use strict';

  // Supported normative eccentric test procedure types (Section 3.6.2.1 - 3.6.2.4)
  const PROCEDURE_TYPES = Object.freeze({
    GENERAL: 'GENERAL',
    MORE_THAN_FOUR_SUPPORTS: 'MORE_THAN_FOUR_SUPPORTS',
    MULTI_SUPPORT: 'MORE_THAN_FOUR_SUPPORTS', // alias
    MINIMAL_OFF_CENTRE: 'MINIMAL_OFF_CENTRE',
    ROLLING_LOAD: 'ROLLING_LOAD'
  });

  function normalizeProcedureType(proc) {
    const str = String(proc || '').toUpperCase().trim().replace(/[\s-]/g, '_');
    if (str.includes('ROLLING')) return PROCEDURE_TYPES.ROLLING_LOAD;
    if (str.includes('MINIMAL') || str.includes('TANK') || str.includes('HOPPER')) return PROCEDURE_TYPES.MINIMAL_OFF_CENTRE;
    if (str.includes('MULTI') || str.includes('MORE_THAN_FOUR') || str.includes('MORE_THAN_4')) return PROCEDURE_TYPES.MORE_THAN_FOUR_SUPPORTS;
    if (str.includes('GENERAL') || str.includes('CORNER') || str.includes('STANDARD')) return PROCEDURE_TYPES.GENERAL;
    return str || PROCEDURE_TYPES.GENERAL;
  }

  // Calculate regulatory test load and upper bounds per Section 3.6.2
  function calculateRequiredTestLoad(params) {
    const maxCapacity = Number(params?.maxCapacity || params?.max);
    if (isNaN(maxCapacity) || maxCapacity <= 0) return null;

    const additiveTare = Number(params?.maximumAdditiveTareEffect || params?.additiveTare || 0);
    const validAdditiveTare = (!isNaN(additiveTare) && additiveTare >= 0) ? additiveTare : 0;
    const effectiveTotal = maxCapacity + validAdditiveTare;

    const procType = normalizeProcedureType(params?.procedureType || params?.loadReceptorType);

    switch (procType) {
      case PROCEDURE_TYPES.GENERAL:
        return {
          procedureType: PROCEDURE_TYPES.GENERAL,
          specificClause: 'Section 3.6.2.1',
          testLoadFormula: '1/3 × (Max + additive tare)',
          calculatedTestLoad: Number((effectiveTotal / 3).toFixed(4)),
          maximumAdditiveTareEffect: validAdditiveTare,
          numberOfSupports: 4,
          maxCapacity
        };

      case PROCEDURE_TYPES.MORE_THAN_FOUR_SUPPORTS: {
        const numSupports = Number(params?.numberOfSupports || params?.supports);
        if (isNaN(numSupports) || numSupports <= 4) {
          return {
            procedureType: PROCEDURE_TYPES.MORE_THAN_FOUR_SUPPORTS,
            specificClause: 'Section 3.6.2.2',
            testLoadFormula: '1 / (n - 1) × (Max + additive tare)',
            calculatedTestLoad: null,
            maximumAdditiveTareEffect: validAdditiveTare,
            numberOfSupports: numSupports,
            maxCapacity,
            error: 'numberOfSupports must be greater than 4 for MORE_THAN_FOUR_SUPPORTS procedure.'
          };
        }
        return {
          procedureType: PROCEDURE_TYPES.MORE_THAN_FOUR_SUPPORTS,
          specificClause: 'Section 3.6.2.2',
          testLoadFormula: `1 / (${numSupports} - 1) × (Max + additive tare)`,
          calculatedTestLoad: Number((effectiveTotal / (numSupports - 1)).toFixed(4)),
          maximumAdditiveTareEffect: validAdditiveTare,
          numberOfSupports: numSupports,
          maxCapacity
        };
      }

      case PROCEDURE_TYPES.MINIMAL_OFF_CENTRE: {
        const numSupports = Number(params?.numberOfSupports || params?.supports || 4);
        return {
          procedureType: PROCEDURE_TYPES.MINIMAL_OFF_CENTRE,
          specificClause: 'Section 3.6.2.3',
          testLoadFormula: '1/10 × (Max + additive tare)',
          calculatedTestLoad: Number((effectiveTotal / 10).toFixed(4)),
          maximumAdditiveTareEffect: validAdditiveTare,
          numberOfSupports: numSupports,
          maxCapacity
        };
      }

      case PROCEDURE_TYPES.ROLLING_LOAD: {
        const rollingUpperBound = Number((0.8 * effectiveTotal).toFixed(4));
        const rollingLoad = (params?.rollingTestLoad !== undefined && params?.rollingTestLoad !== null && params?.rollingTestLoad !== '')
          ? Number(params.rollingTestLoad)
          : null;
        return {
          procedureType: PROCEDURE_TYPES.ROLLING_LOAD,
          specificClause: 'Section 3.6.2.4',
          testLoadFormula: 'Usual rolling load ≤ 0.8 × (Max + additive tare)',
          rollingLoadUpperBound: rollingUpperBound,
          rollingTestLoad: rollingLoad,
          calculatedTestLoad: rollingLoad,
          maximumAdditiveTareEffect: validAdditiveTare,
          numberOfSupports: Number(params?.numberOfSupports || 4),
          maxCapacity
        };
      }

      default:
        return null;
    }
  }

  // Default position templates according to procedure and supports
  function getDefaultPositions(procedureType, numberOfSupports = 4) {
    const norm = normalizeProcedureType(procedureType);
    if (norm === PROCEDURE_TYPES.GENERAL) {
      return [
        { positionId: 'POS-1', positionLabel: 'Position 1 (Front-Left quarter segment)', sequenceNumber: 1 },
        { positionId: 'POS-2', positionLabel: 'Position 2 (Front-Right quarter segment)', sequenceNumber: 2 },
        { positionId: 'POS-3', positionLabel: 'Position 3 (Rear-Right quarter segment)', sequenceNumber: 3 },
        { positionId: 'POS-4', positionLabel: 'Position 4 (Rear-Left quarter segment)', sequenceNumber: 4 }
      ];
    }
    if (norm === PROCEDURE_TYPES.MORE_THAN_FOUR_SUPPORTS) {
      const n = Math.max(5, Number(numberOfSupports) || 6);
      return Array.from({ length: n }, (_, i) => ({
        positionId: `SUP-${i + 1}`,
        positionLabel: `Support Point ${i + 1}`,
        sequenceNumber: i + 1
      }));
    }
    if (norm === PROCEDURE_TYPES.MINIMAL_OFF_CENTRE) {
      const n = Math.max(3, Number(numberOfSupports) || 4);
      return Array.from({ length: n }, (_, i) => ({
        positionId: `SUP-${i + 1}`,
        positionLabel: `Support Point ${i + 1}`,
        sequenceNumber: i + 1
      }));
    }
    if (norm === PROCEDURE_TYPES.ROLLING_LOAD) {
      return [
        { positionId: 'TRK-1', positionLabel: 'Position 1 (Approach End)', sequenceNumber: 1 },
        { positionId: 'TRK-2', positionLabel: 'Position 2 (Middle of Platform)', sequenceNumber: 2 },
        { positionId: 'TRK-3', positionLabel: 'Position 3 (Departure End)', sequenceNumber: 3 }
      ];
    }
    return [
      { positionId: 'POS-1', positionLabel: 'Position 1', sequenceNumber: 1 },
      { positionId: 'POS-2', positionLabel: 'Position 2', sequenceNumber: 2 },
      { positionId: 'POS-3', positionLabel: 'Position 3', sequenceNumber: 3 },
      { positionId: 'POS-4', positionLabel: 'Position 4', sequenceNumber: 4 }
    ];
  }

  // Primary evaluation function for an ECCENTRIC_LOADING series
  function evaluateEccentricSeries(params) {
    const ruleVersion = (Metadata && Metadata.edition) ? `OIML R 76-1:${Metadata.edition}` : 'OIML R 76-1:2006';
    const ruleReference = 'OIML R 76-1:2006 Section 3.6.2, Annex A.4.7';

    // Safety check 1: MpeRules availability
    if (!MpeRules || typeof MpeRules.lookupMpeBand !== 'function') {
      return {
        testType: 'ECCENTRIC_LOADING',
        seriesId: params?.seriesId || 'ECC-SERIES',
        accuracyClass: params?.accuracyClass,
        evaluationType: params?.evaluationType,
        procedureType: params?.procedureType,
        specificClause: 'Section 3.6.2',
        maxCapacity: params?.maxCapacity || params?.max,
        maximumAdditiveTareEffect: params?.maximumAdditiveTareEffect || 0,
        numberOfSupports: params?.numberOfSupports,
        testLoadFormula: '',
        calculatedTestLoad: null,
        referenceLoad: params?.referenceLoad,
        positions: [],
        requiredPositionsCount: 0,
        actualPositionsCount: 0,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference,
        mpeRuleReference: 'OIML R 76-1:2006 Table 6 (Unavailable)',
        ruleVersion,
        explanation: 'Verified rule package is unavailable or failed to initialize.',
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    if (!params) {
      return {
        testType: 'ECCENTRIC_LOADING',
        seriesId: 'ECC-SERIES',
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference,
        ruleVersion,
        explanation: 'Missing eccentric loading evaluation parameters.',
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    const normClass = String(params.accuracyClass || '').toUpperCase().trim();
    const VALID_CLASSES = ['I', 'II', 'III', 'IIII'];

    // Safety check 2: Validate accuracy class
    if (!VALID_CLASSES.includes(normClass)) {
      return {
        testType: 'ECCENTRIC_LOADING',
        seriesId: params.seriesId || 'ECC-SERIES',
        accuracyClass: params.accuracyClass,
        evaluationType: params.evaluationType,
        procedureType: params.procedureType,
        specificClause: 'Section 3.6.2',
        maxCapacity: params.maxCapacity || params.max,
        maximumAdditiveTareEffect: params.maximumAdditiveTareEffect || 0,
        numberOfSupports: params.numberOfSupports,
        testLoadFormula: '',
        calculatedTestLoad: null,
        referenceLoad: params.referenceLoad,
        positions: [],
        requiredPositionsCount: 0,
        actualPositionsCount: 0,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference,
        mpeRuleReference: 'OIML R 76-1:2006 Table 6',
        ruleVersion,
        explanation: `Accuracy Class "${params.accuracyClass}" is invalid or not recognized under OIML R 76-1. Valid classes: I, II, III, IIII.`,
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Safety check 3: Validate verification scale interval e
    const numE = Number(params.e);
    if (isNaN(numE) || numE <= 0) {
      return {
        testType: 'ECCENTRIC_LOADING',
        seriesId: params.seriesId || 'ECC-SERIES',
        accuracyClass: normClass,
        evaluationType: params.evaluationType,
        procedureType: params.procedureType,
        specificClause: 'Section 3.6.2',
        maxCapacity: params.maxCapacity || params.max,
        maximumAdditiveTareEffect: params.maximumAdditiveTareEffect || 0,
        numberOfSupports: params.numberOfSupports,
        testLoadFormula: '',
        calculatedTestLoad: null,
        referenceLoad: params.referenceLoad,
        positions: [],
        requiredPositionsCount: 0,
        actualPositionsCount: 0,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference,
        mpeRuleReference: 'OIML R 76-1:2006 Table 6',
        ruleVersion,
        explanation: 'Verification scale interval e must be greater than zero.',
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Safety check 4: Validate procedure type
    const rawProcType = params.procedureType || params.loadReceptorType || 'GENERAL';
    const procType = normalizeProcedureType(rawProcType);
    const VALID_PROC_TYPES = [
      PROCEDURE_TYPES.GENERAL,
      PROCEDURE_TYPES.MORE_THAN_FOUR_SUPPORTS,
      PROCEDURE_TYPES.MINIMAL_OFF_CENTRE,
      PROCEDURE_TYPES.ROLLING_LOAD
    ];

    if (!VALID_PROC_TYPES.includes(procType)) {
      return {
        testType: 'ECCENTRIC_LOADING',
        seriesId: params.seriesId || 'ECC-SERIES',
        accuracyClass: normClass,
        evaluationType: params.evaluationType,
        procedureType: rawProcType,
        specificClause: 'Section 3.6.2',
        maxCapacity: params.maxCapacity || params.max,
        maximumAdditiveTareEffect: params.maximumAdditiveTareEffect || 0,
        numberOfSupports: params.numberOfSupports,
        testLoadFormula: '',
        calculatedTestLoad: null,
        referenceLoad: params.referenceLoad,
        positions: [],
        requiredPositionsCount: 0,
        actualPositionsCount: 0,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference,
        mpeRuleReference: 'OIML R 76-1:2006 Table 6',
        ruleVersion,
        explanation: `Eccentric procedure type "${rawProcType}" is invalid. Supported procedures: GENERAL, MORE_THAN_FOUR_SUPPORTS, MINIMAL_OFF_CENTRE, ROLLING_LOAD.`,
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Safety check 5: Calculate regulatory test load configuration
    const config = calculateRequiredTestLoad({
      maxCapacity: params.maxCapacity || params.max,
      maximumAdditiveTareEffect: params.maximumAdditiveTareEffect,
      numberOfSupports: params.numberOfSupports,
      procedureType: procType,
      rollingTestLoad: params.rollingTestLoad
    });

    if (!config) {
      return {
        testType: 'ECCENTRIC_LOADING',
        seriesId: params.seriesId || 'ECC-SERIES',
        accuracyClass: normClass,
        evaluationType: params.evaluationType,
        procedureType: procType,
        specificClause: 'Section 3.6.2',
        maxCapacity: params.maxCapacity || params.max,
        maximumAdditiveTareEffect: params.maximumAdditiveTareEffect || 0,
        numberOfSupports: params.numberOfSupports,
        testLoadFormula: '',
        calculatedTestLoad: null,
        referenceLoad: params.referenceLoad,
        positions: [],
        requiredPositionsCount: 0,
        actualPositionsCount: 0,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference,
        mpeRuleReference: 'OIML R 76-1:2006 Table 6',
        ruleVersion,
        explanation: 'Invalid instrument capacity or configuration for eccentric test load calculation.',
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Validate MORE_THAN_FOUR_SUPPORTS numberOfSupports > 4
    if (procType === PROCEDURE_TYPES.MORE_THAN_FOUR_SUPPORTS && (isNaN(config.numberOfSupports) || config.numberOfSupports <= 4)) {
      return {
        testType: 'ECCENTRIC_LOADING',
        seriesId: params.seriesId || 'ECC-SERIES',
        accuracyClass: normClass,
        evaluationType: params.evaluationType,
        procedureType: procType,
        specificClause: 'Section 3.6.2.2',
        maxCapacity: config.maxCapacity,
        maximumAdditiveTareEffect: config.maximumAdditiveTareEffect,
        numberOfSupports: config.numberOfSupports,
        testLoadFormula: config.testLoadFormula,
        calculatedTestLoad: null,
        referenceLoad: params.referenceLoad,
        positions: [],
        requiredPositionsCount: 0,
        actualPositionsCount: 0,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference,
        mpeRuleReference: 'OIML R 76-1:2006 Table 6',
        ruleVersion,
        explanation: `Under OIML R 76-1 Section 3.6.2.2, numberOfSupports must be strictly greater than 4 for MORE_THAN_FOUR_SUPPORTS procedure (got ${config.numberOfSupports}).`,
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Validate ROLLING_LOAD upper bound & presence
    if (procType === PROCEDURE_TYPES.ROLLING_LOAD) {
      if (config.rollingTestLoad === null || config.rollingTestLoad === undefined || config.rollingTestLoad <= 0) {
        return {
          testType: 'ECCENTRIC_LOADING',
          seriesId: params.seriesId || 'ECC-SERIES',
          accuracyClass: normClass,
          evaluationType: params.evaluationType,
          procedureType: procType,
          specificClause: 'Section 3.6.2.4',
          maxCapacity: config.maxCapacity,
          maximumAdditiveTareEffect: config.maximumAdditiveTareEffect,
          numberOfSupports: config.numberOfSupports,
          testLoadFormula: config.testLoadFormula,
          rollingLoadUpperBound: config.rollingLoadUpperBound,
          rollingTestLoad: null,
          calculatedTestLoad: null,
          referenceLoad: null,
          positions: [],
          requiredPositionsCount: 0,
          actualPositionsCount: 0,
          complianceResult: 'NOT_EVALUATED',
          ruleReference,
          mpeRuleReference: 'OIML R 76-1:2006 Table 6',
          ruleVersion,
          explanation: `Tester-entered rolling test load is required for rolling load evaluation under Section 3.6.2.4 (maximum permissible upper bound: ${config.rollingLoadUpperBound} ${params.unit || ''}).`,
          badgeHtml: '<span class="badge warn" style="background:#eaf0f2;color:#355361;">NOT EVALUATED</span>',
          complianceMode: 'VERIFIED_R76'
        };
      }

      const EPSILON = 1e-9;
      if (config.rollingTestLoad > config.rollingLoadUpperBound + EPSILON) {
        return {
          testType: 'ECCENTRIC_LOADING',
          seriesId: params.seriesId || 'ECC-SERIES',
          accuracyClass: normClass,
          evaluationType: params.evaluationType,
          procedureType: procType,
          specificClause: 'Section 3.6.2.4',
          maxCapacity: config.maxCapacity,
          maximumAdditiveTareEffect: config.maximumAdditiveTareEffect,
          numberOfSupports: config.numberOfSupports,
          testLoadFormula: config.testLoadFormula,
          rollingLoadUpperBound: config.rollingLoadUpperBound,
          rollingTestLoad: config.rollingTestLoad,
          calculatedTestLoad: config.rollingTestLoad,
          referenceLoad: config.rollingTestLoad,
          positions: [],
          requiredPositionsCount: 0,
          actualPositionsCount: 0,
          complianceResult: 'REFERENCE_REQUIRED',
          ruleReference,
          mpeRuleReference: 'OIML R 76-1:2006 Table 6',
          ruleVersion,
          explanation: `Entered rolling test load (${config.rollingTestLoad} ${params.unit || ''}) exceeds permitted regulatory upper bound of 0.8 × (Max + additive tare) = ${config.rollingLoadUpperBound} ${params.unit || ''} under Section 3.6.2.4.`,
          badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
          complianceMode: 'VERIFIED_R76'
        };
      }
    }

    // Determine reference load applied
    let refLoad = (params.referenceLoad !== undefined && params.referenceLoad !== null && params.referenceLoad !== '')
      ? Number(params.referenceLoad)
      : config.calculatedTestLoad;

    if (isNaN(refLoad) || refLoad <= 0) {
      return {
        testType: 'ECCENTRIC_LOADING',
        seriesId: params.seriesId || 'ECC-SERIES',
        accuracyClass: normClass,
        evaluationType: params.evaluationType,
        procedureType: procType,
        specificClause: config.specificClause,
        maxCapacity: config.maxCapacity,
        maximumAdditiveTareEffect: config.maximumAdditiveTareEffect,
        numberOfSupports: config.numberOfSupports,
        testLoadFormula: config.testLoadFormula,
        calculatedTestLoad: config.calculatedTestLoad,
        referenceLoad: null,
        positions: [],
        requiredPositionsCount: 0,
        actualPositionsCount: 0,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference,
        mpeRuleReference: 'OIML R 76-1:2006 Table 6',
        ruleVersion,
        explanation: 'Reference test load must be a positive number.',
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // Resolve Table 6 MPE for actual applied load
    const loadInIntervals = MpeRules.calculateLoadInIntervals(refLoad, numE);
    if (loadInIntervals === null) {
      return {
        testType: 'ECCENTRIC_LOADING',
        seriesId: params.seriesId || 'ECC-SERIES',
        accuracyClass: normClass,
        evaluationType: params.evaluationType,
        procedureType: procType,
        specificClause: config.specificClause,
        maxCapacity: config.maxCapacity,
        maximumAdditiveTareEffect: config.maximumAdditiveTareEffect,
        numberOfSupports: config.numberOfSupports,
        testLoadFormula: config.testLoadFormula,
        calculatedTestLoad: config.calculatedTestLoad,
        referenceLoad: refLoad,
        positions: [],
        requiredPositionsCount: 0,
        actualPositionsCount: 0,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference,
        mpeRuleReference: 'OIML R 76-1:2006 Table 6',
        ruleVersion,
        explanation: 'Failed to calculate load in verification scale intervals (m / e).',
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    const evalType = params.evaluationType || 'INITIAL_VERIFICATION';
    const mpeLookup = MpeRules.lookupMpeBand(normClass, loadInIntervals, evalType);
    if (!mpeLookup || !mpeLookup.resolved) {
      return {
        testType: 'ECCENTRIC_LOADING',
        seriesId: params.seriesId || 'ECC-SERIES',
        accuracyClass: normClass,
        evaluationType: evalType,
        procedureType: procType,
        specificClause: config.specificClause,
        maxCapacity: config.maxCapacity,
        maximumAdditiveTareEffect: config.maximumAdditiveTareEffect,
        numberOfSupports: config.numberOfSupports,
        testLoadFormula: config.testLoadFormula,
        calculatedTestLoad: config.calculatedTestLoad,
        referenceLoad: refLoad,
        loadInIntervals,
        positions: [],
        requiredPositionsCount: 0,
        actualPositionsCount: 0,
        complianceResult: 'REFERENCE_REQUIRED',
        ruleReference,
        mpeRuleReference: 'OIML R 76-1:2006 Table 6 (Scope Exceeded)',
        ruleVersion,
        explanation: mpeLookup ? mpeLookup.reason : 'Unable to resolve Table 6 MPE band for eccentric test load.',
        badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    const applicableMpe = MpeRules.safeMultiply(mpeLookup.multiplier, numE);
    const absApplicableMpe = Math.abs(applicableMpe);
    const unit = params.unit || '';

    // Extract position observations
    const defaultPositions = getDefaultPositions(procType, config.numberOfSupports);
    const requiredPositionsCount = defaultPositions.length;

    const rawPositions = params.positions || params.observations || params.readings || [];
    const evaluatedPositions = [];
    const EPSILON = 1e-9;

    for (let idx = 0; idx < rawPositions.length; idx++) {
      const item = rawPositions[idx];
      let pId = `POS-${idx + 1}`;
      let pLabel = defaultPositions[idx]?.positionLabel || `Position ${idx + 1}`;
      let indVal = NaN;
      let posRefLoad = refLoad;

      if (typeof item === 'object' && item !== null) {
        pId = item.positionId || item.id || defaultPositions[idx]?.positionId || pId;
        pLabel = item.positionLabel || item.remarks || defaultPositions[idx]?.positionLabel || pLabel;
        if (item.reference !== undefined && item.reference !== null && item.reference !== '') {
          posRefLoad = Number(item.reference);
        }
        const rawInd = (item.indication !== undefined && item.indication !== null)
          ? item.indication
          : (item.scaleReading !== undefined ? item.scaleReading : item.reading);
        indVal = Number(rawInd);
      } else {
        indVal = Number(item);
      }

      if (isNaN(indVal)) {
        return {
          testType: 'ECCENTRIC_LOADING',
          seriesId: params.seriesId || 'ECC-SERIES',
          accuracyClass: normClass,
          evaluationType: evalType,
          procedureType: procType,
          specificClause: config.specificClause,
          maxCapacity: config.maxCapacity,
          maximumAdditiveTareEffect: config.maximumAdditiveTareEffect,
          numberOfSupports: config.numberOfSupports,
          testLoadFormula: config.testLoadFormula,
          calculatedTestLoad: config.calculatedTestLoad,
          referenceLoad: refLoad,
          loadInIntervals,
          mpeMultiplier: mpeLookup.multiplier,
          applicableMpe,
          applicableMpeFormatted: `±${applicableMpe} ${unit}`.trim(),
          positions: [],
          requiredPositionsCount,
          actualPositionsCount: rawPositions.length,
          complianceResult: 'REFERENCE_REQUIRED',
          ruleReference,
          mpeRuleReference: mpeLookup.clauseRef,
          ruleVersion,
          explanation: `Position ${idx + 1} (${pLabel}) contains invalid numeric indication data.`,
          badgeHtml: '<span class="badge warn">REFERENCE REQUIRED</span>',
          complianceMode: 'VERIFIED_R76'
        };
      }

      const error = MpeRules.decimalSafeSubtract(indVal, posRefLoad);
      const absError = Math.abs(error);
      const isPass = (absError <= absApplicableMpe + EPSILON);

      evaluatedPositions.push({
        positionId: pId,
        positionLabel: pLabel,
        sequenceNumber: idx + 1,
        indication: indVal,
        referenceLoad: posRefLoad,
        error,
        errorFormatted: MpeRules.formatError(error, unit),
        absoluteError: absError,
        applicableMpe,
        applicableMpeFormatted: `±${applicableMpe} ${unit}`.trim(),
        isPass,
        complianceResult: isPass ? 'PASS' : 'FAIL'
      });
    }

    const actualPositionsCount = evaluatedPositions.length;

    // Check if required position observations are incomplete
    if (actualPositionsCount < requiredPositionsCount) {
      return {
        testType: 'ECCENTRIC_LOADING',
        seriesId: params.seriesId || 'ECC-SERIES',
        accuracyClass: normClass,
        evaluationType: evalType,
        procedureType: procType,
        specificClause: config.specificClause,
        maxCapacity: config.maxCapacity,
        maximumAdditiveTareEffect: config.maximumAdditiveTareEffect,
        numberOfSupports: config.numberOfSupports,
        testLoadFormula: config.testLoadFormula,
        calculatedTestLoad: config.calculatedTestLoad,
        referenceLoad: refLoad,
        loadInIntervals,
        mpeMultiplier: mpeLookup.multiplier,
        applicableMpe,
        applicableMpeFormatted: `±${applicableMpe} ${unit}`.trim(),
        positions: evaluatedPositions,
        requiredPositionsCount,
        actualPositionsCount,
        allPositionsPass: false,
        complianceResult: 'NOT_EVALUATED',
        ruleReference,
        mpeRuleReference: mpeLookup.clauseRef,
        ruleVersion,
        explanation: `Additional eccentric loading observations required. (Completed ${actualPositionsCount} of ${requiredPositionsCount} required positions for ${procType} procedure under ${config.specificClause} and Annex A.4.7).`,
        badgeHtml: '<span class="badge warn" style="background:#eaf0f2;color:#355361;">NOT EVALUATED</span>',
        complianceMode: 'VERIFIED_R76'
      };
    }

    // All required positions exist: evaluate compliance
    const allPositionsPass = evaluatedPositions.every(p => p.isPass);
    const complianceResult = allPositionsPass ? 'PASS' : 'FAIL';

    let explanation = '';
    if (allPositionsPass) {
      explanation = `Eccentric loading compliant (OIML R 76-1 ${config.specificClause}): All ${actualPositionsCount} eccentric positions satisfy the applicable MPE (±${applicableMpe} ${unit}) for applied test load ${refLoad} ${unit}.`;
    } else {
      const failing = evaluatedPositions.filter(p => !p.isPass);
      explanation = `Eccentric loading failed: ${failing.length} of ${actualPositionsCount} position(s) exceeded the applicable MPE (±${applicableMpe} ${unit}). Failing positions: ${failing.map(p => `${p.positionLabel} (Error: ${p.errorFormatted})`).join(', ')}.`;
    }

    const badgeHtml = allPositionsPass
      ? '<span class="badge good">PASS</span>'
      : '<span class="badge bad">FAIL</span>';

    return {
      testType: 'ECCENTRIC_LOADING',
      seriesId: params.seriesId || 'ECC-SERIES',
      accuracyClass: normClass,
      evaluationType: evalType,
      procedureType: procType,
      specificClause: config.specificClause,
      maxCapacity: config.maxCapacity,
      maximumAdditiveTareEffect: config.maximumAdditiveTareEffect,
      numberOfSupports: config.numberOfSupports,
      testLoadFormula: config.testLoadFormula,
      calculatedTestLoad: config.calculatedTestLoad,
      // Rolling load fields — present for ROLLING_LOAD procedure, undefined for others
      rollingLoadUpperBound: config.rollingLoadUpperBound !== undefined ? config.rollingLoadUpperBound : undefined,
      rollingTestLoad: config.rollingTestLoad !== undefined ? config.rollingTestLoad : undefined,
      referenceLoad: refLoad,
      loadInIntervals,
      mpeMultiplier: mpeLookup.multiplier,
      applicableMpe,
      applicableMpeFormatted: `±${applicableMpe} ${unit}`.trim(),
      positions: evaluatedPositions,
      requiredPositionsCount,
      actualPositionsCount,
      allPositionsPass,
      complianceResult,
      ruleReference,
      mpeRuleReference: mpeLookup.clauseRef,
      ruleVersion,
      explanation,
      badgeHtml,
      complianceMode: 'VERIFIED_R76'
    };
  }

  return Object.freeze({
    PROCEDURE_TYPES,
    normalizeProcedureType,
    calculateRequiredTestLoad,
    getDefaultPositions,
    evaluateEccentricSeries
  });
});
