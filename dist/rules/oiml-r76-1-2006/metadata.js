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
    scope: ['WEIGHING_PERFORMANCE', 'REPEATABILITY'],
    clauses: {
      initialVerification: 'Section 3.5.1, Table 6',
      inServiceInspection: 'Section 3.5.2',
      repeatability: 'Section 3.6.1, Annex A.4.10'
    }
  });
});
