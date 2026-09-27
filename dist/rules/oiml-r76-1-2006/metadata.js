/**
 * OIML R 76-1:2006 Rule Package Metadata
 * Verified Metrological Regulatory Configuration
 */
(function(root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else {
    root.OimlR76Metadata = factory();
  }
})(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  return Object.freeze({
    ruleSetId: 'oiml-r76-1-2006',
    recommendation: 'OIML R 76-1',
    edition: '2006',
    status: 'VERIFIED_ACTIVE',
    source: 'OIML R 76-1 Edition 2006 (E) - Non-automatic weighing instruments - Part 1: Metrological and technical requirements - Tests',
    verificationStatus: 'VERIFIED',
    scope: ['WEIGHING_PERFORMANCE', 'REPEATABILITY', 'ECCENTRIC_LOADING', 'TARE', 'ZERO_RELATED_TESTS', 'CREEP', 'ZERO_RETURN'],
    clauses: {
      initialVerification: 'Section 3.5.1, Table 6',
      inServiceInspection: 'Section 3.5.2',
      repeatability: 'Section 3.6.1, Annex A.4.10',
      eccentricLoading: 'Section 3.6.2, Annex A.4.7',
      tare: 'Section 3.5.3.3, Section 3.5.3.4, Section 4.6.3, Annex A.4.6.1, A.4.6.2, A.4.6.3',
      zero: 'Section 4.5.1, 4.5.2, 4.5.5, 4.5.6, 4.5.7, Annex A.4.2.1, A.4.2.2, A.4.2.3',
      creep: 'Section 3.9.4, Section 3.9.4.1, Annex A.4.11.1',
      zeroReturn: 'Section 3.9.4, Section 3.9.4.2, Annex A.4.11.2'
    }
  });
});

