// NAWI Laboratory - Type Evaluation Automation System
// OIML R76 Compliance Preparation & Frontend Architecture

const STORAGE_KEY = 'nawi_lab_demo_v2';

// -------------------------------------------------------------
// 1. SEED DATA & MOCK DATA SERVICE
// -------------------------------------------------------------
const initialSeed = {
  manufacturers: [
    {
      id: 'M-001',
      name: 'Aster Weighing Systems',
      country: 'India',
      contact: 'Anika Rao',
      email: 'lab@asterweigh.invalid',
      phone: '+91 44 2855 0100',
      address: 'Industrial Estate, Guindy, Chennai, Tamil Nadu',
      notes: 'Leading manufacturer of Class III electronic industrial balances.'
    },
    {
      id: 'M-002',
      name: 'Meridian Instruments',
      country: 'India',
      contact: 'Ravi Menon',
      email: 'quality@meridianinst.invalid',
      phone: '+91 422 2490 200',
      address: 'Tech Metrology Park, Coimbatore, Tamil Nadu',
      notes: 'Specialist in heavy platform scales and digital load cells.'
    },
    {
      id: 'M-003',
      name: 'Sartori-Tech Metrology',
      country: 'Germany',
      contact: 'Dr. Klaus Becker',
      email: 'type-eval@sartori-tech.invalid',
      phone: '+49 551 308 0',
      address: 'Otto-Brenner-Strasse 20, Goettingen',
      notes: 'Precision analytical balances (Class I and Class II).'
    },
    {
      id: 'M-004',
      name: 'PreciseLoad Sensors',
      country: 'India',
      contact: 'Sunita Patil',
      email: 'contact@preciseload.invalid',
      phone: '+91 20 2712 9988',
      address: 'MIDC Bhosari, Pune, Maharashtra',
      notes: 'Industrial weighing indicators and floor scales.'
    }
  ],
  instruments: [
    {
      id: 'I-001',
      manufacturer: 'M-001',
      model: 'AW-150',
      serial: 'DEMO-150-01',
      type: 'Electronic bench scale',
      max: '150',
      min: '0.02',
      d: '0.01',
      e: '0.01',
      class: 'III',
      unit: 'kg',
      firmware: '1.0.4'
    },
    {
      id: 'I-002',
      manufacturer: 'M-002',
      model: 'MP-60',
      serial: 'DEMO-60-01',
      type: 'Platform scale',
      max: '60',
      min: '0.02',
      d: '0.01',
      e: '0.01',
      class: 'III',
      unit: 'kg',
      firmware: '1.2.0'
    },
    {
      id: 'I-003',
      manufacturer: 'M-003',
      model: 'ST-3000P',
      serial: 'DEMO-3000-88',
      type: 'Precision analytical balance',
      max: '3000',
      min: '0.5',
      d: '0.01',
      e: '0.1',
      class: 'II',
      unit: 'g',
      firmware: '2.1.0'
    },
    {
      id: 'I-004',
      manufacturer: 'M-004',
      model: 'PL-500F',
      serial: 'DEMO-500F-09',
      type: 'Industrial floor scale',
      max: '500',
      min: '2',
      d: '0.05',
      e: '0.05',
      class: 'III',
      unit: 'kg',
      firmware: '3.0.1'
    },
    {
      id: 'I-005',
      manufacturer: 'M-001',
      model: 'AW-30',
      serial: 'DEMO-30-01',
      type: 'Electronic bench scale',
      max: '30',
      min: '0.02',
      d: '0.005',
      e: '0.01',
      class: 'III',
      unit: 'kg',
      firmware: '1.0.1'
    }
  ],
  evaluations: [
    {
      id: 'EV-2026-001',
      instrument: 'I-001',
      evaluationType: 'INITIAL_VERIFICATION',
      complianceMode: 'DEMO',
      ruleVersion: 'UNCONFIGURED',
      lab: 'National Metrology Evaluation Center',
      location: 'Chennai Metrology Bay #2',
      date: '2026-09-18',
      temperature: '21.4',
      humidity: '49',
      environment: 'Stable concrete seismic pedestal foundation. Barometric pressure 1013.2 hPa.',
      tester: 'T. Raghavan, Senior Metrologist',
      reviewer: 'Dr. S. Meenakshi, Technical Director',
      status: 'COMPLETED',
      tests: ['Weighing Performance', 'Repeatability', 'Eccentric Loading'],
      observations: [
        { id: 'OB-101', test: 'Weighing Performance', reference: '10.000', indication: '10.002', remarks: 'Min test load observation' },
        { id: 'OB-102', test: 'Weighing Performance', reference: '50.000', indication: '50.008', remarks: '1/3 capacity verification' },
        { id: 'OB-103', test: 'Weighing Performance', reference: '100.000', indication: '100.016', remarks: '2/3 capacity - near demo limit' },
        { id: 'OB-104', test: 'Weighing Performance', reference: '150.000', indication: '150.018', remarks: 'Max capacity verification' },
        { id: 'OB-105', test: 'Eccentric Loading', reference: '50.000', indication: '50.005', remarks: 'Quarter position 1 (Front Left)' },
        { id: 'OB-106', test: 'Eccentric Loading', reference: '50.000', indication: '50.007', remarks: 'Quarter position 2 (Rear Right)' }
      ],
      attachments: [
        {
          id: 'ATT-001',
          name: 'scale_nameplate.svg',
          category: 'Name Plate',
          desc: 'Instrument nameplate showing Max 150 kg, e=0.01 kg, Class III markings',
          url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="%23142c3b"/><rect x="10" y="10" width="280" height="160" fill="%23f4f7f8" stroke="%234bb2a9" stroke-width="2"/><text x="150" y="45" font-family="Arial" font-weight="bold" font-size="16" fill="%23142c3b" text-anchor="middle">ASTER WEIGHING SYSTEMS</text><text x="150" y="70" font-family="Arial" font-size="13" fill="%23555" text-anchor="middle">Model: AW-150 | S/N: DEMO-150-01</text><text x="150" y="95" font-family="Arial" font-weight="bold" font-size="12" fill="%23167f79" text-anchor="middle">Class III | Max: 150 kg | Min: 0.02 kg</text><text x="150" y="120" font-family="Arial" font-size="12" fill="%23333" text-anchor="middle">e = 0.01 kg | d = 0.01 kg | 220V 50Hz</text><text x="150" y="145" font-family="Arial" font-size="10" fill="%23777" text-anchor="middle">TYPE EVALUATION MOCK ARTIFACT</text></svg>'
        }
      ],
      comments: 'All synthetic measurement errors are compliant within configured demo thresholds. Completed evaluation.',
      reviewerComments: 'Evaluation thoroughly reviewed. Observations traceability checked. Demonstration report approved.',
      report: {
        number: 'DEMO/2026/00001',
        at: '2026-09-19T10:30:00.000Z'
      },
      events: [
        { at: '2026-09-18T09:00:00.000Z', actor: 'Demo tester', action: 'Evaluation created as Initial Verification' },
        { at: '2026-09-18T11:45:00.000Z', actor: 'Demo tester', action: 'Laboratory conditions saved' },
        { at: '2026-09-18T14:20:00.000Z', actor: 'Demo tester', action: 'Observations recorded (6 items)' },
        { at: '2026-09-18T16:00:00.000Z', actor: 'Demo tester', action: 'Submitted for review' },
        { at: '2026-09-19T09:15:00.000Z', actor: 'Demo reviewer', action: 'Status changed to UNDER_REVIEW' },
        { at: '2026-09-19T10:30:00.000Z', actor: 'Demo reviewer', action: 'Evaluation completed & report DEMO/2026/00001 generated' }
      ]
    },
    {
      id: 'EV-2026-002',
      instrument: 'I-002',
      evaluationType: 'IN_SERVICE_INSPECTION',
      complianceMode: 'VERIFIED_R76',
      ruleVersion: 'oiml-r76-1-2006',
      lab: 'Western Metrology Laboratory',
      location: 'Coimbatore Test Bay 1',
      date: '2026-09-24',
      temperature: '22.0',
      humidity: '52',
      environment: 'Air conditioned metrology room, no direct sunlight.',
      tester: 'Arun Kumar, Metrology Tech',
      reviewer: 'Priya Sharma, Quality Manager',
      status: 'SUBMITTED_FOR_REVIEW',
      tests: ['Weighing Performance', 'Tare', 'Zero-related Tests'],
      observations: [
        { id: 'OB-201', test: 'Weighing Performance', reference: '10.000', indication: '10.001', remarks: 'Tare balanced' },
        { id: 'OB-202', test: 'Weighing Performance', reference: '30.000', indication: '30.009', remarks: '50% capacity test' },
        { id: 'OB-203', test: 'Tare', reference: '20.000', indication: '20.003', remarks: 'Tare balancing test' }
      ],
      attachments: [],
      comments: 'Submitted initial observations for reviewer inspection in Verified R76 mode.',
      reviewerComments: '',
      report: null,
      events: [
        { at: '2026-09-24T08:30:00.000Z', actor: 'Demo tester', action: 'Evaluation created as In-Service Inspection (VERIFIED_R76)' },
        { at: '2026-09-24T12:00:00.000Z', actor: 'Demo tester', action: 'Observations recorded' },
        { at: '2026-09-24T15:45:00.000Z', actor: 'Demo tester', action: 'Submitted for review' }
      ]
    },
    {
      id: 'EV-2026-003',
      instrument: 'I-003',
      evaluationType: 'INITIAL_VERIFICATION',
      complianceMode: 'DEMO',
      ruleVersion: 'UNCONFIGURED',
      lab: 'Precision Metrology Lab',
      location: 'Bangalore Clean Room B',
      date: '2026-09-26',
      temperature: '20.1',
      humidity: '45',
      environment: 'Class 10,000 clean room environment with draft shield.',
      tester: 'Anika Rao',
      reviewer: 'Demo Reviewer',
      status: 'IN_PROGRESS',
      tests: ['Weighing Performance', 'Repeatability'],
      observations: [
        { id: 'OB-301', test: 'Weighing Performance', reference: '500.00', indication: '500.05', remarks: 'Initial tare verification' },
        { id: 'OB-302', test: 'Weighing Performance', reference: '1500.00', indication: '1500.12', remarks: 'Half capacity load' }
      ],
      attachments: [],
      comments: 'Work in progress; awaiting repeatability series.',
      reviewerComments: '',
      report: null,
      events: [
        { at: '2026-09-26T10:00:00.000Z', actor: 'Demo tester', action: 'Evaluation intake started' }
      ]
    },
    {
      id: 'EV-2026-004',
      instrument: 'I-004',
      evaluationType: 'INITIAL_VERIFICATION',
      complianceMode: 'DEMO',
      ruleVersion: 'UNCONFIGURED',
      lab: 'Heavy Metrology Station',
      location: 'Pune Facility',
      date: '2026-09-27',
      temperature: '23.5',
      humidity: '55',
      environment: 'Floor pit installation.',
      tester: 'Demo Tester',
      reviewer: 'Demo Reviewer',
      status: 'DRAFT',
      tests: ['Weighing Performance'],
      observations: [],
      attachments: [],
      comments: 'Fresh intake record.',
      reviewerComments: '',
      report: null,
      events: [
        { at: '2026-09-27T08:00:00.000Z', actor: 'Demo tester', action: 'Evaluation drafted' }
      ]
    },
    {
      id: 'EV-2026-005',
      instrument: 'I-001',
      evaluationType: 'IN_SERVICE_INSPECTION',
      complianceMode: 'DEMO',
      ruleVersion: 'UNCONFIGURED',
      lab: 'National Metrology Evaluation Center',
      location: 'Chennai Metrology Bay #2',
      date: '2026-09-22',
      temperature: '21.8',
      humidity: '50',
      environment: 'Standard laboratory ambient conditions.',
      tester: 'K. Suresh, Metrology Tech',
      reviewer: 'Dr. S. Meenakshi',
      status: 'RETURNED_FOR_CORRECTION',
      tests: ['Weighing Performance', 'Eccentric Loading'],
      observations: [
        { id: 'OB-501', test: 'Weighing Performance', reference: '50.000', indication: '50.035', remarks: 'Exceeded mock tolerance' }
      ],
      attachments: [],
      comments: 'Resubmitting after corner check.',
      reviewerComments: 'Please re-verify eccentricity readings at 1/3 Max load in corner positions with certified F1 class weights.',
      report: null,
      events: [
        { at: '2026-09-22T09:00:00.000Z', actor: 'Demo tester', action: 'Evaluation created' },
        { at: '2026-09-22T14:00:00.000Z', actor: 'Demo tester', action: 'Submitted for review' },
        { at: '2026-09-22T16:30:00.000Z', actor: 'Demo reviewer', action: 'Returned for correction with comments' }
      ]
    },
    {
      id: 'EV-2026-006',
      instrument: 'I-005',
      evaluationType: 'INITIAL_VERIFICATION',
      complianceMode: 'VERIFIED_R76',
      ruleVersion: 'oiml-r76-1-2006',
      lab: 'National Metrology Evaluation Center',
      location: 'Precision Test Cell #1',
      date: '2026-09-27',
      temperature: '21.0',
      humidity: '48',
      environment: 'Isolated granite balance bench. Ambient vibration < 0.005 g.',
      tester: 'Demo Tester',
      reviewer: 'Demo Reviewer',
      status: 'IN_PROGRESS',
      tests: ['Repeatability', 'Weighing Performance'],
      observations: [
        { id: 'OB-601', test: 'Repeatability', seriesId: 'RPT-001', sequenceNumber: 1, reference: '24.000', indication: '24.002', remarks: 'Repeatability Series RPT-001 (Run 1/3)' },
        { id: 'OB-602', test: 'Repeatability', seriesId: 'RPT-001', sequenceNumber: 2, reference: '24.000', indication: '24.005', remarks: 'Repeatability Series RPT-001 (Run 2/3)' },
        { id: 'OB-603', test: 'Repeatability', seriesId: 'RPT-001', sequenceNumber: 3, reference: '24.000', indication: '24.001', remarks: 'Repeatability Series RPT-001 (Run 3/3)' }
      ],
      attachments: [],
      comments: 'OIML R 76-1 Annex A.4.10 Repeatability evaluation at ~0.8 Max (24 kg).',
      reviewerComments: '',
      report: null,
      events: [
        { at: '2026-09-27T09:00:00.000Z', actor: 'Demo tester', action: 'Evaluation created as Initial Verification (VERIFIED_R76)' },
        { at: '2026-09-27T10:30:00.000Z', actor: 'Demo tester', action: 'Repeatability series RPT-001 recorded (3 weighings @ 24 kg)' }
      ]
    }
  ],
  audit: [
    { at: '2026-09-27T08:00:00.000Z', actor: 'Demo tester', entity: 'EV-2026-004', action: 'Evaluation drafted' },
    { at: '2026-09-26T10:00:00.000Z', actor: 'Demo tester', entity: 'EV-2026-003', action: 'Evaluation intake started' },
    { at: '2026-09-24T15:45:00.000Z', actor: 'Demo tester', entity: 'EV-2026-002', action: 'Submitted for review' },
    { at: '2026-09-22T16:30:00.000Z', actor: 'Demo reviewer', entity: 'EV-2026-005', action: 'Returned for correction' },
    { at: '2026-09-19T10:30:00.000Z', actor: 'Demo reviewer', entity: 'EV-2026-001', action: 'Evaluation completed & report DEMO/2026/00001 generated' }
  ]
};

const mockDataService = {
  getDb() {
    let data;
    try {
      data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!data || !data.manufacturers || !data.instruments || !data.evaluations) {
        data = structuredClone(initialSeed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch {
      data = structuredClone(initialSeed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    // Migration helper for new fields
    data.evaluations.forEach(e => {
      if (!e.evaluationType) e.evaluationType = 'INITIAL_VERIFICATION';
      if (!e.complianceMode) e.complianceMode = 'DEMO';
      if (!e.ruleVersion || e.ruleVersion === 'UNCONFIGURED') {
        e.ruleVersion = (e.complianceMode === 'VERIFIED_R76') ? 'oiml-r76-1-2006' : 'DEMO-SIM-2026';
      }
    });
    if (!data.instruments.some(i => i.id === 'I-005')) {
      const i5 = initialSeed.instruments.find(i => i.id === 'I-005');
      if (i5) data.instruments.push(i5);
    }
    if (!data.evaluations.some(e => e.id === 'EV-2026-006')) {
      const e6 = initialSeed.evaluations.find(e => e.id === 'EV-2026-006');
      if (e6) data.evaluations.push(e6);
    }
    return data;
  },
  save(db) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  },
  reset() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSeed));
    toast('Demo database reset to default state');
  }
};

let db = mockDataService.getDb();

// -------------------------------------------------------------
// 2. AUDIT SERVICE
// -------------------------------------------------------------
const auditService = {
  log(action, entityId) {
    const entry = {
      at: new Date().toISOString(),
      actor: 'Demo ' + role.toLowerCase(),
      entity: entityId,
      action
    };
    db.audit.unshift(entry);
    if (db.audit.length > 200) db.audit.pop();
    mockDataService.save(db);
  }
};

// -------------------------------------------------------------
// 3. MANUFACTURER SERVICE
// -------------------------------------------------------------
const manufacturerService = {
  getAll(search = '') {
    const q = search.trim().toLowerCase();
    if (!q) return db.manufacturers;
    return db.manufacturers.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.country.toLowerCase().includes(q) ||
      m.contact.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q)
    );
  },
  getById(id) {
    return db.manufacturers.find(m => m.id === id);
  },
  create(data) {
    const newM = {
      id: 'M-' + String(Date.now()).slice(-5),
      name: data.name.trim(),
      country: data.country.trim(),
      contact: data.contact?.trim() || '',
      email: data.email?.trim() || '',
      phone: data.phone?.trim() || '',
      address: data.address?.trim() || '',
      notes: data.notes?.trim() || ''
    };
    db.manufacturers.push(newM);
    auditService.log(`Manufacturer created: ${newM.name}`, newM.id);
    mockDataService.save(db);
    return newM;
  },
  update(id, data) {
    const m = this.getById(id);
    if (!m) return null;
    Object.assign(m, {
      name: data.name.trim(),
      country: data.country.trim(),
      contact: data.contact?.trim() || '',
      email: data.email?.trim() || '',
      phone: data.phone?.trim() || '',
      address: data.address?.trim() || '',
      notes: data.notes?.trim() || ''
    });
    auditService.log(`Manufacturer updated: ${m.name}`, m.id);
    mockDataService.save(db);
    return m;
  },
  delete(id) {
    const linked = db.instruments.filter(i => i.manufacturer === id);
    if (linked.length > 0) {
      return { success: false, message: `Cannot delete: ${linked.length} instrument(s) are registered under this manufacturer.` };
    }
    const idx = db.manufacturers.findIndex(m => m.id === id);
    if (idx === -1) return { success: false, message: 'Manufacturer not found.' };
    const deleted = db.manufacturers.splice(idx, 1)[0];
    auditService.log(`Manufacturer deleted: ${deleted.name}`, id);
    mockDataService.save(db);
    return { success: true };
  }
};

// -------------------------------------------------------------
// 4. INSTRUMENT SERVICE
// -------------------------------------------------------------
const instrumentService = {
  getAll(search = '') {
    const q = search.trim().toLowerCase();
    if (!q) return db.instruments;
    return db.instruments.filter(i => {
      const m = manufacturerService.getById(i.manufacturer);
      return i.model.toLowerCase().includes(q) ||
        i.serial.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q) ||
        (m && m.name.toLowerCase().includes(q)) ||
        i.type.toLowerCase().includes(q) ||
        i.class.toLowerCase().includes(q);
    });
  },
  getById(id) {
    return db.instruments.find(i => i.id === id);
  },
  getHistory(id) {
    return db.evaluations.filter(e => e.instrument === id);
  },
  create(data) {
    const newI = {
      id: 'I-' + String(Date.now()).slice(-5),
      manufacturer: data.manufacturer,
      model: data.model.trim(),
      serial: data.serial.trim(),
      type: data.type.trim(),
      max: String(data.max),
      min: String(data.min),
      d: String(data.d),
      e: String(data.e),
      class: data.class,
      unit: data.unit || 'kg',
      firmware: data.firmware?.trim() || '1.0'
    };
    db.instruments.push(newI);
    auditService.log(`Instrument registered: ${newI.model} (${newI.serial})`, newI.id);
    mockDataService.save(db);
    return newI;
  },
  update(id, data) {
    const i = this.getById(id);
    if (!i) return null;
    Object.assign(i, {
      manufacturer: data.manufacturer,
      model: data.model.trim(),
      serial: data.serial.trim(),
      type: data.type.trim(),
      max: String(data.max),
      min: String(data.min),
      d: String(data.d),
      e: String(data.e),
      class: data.class,
      unit: data.unit || 'kg',
      firmware: data.firmware?.trim() || i.firmware
    });
    auditService.log(`Instrument updated: ${i.model} (${i.serial})`, i.id);
    mockDataService.save(db);
    return i;
  },
  delete(id) {
    const linked = db.evaluations.filter(e => e.instrument === id);
    if (linked.length > 0) {
      return { success: false, message: `Cannot delete: ${linked.length} evaluation(s) are linked to this instrument.` };
    }
    const idx = db.instruments.findIndex(i => i.id === id);
    if (idx === -1) return { success: false, message: 'Instrument not found.' };
    const deleted = db.instruments.splice(idx, 1)[0];
    auditService.log(`Instrument deleted: ${deleted.model}`, id);
    mockDataService.save(db);
    return { success: true };
  }
};

// -------------------------------------------------------------
// 5. CORE ARITHMETIC CALCULATION SERVICE (PURE MATHEMATICS ONLY)
// -------------------------------------------------------------
// NOTE: Regulatory compliance & MPE logic has been cleanly separated
// into oimlRuleService per Requirement 2.
const calculationService = {
  // Decimal-safe difference: Error = indication - reference
  decimalSafeSubtract(indication, reference) {
    const strInd = String(indication).trim();
    const strRef = String(reference).trim();
    const decInd = (strInd.split('.')[1] || '').length;
    const decRef = (strRef.split('.')[1] || '').length;
    const precision = Math.max(decInd, decRef, 2);
    const factor = Math.pow(10, Math.min(precision, 8));
    const numInd = Math.round(Number(indication) * factor);
    const numRef = Math.round(Number(reference) * factor);
    const diff = (numInd - numRef) / factor;
    return Number(diff.toFixed(precision));
  },

  formatError(val, unit = '') {
    if (val === null || val === undefined || isNaN(Number(val))) return '—';
    const num = Number(val);
    const sign = num > 0 ? '+' : '';
    return `${sign}${val}${unit ? ' ' + unit : ''}`;
  }
};

// -------------------------------------------------------------
// 6. DEDICATED OIML RULE SERVICE (ARCHITECTURAL PREPARATION)
// -------------------------------------------------------------
// This service receives complete metrological context and evaluates
// compliance according to active mode: DEMO vs VERIFIED_R76.
// In VERIFIED_R76 mode, without verified loaded normative rules,
// it strictly returns REFERENCE_REQUIRED (Never automatically PASS).
const oimlRuleService = {
  normalizeTestType(testName) {
    const str = String(testName || '').toUpperCase();
    if (str.includes('WEIGHING') || str.includes('PERFORMANCE')) return 'WEIGHING_PERFORMANCE';
    if (str.includes('REPEATABILITY')) return 'REPEATABILITY';
    if (str.includes('ECCENTRIC')) return 'ECCENTRIC_LOADING';
    if (str.includes('TARE')) return 'TARE';
    if (str.includes('ZERO_RETURN') || str.includes('ZERO RETURN')) return 'ZERO_RETURN';
    if (str.includes('ZERO')) return 'ZERO_RELATED_TESTS';
    if (str.includes('CREEP')) return 'CREEP';
    if (str.includes('TEMPERATURE') || str.includes('THERMAL')) return 'TEMPERATURE';
    return 'WEIGHING_PERFORMANCE';
  },

  // Load expressed in verification scale intervals: m / e
  calculateLoadInIntervals(referenceLoad, e) {
    const numLoad = Number(referenceLoad) || 0;
    const numE = Number(e) || 0.01;
    if (numE <= 0) return 0;
    return Number((numLoad / numE).toFixed(2));
  },

  // DEMO SIMULATION ENGINE (Strictly isolated for UI demonstration testing)
  // NOTICE: Not for regulatory use. Synthetic stepped multiplier.
  demoMpeEngine(params) {
    const e = Number(params.e) || 0.01;
    const load = Number(params.referenceLoad) || 0;
    const mOverE = this.calculateLoadInIntervals(load, e);

    // Synthetic demonstration envelope based on m/e:
    // <= 500e => 1.0 e
    // 500e - 2000e => 2.0 e
    // > 2000e => 3.0 e
    let multiplier = 1.0;
    let bandDesc = '0 ≤ m/e ≤ 500';
    if (mOverE > 2000) {
      multiplier = 3.0;
      bandDesc = 'm/e > 2000';
    } else if (mOverE > 500) {
      multiplier = 2.0;
      bandDesc = '500 < m/e ≤ 2000';
    }

    // In-service inspection synthetic multiplier (demonstration rule: 2x initial)
    const isService = params.evaluationType === 'IN_SERVICE_INSPECTION';
    if (isService) {
      multiplier *= 2;
      bandDesc += ' (In-Service 2× tolerance)';
    }

    const rawMpe = multiplier * e;
    const eDecimals = (String(e).split('.')[1] || '').length || 2;
    const applicableMpe = Number(rawMpe.toFixed(Math.max(eDecimals, 2)));

    const error = calculationService.decimalSafeSubtract(params.scaleReading, params.referenceLoad);
    const absError = Math.abs(error);
    const isPass = absError <= applicableMpe;
    const isNearLimit = isPass && absError >= (0.75 * applicableMpe) && applicableMpe > 0;

    const complianceResult = isPass ? 'PASS' : 'FAIL';
    const ruleReference = 'Demo Simulation Envelope (Synthetic OIML R76-like)';
    const ruleVersion = params.ruleVersion && params.ruleVersion !== 'UNCONFIGURED' ? params.ruleVersion : 'DEMO-SIM-2026';

    const explanation = `Demo simulation: m/e = ${mOverE} falls into ${bandDesc}. MPE = ±${multiplier}e = ±${applicableMpe} ${params.unit || ''}. |Error| (${absError}) ${isPass ? '≤' : '>'} MPE (${applicableMpe}) ⟹ ${complianceResult}. Demo values — not for regulatory use.`;

    let badgeHtml = isPass
      ? (isNearLimit
          ? '<span class="badge warn" title="Advisory Warning: Calculated error is ≥ 75% of demo permissible limit">PASS ⚠ NEAR LIMIT</span>'
          : '<span class="badge good">PASS</span>')
      : '<span class="badge bad">FAIL</span>';

    return {
      calculatedError: error,
      errorFormatted: calculationService.formatError(error, params.unit),
      loadInIntervals: mOverE,
      applicableMpe,
      applicableMpeFormatted: `±${applicableMpe} ${params.unit || ''}`,
      mpeMultiplier: multiplier,
      bandDesc,
      complianceResult,
      ruleReference,
      ruleVersion,
      explanation,
      isNearLimit,
      badgeHtml,
      complianceMode: 'DEMO'
    };
  },

  // VERIFIED OIML R76 ENGINE
  // Uses verified OIML R 76-1:2006 rule package for WEIGHING_PERFORMANCE.
  // For unsupported tests or unresolvable conditions, strictly returns REFERENCE_REQUIRED.
  verifiedR76Engine(params) {
    if (params.testType === 'WEIGHING_PERFORMANCE' && typeof OimlR76MpeRules !== 'undefined') {
      return OimlR76MpeRules.evaluateWeighingPerformance(params);
    }
    const e = Number(params.e) || 0.01;
    const load = Number(params.referenceLoad) || 0;
    const mOverE = this.calculateLoadInIntervals(load, e);
    const error = calculationService.decimalSafeSubtract(params.scaleReading, params.referenceLoad);
    const absError = Math.abs(error);

    return {
      accuracyClass: params.accuracyClass || 'III',
      evaluationType: params.evaluationType,
      referenceLoad: params.referenceLoad,
      indication: params.scaleReading,
      e: params.e,
      calculatedError: error,
      absoluteError: absError,
      errorFormatted: calculationService.formatError(error, params.unit),
      loadInIntervals: mOverE,
      applicableMpe: null,
      applicableMpeFormatted: 'REFERENCE REQUIRED',
      mpeMultiplier: null,
      bandDesc: 'Procedure Not Configured',
      complianceResult: 'REFERENCE_REQUIRED',
      ruleReference: 'OIML R 76-1:2006 (Verification Required)',
      ruleVersion: 'OIML R 76-1:2006',
      explanation: `Test procedure "${params.testType}" is not yet normatively configured in rule package oiml-r76-1-2006. Only WEIGHING_PERFORMANCE is currently implemented under Section 3.5.1 Table 6. Official regulatory verification required. Status set to REFERENCE_REQUIRED.`,
      isNearLimit: false,
      badgeHtml: '<span class="badge warn" title="No verified OIML rule package loaded for this procedure. Official regulatory verification required.">REFERENCE REQUIRED</span>',
      complianceMode: 'VERIFIED_R76'
    };
  },

  // TEST-SPECIFIC EVALUATORS ADAPTER STRUCTURE
  // Each test type can have its own future calculation and acceptance logic.
  // Requirement 6: Do NOT assume every test uses the same PASS/FAIL formula.
  testEvaluators: {
    WEIGHING_PERFORMANCE(params, self) {
      if (params.complianceMode === 'VERIFIED_R76') {
        if (typeof OimlR76MpeRules !== 'undefined') {
          return OimlR76MpeRules.evaluateWeighingPerformance(params);
        }
        return self.verifiedR76Engine(params);
      }
      return self.demoMpeEngine(params);
    },
    REPEATABILITY(params, self) {
      if (params.complianceMode === 'VERIFIED_R76') {
        if (typeof OimlR76RepeatabilityRules !== 'undefined') {
          let readings = params.readings || params.indications;
          if (!readings && Array.isArray(params.allObservations)) {
            const seriesId = params.seriesId || params.observation?.seriesId;
            readings = params.allObservations.filter(o => {
              if (self.normalizeTestType(o.test) !== 'REPEATABILITY') return false;
              if (seriesId && o.seriesId) return o.seriesId === seriesId;
              return Math.abs(Number(o.reference) - Number(params.referenceLoad)) < 1e-6;
            });
          }
          if (!readings || readings.length === 0) {
            readings = [params.scaleReading];
          }

          const repResult = OimlR76RepeatabilityRules.evaluateRepeatabilitySeries({
            accuracyClass: params.accuracyClass,
            evaluationType: params.evaluationType,
            referenceLoad: params.referenceLoad,
            maxCapacity: params.max,
            e: params.e,
            unit: params.unit,
            seriesId: params.seriesId || params.observation?.seriesId || 'RPT-001',
            readings
          });

          // Individual error for this single observation
          const indError = calculationService.decimalSafeSubtract(params.scaleReading, params.referenceLoad);
          const indAbsError = Math.abs(indError);

          return {
            ...repResult,
            calculatedError: indError,
            errorFormatted: calculationService.formatError(indError, params.unit),
            absoluteError: indAbsError
          };
        }
        return self.verifiedR76Engine(params);
      }
      const res = self.demoMpeEngine(params);
      res.explanation += ' [Repeatability run observation]';
      return res;
    },
    ECCENTRIC_LOADING(params, self) {
      if (params.complianceMode === 'VERIFIED_R76') {
        if (typeof OimlR76EccentricityRules !== 'undefined') {
          // Build eccentric params from observation
          // Each eccentric observation maps to a single position evaluation
          const e = Number(params.e) || 0.01;
          const eccRes = OimlR76EccentricityRules.evaluateEccentricPosition({
            accuracyClass: params.accuracyClass,
            evaluationType: params.evaluationType,
            procedure: params.eccentricProcedure || 'GENERAL',
            max: params.max,
            e,
            unit: params.unit,
            position: params.eccentricPosition || 'Q1',
            referenceCentreLoad: params.eccentricCentreLoad || (Number(params.max) / 3),
            additionalTareForLoad: params.additionalTareForLoad || 0,
            referenceLoad: params.referenceLoad,
            indication: params.scaleReading,
            n: params.supportCount || 4
          });
          const error = calculationService.decimalSafeSubtract(params.scaleReading, params.referenceLoad);
          return {
            ...eccRes,
            calculatedError: error,
            errorFormatted: calculationService.formatError(error, params.unit),
            absoluteError: Math.abs(error)
          };
        }
        const res = self.verifiedR76Engine(params);
        res.explanation = 'Eccentric Loading Evaluation: OIML R 76-1 Clause 3.6.2 requires errors at 1/3 Max quarter-points to be within applicable MPE.';
        res.ruleReference = 'OIML R 76-1:2006 Clause 3.6.2';
        return res;
      }
      const res = self.demoMpeEngine(params);
      res.explanation += ' [Eccentric position observation]';
      return res;
    },
    TARE(params, self) {
      if (params.complianceMode === 'VERIFIED_R76') {
        if (typeof OimlR76TareRules !== 'undefined') {
          // Evaluate a single net-weighing observation against Table 6 MPE
          const e = Number(params.e) || 0.01;
          const netLoad = Number(params.referenceLoad) || 0;
          const netIndication = Number(params.scaleReading) || 0;
          const error = calculationService.decimalSafeSubtract(netIndication, netLoad);
          const absError = Math.abs(error);
          const loadInIntervals = oimlRuleService.calculateLoadInIntervals(netLoad, e);
          const evalType = params.evaluationType || 'INITIAL_VERIFICATION';

          if (typeof OimlR76MpeRules !== 'undefined') {
            const mpeLookup = OimlR76MpeRules.lookupMpeBand(params.accuracyClass, loadInIntervals, evalType);
            if (mpeLookup && mpeLookup.resolved) {
              const applicableMpe = OimlR76MpeRules.safeMultiply(mpeLookup.multiplier, e);
              const isPass = absError <= applicableMpe + 1e-9;
              const complianceResult = isPass ? 'PASS' : 'FAIL';
              return {
                calculatedError: error,
                errorFormatted: calculationService.formatError(error, params.unit),
                absoluteError: absError,
                loadInIntervals,
                mpeMultiplier: mpeLookup.multiplier,
                bandDesc: mpeLookup.bandDesc,
                applicableMpe,
                applicableMpeFormatted: `±${applicableMpe} ${params.unit || ''}`.trim(),
                complianceResult,
                ruleReference: `OIML R 76-1:2006 Section 3.5.3.3 (Net MPE), Table 6`,
                ruleVersion: 'OIML R 76-1:2006',
                ruleClause: 'Section 3.5.3.3',
                ruleTable: 'Table 6 (Net MPE)',
                explanation: `Tare net observation: Net load ${netLoad} ${params.unit || ''} / e = ${loadInIntervals} e → Band: ${mpeLookup.bandDesc} → MPE ±${mpeLookup.multiplier}e = ±${applicableMpe} ${params.unit || ''}. Net Error = ${calculationService.formatError(error, params.unit)}. |Error| ${isPass ? '≤' : '>'} MPE → ${complianceResult}.`,
                isNearLimit: isPass && absError >= 0.75 * applicableMpe && applicableMpe > 0,
                badgeHtml: isPass ? '<span class="badge good">PASS</span>' : '<span class="badge bad">FAIL</span>',
                complianceMode: 'VERIFIED_R76'
              };
            }
          }
          return self.verifiedR76Engine(params);
        }
        const res = self.verifiedR76Engine(params);
        res.explanation = 'Tare Evaluation: OIML R 76-1 Clause 3.5.3.3 requires net values to comply with Table 6 MPE.';
        res.ruleReference = 'OIML R 76-1:2006 Clause 3.5.3.3';
        return res;
      }
      const res = self.demoMpeEngine(params);
      res.explanation += ' [Tare test observation]';
      return res;
    },
    ZERO_RELATED_TESTS(params, self) {
      if (params.complianceMode === 'VERIFIED_R76') {
        if (typeof OimlR76ZeroRules !== 'undefined') {
          // For single observations (ZERO_SETTING_ACCURACY path):
          // evaluate the zero deviation observation directly
          const e = Number(params.e) || 0.01;
          const zeroDeviation = params.zeroDeviation !== undefined
            ? Number(params.zeroDeviation)
            : (params.scaleReading !== undefined ? Number(params.scaleReading) - Number(params.referenceLoad) : undefined);

          const zeroSettingType = params.zeroSettingType || 'NON_AUTOMATIC';
          const acc = OimlR76ZeroRules.evaluateZeroSettingAccuracy({
            zeroSettingType,
            e,
            unit: params.unit,
            zeroDeviation
          });

          const error = (zeroDeviation !== undefined && !isNaN(zeroDeviation))
            ? zeroDeviation : null;

          return {
            calculatedError: error,
            errorFormatted: error !== null ? (error >= 0 ? '+' + error : '' + error) + ' ' + (params.unit || '') : '—',
            absoluteError: error !== null ? Math.abs(error) : null,
            applicableMpe: acc.allowedZeroDeviation,
            applicableMpeFormatted: acc.allowedZeroDeviation !== undefined ? '\u00b1' + acc.allowedZeroDeviation + ' ' + (params.unit || '') : '—',
            complianceResult: acc.complianceResult,
            ruleReference: acc.ruleReference || 'OIML R 76-1:2006 Section 4.5.2',
            ruleVersion: 'OIML R 76-1:2006',
            ruleClause: 'Section 4.5.2',
            explanation: acc.explanation,
            badgeHtml: acc.badgeHtml,
            complianceMode: 'VERIFIED_R76'
          };
        }
        const res = self.verifiedR76Engine(params);
        res.explanation = 'Zero Evaluation: OIML R 76-1 Section 4.5.2 requires zero deviation \u2264 \u00b10.25e after zero-setting.';
        res.ruleReference = 'OIML R 76-1:2006 Section 4.5.2';
        return res;
      }
      const res = self.demoMpeEngine(params);
      res.explanation += ' [Zero test observation]';
      return res;
    },
    CREEP(params, self) {
      if (params.complianceMode === 'VERIFIED_R76') {
        if (typeof OimlR76CreepRules !== 'undefined') {
          // Build observation array from this single observation for live P display
          const indication = Number(params.scaleReading);
          const nomTime = Number(params.nominalTimeMinutes) || 0;
          const deltaL = Number(params.additionalLoadDeltaL) || 0;
          const e = Number(params.e) || 0.01;

          // Compute P = I + 0.5e - ΔL for this observation
          const halfE = e * 0.5;
          const correctedP = indication + halfE - deltaL;

          return {
            calculatedError: indication,
            correctedIndication: correctedP,
            nominalTimeMinutes: nomTime,
            additionalLoad: deltaL,
            halfE,
            complianceResult: 'NOT_EVALUATED', // single obs — full series evaluated at Step 5
            ruleReference: 'OIML R 76-1:2006\nSection 3.9.4.1\nAnnex A.4.11.1',
            ruleVersion: 'OIML R 76-1:2006',
            ruleClause: 'Section 3.9.4.1',
            explanation: 'Creep observation recorded. P = ' + indication + ' + ' + halfE + ' − ' + deltaL + ' = ' + correctedP + '. '
              + 'Full creep series will be evaluated once all required observations are entered (Section 3.9.4.1 / Annex A.4.11.1).',
            complianceMode: 'VERIFIED_R76',
            badgeHtml: '<span class="badge warn" style="background:#eaf0f2;color:#355361;">PENDING SERIES</span>'
          };
        }
        const res = self.verifiedR76Engine(params);
        res.explanation = 'Creep Evaluation: OIML R 76-1 Section 3.9.4.1 / Annex A.4.11.1. Verified engine unavailable.';
        res.ruleReference = 'OIML R 76-1:2006 Section 3.9.4';
        return res;
      }
      const res = self.demoMpeEngine(params);
      res.explanation += ' [Creep duration observation]';
      return res;
    },
    ZERO_RETURN(params, self) {
      if (params.complianceMode === 'VERIFIED_R76') {
        if (typeof OimlR76ZeroReturnRules !== 'undefined') {
          const obs = params.observation || {};
          const appliedLoadVal = obs.appliedLoad !== undefined ? Number(obs.appliedLoad) : (params.referenceLoad !== undefined ? Number(params.referenceLoad) : Number(params.max));
          const initZeroVal = obs.initialZeroIndication !== undefined ? Number(obs.initialZeroIndication) : (obs.reference !== undefined ? Number(obs.reference) : 0);
          const retZeroVal = obs.returnedZeroIndication !== undefined ? Number(obs.returnedZeroIndication) : Number(params.scaleReading);
          const durationVal = obs.loadingDurationMinutes !== undefined ? Number(obs.loadingDurationMinutes) : 30;

          const evalRes = OimlR76ZeroReturnRules.evaluateZeroReturn({
            accuracyClass: params.accuracyClass,
            appliedLoad: appliedLoadVal,
            maxCapacity: Number(params.max),
            loadingDurationMinutes: durationVal,
            initialZeroIndication: initZeroVal,
            returnedZeroIndication: retZeroVal,
            e: Number(params.e),
            unit: params.unit,
            isMultiInterval: !!(params.isMultiInterval || obs.isMultiInterval),
            e1: params.e1 || obs.e1,
            isMultipleRange: !!(params.isMultipleRange || obs.isMultipleRange),
            ranges: params.ranges || obs.ranges,
            activeRange: params.activeRange || obs.activeRange,
            e_i: params.e_i || obs.e_i,
            Max1: params.Max1 || obs.Max1,
            hasAutomaticZeroSetting: !!(params.hasAutomaticZeroSetting || obs.hasAutomaticZeroSetting),
            hasZeroTracking: !!(params.hasZeroTracking || obs.hasZeroTracking),
            automaticZeroDisabledDuringTest: (params.automaticZeroDisabledDuringTest !== undefined ? params.automaticZeroDisabledDuringTest : (obs.automaticZeroDisabledDuringTest !== undefined ? obs.automaticZeroDisabledDuringTest : true)),
            zeroTrackingDisabledDuringTest: (params.zeroTrackingDisabledDuringTest !== undefined ? params.zeroTrackingDisabledDuringTest : (obs.zeroTrackingDisabledDuringTest !== undefined ? obs.zeroTrackingDisabledDuringTest : true)),
            lowestRangeFollowUpObservations: obs.lowestRangeFollowUpObservations || params.lowestRangeFollowUpObservations || []
          });

          const stdAllowed = evalRes.standardEvaluation ? evalRes.standardEvaluation.allowedDeviation : (Number(params.e || 0.01) * 0.5);
          const dev = evalRes.zeroReturnDeviation !== null ? evalRes.zeroReturnDeviation : (retZeroVal - initZeroVal);

          return {
            ...evalRes,
            calculatedError: dev,
            errorFormatted: (dev >= 0 ? '+' : '') + Number(dev).toFixed(4) + ' ' + (params.unit || 'kg'),
            loadInIntervals: self.calculateLoadInIntervals(appliedLoadVal, params.e),
            mpeMultiplier: 0.5,
            applicableMpe: stdAllowed,
            applicableMpeFormatted: '±' + stdAllowed + ' ' + (params.unit || 'kg'),
            bandDesc: 'Zero Return Limit: 0.5' + (evalRes.standardEvaluation ? evalRes.standardEvaluation.intervalLabel : 'e'),
            ruleReference: evalRes.ruleReference,
            ruleVersion: evalRes.ruleVersion,
            ruleClause: 'Section 3.9.4.2',
            ruleTable: 'Annex A.4.11.2',
            explanation: evalRes.explanation,
            complianceResult: evalRes.complianceResult,
            badgeHtml: evalRes.badgeHtml,
            complianceMode: 'VERIFIED_R76'
          };
        }
        const res = self.verifiedR76Engine(params);
        res.explanation = 'Zero Return Evaluation: OIML R 76-1 Section 3.9.4.2 / Annex A.4.11.2. Verified engine unavailable.';
        res.ruleReference = 'OIML R 76-1:2006 Section 3.9.4.2';
        return res;
      }
      const res = self.demoMpeEngine(params);
      res.explanation += ' [Zero return observation]';
      return res;
    },
    TEMPERATURE(params, self) {
      if (params.complianceMode === 'VERIFIED_R76') {
        const res = self.verifiedR76Engine(params);
        res.explanation = 'Temperature Influence Evaluation: OIML R 76-1 Clause 3.9.2 limits span and zero shift across ambient temperatures. Separate verified normative rule configuration required.';
        res.ruleReference = 'OIML R 76-1:2006 Clause 3.9.2';
        return res;
      }
      const res = self.demoMpeEngine(params);
      res.explanation += ' [Temperature condition observation]';
      return res;
    }
  },

  // Main evaluation dispatch method
  evaluateObservation(rawParams) {
    const testKey = this.normalizeTestType(rawParams.testType);
    const evaluator = this.testEvaluators[testKey] || this.testEvaluators.WEIGHING_PERFORMANCE;

    const params = {
      accuracyClass: rawParams.accuracyClass || 'III',
      e: Number(rawParams.e) || 0.01,
      d: Number(rawParams.d) || 0.01,
      max: Number(rawParams.max) || 100,
      min: Number(rawParams.min) || 0.02,
      unit: rawParams.unit || 'kg',
      referenceLoad: Number(rawParams.referenceLoad) || 0,
      scaleReading: Number(rawParams.scaleReading) || 0,
      evaluationType: rawParams.evaluationType || 'INITIAL_VERIFICATION',
      testType: testKey,
      ruleVersion: rawParams.ruleVersion && rawParams.ruleVersion !== 'UNCONFIGURED' ? rawParams.ruleVersion : 'oiml-r76-1-2006',
      complianceMode: rawParams.complianceMode || 'DEMO',
      seriesId: rawParams.seriesId || rawParams.observation?.seriesId,
      observation: rawParams.observation,
      allObservations: rawParams.allObservations,
      readings: rawParams.readings,
      indications: rawParams.indications
    };

    const result = evaluator(params, this);
    return {
      ...params,
      ...result
    };
  }
};

// -------------------------------------------------------------
// 7. EVALUATION SERVICE
// -------------------------------------------------------------
const ALL_TEST_MODULES = [
  { id: 'Weighing Performance', title: 'Weighing Performance', desc: 'Stepwise loading and unloading error evaluation from Min to Max.' },
  { id: 'Repeatability', title: 'Repeatability', desc: 'Consecutive test runs at identical loads (~50% and Max) to verify reading consistency.' },
  { id: 'Eccentric Loading', title: 'Eccentric Loading', desc: 'Off-center load application across standard quarter-platform positions.' },
  { id: 'Tare', title: 'Tare', desc: 'Evaluation of tare balancing accuracy, tare-weighing, and pre-set tare limits.' },
  { id: 'Zero-related Tests', title: 'Zero-related Tests', desc: 'Zero-setting range, zero-tracking speed, and initial zero-setting bounds.' },
  { id: 'Creep', title: 'Creep', desc: 'Reading deviation over sustained static load (typically evaluated at 30 minutes).' },
  { id: 'Zero Return', title: 'Zero Return', desc: 'Zero deviation after sustained 30-minute load close to Max per OIML R 76-1 Section 3.9.4.2.' },
  { id: 'Temperature', title: 'Temperature', desc: 'Performance and span stability across nominal ambient temperature ranges.' }
];

const evaluationService = {
  getAll(search = '', statusFilter = '') {
    let list = db.evaluations.slice().reverse();
    if (statusFilter) {
      list = list.filter(e => e.status === statusFilter);
    }
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(e => {
      const inst = instrumentService.getById(e.instrument);
      const mfg = inst ? manufacturerService.getById(inst.manufacturer) : null;
      return e.id.toLowerCase().includes(q) ||
        (e.report && e.report.number.toLowerCase().includes(q)) ||
        (inst && inst.model.toLowerCase().includes(q)) ||
        (inst && inst.serial.toLowerCase().includes(q)) ||
        (mfg && mfg.name.toLowerCase().includes(q)) ||
        e.status.toLowerCase().includes(q) ||
        e.evaluationType.toLowerCase().includes(q) ||
        e.complianceMode.toLowerCase().includes(q) ||
        e.tester.toLowerCase().includes(q);
    });
  },
  getById(id) {
    return db.evaluations.find(e => e.id === id);
  },
  create(instrumentId, testDate, evaluationType = 'INITIAL_VERIFICATION', complianceMode = 'DEMO') {
    const newEval = {
      id: 'EV-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-4),
      instrument: instrumentId,
      evaluationType: evaluationType || 'INITIAL_VERIFICATION',
      complianceMode: complianceMode || 'DEMO',
      ruleVersion: 'UNCONFIGURED',
      date: testDate || new Date().toISOString().slice(0, 10),
      lab: 'National Metrology Evaluation Center',
      location: 'Main Test Bay',
      tester: 'Demo Tester',
      reviewer: 'Demo Reviewer',
      temperature: '21.5',
      humidity: '50',
      environment: 'Vibration-damped foundation, ambient conditions standard.',
      status: 'DRAFT',
      tests: ['Weighing Performance'],
      observations: [],
      attachments: [],
      comments: '',
      reviewerComments: '',
      report: null,
      events: [
        { at: new Date().toISOString(), actor: 'Demo ' + role.toLowerCase(), action: `Evaluation created (${evaluationType === 'INITIAL_VERIFICATION' ? 'Initial Verification' : 'In-Service Inspection'}, Mode: ${complianceMode})` }
      ]
    };
    db.evaluations.push(newEval);
    auditService.log(`New evaluation created: ${newEval.id}`, newEval.id);
    mockDataService.save(db);
    return newEval;
  },
  update(id, data) {
    const e = this.getById(id);
    if (!e) return null;
    Object.assign(e, data);
    mockDataService.save(db);
    return e;
  },
  addEvent(evalId, action) {
    const e = this.getById(evalId);
    if (!e) return;
    const entry = { at: new Date().toISOString(), actor: 'Demo ' + role.toLowerCase(), action };
    e.events.push(entry);
    auditService.log(action, evalId);
    mockDataService.save(db);
  },
  addObservation(evalId, obsData) {
    const e = this.getById(evalId);
    if (!e) return null;
    const obs = {
      id: 'OB-' + String(Date.now()).slice(-5) + Math.floor(Math.random() * 100),
      test: obsData.test,
      seriesId: obsData.seriesId || null,
      sequenceNumber: obsData.sequenceNumber || null,
      reference: String(obsData.reference),
      indication: String(obsData.indication),
      remarks: obsData.remarks?.trim() || ''
    };
    e.observations.push(obs);
    if (e.status === 'DRAFT') e.status = 'IN_PROGRESS';
    this.addEvent(evalId, `Observation added: ${obs.test} @ ${obs.reference}`);
    mockDataService.save(db);
    return obs;
  },
  updateObservation(evalId, obsId, obsData) {
    const e = this.getById(evalId);
    if (!e) return null;
    const obs = e.observations.find(o => o.id === obsId);
    if (!obs) return null;
    Object.assign(obs, {
      test: obsData.test,
      reference: String(obsData.reference),
      indication: String(obsData.indication),
      remarks: obsData.remarks?.trim() || ''
    });
    this.addEvent(evalId, `Observation updated: ${obs.test} @ ${obs.reference}`);
    mockDataService.save(db);
    return obs;
  },
  deleteObservation(evalId, obsId) {
    const e = this.getById(evalId);
    if (!e) return false;
    const idx = e.observations.findIndex(o => o.id === obsId);
    if (idx === -1) return false;
    const removed = e.observations.splice(idx, 1)[0];
    this.addEvent(evalId, `Observation removed: ${removed.test}`);
    mockDataService.save(db);
    return true;
  },
  addAttachment(evalId, attachmentData) {
    const e = this.getById(evalId);
    if (!e) return null;
    if (!e.attachments) e.attachments = [];
    const att = {
      id: 'ATT-' + String(Date.now()).slice(-5),
      name: attachmentData.name || 'Photo',
      category: attachmentData.category || 'Instrument',
      desc: attachmentData.desc?.trim() || '',
      url: attachmentData.url
    };
    e.attachments.push(att);
    this.addEvent(evalId, `Attachment uploaded: ${att.category} (${att.name})`);
    mockDataService.save(db);
    return att;
  },
  deleteAttachment(evalId, attId) {
    const e = this.getById(evalId);
    if (!e || !e.attachments) return false;
    const idx = e.attachments.findIndex(a => a.id === attId);
    if (idx === -1) return false;
    const removed = e.attachments.splice(idx, 1)[0];
    this.addEvent(evalId, `Attachment removed: ${removed.name}`);
    mockDataService.save(db);
    return true;
  }
};

// -------------------------------------------------------------
// 8. REPORT SERVICE
// -------------------------------------------------------------
const reportService = {
  generateReport(evalId) {
    const e = evaluationService.getById(evalId);
    if (!e) return null;
    if (!e.report) {
      const year = new Date().getFullYear();
      const existingReports = db.evaluations.filter(x => x.report).length + 1;
      const num = `DEMO/${year}/${String(existingReports).padStart(5, '0')}`;
      e.report = {
        number: num,
        at: new Date().toISOString()
      };
      e.status = 'COMPLETED';
      evaluationService.addEvent(evalId, `Report generated: ${num} · Evaluation marked COMPLETED`);
      mockDataService.save(db);
    }
    return e.report;
  },
  printReport(evalId) {
    const e = evaluationService.getById(evalId);
    if (!e) return;
    if (!e.report) {
      this.generateReport(evalId);
    }
    const inst = instrumentService.getById(e.instrument);
    const mfg = inst ? manufacturerService.getById(inst.manufacturer) : null;
    const isDemo = e.complianceMode === 'DEMO';

    const calcRows = e.observations.map(o => {
      const res = oimlRuleService.evaluateObservation({
        accuracyClass: inst?.class,
        e: inst?.e,
        d: inst?.d,
        max: inst?.max,
        min: inst?.min,
        unit: inst?.unit,
        referenceLoad: o.reference,
        scaleReading: o.indication,
        evaluationType: e.evaluationType,
        testType: o.test,
        ruleVersion: e.ruleVersion,
        complianceMode: e.complianceMode
      });
      return `<tr>
        <td>${esc(o.test)}</td>
        <td>${esc(o.reference)} ${esc(inst?.unit)}</td>
        <td>${esc(o.indication)} ${esc(inst?.unit)}</td>
        <td>${esc(res.loadInIntervals)}</td>
        <td>${esc(res.errorFormatted)}</td>
        <td>${esc(res.applicableMpeFormatted)}</td>
        <td><b>${esc(res.complianceResult)}</b> ${res.isNearLimit ? '⚠ (Near Limit)' : ''}</td>
        <td>${esc(res.ruleReference)}</td>
        <td>${esc(o.remarks || '—')}</td>
      </tr>`;
    }).join('');

    const attachmentsHtml = (e.attachments && e.attachments.length > 0)
      ? `<div style="margin:20px 0;">
          <h3 style="font-size:16px;border-bottom:1px solid #ccc;padding-bottom:6px;">Photographic & Document Attachments</h3>
          <div style="display:flex;gap:15px;flex-wrap:wrap;margin-top:10px;">
            ${e.attachments.map(a => `
              <div style="border:1px solid #ddd;padding:8px;border-radius:6px;width:200px;">
                <img src="${a.url}" style="width:100%;height:120px;object-fit:cover;border-radius:4px;display:block;">
                <div style="font-size:11px;font-weight:bold;margin-top:5px;color:#167f79;">${esc(a.category)}</div>
                <div style="font-size:11px;color:#555;margin-top:3px;">${esc(a.desc || a.name)}</div>
              </div>
            `).join('')}
          </div>
        </div>`
      : '';

    const printHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>NAWI Test Report - ${esc(e.report.number)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #172b36; margin: 30px auto; max-width: 920px; padding: 0 20px; line-height: 1.5; font-size: 13px; }
    .header-box { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #142c3b; padding-bottom: 15px; margin-bottom: 20px; }
    .header-title { font-size: 22px; font-weight: 800; color: #142c3b; margin: 0; }
    .header-sub { font-size: 13px; color: #5a7380; margin-top: 4px; }
    .demo-notice { background: ${isDemo ? '#fff4d9' : '#f0f6f8'}; border: 1px solid ${isDemo ? '#e9d9ab' : '#b8d6e0'}; color: ${isDemo ? '#795d18' : '#1b5668'}; padding: 12px 16px; border-radius: 6px; font-size: 12px; margin-bottom: 20px; font-weight: 600; line-height: 1.5; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
    .card { background: #f8fafb; border: 1px solid #dce5e8; border-radius: 6px; padding: 14px; }
    .card h3 { margin: 0 0 10px; font-size: 14px; color: #142c3b; border-bottom: 1px solid #e1eaed; padding-bottom: 6px; }
    .item { margin-bottom: 6px; }
    .item strong { color: #506d7a; font-size: 11px; text-transform: uppercase; display: inline-block; width: 140px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 12px; }
    th { background: #f0f4f6; color: #486370; font-size: 11px; text-transform: uppercase; padding: 8px 10px; border: 1px solid #ccc; text-align: left; }
    td { padding: 8px 10px; border: 1px solid #ccc; }
    .signatures { display: flex; justify-content: space-between; margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; }
    .sig-block { width: 45%; }
    .sig-line { border-bottom: 1px solid #333; margin-top: 40px; }
    @media print {
      body { margin: 10mm; font-size: 11pt; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom:20px;display:flex;gap:10px;justify-content:flex-end;">
    <button onclick="window.print()" style="background:#167f79;color:white;border:none;padding:10px 18px;border-radius:6px;font-weight:bold;cursor:pointer;">🖨️ Print / Save to PDF</button>
    <button onclick="window.close()" style="background:#eee;border:1px solid #ccc;padding:10px 18px;border-radius:6px;cursor:pointer;">Close Window</button>
  </div>

  <div class="header-box">
    <div>
      <h1 class="header-title">NAWI TYPE EVALUATION TEST REPORT</h1>
      <div class="header-sub">Non-Automatic Weighing Instruments Metrological Evaluation</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:16px;font-weight:bold;color:#142c3b;">${esc(e.report.number)}</div>
      <div style="font-size:12px;color:#666;">Date: ${new Date(e.report.at).toLocaleDateString()}</div>
      <div style="font-size:12px;color:#666;">Evaluation Type: <b>${esc(e.evaluationType === 'INITIAL_VERIFICATION' ? 'Initial Verification' : 'In-Service Inspection')}</b></div>
      <div style="font-size:12px;color:#666;">Rule Version: <code>${esc(e.ruleVersion || 'UNCONFIGURED')}</code></div>
    </div>
  </div>

  <div class="demo-notice">
    ${isDemo ? `
      ⚠ <strong>DEMO COMPLIANCE MODE — NOT FOR REGULATORY USE:</strong>
      All calculated errors, permissible limits, and compliance verdicts presented herein are frontend synthetic test values generated for workflow and UI automation demonstration purposes. No verified OIML R76 regulatory evaluation or legal metrology decision is claimed or implied.
    ` : `
      ℹ <strong>VERIFIED OIML R76 COMPLIANCE INTEGRATION MODE:</strong>
      No official OIML R 76 normative rule package is configured (Rule version: ${esc(e.ruleVersion || 'UNCONFIGURED')}). All compliance determinations remain strictly <strong>REFERENCE REQUIRED</strong>. No regulatory pass/fail verdict is claimed.
    `}
  </div>

  <div class="grid">
    <div class="card">
      <h3>1. Instrument Identification</h3>
      <div class="item"><strong>Manufacturer:</strong> ${esc(mfg?.name || '—')}</div>
      <div class="item"><strong>Model:</strong> ${esc(inst?.model || '—')}</div>
      <div class="item"><strong>Serial Number:</strong> ${esc(inst?.serial || '—')}</div>
      <div class="item"><strong>Accuracy Class:</strong> Class ${esc(inst?.class || '—')}</div>
      <div class="item"><strong>Max Capacity:</strong> ${esc(inst?.max)} ${esc(inst?.unit)}</div>
      <div class="item"><strong>Min Capacity:</strong> ${esc(inst?.min)} ${esc(inst?.unit)}</div>
      <div class="item"><strong>Intervals:</strong> e = ${esc(inst?.e)} ${esc(inst?.unit)}, d = ${esc(inst?.d)} ${esc(inst?.unit)}</div>
      <div class="item"><strong>Firmware:</strong> v${esc(inst?.firmware || '1.0')}</div>
    </div>
    <div class="card">
      <h3>2. Laboratory & Environmental Test Conditions</h3>
      <div class="item"><strong>Laboratory:</strong> ${esc(e.lab || '—')}</div>
      <div class="item"><strong>Location:</strong> ${esc(e.location || '—')}</div>
      <div class="item"><strong>Evaluation Date:</strong> ${esc(e.date || '—')}</div>
      <div class="item"><strong>Ambient Temperature:</strong> ${esc(e.temperature || '—')} °C</div>
      <div class="item"><strong>Relative Humidity:</strong> ${esc(e.humidity || '—')} % RH</div>
      <div class="item"><strong>Evaluation Type:</strong> ${esc(e.evaluationType === 'INITIAL_VERIFICATION' ? 'Initial Verification' : 'In-Service Inspection')}</div>
      <div class="item"><strong>Rule Version:</strong> <code>${esc(e.ruleVersion || 'UNCONFIGURED')}</code></div>
    </div>
  </div>

  <div style="margin:20px 0;">
    <h3 style="font-size:15px;color:#142c3b;border-bottom:1px solid #ccc;padding-bottom:6px;">3. Metrological Observations & MPE Traceability</h3>
    <table>
      <thead>
        <tr>
          <th>Test Procedure</th>
          <th>Reference Load</th>
          <th>Indication</th>
          <th>Load / e</th>
          <th>Calculated Error</th>
          <th>Applicable MPE</th>
          <th>Compliance Result</th>
          <th>Rule Reference</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        ${calcRows || '<tr><td colspan="9" style="text-align:center;">No observations recorded.</td></tr>'}
      </tbody>
    </table>
    <div style="font-size:11px;color:#666;font-style:italic;">
      * Formula: Error = Scale Reading − Reference Load. Load/e = Reference Load / e.
      ${isDemo ? 'Demo simulation values shown.' : 'Verified mode active: Reference required without configured rule package.'}
    </div>
  </div>

  ${attachmentsHtml}

  <div class="card" style="margin:20px 0;">
    <h3>4. Technical Review & Sign-off</h3>
    <div class="item"><strong>Tester Comments:</strong> ${esc(e.comments || 'Observations verified and submitted.')}</div>
    <div class="item"><strong>Reviewer Comments:</strong> ${esc(e.reviewerComments || 'Traceability reviewed and accepted.')}</div>
  </div>

  <div class="signatures">
    <div class="sig-block">
      <div><strong>Evaluated by (Tester):</strong> ${esc(e.tester || 'Demo Tester')}</div>
      <div class="sig-line"></div>
      <div style="font-size:11px;color:#666;margin-top:4px;">Signature & Date</div>
    </div>
    <div class="sig-block">
      <div><strong>Reviewed & Approved by (Reviewer):</strong> ${esc(e.reviewer || 'Demo Reviewer')}</div>
      <div class="sig-line"></div>
      <div style="font-size:11px;color:#666;margin-top:4px;">Signature & Date</div>
    </div>
  </div>
</body>
</html>`;

    const printWin = window.open('', '_blank');
    if (!printWin) {
      toast('Please allow pop-ups to open and print the report');
      return;
    }
    printWin.document.write(printHtml);
    printWin.document.close();
    printWin.focus();
  }
};

// -------------------------------------------------------------
// 9. GLOBAL APPLICATION STATE & HELPERS
// -------------------------------------------------------------
let page = 'dashboard';
let active = null;
let step = 0;
let query = '';
let role = sessionStorage.getItem('nawi_role') || 'TESTER';
let currentObsTest = '';

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function toast(message) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 3200);
}

// Requirement 7: Every compliance calculation must have one of these states:
// PASS, FAIL, REFERENCE_REQUIRED, NOT_EVALUATED
function badge(status) {
  const s = String(status || '').toUpperCase();
  let cls = '';
  if (['APPROVED', 'COMPLETED', 'PASS'].includes(s)) cls = 'good';
  else if (['REJECTED', 'RETURNED_FOR_CORRECTION', 'FAIL'].includes(s)) cls = 'bad';
  else if (['SUBMITTED_FOR_REVIEW', 'UNDER_REVIEW', 'REFERENCE_REQUIRED', 'NEAR_LIMIT', 'WARN'].includes(s)) cls = 'warn';
  else if (['NOT_EVALUATED', 'DRAFT'].includes(s)) cls = '';
  return `<span class="badge ${cls}">${esc(s.replaceAll('_', ' '))}</span>`;
}

function field(label, name, value = '', type = 'text', required = false, extra = '') {
  return `<div class="field">
    <label for="${name}">${label}${required ? ' *' : ''}</label>
    <input id="${name}" name="${name}" type="${type}" value="${esc(value)}" ${required ? 'required' : ''} ${extra}>
  </div>`;
}

function selectField(label, name, options, current) {
  return `<div class="field">
    <label for="${name}">${label}</label>
    <select id="${name}" name="${name}">
      ${options.map(([v, l]) => `<option value="${esc(v)}" ${String(v) === String(current) ? 'selected' : ''}>${esc(l)}</option>`).join('')}
    </select>
  </div>`;
}

function formData(f) {
  return Object.fromEntries(new FormData(f));
}

function show(p, id = null, s = 0) {
  page = p;
  active = id;
  step = s;
  query = '';
  render();
  window.scrollTo(0, 0);
}

function panel(title, body, more = '') {
  return `<div class="panel"><div class="toolbar"><h2>${title}</h2>${more}</div>${body}</div>`;
}

function table(head, rows, empty = 'No records yet.') {
  return `<div class="table-wrap"><table><thead><tr>${head.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.join('') : `<tr><td colspan="${head.length}" class="empty">${empty}</td></tr>`}</tbody></table></div>`;
}

function modal(html, maxWidth = '860px') {
  const d = document.createElement('dialog');
  if (maxWidth) d.style.width = `min(${maxWidth}, calc(100% - 32px))`;
  d.innerHTML = `<div class="modal"><button class="btn right subtle small" type="button" data-close>✕ Close</button>${html}</div>`;
  document.body.append(d);
  d.showModal();
  d.addEventListener('click', e => {
    if (e.target === d || e.target.closest('[data-close]')) d.close();
  });
  d.addEventListener('close', () => d.remove());
  return d;
}

// -------------------------------------------------------------
// 10. ERROR VISUALIZATION CHART (SVG)
// -------------------------------------------------------------
function renderErrorChart(observations, inst, complianceMode = 'DEMO', evalType = 'INITIAL_VERIFICATION') {
  if (!observations || observations.length === 0) {
    return `<div class="empty">Add observation entries to generate the Error Trend Visualization chart.</div>`;
  }

  const unit = inst?.unit || 'kg';
  const data = observations.map(o => {
    const res = oimlRuleService.evaluateObservation({
      accuracyClass: inst?.class,
      e: inst?.e,
      d: inst?.d,
      max: inst?.max,
      min: inst?.min,
      unit,
      referenceLoad: o.reference,
      scaleReading: o.indication,
      evaluationType: evalType,
      testType: o.test,
      complianceMode
    });
    return {
      test: o.test,
      reference: Number(o.reference),
      indication: Number(o.indication),
      error: res.calculatedError,
      limit: res.applicableMpe,
      isPass: res.complianceResult === 'PASS',
      isNearLimit: res.isNearLimit,
      complianceResult: res.complianceResult
    };
  }).sort((a, b) => a.reference - b.reference);

  const maxCapacity = Math.max(Number(inst?.max) || 100, ...data.map(d => d.reference));
  const maxAbsError = Math.max(0.02, ...data.map(d => Math.max(Math.abs(d.error), (d.limit || 0) * 1.25)));

  const svgWidth = 720;
  const svgHeight = 280;
  const padLeft = 70;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 45;

  const plotW = svgWidth - padLeft - padRight;
  const plotH = svgHeight - padTop - padBottom;

  const scaleX = val => padLeft + (val / maxCapacity) * plotW;
  const scaleY = val => padTop + (plotH / 2) - (val / maxAbsError) * (plotH / 2);

  const zeroY = scaleY(0);

  // Y Grid
  const gridSteps = 4;
  let gridY = '';
  for (let i = -gridSteps / 2; i <= gridSteps / 2; i++) {
    const errVal = (i / (gridSteps / 2)) * maxAbsError;
    const yPos = scaleY(errVal);
    gridY += `<line x1="${padLeft}" y1="${yPos}" x2="${svgWidth - padRight}" y2="${yPos}" stroke="#e9f0f3" stroke-width="1"/>
      <text x="${padLeft - 8}" y="${yPos + 4}" fill="#718892" font-size="11" text-anchor="end">${errVal > 0 ? '+' : ''}${errVal.toFixed(3)}</text>`;
  }

  // X Grid
  let gridX = '';
  for (let stepIdx = 0; stepIdx <= 4; stepIdx++) {
    const loadVal = (stepIdx / 4) * maxCapacity;
    const xPos = scaleX(loadVal);
    gridX += `<line x1="${xPos}" y1="${padTop}" x2="${xPos}" y2="${svgHeight - padBottom}" stroke="#e9f0f3" stroke-width="1"/>
      <text x="${xPos}" y="${svgHeight - padBottom + 18}" fill="#718892" font-size="11" text-anchor="middle">${loadVal.toFixed(1)} ${unit}</text>`;
  }

  // Permissible Limit bounds (shown only when applicableMpe is known, e.g. Demo mode)
  let upperLimitPath = '';
  let lowerLimitPath = '';
  const hasLimits = complianceMode === 'DEMO' && data.some(d => d.limit !== null);

  if (hasLimits) {
    data.forEach((pt, idx) => {
      const x = scaleX(pt.reference);
      const yUpper = scaleY(pt.limit);
      const yLower = scaleY(-pt.limit);
      upperLimitPath += (idx === 0 ? `M ${x} ${yUpper}` : ` L ${x} ${yUpper}`);
      lowerLimitPath += (idx === 0 ? `M ${x} ${yLower}` : ` L ${x} ${yLower}`);
    });
  }

  // Trend line connecting error points
  let trendLine = '';
  data.forEach((pt, idx) => {
    const x = scaleX(pt.reference);
    const y = scaleY(pt.error);
    trendLine += (idx === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
  });

  // Data point markers
  const markers = data.map(pt => {
    const cx = scaleX(pt.reference);
    const cy = scaleY(pt.error);
    let fill = '#167f79';
    let stroke = '#126e69';

    if (pt.complianceResult === 'FAIL') {
      fill = '#e04f4b';
      stroke = '#b8322e';
    } else if (pt.isNearLimit) {
      fill = '#e69500';
      stroke = '#b37400';
    } else if (pt.complianceResult === 'REFERENCE_REQUIRED') {
      fill = '#c28308';
      stroke = '#8c5d00';
    }

    const tip = `Load: ${pt.reference} ${unit} | Error: ${calculationService.formatError(pt.error, unit)} | Status: ${pt.complianceResult}${pt.isNearLimit ? ' (Near Limit)' : ''}`;
    return `<g class="chart-point" tabindex="0">
      <circle cx="${cx}" cy="${cy}" r="6" fill="${fill}" stroke="${stroke}" stroke-width="2">
        <title>${esc(tip)}</title>
      </circle>
      <text x="${cx}" y="${cy - 10}" fill="#223b47" font-size="10.5" font-weight="bold" text-anchor="middle">${calculationService.formatError(pt.error)}</text>
    </g>`;
  }).join('');

  return `
  <div class="chart-container">
    <div class="chart-header">
      <div>
        <h3 style="margin:0 0 4px;font-size:16px;">Measurement Error Trend Across Applied Loads</h3>
        <p class="muted" style="margin:0;font-size:12px;">X-axis: Test Load (${unit}) · Y-axis: Calculated Error (${unit}) · Mode: <b>${esc(complianceMode)}</b></p>
      </div>
      <span class="badge" style="background:#eaf2f5;color:#244757;">${data.length} Observation Points Plotted</span>
    </div>
    <div style="overflow-x:auto;">
      <svg class="chart-svg" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet">
        <!-- Axes and Grids -->
        ${gridY}
        ${gridX}
        <!-- Zero reference line -->
        <line x1="${padLeft}" y1="${zeroY}" x2="${svgWidth - padRight}" y2="${zeroY}" stroke="#527888" stroke-width="1.75"/>
        <text x="${svgWidth - padRight + 6}" y="${zeroY + 4}" fill="#527888" font-size="11" font-weight="bold">0</text>

        <!-- Limit Envelope in Demo Mode -->
        ${hasLimits && data.length > 1 ? `
          <path d="${upperLimitPath}" fill="none" stroke="#d48c08" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.8"/>
          <path d="${lowerLimitPath}" fill="none" stroke="#d48c08" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.8"/>
        ` : ''}

        <!-- Trend Line -->
        ${data.length > 1 ? `<path d="${trendLine}" fill="none" stroke="#167f79" stroke-width="2.5" stroke-linecap="round"/>` : ''}

        <!-- Data Point Markers -->
        ${markers}
      </svg>
    </div>
    <div class="chart-legend">
      ${complianceMode === 'DEMO' ? `
        <div class="legend-item"><span class="legend-dot" style="background:#167f79;"></span> Demo Pass</div>
        <div class="legend-item"><span class="legend-dot" style="background:#e69500;"></span> ⚠ Near Limit Warning (≥75% limit)</div>
        <div class="legend-item"><span class="legend-dot" style="background:#e04f4b;"></span> Demo Fail</div>
        <div class="legend-item"><span class="legend-line" style="border-top:2px dashed #d48c08;"></span> Demo Permissible Envelope (±Limit)</div>
      ` : `
        <div class="legend-item"><span class="legend-dot" style="background:#c28308;"></span> Observed Point (REFERENCE REQUIRED)</div>
        <div class="legend-item"><span class="legend-line" style="border-top:2px dashed #999;"></span> Permissible Envelope: Unconfigured</div>
      `}
      <div class="legend-item"><span class="legend-line" style="border-top:2px solid #527888;"></span> Zero Error Reference</div>
    </div>
  </div>`;
}

// -------------------------------------------------------------
// 11. "WHY THIS RESULT?" TRACEABILITY MODAL
// -------------------------------------------------------------
// Requirement 5: Display full regulatory traceability breakdown:
// Accuracy Class, Evaluation Type, Applied Load, Interval (e),
// Load expressed as number of e (L/e), Applicable MPE band,
// MPE calculation, Actual Error, Comparison, Compliance Result,
// OIML reference, Rule version.
function showWhyThisResult(obs, inst, evaluation) {
  const unit = inst?.unit || 'kg';
  const evalType = evaluation?.evaluationType || 'INITIAL_VERIFICATION';
  const compMode = evaluation?.complianceMode || 'DEMO';
  const ruleVer = evaluation?.ruleVersion || 'oiml-r76-1-2006';

  const res = oimlRuleService.evaluateObservation({
    accuracyClass: inst?.class,
    e: inst?.e,
    d: inst?.d,
    max: inst?.max,
    min: inst?.min,
    unit,
    referenceLoad: obs.reference,
    scaleReading: obs.indication,
    evaluationType: evalType,
    testType: obs.test,
    ruleVersion: ruleVer,
    complianceMode: compMode,
    allObservations: evaluation?.observations,
    observation: obs,
    seriesId: obs.seriesId
  });

  const diffStr = calculationService.formatError(res.calculatedError, unit);

  modal(`
    <div class="modal-header">
      <div>
        <div class="eyebrow">OIML R76 METROLOGICAL TRACEABILITY BREAKDOWN</div>
        <h2>Why This Result?</h2>
      </div>
      <div>${res.badgeHtml}</div>
    </div>

    <!-- Mode Banner -->
    ${compMode === 'DEMO' ? `
      <div class="callout" style="background:#fff7e6;border-color:#f5d998;color:#7e5b15;">
        <strong>DEMO COMPLIANCE MODE:</strong>
        Tolerance bands and criteria are synthetic demonstration parameters for testing calculation workflows. <em>Demo compliance values — not for regulatory use.</em>
      </div>
    ` : (res.complianceResult === 'REFERENCE_REQUIRED' ? `
      <div class="callout warn" style="background:#fef7e7;border-color:#f5d68b;color:#855805;">
        <strong>VERIFIED OIML R76 SAFETY STATE (REFERENCE REQUIRED):</strong>
        ${esc(res.explanation || 'Regulatory compliance cannot be determined automatically without verified normative rule package for this procedure.')}
      </div>
    ` : (res.testType === 'REPEATABILITY' ? `
      <div class="callout" style="background:#eaf6f5;border-color:#b4e3df;color:#135955;">
        <strong>VERIFIED OIML R 76-1:2006 REPEATABILITY TRACEABILITY:</strong>
        Repeatability series evaluated under OIML R 76-1:2006 Section 3.6.1 and Annex A.4.10 using verified Table 6 MPE resolution (${esc(evalType === 'INITIAL_VERIFICATION' ? 'Initial Verification' : 'In-Service Inspection')}).
      </div>
    ` : (res.testType === 'ZERO_RETURN' ? `
      <div class="callout" style="background:#eaf6f5;border-color:#b4e3df;color:#135955;">
        <strong>VERIFIED OIML R 76-1:2006 ZERO RETURN TRACEABILITY:</strong>
        Zero-return observation evaluated under OIML R 76-1:2006 Section 3.9.4.2 and Annex A.4.11.2 (30-minute sustained load close to Max).
      </div>
    ` : `
      <div class="callout" style="background:#eaf6f5;border-color:#b4e3df;color:#135955;">
        <strong>VERIFIED OIML R 76-1:2006 METROLOGICAL TRACEABILITY:</strong>
        Observation resolved and verified against OIML R 76-1 Edition 2006 (E) ${esc(res.ruleClause || 'Section 3.5.1')}, ${esc(res.ruleTable || 'Table 6')} (${esc(evalType === 'INITIAL_VERIFICATION' ? 'Initial Verification' : 'In-Service Inspection')}).
      </div>
    `)))}

    <div class="trace-box">
      ${compMode === 'VERIFIED_R76' && res.testType === 'REPEATABILITY' && res.complianceResult !== 'REFERENCE_REQUIRED' ? `
        <!-- Verified Repeatability Traceability View matching Requirement 6 -->
        <div class="trace-card">
          <h4>OIML R 76-1:2006 Repeatability Traceability</h4>
          <div class="detail-grid" style="margin:8px 0;background:white;">
            <div class="detail-row">
              <span class="detail-label">Test Procedure</span>
              <span class="detail-val"><strong>Repeatability (Series ${esc(res.seriesId || 'RPT-001')})</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Accuracy Class</span>
              <span class="detail-val"><strong>Class ${esc(res.accuracyClass || inst?.class || 'III')}</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Evaluation Type</span>
              <span class="detail-val"><b>${esc(evalType === 'INITIAL_VERIFICATION' ? 'Initial Verification' : 'In-Service Inspection')}</b></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Max Capacity (Max)</span>
              <span class="detail-val"><code>${esc(res.maxCapacity || inst?.max)} ${esc(unit)}</code></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Recommended Verification Load (~0.8 Max)</span>
              <span class="detail-val"><code>${res.targetTestLoad !== null ? res.targetTestLoad + ' ' + esc(unit) : '~' + ((Number(inst?.max) || 0) * 0.8).toFixed(2) + ' ' + esc(unit)}</code></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Actual Applied Reference Load</span>
              <span class="detail-val"><code>${Number(res.referenceLoad).toFixed(3)} ${esc(unit)}</code></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Required Weighings (Annex A.4.10)</span>
              <span class="detail-val"><b>${res.requiredRepetitions || '—'} weighings</b></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Weighings Performed</span>
              <span class="detail-val"><b>${res.actualRepetitions} weighings</b></span>
            </div>
          </div>

          <!-- Series Readings List -->
          <div style="margin: 12px 0;">
            <strong style="font-size:13px;">Series Weighings Breakdown:</strong>
            <table style="width:100%;border-collapse:collapse;margin-top:6px;font-size:13px;">
              <thead>
                <tr style="background:#f1f6f8;border-bottom:1px solid #d5e2e6;">
                  <th style="padding:6px 8px;text-align:left;">Weighing</th>
                  <th style="padding:6px 8px;text-align:left;">Indication (I)</th>
                  <th style="padding:6px 8px;text-align:left;">Error (I − L)</th>
                  <th style="padding:6px 8px;text-align:left;">Applicable MPE</th>
                  <th style="padding:6px 8px;text-align:left;">Individual Compliance</th>
                </tr>
              </thead>
              <tbody>
                ${(res.individualResults && res.individualResults.length > 0) ? res.individualResults.map((ir, idx) => `
                  <tr style="border-bottom:1px solid #eef3f5;">
                    <td style="padding:6px 8px;"><b>Reading ${idx + 1}</b></td>
                    <td style="padding:6px 8px;"><code>${Number(ir.indication).toFixed(3)} ${esc(unit)}</code></td>
                    <td style="padding:6px 8px;"><code>${esc(ir.errorFormatted)}</code></td>
                    <td style="padding:6px 8px;"><code>±${res.applicableMpe} ${esc(unit)}</code></td>
                    <td style="padding:6px 8px;">
                      ${ir.isPass ? '<span class="badge good" style="font-size:11px;">PASS</span>' : '<span class="badge bad" style="font-size:11px;">FAIL</span>'}
                    </td>
                  </tr>
                `).join('') : res.indications.map((ind, idx) => `
                  <tr style="border-bottom:1px solid #eef3f5;">
                    <td style="padding:6px 8px;"><b>Reading ${idx + 1}</b></td>
                    <td style="padding:6px 8px;"><code>${Number(ind).toFixed(3)} ${esc(unit)}</code></td>
                    <td style="padding:6px 8px;"><code>${calculationService.formatError(calculationService.decimalSafeSubtract(ind, res.referenceLoad), unit)}</code></td>
                    <td style="padding:6px 8px;"><code>±${res.applicableMpe || '—'} ${esc(unit)}</code></td>
                    <td style="padding:6px 8px;"><span class="badge warn" style="font-size:11px;">PENDING</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="font-family: monospace; font-size: 13.5px; line-height: 1.8; background: #fdfefe; border: 1px solid #d0dfe5; padding: 16px; border-radius: 6px; color: #142c3b; margin-top: 10px;">
            <div><strong>Highest Indication:</strong> ${res.highestIndication !== null ? Number(res.highestIndication).toFixed(3) + ' ' + esc(unit) : '—'}</div>
            <div><strong>Lowest Indication:</strong> ${res.lowestIndication !== null ? Number(res.lowestIndication).toFixed(3) + ' ' + esc(unit) : '—'}</div>
            <div style="margin-top: 8px;"><strong>Repeatability Difference</strong> = Highest − Lowest = ${res.highestIndication !== null && res.lowestIndication !== null ? `${Number(res.highestIndication).toFixed(3)} − ${Number(res.lowestIndication).toFixed(3)} = <strong>${res.repeatabilityDifference} ${esc(unit)}</strong>` : '—'}</div>
            <div style="margin-top: 8px;"><strong>Load in intervals (m / e):</strong> ${res.loadInIntervals} e (Reference: ${Number(res.referenceLoad).toFixed(3)} ${esc(unit)} / e: ${res.e ?? inst?.e} ${esc(unit)})</div>
            <div><strong>Applicable Table 6 MPE:</strong> ±${res.mpeMultiplier} e = <strong>±${res.applicableMpe} ${esc(unit)}</strong> (Multiplier: ±${res.mpeMultiplier} e)</div>
            <div style="margin-top: 8px;"><strong>Repeatability Comparison:</strong> Repeatability Difference ${res.repeatabilityDifference !== null ? (res.repeatabilityDifference <= Math.abs(res.applicableMpe) ? '≤' : '>') : '—'} |MPE| (${res.repeatabilityDifference} ${res.repeatabilityDifference !== null && res.repeatabilityDifference <= Math.abs(res.applicableMpe) ? '≤' : '>'} ${Math.abs(res.applicableMpe)})</div>
            <div><strong>Individual Weighing Compliance:</strong> ${res.individualResults && res.individualResults.length > 0 ? (res.allIndividualResultsWithinMpe ? 'All individual weighings within MPE' : 'One or more individual weighings exceed MPE') : (res.complianceResult === 'NOT_EVALUATED' ? 'Additional observations required' : '—')}</div>
            <div style="margin-top: 10px; font-size: 15px;"><strong>Final Result:</strong> <b style="color: ${res.complianceResult === 'PASS' ? '#167f79' : (res.complianceResult === 'FAIL' ? '#d93834' : '#7b6314')};">${res.complianceResult}</b></div>
            <div style="margin-top: 6px; font-size: 13px; color: #355361;">${esc(res.explanation)}</div>
            <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed #b8ced7; font-size: 12.5px;">
              <strong>Rule Reference:</strong><br>
              OIML R 76-1:2006<br>
              Section 3.6.1 (Repeatability)<br>
              Annex A.4.10 (Repeatability test)<br>
              Table 6 MPE Resolution: ${esc(res.mpeRuleReference || 'OIML R 76-1:2006 Table 6')}
            </div>
            <div style="margin-top: 4px; font-size: 12px; color: #527888;"><strong>Rule Version:</strong> <code>${esc(res.ruleVersion)}</code></div>
          </div>
        </div>
      ` : (compMode === 'VERIFIED_R76' && res.testType === 'ZERO_RETURN' && res.complianceResult !== 'REFERENCE_REQUIRED' ? `
        <!-- Verified Zero Return Traceability View matching Requirement 17 -->
        <div class="trace-card">
          <h4>OIML R 76-1:2006 Zero Return Traceability</h4>
          <div class="detail-grid" style="margin:8px 0;background:white;">
            <div class="detail-row">
              <span class="detail-label">Test Procedure</span>
              <span class="detail-val"><strong>Zero Return (Section 3.9.4.2 / Annex A.4.11.2)</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Accuracy Class</span>
              <span class="detail-val"><strong>Class ${esc(res.accuracyClass || inst?.class || 'III')}</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Instrument Type</span>
              <span class="detail-val"><b>${res.instrumentConfiguration?.isMultiInterval ? 'Multi-Interval' : (res.instrumentConfiguration?.isMultipleRange ? 'Multiple Range' : 'Single Interval')}</b></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Max Capacity (Max)</span>
              <span class="detail-val"><code>${esc(res.maxCapacity || inst?.max)} ${esc(unit)}</code></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Applied Test Load (Close to Max)</span>
              <span class="detail-val"><code>${Number(res.appliedLoad || obs.reference).toFixed(3)} ${esc(unit)}</code></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Loading Duration (Required ≥ 30 min)</span>
              <span class="detail-val"><b>${res.loadingDurationMinutes !== null ? res.loadingDurationMinutes + ' min' : '30 min'}</b></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Automatic Zero Device During Test</span>
              <span class="detail-val"><b>${res.automaticZeroConfiguration?.hasAutomaticZeroSetting ? (res.automaticZeroConfiguration?.automaticZeroDisabledDuringTest ? 'Disabled (Compliant)' : 'Active (Non-compliant)') : 'Not equipped'}</b></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Zero-Tracking Device During Test</span>
              <span class="detail-val"><b>${res.automaticZeroConfiguration?.hasZeroTracking ? (res.automaticZeroConfiguration?.zeroTrackingDisabledDuringTest ? 'Disabled (Compliant)' : 'Active (Non-compliant)') : 'Not equipped'}</b></span>
            </div>
          </div>

          <div style="font-family: monospace; font-size: 13.5px; line-height: 1.8; background: #fdfefe; border: 1px solid #d0dfe5; padding: 16px; border-radius: 6px; color: #142c3b; margin-top: 10px;">
            <div><strong>Initial Zero Indication:</strong> ${res.initialZeroIndication !== null ? Number(res.initialZeroIndication).toFixed(4) + ' ' + esc(unit) : '—'}</div>
            <div><strong>Returned Zero Indication:</strong> ${res.returnedZeroIndication !== null ? Number(res.returnedZeroIndication).toFixed(4) + ' ' + esc(unit) : '—'}</div>
            <div style="margin-top: 8px;"><strong>Signed Zero Return Deviation:</strong> Returned − Initial = ${res.returnedZeroIndication !== null && res.initialZeroIndication !== null ? `${Number(res.returnedZeroIndication).toFixed(4)} − ${Number(res.initialZeroIndication).toFixed(4)} = <strong>${res.zeroReturnDeviation} ${esc(unit)}</strong>` : '—'}</div>
            <div><strong>Absolute Deviation:</strong> |Deviation| = <strong>${res.absoluteZeroReturnDeviation} ${esc(unit)}</strong></div>
            <div style="margin-top: 8px;"><strong>Verification Scale Interval Used:</strong> <code>${res.standardEvaluation?.intervalLabel || 'e'} = ${res.standardEvaluation?.intervalUsed} ${esc(unit)}</code></div>
            <div><strong>Allowed Limit:</strong> 0.5 × ${res.standardEvaluation?.intervalLabel || 'e'} = <strong>±${res.standardEvaluation?.allowedDeviation} ${esc(unit)}</strong></div>
            <div style="margin-top: 8px;"><strong>Standard Comparison:</strong> |Deviation| ${res.standardEvaluation?.result === 'PASS' ? '≤' : '>'} Allowed Limit (${res.absoluteZeroReturnDeviation} ${res.standardEvaluation?.result === 'PASS' ? '≤' : '>'} ${res.standardEvaluation?.allowedDeviation})</div>
            <div><strong>Standard Zero-Return Result:</strong> <b style="color: ${res.standardEvaluation?.result === 'PASS' ? '#167f79' : '#d93834'};">${res.standardEvaluation?.result}</b></div>

            ${res.multipleRangeFollowUp?.applicable ? `
              <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #b8ced7;">
                <strong>Section 3.9.4.2 Multiple-Range 5-Minute Follow-Up:</strong>
                <div>Max1 = ${res.multipleRangeFollowUp?.allowedVariation ? esc(res.instrumentConfiguration?.ranges?.[0]?.Max_i || '—') : '—'} ${esc(unit)}, e1 = ${res.multipleRangeFollowUp?.allowedVariation} ${esc(unit)}</div>
                <div>Load before return (${Number(res.appliedLoad).toFixed(3)} ${esc(unit)}) > Max1: 5-minute lowest-range follow-up required.</div>
                <div>Near-zero observations count: ${res.multipleRangeFollowUp?.observations?.length || 0}</div>
                <div>Maximum variation during 5 min: <strong>${res.multipleRangeFollowUp?.maximumVariation !== null ? res.multipleRangeFollowUp.maximumVariation + ' ' + esc(unit) : '—'}</strong> (Allowed: ≤ ${res.multipleRangeFollowUp?.allowedVariation} ${esc(unit)})</div>
                <div>Follow-up Result: <b style="color: ${res.multipleRangeFollowUp?.result === 'PASS' ? '#167f79' : (res.multipleRangeFollowUp?.result === 'FAIL' ? '#d93834' : '#7b6314')}">${res.multipleRangeFollowUp?.result}</b></div>
              </div>
            ` : ''}

            <div style="margin-top: 10px; font-size: 15px;"><strong>Final Result:</strong> <b style="color: ${res.complianceResult === 'PASS' ? '#167f79' : (res.complianceResult === 'FAIL' ? '#d93834' : '#7b6314')};">${res.complianceResult}</b></div>
            <div style="margin-top: 6px; font-size: 13px; color: #355361;">${esc(res.explanation)}</div>
            <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed #b8ced7; font-size: 12.5px;">
              <strong>Rule Reference:</strong><br>
              OIML R 76-1:2006 Section 3.9.4.2 (Zero return)<br>
              Annex A.4.11.2 (Zero return test)
            </div>
            <div style="margin-top: 4px; font-size: 12px; color: #527888;"><strong>Rule Version:</strong> <code>${esc(res.ruleVersion)}</code></div>
          </div>
        </div>
      ` : (compMode === 'VERIFIED_R76' && res.complianceResult !== 'REFERENCE_REQUIRED' ? `
        <!-- Verified Traceability View matching Requirement 6 -->
        <div class="trace-card">
          <h4>OIML R 76-1:2006 Calculation Trace</h4>
          <div class="detail-grid" style="margin:8px 0;background:white;">
            <div class="detail-row">
              <span class="detail-label">Accuracy Class</span>
              <span class="detail-val"><strong>Class ${esc(res.accuracyClass || inst?.class || 'III')}</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Evaluation Type</span>
              <span class="detail-val"><b>${esc(evalType === 'INITIAL_VERIFICATION' ? 'Initial Verification' : 'In-Service Inspection')}</b></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Verification Scale Interval e</span>
              <span class="detail-val"><code>${esc(res.e ?? inst?.e)} ${esc(unit)}</code></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Selected MPE Band</span>
              <span class="detail-val"><code>${esc(res.bandDesc)}</code></span>
            </div>
          </div>

          <div style="font-family: monospace; font-size: 13.5px; line-height: 1.8; background: #fdfefe; border: 1px solid #d0dfe5; padding: 16px; border-radius: 6px; color: #142c3b; margin-top: 10px;">
            <div><strong>Reference Load:</strong> ${Number(obs.reference).toFixed(3)} ${esc(unit)}</div>
            <div><strong>Indication:</strong> ${Number(obs.indication).toFixed(3)} ${esc(unit)}</div>
            <div style="margin-top: 8px;"><strong>Error</strong> = Indication − Reference Load = ${Number(obs.indication).toFixed(3)} − ${Number(obs.reference).toFixed(3)} = <strong>${diffStr}</strong></div>
            <div><strong>Absolute Error:</strong> |Error| = <strong>${res.absoluteError} ${esc(unit)}</strong></div>
            <div style="margin-top: 8px;"><strong>Load / e</strong> = ${Number(obs.reference).toFixed(3)} / ${res.e ?? inst?.e} = <strong>${res.loadInIntervals} e</strong></div>
            <div style="margin-top: 8px;"><strong>Applicable MPE multiplier</strong> = <strong>±${res.mpeMultiplier} e</strong> ${evalType === 'IN_SERVICE_INSPECTION' ? '(2 × Table 6 initial MPE under Section 3.5.2)' : ''}</div>
            <div><strong>Applicable MPE</strong> = multiplier × e = ±${res.mpeMultiplier} × ${res.e ?? inst?.e} = <strong>±${res.applicableMpe} ${esc(unit)}</strong></div>
            <div style="margin-top: 8px;"><strong>Comparison:</strong> |Error| ${res.complianceResult === 'PASS' ? '≤' : '>'} MPE (${res.absoluteError} ${res.complianceResult === 'PASS' ? '≤' : '>'} ${res.applicableMpe})</div>
            <div style="margin-top: 10px; font-size: 15px;"><strong>Result:</strong> <b style="color: ${res.complianceResult === 'PASS' ? '#167f79' : '#d93834'};">${res.complianceResult}</b></div>
            <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed #b8ced7; font-size: 12.5px;">
              <strong>Rule:</strong><br>
              OIML R 76-1:2006<br>
              ${esc(res.ruleClause || 'Section 3.5.1')}<br>
              ${esc(res.ruleTable || 'Table 6')}
            </div>
            <div style="margin-top: 4px; font-size: 12px; color: #527888;"><strong>Rule Version:</strong> <code>${esc(res.ruleVersion)}</code></div>
          </div>
        </div>
      ` : (compMode === 'VERIFIED_R76' ? `
        <!-- Safety State: Reference Required View -->
        <div class="trace-card">
          <h4>Metrological Evaluation (Safety State)</h4>
          <div class="callout warn" style="margin:8px 0;">
            <strong>REFERENCE REQUIRED</strong><br>
            ${esc(res.explanation)}
          </div>
          <div class="detail-grid" style="margin:8px 0;background:white;">
            <div class="detail-row">
              <span class="detail-label">Accuracy Class</span>
              <span class="detail-val"><strong>Class ${esc(inst?.class || '—')}</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Evaluation Type</span>
              <span class="detail-val"><b>${esc(evalType === 'INITIAL_VERIFICATION' ? 'Initial Verification' : 'In-Service Inspection')}</b></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Test Procedure</span>
              <span class="detail-val"><b>${esc(obs.test)}</b></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Applied Reference Load</span>
              <span class="detail-val"><code>${Number(obs.reference).toFixed(3)} ${esc(unit)}</code></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Scale Indication Reading</span>
              <span class="detail-val"><code>${Number(obs.indication).toFixed(3)} ${esc(unit)}</code></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Verification Scale Interval (e)</span>
              <span class="detail-val"><code>${esc(inst?.e)} ${esc(unit)}</code></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Load / e</span>
              <span class="detail-val"><code>${res.loadInIntervals} e</code></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Calculated Error</span>
              <span class="detail-val"><code>${diffStr}</code></span>
            </div>
          </div>
          <div style="margin-top:12px;padding-top:10px;border-top:1px solid #e2ecee;font-size:12px;color:#59717d;">
            <div><strong>Rule Reference:</strong> ${esc(res.ruleReference)}</div>
            <div><strong>Rule Version:</strong> <code>${esc(res.ruleVersion)}</code></div>
            <div style="margin-top:4px;font-style:italic;">* Regulatory safety policy: Never defaults to PASS. Only verified rule packages render decisions.</div>
          </div>
        </div>
      ` : `
        <!-- Demo Mode Trace -->
        <div class="trace-card">
          <h4>1. Instrument & Evaluation Profile</h4>
          <div class="detail-grid" style="margin:6px 0;background:white;">
            <div class="detail-row">
              <span class="detail-label">Accuracy Class</span>
              <span class="detail-val"><strong>Class ${esc(inst?.class || 'III')}</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Evaluation Type</span>
              <span class="detail-val"><b>${esc(evalType === 'INITIAL_VERIFICATION' ? 'Initial Verification' : 'In-Service Inspection')}</b></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Verification Scale Interval (e)</span>
              <span class="detail-val"><code>${esc(inst?.e)} ${esc(unit)}</code></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Actual Scale Interval (d)</span>
              <span class="detail-val"><code>${esc(inst?.d)} ${esc(unit)}</code></span>
            </div>
          </div>
        </div>

        <div class="trace-card">
          <h4>2. Applied Load & Relative Load (m / e)</h4>
          <div class="detail-grid" style="margin:6px 0;background:white;">
            <div class="detail-row">
              <span class="detail-label">Applied / True Reference Load (L)</span>
              <span class="detail-val"><code>${Number(obs.reference).toFixed(3)} ${esc(unit)}</code></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Scale Indication Reading (I)</span>
              <span class="detail-val"><code>${Number(obs.indication).toFixed(3)} ${esc(unit)}</code></span>
            </div>
            <div class="detail-row" style="grid-column:1/-1;">
              <span class="detail-label">Load Expressed as Number of Verification Intervals (L / e)</span>
              <span class="detail-val">
                <code>${Number(obs.reference).toFixed(3)} / ${inst?.e} = <strong>${res.loadInIntervals} e</strong></code>
              </span>
            </div>
          </div>
        </div>

        <div class="trace-card">
          <h4>3. Error Calculation Formula</h4>
          <p style="margin:4px 0 8px;font-size:13px;color:#456270;">Error (E) is evaluated by subtracting the known reference standard load from the scale indication reading:</p>
          <div class="trace-math">Error (E) = Indication (I) − Reference Load (L)</div>
          <div class="trace-math">${Number(obs.indication).toFixed(3)} − ${Number(obs.reference).toFixed(3)} = <strong>${diffStr}</strong></div>
        </div>

        <div class="trace-card">
          <h4>4. Applicable Maximum Permissible Error (MPE)</h4>
          <p style="margin:4px 0 8px;font-size:13px;color:#456270;">Demo synthetic tolerance band: <code>${esc(res.bandDesc)}</code></p>
          <div class="trace-math">Applicable Demo MPE = ±${res.applicableMpe} ${esc(unit)} (±${res.mpeMultiplier} e)</div>
          <small class="muted">Synthetic stepped multiplier configured for demonstration testing only. Demo compliance values — not for regulatory use.</small>
        </div>

        <div class="trace-card">
          <h4>5. Comparison & Compliance Determination</h4>
          <div class="trace-math">Condition: |E| ≤ MPE &nbsp;⟹&nbsp; |${res.calculatedError}| (${Math.abs(res.calculatedError)} ${esc(unit)}) ${res.complianceResult === 'PASS' ? '≤' : '>'} ${res.applicableMpe} ${esc(unit)}</div>
          <div style="margin-top:10px;">
            ${res.complianceResult === 'PASS'
              ? `<div class="callout success" style="margin:6px 0;"><strong>RESULT: PASS</strong> — Calculated error of ${diffStr} is within demo tolerance boundary of ±${res.applicableMpe} ${esc(unit)}.</div>`
              : `<div class="callout danger" style="margin:6px 0;"><strong>RESULT: FAIL</strong> — Calculated error of ${diffStr} exceeds demo permissible limit of ±${res.applicableMpe} ${esc(unit)}.</div>`
            }
            ${res.isNearLimit ? `
              <div class="callout" style="background:#fff2d9;border-color:#f4d193;color:#875b00;margin:6px 0;">
                <strong>⚠ ADVISORY WARNING (NEAR PERMISSIBLE LIMIT):</strong><br>
                The calculated absolute error is ≥ 75% of the permissible limit. This is an informational advisory and does not fail the test run.
              </div>` : ''}
          </div>
          <div style="margin-top:12px;padding-top:10px;border-top:1px solid #e2ecee;font-size:12px;color:#59717d;">
            <div><strong>Rule Reference:</strong> ${esc(res.ruleReference)}</div>
            <div><strong>Rule Version Identifier:</strong> <code>${esc(res.ruleVersion)}</code></div>
            <div style="margin-top:4px;font-style:italic;">* Demo simulation envelope. Not for legal regulatory verification.</div>
          </div>
        </div>
      `)))}
    </div>

    <div class="actions">
      <button class="btn primary" type="button" data-close>Close</button>
    </div>
  `, '820px');
}

// -------------------------------------------------------------
// 12. PAGE RENDERING LOGIC
// -------------------------------------------------------------
function render() {
  const routes = [
    ['dashboard', 'Overview'],
    ['evaluations', 'Evaluations'],
    ['manufacturers', 'Manufacturers'],
    ['instruments', 'Instruments'],
    ['reviews', 'Review queue'],
    ['reports', 'Reports'],
    ['rules', 'Rule management'],
    ['audit', 'Audit log']
  ];

  $('#nav').innerHTML = routes.map(([p, n]) =>
    `<button data-page="${p}" class="${page === p || (page === 'evaluation' && p === 'evaluations') ? 'active' : ''}">${n}</button>`
  ).join('');

  $('#role').value = role;

  const titles = {
    dashboard: 'Dashboard',
    evaluations: 'Evaluations',
    evaluation: 'Evaluation Workspace',
    manufacturers: 'Manufacturers',
    instruments: 'Instruments',
    reviews: 'Review Queue',
    reports: 'Report Repository',
    rules: 'Rule Management',
    audit: 'System Audit Log'
  };
  $('#title').textContent = titles[page] || 'NAWI Laboratory';

  const viewFn = {
    dashboard,
    manufacturers,
    instruments,
    evaluations,
    evaluation,
    reviews,
    reports,
    rules,
    audit
  }[page];

  $('#content').innerHTML = viewFn ? viewFn() : '<p>Page not found</p>';
  bind();
}

// -------------------------------------------------------------
// 12.1 DASHBOARD
// -------------------------------------------------------------
function dashboard() {
  const counts = {
    total: db.evaluations.length,
    draft: db.evaluations.filter(x => x.status === 'DRAFT').length,
    progress: db.evaluations.filter(x => x.status === 'IN_PROGRESS').length,
    pending: db.evaluations.filter(x => x.status === 'SUBMITTED_FOR_REVIEW').length,
    underReview: db.evaluations.filter(x => x.status === 'UNDER_REVIEW').length,
    completed: db.evaluations.filter(x => x.status === 'COMPLETED').length,
    reports: db.evaluations.filter(x => x.report).length
  };

  return `
    <div class="toolbar">
      <div>
        <p style="margin:0;font-size:15px;color:#456270;">Welcome to the <strong>NAWI Metrology Type Evaluation</strong> frontend workspace.</p>
        <p class="muted" style="margin:4px 0 0;">OIML R76 compliance preparation architecture: Evaluation Type selection, DEMO vs VERIFIED_R76 modes, and MPE traceability.</p>
      </div>
      <div class="inline">
        <button class="btn" data-action="reset-demo-data" title="Restore seed data">↻ Reset Demo Data</button>
        <button class="btn primary" data-action="new-evaluation">+ New Evaluation</button>
      </div>
    </div>

    <!-- 4 Main Workflow Metric Cards -->
    <div class="cards">
      <div class="card">
        <small>Total Evaluations</small>
        <strong>${counts.total}</strong>
      </div>
      <div class="card">
        <small>In Progress</small>
        <strong style="color:#167f79;">${counts.progress + counts.draft}</strong>
      </div>
      <div class="card">
        <small>Pending Review</small>
        <strong style="color:#d48c08;">${counts.pending + counts.underReview}</strong>
      </div>
      <div class="card">
        <small>Completed</small>
        <strong style="color:#206b4d;">${counts.completed}</strong>
      </div>
    </div>

    <div class="two">
      <!-- Recent Evaluations -->
      ${panel('Recent Evaluations',
        table(
          ['ID', 'Instrument Model', 'Evaluation Type', 'Compliance Mode', 'Status', ''],
          db.evaluations.slice().reverse().slice(0, 5).map(e => {
            const inst = instrumentService.getById(e.instrument);
            return `<tr>
              <td><button class="link" data-open="${e.id}">${e.id}</button></td>
              <td><b>${esc(inst?.model || '—')}</b><br><small class="muted">${esc(inst?.serial || '')}</small></td>
              <td><span class="badge" style="background:#eaf2f5;font-size:10px;">${esc(e.evaluationType === 'INITIAL_VERIFICATION' ? 'Initial' : 'In-Service')}</span></td>
              <td><span class="badge ${e.complianceMode === 'DEMO' ? 'warn' : 'good'}" style="font-size:10px;">${esc(e.complianceMode)}</span></td>
              <td>${badge(e.status)}</td>
              <td class="right"><button class="btn small" data-open="${e.id}">Open</button></td>
            </tr>`;
          }),
          'No evaluations recorded yet.'
        ),
        `<button class="btn subtle small" data-page="evaluations">View all →</button>`
      )}

      <!-- Recent Reports -->
      ${panel('Recent Reports',
        table(
          ['Report #', 'Instrument', 'Rule Version', 'Action'],
          db.evaluations.filter(e => e.report).slice().reverse().slice(0, 5).map(e => {
            const inst = instrumentService.getById(e.instrument);
            return `<tr>
              <td><button class="link" data-report="${e.id}">${esc(e.report.number)}</button><br><span class="muted">${new Date(e.report.at).toLocaleDateString()}</span></td>
              <td>${esc(inst?.model || '—')}</td>
              <td><code>${esc(e.ruleVersion || 'UNCONFIGURED')}</code></td>
              <td><button class="btn small" data-report="${e.id}">View</button></td>
            </tr>`;
          }),
          'No demo reports generated yet.'
        ),
        `<button class="btn subtle small" data-page="reports">Repository →</button>`
      )}
    </div>

    <div class="two">
      <!-- Review Queue Highlights -->
      ${panel('Review Queue Status',
        db.evaluations.filter(e => ['SUBMITTED_FOR_REVIEW', 'UNDER_REVIEW'].includes(e.status)).length ?
        table(
          ['Evaluation', 'Model', 'Tester', 'Status', 'Action'],
          db.evaluations.filter(e => ['SUBMITTED_FOR_REVIEW', 'UNDER_REVIEW'].includes(e.status)).map(e => {
            const inst = instrumentService.getById(e.instrument);
            return `<tr>
              <td><button class="link" data-review="${e.id}">${e.id}</button></td>
              <td>${esc(inst?.model || '—')}</td>
              <td>${esc(e.tester)}</td>
              <td>${badge(e.status)}</td>
              <td><button class="btn small primary" data-review="${e.id}">Review</button></td>
            </tr>`;
          })
        ) : '<div class="empty">No evaluations currently awaiting review.</div>',
        `<button class="btn subtle small" data-page="reviews">Open queue →</button>`
      )}

      <!-- Recent System Activity -->
      ${panel('Recent Activity',
        db.audit.slice(0, 5).map(a =>
          `<p class="small" style="margin:8px 0;line-height:1.4;">
            <strong>${esc(a.action)}</strong><br>
            <span class="muted">Entity: ${esc(a.entity)} · Actor: ${esc(a.actor)} · ${new Date(a.at).toLocaleTimeString()}</span>
          </p>`
        ).join('') || '<p class="muted">No recent activity logged.</p>',
        `<button class="btn subtle small" data-page="audit">Audit log →</button>`
      )}
    </div>
  `;
}

// -------------------------------------------------------------
// 12.2 MANUFACTURERS MANAGEMENT
// -------------------------------------------------------------
function manufacturers() {
  const list = manufacturerService.getAll(query);
  return `
    <div class="toolbar">
      <div class="inline">
        <input id="search" type="search" placeholder="Search manufacturers..." value="${esc(query)}" aria-label="Search manufacturers">
        <span class="muted small">${list.length} registered</span>
      </div>
      <button class="btn primary" data-action="add-manufacturer">+ Add Manufacturer</button>
    </div>
    ${panel('Manufacturer Directory',
      table(
        ['ID', 'Manufacturer Name', 'Country', 'Contact Person', 'Email / Phone', 'Instruments', 'Actions'],
        list.map(m => {
          const linkedCount = db.instruments.filter(i => i.manufacturer === m.id).length;
          return `<tr>
            <td><code>${m.id}</code></td>
            <td><b>${esc(m.name)}</b></td>
            <td>${esc(m.country)}</td>
            <td>${esc(m.contact || '—')}</td>
            <td>${esc(m.email || '—')}<br><small class="muted">${esc(m.phone || '')}</small></td>
            <td><span class="badge" style="background:#eaf2f5;color:#244757;">${linkedCount} models</span></td>
            <td>
              <div class="inline">
                <button class="btn small" data-view-manufacturer="${m.id}">View</button>
                <button class="btn small" data-edit-manufacturer="${m.id}">Edit</button>
                <button class="btn small danger" data-delete-manufacturer="${m.id}">Delete</button>
              </div>
            </td>
          </tr>`;
        }),
        'No manufacturers match search.'
      )
    )}
  `;
}

function viewManufacturerModal(m) {
  const instruments = db.instruments.filter(i => i.manufacturer === m.id);
  modal(`
    <div class="modal-header">
      <div>
        <div class="eyebrow">MANUFACTURER DOSSIER</div>
        <h2>${esc(m.name)}</h2>
      </div>
      <button class="btn small" data-edit-manufacturer="${m.id}">Edit Profile</button>
    </div>

    <div class="detail-grid">
      <div class="detail-row"><span class="detail-label">Manufacturer ID</span><span class="detail-val"><code>${m.id}</code></span></div>
      <div class="detail-row"><span class="detail-label">Country</span><span class="detail-val">${esc(m.country)}</span></div>
      <div class="detail-row"><span class="detail-label">Contact Person</span><span class="detail-val">${esc(m.contact || '—')}</span></div>
      <div class="detail-row"><span class="detail-label">Email Address</span><span class="detail-val">${esc(m.email || '—')}</span></div>
      <div class="detail-row"><span class="detail-label">Phone Number</span><span class="detail-val">${esc(m.phone || '—')}</span></div>
      <div class="detail-row"><span class="detail-label">Facility Address</span><span class="detail-val">${esc(m.address || '—')}</span></div>
      <div class="detail-row" style="grid-column:1/-1;"><span class="detail-label">Metrological Notes</span><span class="detail-val">${esc(m.notes || 'No notes provided.')}</span></div>
    </div>

    <h3 style="margin:20px 0 10px;">Registered Instruments (${instruments.length})</h3>
    ${table(
      ['Model', 'Serial Number', 'Class', 'Capacity', 'Actions'],
      instruments.map(i => `<tr>
        <td><b>${esc(i.model)}</b></td>
        <td><code>${esc(i.serial)}</code></td>
        <td>Class ${esc(i.class)}</td>
        <td>${esc(i.min)}–${esc(i.max)} ${esc(i.unit)}</td>
        <td><button class="btn small" data-view-instrument="${i.id}">View Instrument</button></td>
      </tr>`),
      'No instruments registered under this manufacturer.'
    )}
    <div class="actions">
      <button class="btn primary" type="button" data-close>Close</button>
    </div>
  `);
}

function addManufacturerModal(m = null) {
  const d = modal(`
    <div class="modal-header">
      <div>
        <div class="eyebrow">MANUFACTURER REGISTRATION</div>
        <h2>${m ? 'Edit Manufacturer' : 'Add New Manufacturer'}</h2>
      </div>
    </div>
    <form id="mform" class="formgrid spaced">
      ${field('Manufacturer Name', 'name', m?.name, 'text', true)}
      ${field('Country of Origin', 'country', m?.country, 'text', true)}
      ${field('Contact Person', 'contact', m?.contact)}
      ${field('Email Address', 'email', m?.email, 'email')}
      ${field('Phone Number', 'phone', m?.phone, 'tel')}
      ${field('Postal Address', 'address', m?.address)}
      <div class="field wide">
        <label for="notes">Notes & Metrology Qualifications</label>
        <textarea id="notes" name="notes">${esc(m?.notes || '')}</textarea>
      </div>
      <div class="field wide actions">
        <button class="btn" type="button" data-close>Cancel</button>
        <button class="btn primary" type="submit">Save Manufacturer</button>
      </div>
    </form>
  `);

  d.querySelector('#mform').onsubmit = e => {
    e.preventDefault();
    const data = formData(e.target);
    if (!data.name || !data.country) return toast('Name and Country are required.');
    if (m) {
      manufacturerService.update(m.id, data);
      toast('Manufacturer updated successfully');
    } else {
      manufacturerService.create(data);
      toast('Manufacturer saved successfully');
    }
    d.close();
    render();
  };
}

// -------------------------------------------------------------
// 12.3 INSTRUMENT MANAGEMENT
// -------------------------------------------------------------
function instruments() {
  const list = instrumentService.getAll(query);
  return `
    <div class="toolbar">
      <div class="inline">
        <input id="search" type="search" placeholder="Search instruments..." value="${esc(query)}" aria-label="Search instruments">
        <span class="muted small">${list.length} registered</span>
      </div>
      <button class="btn primary" data-action="add-instrument">+ Register Instrument</button>
    </div>
    ${panel('Instrument Register',
      table(
        ['ID', 'Model & Serial', 'Manufacturer', 'Class', 'Capacity Range', 'Scale Intervals', 'Evaluations', 'Actions'],
        list.map(i => {
          const mfg = manufacturerService.getById(i.manufacturer);
          const evals = instrumentService.getHistory(i.id);
          return `<tr>
            <td><code>${i.id}</code></td>
            <td><b>${esc(i.model)}</b><br><small class="muted">S/N: ${esc(i.serial)}</small></td>
            <td>${esc(mfg?.name || '—')}</td>
            <td><span class="badge" style="background:#eaf0f5;">Class ${esc(i.class)}</span></td>
            <td>${esc(i.min)} – ${esc(i.max)} ${esc(i.unit)}</td>
            <td><code>e=${esc(i.e)} ${esc(i.unit)}</code><br><small class="muted">d=${esc(i.d)} ${esc(i.unit)}</small></td>
            <td><span class="badge ${evals.length ? 'good' : ''}">${evals.length} records</span></td>
            <td>
              <div class="inline">
                <button class="btn small" data-view-instrument="${i.id}">View</button>
                <button class="btn small" data-edit-instrument="${i.id}">Edit</button>
                <button class="btn small" data-history="${i.id}" title="Evaluation History">History</button>
                <button class="btn small danger" data-delete-instrument="${i.id}">Delete</button>
              </div>
            </td>
          </tr>`;
        }),
        'No instruments match search.'
      )
    )}
  `;
}

function viewInstrumentModal(i) {
  const mfg = manufacturerService.getById(i.manufacturer);
  const history = instrumentService.getHistory(i.id);
  modal(`
    <div class="modal-header">
      <div>
        <div class="eyebrow">METROLOGICAL SPECIFICATIONS</div>
        <h2>${esc(i.model)} · S/N: ${esc(i.serial)}</h2>
      </div>
      <div class="inline">
        <button class="btn small" data-edit-instrument="${i.id}">Edit Specs</button>
      </div>
    </div>

    <div class="detail-grid">
      <div class="detail-row"><span class="detail-label">Instrument ID</span><span class="detail-val"><code>${i.id}</code></span></div>
      <div class="detail-row"><span class="detail-label">Manufacturer</span><span class="detail-val">${esc(mfg?.name || '—')}</span></div>
      <div class="detail-row"><span class="detail-label">Instrument Type</span><span class="detail-val">${esc(i.type || 'Electronic Scale')}</span></div>
      <div class="detail-row"><span class="detail-label">Accuracy Class</span><span class="detail-val"><strong>Class ${esc(i.class)}</strong></span></div>
      <div class="detail-row"><span class="detail-label">Maximum Capacity (Max)</span><span class="detail-val">${esc(i.max)} ${esc(i.unit)}</span></div>
      <div class="detail-row"><span class="detail-label">Minimum Capacity (Min)</span><span class="detail-val">${esc(i.min)} ${esc(i.unit)}</span></div>
      <div class="detail-row"><span class="detail-label">Verification Scale Interval (e)</span><span class="detail-val"><code>${esc(i.e)} ${esc(i.unit)}</code></span></div>
      <div class="detail-row"><span class="detail-label">Actual Scale Interval (d)</span><span class="detail-val"><code>${esc(i.d)} ${esc(i.unit)}</code></span></div>
      <div class="detail-row"><span class="detail-label">Measurement Unit</span><span class="detail-val">${esc(i.unit)}</span></div>
      <div class="detail-row"><span class="detail-label">Firmware Revision</span><span class="detail-val">${esc(i.firmware || '1.0')}</span></div>
    </div>

    <h3 style="margin:20px 0 10px;">Instrument Evaluation History (${history.length})</h3>
    ${table(
      ['Evaluation ID', 'Evaluation Type', 'Mode', 'Test Date', 'Status', 'Report', 'Action'],
      history.map(e => `<tr>
        <td><code>${e.id}</code></td>
        <td><span class="badge" style="font-size:10px;">${esc(e.evaluationType === 'INITIAL_VERIFICATION' ? 'Initial' : 'In-Service')}</span></td>
        <td><span class="badge ${e.complianceMode === 'DEMO' ? 'warn' : 'good'}" style="font-size:10px;">${esc(e.complianceMode)}</span></td>
        <td>${esc(e.date)}</td>
        <td>${badge(e.status)}</td>
        <td>${e.report ? `<b>${esc(e.report.number)}</b>` : '—'}</td>
        <td><button class="btn small" data-open="${e.id}">Open Evaluation</button></td>
      </tr>`),
      'No evaluation records exist for this instrument yet.'
    )}

    <div class="actions">
      <button class="btn primary" type="button" data-close>Close</button>
    </div>
  `);
}

function addInstrumentModal(inst = null) {
  if (!db.manufacturers.length) {
    toast('Please register a manufacturer before registering an instrument.');
    addManufacturerModal();
    return;
  }

  const d = modal(`
    <div class="modal-header">
      <div>
        <div class="eyebrow">METROLOGICAL REGISTRATION</div>
        <h2>${inst ? 'Edit Instrument' : 'Register New Instrument'}</h2>
      </div>
    </div>
    <form id="iform" class="formgrid spaced">
      ${selectField('Manufacturer', 'manufacturer', db.manufacturers.map(m => [m.id, m.name]), inst?.manufacturer || db.manufacturers[0].id)}
      ${field('Model Name', 'model', inst?.model, 'text', true)}
      ${field('Serial Number', 'serial', inst?.serial, 'text', true)}
      ${field('Instrument Type', 'type', inst?.type || 'Electronic platform scale', 'text', true)}
      ${field('Maximum Capacity (Max)', 'max', inst?.max, 'number', true, 'min="0.0001" step="any"')}
      ${field('Minimum Capacity (Min)', 'min', inst?.min, 'number', true, 'min="0.0001" step="any"')}
      ${field('Verification Interval (e)', 'e', inst?.e, 'number', true, 'min="0.0001" step="any"')}
      ${field('Actual Scale Interval (d)', 'd', inst?.d, 'number', true, 'min="0.0001" step="any"')}
      ${selectField('Accuracy Class', 'class', [['I', 'Class I (Special)'], ['II', 'Class II (High)'], ['III', 'Class III (Medium)'], ['IIII', 'Class IIII (Ordinary)']], inst?.class || 'III')}
      ${selectField('Measurement Unit', 'unit', [['kg', 'Kilograms (kg)'], ['g', 'Grams (g)'], ['t', 'Tonnes (t)'], ['mg', 'Milligrams (mg)']], inst?.unit || 'kg')}
      <div class="field wide">
        <label for="firmware">Firmware / Software Version</label>
        <input id="firmware" name="firmware" type="text" value="${esc(inst?.firmware || '1.0')}">
      </div>
      <div class="field wide actions">
        <button class="btn" type="button" data-close>Cancel</button>
        <button class="btn primary" type="submit">Save Instrument</button>
      </div>
    </form>
  `);

  d.querySelector('#iform').onsubmit = e => {
    e.preventDefault();
    const v = formData(e.target);
    if (!v.model || !v.serial) return toast('Model and Serial Number are required.');
    const maxVal = Number(v.max);
    const minVal = Number(v.min);
    const eVal = Number(v.e);
    const dVal = Number(v.d);

    if (isNaN(maxVal) || isNaN(minVal) || maxVal <= minVal) {
      return toast('Validation Error: Maximum capacity (Max) must strictly exceed Minimum capacity (Min).');
    }
    if (isNaN(eVal) || eVal <= 0 || isNaN(dVal) || dVal <= 0) {
      return toast('Validation Error: Scale intervals (e and d) must be greater than zero.');
    }
    const exists = db.instruments.some(x => x.serial.toLowerCase() === v.serial.toLowerCase() && x.id !== inst?.id);
    if (exists) {
      return toast(`Validation Error: Serial number "${v.serial}" is already registered.`);
    }

    if (inst) {
      instrumentService.update(inst.id, v);
      toast('Instrument updated successfully');
    } else {
      instrumentService.create(v);
      toast('Instrument saved successfully');
    }
    d.close();
    render();
  };
}

// -------------------------------------------------------------
// 12.4 EVALUATIONS REGISTER
// -------------------------------------------------------------
function evaluations() {
  const list = evaluationService.getAll(query);
  return `
    <div class="toolbar">
      <div class="inline">
        <input id="search" type="search" placeholder="Search evaluations (ID, model, status)..." value="${esc(query)}" aria-label="Search evaluations">
        <span class="muted small">${list.length} evaluations</span>
      </div>
      <button class="btn primary" data-action="new-evaluation">+ Start New Evaluation</button>
    </div>
    ${panel('Evaluation Register',
      table(
        ['Evaluation ID', 'Instrument Model', 'Evaluation Type', 'Compliance Mode', 'Test Date', 'Status', 'Observations', 'Report #', 'Actions'],
        list.map(e => {
          const inst = instrumentService.getById(e.instrument);
          return `<tr>
            <td><button class="link" data-open="${e.id}"><b>${e.id}</b></button></td>
            <td>${esc(inst?.model || '—')}<br><small class="muted">S/N: ${esc(inst?.serial || '')}</small></td>
            <td><span class="badge" style="background:#eaf2f5;font-size:10px;">${esc(e.evaluationType === 'INITIAL_VERIFICATION' ? 'Initial Verification' : 'In-Service Inspection')}</span></td>
            <td><span class="badge ${e.complianceMode === 'DEMO' ? 'warn' : 'good'}" style="font-size:10px;">${esc(e.complianceMode)}</span></td>
            <td>${esc(e.date || '—')}</td>
            <td>${badge(e.status)}</td>
            <td><span class="badge" style="background:#eef4f7;">${e.observations.length} points</span></td>
            <td>${e.report ? `<button class="link" data-report="${e.id}">${esc(e.report.number)}</button>` : '<span class="muted">—</span>'}</td>
            <td>
              <div class="inline">
                <button class="btn small primary" data-open="${e.id}">Open</button>
                ${e.report ? `<button class="btn small" data-print-direct="${e.id}">Print</button>` : ''}
              </div>
            </td>
          </tr>`;
        }),
        'No evaluations found.'
      )
    )}
  `;
}

// Requirement 1: Add Evaluation Type (Initial Verification vs In-Service Inspection)
function newEvaluationModal() {
  if (!db.instruments.length) {
    toast('Please register at least one instrument before starting an evaluation.');
    addInstrumentModal();
    return;
  }

  const d = modal(`
    <div class="modal-header">
      <div>
        <div class="eyebrow">NEW EVALUATION INTAKE</div>
        <h2>Start New Type Evaluation</h2>
      </div>
    </div>
    <form id="new-eval-form" class="formgrid spaced">
      ${selectField('Target Instrument', 'instrument', db.instruments.map(i => {
        const mfg = manufacturerService.getById(i.manufacturer);
        return [i.id, `${i.model} (S/N: ${i.serial}) — ${mfg?.name || ''} [Max: ${i.max} ${i.unit}]`];
      }))}
      ${selectField('Evaluation Type', 'evaluationType', [
        ['INITIAL_VERIFICATION', 'Initial Verification (Type Approval / New Instrument)'],
        ['IN_SERVICE_INSPECTION', 'In-Service Inspection (Routine Reverification)']
      ], 'INITIAL_VERIFICATION')}
      ${selectField('Compliance Engine Mode', 'complianceMode', [
        ['DEMO', 'DEMO Mode (Synthetic simulation tolerances)'],
        ['VERIFIED_R76', 'VERIFIED_R76 Mode (Strict Normative Rule Engine)']
      ], 'DEMO')}
      ${field('Evaluation Date', 'date', new Date().toISOString().slice(0, 10), 'date', true)}
      <div class="field wide actions">
        <button class="btn" type="button" data-close>Cancel</button>
        <button class="btn primary" type="submit">Launch Evaluation Wizard →</button>
      </div>
    </form>
  `);

  d.querySelector('#new-eval-form').onsubmit = e => {
    e.preventDefault();
    const data = formData(e.target);
    const newEval = evaluationService.create(data.instrument, data.date, data.evaluationType, data.complianceMode);
    d.close();
    show('evaluation', newEval.id, 0);
    toast(`Evaluation started: ${data.evaluationType === 'INITIAL_VERIFICATION' ? 'Initial Verification' : 'In-Service Inspection'}`);
  };
}

// -------------------------------------------------------------
// 12.5 EVALUATION WIZARD (7 COMPLETE STEPS)
// -------------------------------------------------------------
function evaluation() {
  const e = evaluationService.getById(active);
  if (!e) {
    return `<div class="panel"><p>Evaluation not found.</p><button class="btn primary" data-page="evaluations">Back to Evaluations</button></div>`;
  }

  const inst = instrumentService.getById(e.instrument);
  const mfg = inst ? manufacturerService.getById(inst.manufacturer) : null;
  const isLocked = ['COMPLETED'].includes(e.status) && role !== 'ADMIN';

  const wizardSteps = [
    'Instrument & Intake',
    'Laboratory Conditions',
    'Select Tests',
    'Enter Observations',
    'Results & Calculations',
    'Review & Summary',
    'Report & Attachments'
  ];

  const headerNavigation = `
    <div class="crumb">
      <button class="link" data-page="evaluations">Evaluations</button> /
      <strong>${e.id}</strong> · ${esc(inst?.model || '—')} (${esc(mfg?.name || '—')}) ·
      <span class="badge" style="background:#e8f0f3;font-size:10.5px;">${esc(e.evaluationType === 'INITIAL_VERIFICATION' ? 'Initial Verification' : 'In-Service Inspection')}</span> ·
      <span class="badge ${e.complianceMode === 'DEMO' ? 'warn' : 'good'}" style="font-size:10.5px;">Mode: ${esc(e.complianceMode)}</span> ·
      ${badge(e.status)}
    </div>
    <div class="steps">
      ${wizardSteps.map((name, idx) => `
        <button class="${step === idx ? 'active' : ''}" data-step="${idx}">
          ${idx + 1}. ${name}
        </button>
      `).join('')}
    </div>
  `;

  let stepBody = '';

  // -----------------------------------------------------------
  // STEP 0: INSTRUMENT SPECIFICATIONS & INTAKE
  // -----------------------------------------------------------
  if (step === 0) {
    stepBody = `
      ${panel('1. Selected Instrument Specifications & Evaluation Profile', `
        <div class="toolbar" style="margin-bottom:14px;">
          <p class="muted" style="margin:0;">Confirm instrument metadata, active Evaluation Type, and Compliance Calculation Engine.</p>
          <div class="inline">
            <span class="muted small" style="font-weight:700;">Compliance Mode:</span>
            <div class="mode-toggle">
              <button type="button" class="${e.complianceMode === 'DEMO' ? 'active-demo' : ''}" data-toggle-mode="DEMO" ${isLocked ? 'disabled' : ''}>DEMO Mode</button>
              <button type="button" class="${e.complianceMode === 'VERIFIED_R76' ? 'active' : ''}" data-toggle-mode="VERIFIED_R76" ${isLocked ? 'disabled' : ''}>VERIFIED_R76 Mode</button>
            </div>
          </div>
        </div>

        <div class="detail-grid">
          <div class="detail-row"><span class="detail-label">Manufacturer</span><span class="detail-val"><b>${esc(mfg?.name)}</b> (${esc(mfg?.country)})</span></div>
          <div class="detail-row"><span class="detail-label">Model Designation</span><span class="detail-val"><b>${esc(inst?.model)}</b></span></div>
          <div class="detail-row"><span class="detail-label">Serial Number</span><span class="detail-val"><code>${esc(inst?.serial)}</code></span></div>
          <div class="detail-row"><span class="detail-label">Instrument Type</span><span class="detail-val">${esc(inst?.type)}</span></div>
          <div class="detail-row"><span class="detail-label">Accuracy Class</span><span class="detail-val"><strong>Class ${esc(inst?.class)}</strong></span></div>
          <div class="detail-row"><span class="detail-label">Capacity Range</span><span class="detail-val">${esc(inst?.min)} – ${esc(inst?.max)} ${esc(inst?.unit)}</span></div>
          <div class="detail-row"><span class="detail-label">Scale Intervals</span><span class="detail-val">e = ${esc(inst?.e)} ${esc(inst?.unit)} &nbsp;|&nbsp; d = ${esc(inst?.d)} ${esc(inst?.unit)}</span></div>
          <div class="detail-row"><span class="detail-label">Firmware Revision</span><span class="detail-val">${esc(inst?.firmware || '1.0')}</span></div>
          <div class="detail-row"><span class="detail-label">Evaluation Type</span><span class="detail-val"><b>${esc(e.evaluationType === 'INITIAL_VERIFICATION' ? 'Initial Verification' : 'In-Service Inspection')}</b></span></div>
          <div class="detail-row"><span class="detail-label">OIML Rule Version</span><span class="detail-val"><code>${esc(e.ruleVersion || 'UNCONFIGURED')}</code></span></div>
        </div>
      `)}
    `;
  }

  // -----------------------------------------------------------
  // STEP 1: LABORATORY CONDITIONS
  // -----------------------------------------------------------
  else if (step === 1) {
    stepBody = `
      ${panel('2. Laboratory Environmental Conditions', `
        <div class="callout info">
          <strong>Environmental Control:</strong> Record ambient temperature, relative humidity, and test bay conditions. Under OIML R76 guidelines, tests must be conducted within stable ambient limits.
        </div>
        <form id="conditions-form" class="formgrid">
          ${field('Laboratory Name', 'lab', e.lab || 'National Metrology Evaluation Center', 'text', true)}
          ${field('Laboratory Location / Test Bay', 'location', e.location || 'Metrology Bay #2')}
          ${selectField('Evaluation Type', 'evaluationType', [
            ['INITIAL_VERIFICATION', 'Initial Verification'],
            ['IN_SERVICE_INSPECTION', 'In-Service Inspection']
          ], e.evaluationType || 'INITIAL_VERIFICATION')}
          ${field('Evaluation Date', 'date', e.date, 'date', true)}
          ${field('Assigned Tester', 'tester', e.tester || 'Demo Tester', 'text', true)}
          ${field('Assigned Technical Reviewer', 'reviewer', e.reviewer || 'Demo Reviewer', 'text')}
          ${field('Ambient Temperature (°C)', 'temperature', e.temperature || '21.5', 'number', true, 'step="any"')}
          ${field('Relative Humidity (% RH)', 'humidity', e.humidity || '50', 'number', true, 'step="any"')}
          <div class="field wide">
            <label for="environment">Environmental / Foundation Notes</label>
            <textarea id="environment" name="environment" placeholder="Notes on seismic isolation, draught shields, barometric pressure...">${esc(e.environment || '')}</textarea>
          </div>
          <div class="field wide actions">
            <button class="btn primary" type="submit" ${isLocked ? 'disabled' : ''}>Save Laboratory Conditions</button>
          </div>
        </form>
      `)}
    `;
  }

  // -----------------------------------------------------------
  // STEP 2: SELECT TESTS
  // -----------------------------------------------------------
  else if (step === 2) {
    stepBody = `
      ${panel('3. Test Selection Modules', `
        <div class="toolbar" style="margin-bottom:12px;">
          <p class="muted" style="margin:0;">Select applicable metrological test modules. Each module connects to its dedicated acceptance structure in <code>oimlRuleService</code>.</p>
          <div class="inline">
            <button class="btn small" data-action="select-all-tests" ${isLocked ? 'disabled' : ''}>Select All</button>
            <button class="btn small subtle" data-action="clear-all-tests" ${isLocked ? 'disabled' : ''}>Clear</button>
          </div>
        </div>

        <div class="test-cards-grid">
          ${ALL_TEST_MODULES.map(t => {
            const isSelected = e.tests.includes(t.id);
            return `
              <div class="test-card ${isSelected ? 'selected' : ''}" data-toggle-test="${esc(t.id)}">
                <div>
                  <div class="test-card-header">
                    <span class="test-card-title">${esc(t.title)}</span>
                    <input type="checkbox" style="pointer-events:none;" ${isSelected ? 'checked' : ''}>
                  </div>
                  <div class="test-card-desc">${esc(t.desc)}</div>
                </div>
                <div style="margin-top:12px;">
                  <span class="badge ${isSelected ? 'good' : ''}">${isSelected ? 'Active Module' : 'Not Selected'}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `)}
    `;
  }

  // -----------------------------------------------------------
  // STEP 3: OBSERVATION ENTRY
  // -----------------------------------------------------------
  else if (step === 3) {
    const unit = inst?.unit || 'kg';
    const activeTestList = (e.tests.length ? e.tests : ['Weighing Performance']);
    if (!currentObsTest || !activeTestList.includes(currentObsTest)) {
      currentObsTest = activeTestList[0];
    }
    const isRepeatability = oimlRuleService.normalizeTestType(currentObsTest) === 'REPEATABILITY';
    const normClass = String(inst?.class || 'III').toUpperCase().trim();
    const reqReps = (normClass === 'I' || normClass === 'II') ? 6 : 3;
    const maxVal = Number(inst?.max) || 100;
    const minVal = Number(inst?.min) || 0.02;
    const targetLoadGuidance = (maxVal * 0.8).toFixed(2);

    // Calculate next series ID
    const existingSeries = [...new Set(e.observations.filter(o => oimlRuleService.normalizeTestType(o.test) === 'REPEATABILITY' && o.seriesId).map(o => o.seriesId))];
    const nextSeriesId = 'RPT-' + String(existingSeries.length + 1).padStart(3, '0');

    const obsRows = e.observations.map(o => {
      const diff = calculationService.decimalSafeSubtract(o.indication, o.reference);
      const diffStr = calculationService.formatError(diff, unit);
      const mOverE = oimlRuleService.calculateLoadInIntervals(o.reference, inst?.e);
      return `<tr>
        <td><b>${esc(o.test)}</b> ${o.seriesId ? `<br><small class="muted">${esc(o.seriesId)} Run #${o.sequenceNumber || '—'}</small>` : ''}</td>
        <td><code>${esc(o.reference)} ${esc(unit)}</code></td>
        <td><code>${esc(o.indication)} ${esc(unit)}</code></td>
        <td><code>${mOverE} e</code></td>
        <td><b>${esc(diffStr)}</b></td>
        <td>${esc(o.remarks || '—')}</td>
        <td>
          <div class="inline">
            <button class="btn small" data-edit-obs="${o.id}" ${isLocked ? 'disabled' : ''}>Edit</button>
            <button class="btn small danger" data-delete-obs="${o.id}" ${isLocked ? 'disabled' : ''}>Delete</button>
          </div>
        </td>
      </tr>`;
    });

    stepBody = `
      ${panel('4. Observation Entry', `
        <div class="callout">
          <strong>Observation Entry Table:</strong> Record applied reference loads and scale indication readings. Load / e and calculated errors are generated immediately.
        </div>

        ${table(
          ['Test Category', 'Reference Load', 'Scale Reading', 'Load / e', 'Live Error', 'Remarks', 'Actions'],
          obsRows,
          'No observation rows entered yet. Use the entry form below to add data.'
        )}

        ${!isLocked ? `
          <div class="panel" style="background:#f9fbfb;margin-top:20px;border-color:#d4e2e6;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid #e2ecee;padding-bottom:10px;">
              <h3 style="margin:0;">+ Record Metrological Observation Data</h3>
              <div style="display:flex;align-items:center;gap:8px;">
                <label for="obs-test-selector" style="font-size:13px;font-weight:700;">Procedure:</label>
                <select id="obs-test-selector" style="padding:6px 10px;border-radius:4px;border:1px solid #bad0d7;font-weight:600;">
                  ${activeTestList.map(t => `<option value="${esc(t)}" ${t === currentObsTest ? 'selected' : ''}>${esc(t)}</option>`).join('')}
                </select>
              </div>
            </div>

            ${isRepeatability ? `
              <!-- Repeatability Series Entry UI per Requirement 7 -->
              <div class="callout" style="background:#f0f8fa;border-color:#b8dce6;color:#185363;margin-bottom:16px;">
                <div style="font-weight:700;font-size:14px;margin-bottom:4px;">REPEATABILITY TEST (OIML R 76-1:2006 Section 3.6.1 & Annex A.4.10)</div>
                <div>Target verification load guidance: <strong>~0.8 Max (${targetLoadGuidance} ${esc(unit)})</strong></div>
                <div style="font-size:12.5px;color:#356b7c;margin-top:2px;">
                  Required repetitions for Class ${esc(normClass)}: <strong>${reqReps} weighings</strong> at identical load.
                  <span class="muted">(Normative procedure: tester enters actual applied load; guidance load is not silently forced).</span>
                </div>
              </div>

              <form id="repeatability-series-form" class="spaced">
                <div class="formgrid">
                  <div class="field">
                    <label for="rpt-series-id">Repeatability Series ID *</label>
                    <input id="rpt-series-id" name="seriesId" type="text" value="${nextSeriesId}" required>
                  </div>
                  <div class="field">
                    <label for="rpt-reference">Applied Reference Load (${esc(unit)}) *</label>
                    <div style="display:flex;gap:6px;">
                      <input id="rpt-reference" name="reference" type="number" step="any" min="0" max="${maxVal}" value="${targetLoadGuidance}" required placeholder="e.g. ${targetLoadGuidance}" style="flex:1;">
                      <button type="button" class="btn small" id="rpt-preset-target" title="Set to recommended ~0.8 Max">~0.8 Max</button>
                    </div>
                  </div>
                </div>

                <div style="margin:16px 0 8px;">
                  <label style="font-weight:700;font-size:13px;display:block;margin-bottom:6px;">
                    Repeatability Series Indications (${reqReps} Repetitions for Class ${esc(normClass)}):
                  </label>
                  <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;">
                    ${Array.from({ length: reqReps }, (_, i) => `
                      <div class="field" style="margin:0;">
                        <label for="rpt-reading-${i + 1}" style="font-size:12px;font-weight:600;">Reading ${i + 1} (${esc(unit)}) *</label>
                        <input id="rpt-reading-${i + 1}" class="rpt-reading-input" data-seq="${i + 1}" type="number" step="any" placeholder="Reading ${i + 1} (e.g. ${targetLoadGuidance})" style="font-size:13px;">
                      </div>
                    `).join('')}
                  </div>
                </div>

                <div id="rpt-live-calc-box" style="margin:12px 0;padding:10px 14px;background:#fdfefe;border:1px solid #d4e3e8;border-radius:6px;font-size:13px;color:#184554;">
                  <div style="display:flex;gap:18px;flex-wrap:wrap;">
                    <span>Highest: <strong id="rpt-live-max">—</strong></span>
                    <span>Lowest: <strong id="rpt-live-min">—</strong></span>
                    <span>Repeatability Diff (I_max − I_min): <strong id="rpt-live-diff">—</strong></span>
                    <span>Applicable Table 6 MPE: <strong id="rpt-live-mpe">—</strong></span>
                  </div>
                </div>

                <div class="field wide" style="margin-top:8px;">
                  <label for="rpt-remarks">Series Remarks</label>
                  <input id="rpt-remarks" name="remarks" type="text" placeholder="e.g. OIML A.4.10 repeatability run at ~0.8 Max in center position">
                </div>

                <div class="field wide actions" style="margin-top:12px;">
                  <button class="btn primary" type="submit">+ Save Repeatability Series (${reqReps} Observations)</button>
                </div>
              </form>
            ` : (oimlRuleService.normalizeTestType(currentObsTest) === 'TARE' ? `
              <!-- TARE Net Weighing Observation UI per OIML R 76-1:2006 Annex A.4.6.1 -->
              <div class="callout" style="background:#f0f8fa;border-color:#b8dce6;color:#185363;margin-bottom:16px;">
                <div style="font-weight:700;font-size:14px;margin-bottom:4px;">TARE TEST (OIML R 76-1:2006 Section 3.5.3.3 &amp; Annex A.4.6.1)</div>
                <div style="font-size:12.5px;color:#356b7c;">
                  Record the <strong>NET reference load</strong> and <strong>net indication reading</strong> for each tare step (loading &amp; unloading).
                  Minimum <strong>5 load steps</strong> required per A.4.6.1.
                  In VERIFIED_R76 mode, MPE is resolved from Table 6 applied to the NET value (Section 3.5.3.3). Use the Remarks field for direction (LOADING / UNLOADING).
                </div>
              </div>
              <form id="new-observation-form" class="formgrid spaced">
                <input type="hidden" name="test" value="${esc(currentObsTest)}">
                <div class="field">
                  <label for="reference">Net Reference Load (${esc(unit)}) *</label>
                  <input id="reference" name="reference" type="number" step="any" min="0" max="${maxVal}" required placeholder="e.g. 5.000">
                  <div class="preset-wrap">
                    <span class="muted small">Presets (net load):</span>
                    <button type="button" class="preset-btn" data-preset="${(maxVal * 0.1).toFixed(2)}">10% (${(maxVal * 0.1).toFixed(2)})</button>
                    <button type="button" class="preset-btn" data-preset="${(maxVal * 0.25).toFixed(2)}">25% (${(maxVal * 0.25).toFixed(2)})</button>
                    <button type="button" class="preset-btn" data-preset="${(maxVal * 0.50).toFixed(2)}">50% (${(maxVal * 0.50).toFixed(2)})</button>
                    <button type="button" class="preset-btn" data-preset="${(maxVal * 0.75).toFixed(2)}">75% (${(maxVal * 0.75).toFixed(2)})</button>
                  </div>
                </div>
                <div class="field">
                  <label for="indication">Net Indication Reading (${esc(unit)}) *</label>
                  <input id="indication" name="indication" type="number" step="any" required placeholder="e.g. 5.005">
                  <div id="live-error-calc" style="font-size:12px;font-weight:bold;color:#167f79;margin-top:6px;">
                    Net Calculated Error: —
                  </div>
                </div>
                ${field('Direction &amp; Remarks', 'remarks', 'LOADING', 'text', false, 'placeholder="LOADING or UNLOADING"')}
                <div class="field wide actions">
                  <button class="btn primary" type="submit">+ Add Tare Net Observation</button>
                </div>
              </form>
            ` : (oimlRuleService.normalizeTestType(currentObsTest) === 'ZERO_RELATED_TESTS' ? `
              <!-- ZERO RELATED TESTS Observation UI per OIML R 76-1:2006 Section 4.5 / Annex A.4.2 -->
              <div class="callout" style="background:#f0f8fa;border-color:#b8dce6;color:#185363;margin-bottom:16px;">
                <div style="font-weight:700;font-size:14px;margin-bottom:4px;">ZERO-RELATED TESTS (OIML R 76-1:2006 Section 4.5 &amp; Annex A.4.2)</div>
                <div style="font-size:12.5px;color:#356b7c;line-height:1.6;">
                  Record observations for the applicable zero subtest:
                  <ul style="margin:6px 0 0 18px;padding:0;">
                    <li><strong>Zero-Setting Accuracy (A.4.2.3):</strong> Enter the measured zero deviation after operating the zero-setting device. Allowed: ±0.25e = ±${(Number(inst?.e || 0.01) * 0.25).toFixed(4)} ${esc(unit)}</li>
                    <li><strong>Zero-Setting Range (A.4.2.1):</strong> Enter positive / negative setting range vs 4% Max (${(maxVal * 0.04).toFixed(3)} ${esc(unit)}) or 20% Max initial (${(maxVal * 0.20).toFixed(3)} ${esc(unit)})</li>
                    <li><strong>Zero-Tracking (4.5.7):</strong> Enter correction amount, duration, indication state, equilibrium state. Allowed rate: ≤ 0.5d/s = ${(Number(inst?.d || inst?.e || 0.01) * 0.5).toFixed(4)} ${esc(unit)}/s</li>
                    <li><strong>Auto Zero-Setting (4.5.6):</strong> Record equilibrium state, indication, duration before operation.</li>
                  </ul>
                  <span class="muted">Use Reference = 0 for zero-deviation observations. Use the Remarks field to describe the subtest type (e.g., ZERO_SETTING_ACCURACY / ZERO_TRACKING / ZERO_RANGE).</span>
                </div>
              </div>
              <form id="new-observation-form" class="formgrid spaced">
                <input type="hidden" name="test" value="${esc(currentObsTest)}">
                <div class="field">
                  <label for="reference">Zero Reference (${esc(unit)}) — enter 0 for zero-point *</label>
                  <input id="reference" name="reference" type="number" step="any" min="-${maxVal}" max="${maxVal}" required value="0" placeholder="0.000">
                </div>
                <div class="field">
                  <label for="indication">Measured Value / Zero Deviation Reading (${esc(unit)}) *</label>
                  <input id="indication" name="indication" type="number" step="any" required placeholder="e.g. 0.002 (positive) or -0.001 (negative)">
                  <div id="live-error-calc" style="font-size:12px;font-weight:bold;color:#167f79;margin-top:6px;">
                    Calculated Zero Deviation: —
                  </div>
                </div>
                ${field('Subtest &amp; Remarks', 'remarks', 'ZERO_SETTING_ACCURACY', 'text', false, 'placeholder=\"ZERO_SETTING_ACCURACY | ZERO_RANGE | ZERO_TRACKING | AUTO_ZERO\"')}
                <div class="field wide actions">
                  <button class="btn primary" type="submit">+ Add Zero Observation</button>
                </div>
              </form>
            ` : (oimlRuleService.normalizeTestType(currentObsTest) === 'CREEP' ? `
              <!-- CREEP Observation UI per OIML R 76-1:2006 Section 3.9.4.1 / Annex A.4.11.1 -->
              <div class="callout" style="background:#f4f0fa;border-color:#c8b4e6;color:#3a2060;margin-bottom:16px;">
                <div style="font-weight:700;font-size:14px;margin-bottom:4px;">CREEP TEST (OIML R 76-1:2006 Section 3.9.4.1 / Annex A.4.11.1)</div>
                <div style="font-size:12.5px;color:#5a3d8a;line-height:1.65;">
                  <ul style="margin:6px 0 0 18px;padding:0;">
                    <li><strong>Applied Load:</strong> One fixed load maintained throughout the test (Annex A.4.11.1). Do NOT mix loads.</li>
                    <li><strong>P = I + 0.5e − ΔL.</strong> e = ${esc(inst?.e)} ${esc(unit)}. ΔL = additional load from changeover method (set 0 if direct reading).</li>
                    <li><strong>Path A (30-min):</strong> All |ΔP| ≤ 0.5e = ${(Number(inst?.e||0.01)*0.5).toFixed(4)} ${esc(unit)} AND |P₃₀−P₁₅| ≤ 0.2e = ${(Number(inst?.e||0.01)*0.2).toFixed(4)} ${esc(unit)}</li>
                    <li><strong>Path B (4-hour):</strong> Automatically triggered if Path A not satisfied. All |ΔP| ≤ Table 6 MPE.</li>
                    <li>Use <strong>Reference field = Nominal Time (minutes)</strong> to record each observation: 0, 5, 15, 30 (then 60, 120, 180, 240 if needed).</li>
                  </ul>
                </div>
              </div>
              <form id="new-observation-form" class="formgrid spaced">
                <input type="hidden" name="test" value="${esc(currentObsTest)}">
                <div class="field">
                  <label for="reference">Nominal Time (minutes) — 0, 5, 15, 30 [, 60, 120, 180, 240] *</label>
                  <input id="reference" name="reference" type="number" step="1" min="0" max="240" required placeholder="e.g. 0">
                  <div class="preset-wrap">
                    <span class="muted small">Path A:</span>
                    <button type="button" class="preset-btn" data-preset="0">0 min</button>
                    <button type="button" class="preset-btn" data-preset="5">5 min</button>
                    <button type="button" class="preset-btn" data-preset="15">15 min</button>
                    <button type="button" class="preset-btn" data-preset="30">30 min</button>
                    <span class="muted small" style="margin-left:10px;">Path B:</span>
                    <button type="button" class="preset-btn" data-preset="60">1 h</button>
                    <button type="button" class="preset-btn" data-preset="120">2 h</button>
                    <button type="button" class="preset-btn" data-preset="180">3 h</button>
                    <button type="button" class="preset-btn" data-preset="240">4 h</button>
                  </div>
                </div>
                <div class="field">
                  <label for="indication">Scale Indication I (${esc(unit)}) *</label>
                  <input id="indication" name="indication" type="number" step="any" required placeholder="e.g. 50.003">
                  <div id="live-error-calc" style="font-size:12px;font-weight:bold;color:#5a3d8a;margin-top:6px;">
                    P = I + 0.5e − ΔL: —
                  </div>
                </div>
                ${field('ΔL — Additional Load (changeover method; 0 for direct)', 'additionalLoad', '0', 'number', false, 'step="any" placeholder="0.000 (enter 0 if direct reading)"')}
                ${field('Applied Load (maintained throughout series, ' + esc(unit) + ')', 'appliedLoad', String(Number(inst?.max||0)*0.5), 'number', false, 'step="any" placeholder="e.g. 50.000"')}
                ${field('Actual Timestamp / Notes', 'remarks', '', 'text', false, 'placeholder="e.g. 09:00:00 — observation at 0 min"')}
                <div class="field wide actions">
                  <button class="btn primary" type="submit">+ Add Creep Observation</button>
                </div>
              </form>
            ` : (oimlRuleService.normalizeTestType(currentObsTest) === 'ZERO_RETURN' ? `
              <!-- ZERO RETURN Observation UI per OIML R 76-1:2006 Section 3.9.4.2 / Annex A.4.11.2 -->
              <div class="callout" style="background:#eaf4f8;border-color:#b0d3e4;color:#184258;margin-bottom:16px;">
                <div style="font-weight:700;font-size:14px;margin-bottom:4px;">ZERO RETURN TEST (OIML R 76-1:2006 Section 3.9.4.2 / Annex A.4.11.2)</div>
                <div style="font-size:12.5px;color:#21526d;line-height:1.65;">
                  <ul style="margin:6px 0 0 18px;padding:0;">
                    <li><strong>Test Load:</strong> Test load should be close to Max (Max = ${esc(inst?.max)} ${esc(unit)}). Maintained for 30 minutes.</li>
                    <li><strong>Loading Duration:</strong> Must remain applied for at least 30 minutes before load removal.</li>
                    <li><strong>Automatic Zero &amp; Zero Tracking:</strong> Relevant devices must NOT be in operation during this test.</li>
                    <li><strong>Acceptance:</strong> |Returned Zero − Initial Zero| ≤ 0.5e (${(Number(inst?.e||0.01)*0.5).toFixed(4)} ${esc(unit)}) for Single-Interval; ≤ 0.5e₁ for Multi-Interval; ≤ 0.5e_i for Multiple Range.</li>
                    <li><strong>Multiple Range Switch:</strong> If applied load &gt; Max₁, indication near zero must not vary by more than e₁ during following 5 min.</li>
                  </ul>
                </div>
              </div>
              <form id="new-observation-form" class="formgrid spaced">
                <input type="hidden" name="test" value="${esc(currentObsTest)}">
                
                <div class="field">
                  <label for="appliedLoad">Applied Test Load (${esc(unit)}) — <em>Test load should be close to Max (${esc(inst?.max)})</em> *</label>
                  <input id="appliedLoad" name="appliedLoad" type="number" step="any" required value="${esc(inst?.max)}" placeholder="e.g. ${esc(inst?.max)}">
                </div>

                <div class="field">
                  <label for="loadingDurationMinutes">Loading Duration (minutes) — <em>required ≥ 30 min</em> *</label>
                  <input id="loadingDurationMinutes" name="loadingDurationMinutes" type="number" step="any" min="30" required value="30" placeholder="30">
                </div>

                <div class="field">
                  <label for="reference">Initial Zero Indication before loading (${esc(unit)}) *</label>
                  <input id="reference" name="reference" type="number" step="any" required value="0.000" placeholder="0.000">
                </div>

                <div class="field">
                  <label for="indication">Returned Zero Indication after stabilization (${esc(unit)}) *</label>
                  <input id="indication" name="indication" type="number" step="any" required placeholder="e.g. 0.002">
                  <div id="live-error-calc" style="font-size:12px;font-weight:bold;color:#184258;margin-top:6px;">
                    Zero Return Deviation: —
                  </div>
                </div>

                <div class="field">
                  <label for="instrumentTypeSelect">Instrument Configuration Mode *</label>
                  <select id="instrumentTypeSelect" name="instrumentTypeSelect" onchange="toggleZeroReturnInstrumentFields(this.value)">
                    <option value="SINGLE">Single Interval (e = ${esc(inst?.e)} ${esc(unit)})</option>
                    <option value="MULTI">Multi-Interval (e₁ required)</option>
                    <option value="MULTIPLE_RANGE">Multiple Range (Max₁, e₁, Max_i, e_i)</option>
                  </select>
                </div>

                <div class="field" id="multiIntervalFields" style="display:none;">
                  <label for="e1">e₁ — Lowest Verification Scale Interval (${esc(unit)}) *</label>
                  <input id="e1" name="e1" type="number" step="any" placeholder="e.g. 0.002">
                </div>

                <div class="field wide" id="multipleRangeFields" style="display:none;background:#f5fafc;padding:12px;border:1px solid #d0e4ee;border-radius:6px;">
                  <div style="font-weight:600;margin-bottom:8px;color:#184258;">Multiple Range Configuration</div>
                  <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;">
                    <div>
                      <label style="font-size:11.5px;">Max₁ (${esc(unit)})</label>
                      <input id="Max1" name="Max1" type="number" step="any" placeholder="e.g. 15">
                    </div>
                    <div>
                      <label style="font-size:11.5px;">e₁ (${esc(unit)})</label>
                      <input id="mr_e1" name="mr_e1" type="number" step="any" placeholder="e.g. 0.002">
                    </div>
                    <div>
                      <label style="font-size:11.5px;">Active Range (i)</label>
                      <input id="activeRange" name="activeRange" type="text" value="2" placeholder="e.g. 2">
                    </div>
                    <div>
                      <label style="font-size:11.5px;">Active Range e_i (${esc(unit)})</label>
                      <input id="e_i" name="e_i" type="number" step="any" placeholder="e.g. 0.005">
                    </div>
                  </div>
                  <div id="fiveMinuteFollowUpSection" style="margin-top:12px;padding-top:10px;border-top:1px dashed #b8ced7;">
                    <div style="font-weight:600;font-size:12px;color:#184258;margin-bottom:4px;">5-Minute Lowest-Range Follow-Up (Applicable when Load &gt; Max₁)</div>
                    <div style="font-size:11.5px;color:#456778;margin-bottom:8px;">Enter comma-separated readings during the 5 minutes following return/switch to lowest range:</div>
                    <input id="followUpReadings" name="followUpReadings" type="text" placeholder="e.g. 0.001, 0.0015, 0.002 (baseline to 5 min)">
                  </div>
                </div>

                <div class="field" style="display:flex;gap:20px;align-items:center;margin-top:6px;">
                  <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                    <input type="checkbox" id="autoZeroDisabled" name="autoZeroDisabled" checked>
                    <span>Automatic Zero disabled during test</span>
                  </label>
                  <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                    <input type="checkbox" id="zeroTrackDisabled" name="zeroTrackDisabled" checked>
                    <span>Zero-Tracking disabled during test</span>
                  </label>
                </div>

                ${field('Subtest &amp; Remarks', 'remarks', 'ZERO_RETURN', 'text', false, 'placeholder="ZERO_RETURN | notes"')}
                <div class="field wide actions">
                  <button class="btn primary" type="submit">+ Add Zero Return Observation</button>
                </div>
              </form>
            ` : `
              <!-- Single Observation Entry UI (Weighing Performance, Eccentric Loading, etc.) -->
              <form id="new-observation-form" class="formgrid spaced">
                <input type="hidden" name="test" value="${esc(currentObsTest)}">
                <div class="field">
                  <label for="reference">Reference / Standard Load (${esc(unit)}) *</label>
                  <input id="reference" name="reference" type="number" step="any" min="0" max="${maxVal}" required placeholder="e.g. 50.000">
                  <div class="preset-wrap">
                    <span class="muted small">Presets:</span>
                    <button type="button" class="preset-btn" data-preset="${minVal}">Min (${minVal})</button>
                    <button type="button" class="preset-btn" data-preset="${(maxVal * 0.25).toFixed(2)}">25% (${(maxVal * 0.25).toFixed(2)})</button>
                    <button type="button" class="preset-btn" data-preset="${(maxVal * 0.50).toFixed(2)}">50% (${(maxVal * 0.50).toFixed(2)})</button>
                    <button type="button" class="preset-btn" data-preset="${(maxVal * 0.75).toFixed(2)}">75% (${(maxVal * 0.75).toFixed(2)})</button>
                    <button type="button" class="preset-btn" data-preset="${maxVal}">Max (${maxVal})</button>
                  </div>
                </div>
                <div class="field">
                  <label for="indication">Scale Indication Reading (${esc(unit)}) *</label>
                  <input id="indication" name="indication" type="number" step="any" required placeholder="e.g. 50.003">
                  <div id="live-error-calc" style="font-size:12px;font-weight:bold;color:#167f79;margin-top:6px;">
                    Calculated Error: —
                  </div>
                </div>
                ${field('Observations / Remarks', 'remarks', '', 'text', false, 'placeholder="e.g. Center load position"')}
                <div class="field wide actions">
                  <button class="btn primary" type="submit">+ Add Observation Row</button>
                </div>
              </form>
            `))))}
          </div>
        ` : ''}
      `)}
    `;
  }

  // -----------------------------------------------------------
  // STEP 4: RESULTS, COMPLIANCE, TRACEABILITY & ERROR CHART
  // -----------------------------------------------------------
  // Requirement 4: Display Applied Load, Instrument Indication,
  // Verification Scale Interval (e), Load / e, Calculated Error,
  // Applicable MPE, Compliance Result, OIML Rule Reference, Rule Version.
  else if (step === 4) {
    const unit = inst?.unit || 'kg';
    const isDemo = e.complianceMode === 'DEMO';

    const resultRows = e.observations.map(o => {
      const res = oimlRuleService.evaluateObservation({
        accuracyClass: inst?.class,
        e: inst?.e,
        d: inst?.d,
        max: inst?.max,
        min: inst?.min,
        unit,
        referenceLoad: o.reference,
        scaleReading: o.indication,
        evaluationType: e.evaluationType,
        testType: o.test,
        ruleVersion: e.ruleVersion,
        complianceMode: e.complianceMode,
        allObservations: e.observations,
        observation: o,
        seriesId: o.seriesId
      });

      return `<tr>
        <td><b>${esc(o.test)}</b> ${o.seriesId ? `<br><small class="muted">${esc(o.seriesId)} Run #${o.sequenceNumber || '—'}</small>` : ''}</td>
        <td><code>${Number(o.reference).toFixed(3)} ${esc(unit)}</code></td>
        <td><code>${Number(o.indication).toFixed(3)} ${esc(unit)}</code></td>
        <td><code>${esc(inst?.e)} ${esc(unit)}</code></td>
        <td><code>${res.loadInIntervals} e</code></td>
        <td><b>${esc(res.errorFormatted)}</b></td>
        <td>${esc(res.applicableMpeFormatted)}</td>
        <td>${res.badgeHtml}</td>
        <td><small class="muted">${esc(res.ruleReference)}</small></td>
        <td><code>${esc(res.ruleVersion)}</code></td>
        <td>
          <button class="btn small" data-why-result="${o.id}">Why This Result?</button>
        </td>
      </tr>`;
    });

    const hasNearLimit = isDemo && e.observations.some(o => {
      const res = oimlRuleService.evaluateObservation({
        accuracyClass: inst?.class,
        e: inst?.e,
        d: inst?.d,
        max: inst?.max,
        min: inst?.min,
        unit,
        referenceLoad: o.reference,
        scaleReading: o.indication,
        evaluationType: e.evaluationType,
        testType: o.test,
        ruleVersion: e.ruleVersion,
        complianceMode: e.complianceMode
      });
      return res.isNearLimit;
    });

    // Render Repeatability Series Metrological Analysis Summary if any repeatability observations exist
    const rptObs = e.observations.filter(o => oimlRuleService.normalizeTestType(o.test) === 'REPEATABILITY');
    let rptSummaryHtml = '';
    if (rptObs.length > 0 && typeof OimlR76RepeatabilityRules !== 'undefined') {
      const seriesIds = [...new Set(rptObs.map(o => o.seriesId || 'RPT-001'))];
      const seriesCards = seriesIds.map(sId => {
        const sObs = rptObs.filter(o => (o.seriesId || 'RPT-001') === sId);
        const repRes = OimlR76RepeatabilityRules.evaluateRepeatabilitySeries({
          accuracyClass: inst?.class,
          evaluationType: e.evaluationType,
          referenceLoad: sObs[0]?.reference,
          maxCapacity: inst?.max,
          e: inst?.e,
          unit,
          seriesId: sId,
          readings: sObs
        });

        return `
          <div class="card" style="padding:16px;margin-top:14px;background:#fcfdfe;border:1px solid #d3e2e6;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
              <div>
                <div class="eyebrow" style="margin-bottom:2px;">REPEATABILITY SERIES EVALUATION (OIML R 76-1:2006 ANNEX A.4.10)</div>
                <h3 style="margin:0;font-size:16px;">Series: ${esc(sId)} — Applied Reference Load: ${Number(repRes.referenceLoad).toFixed(3)} ${esc(unit)}</h3>
              </div>
              <div>${repRes.badgeHtml}</div>
            </div>

            <div class="detail-grid" style="background:white;margin:8px 0;">
              <div class="detail-row">
                <span class="detail-label">Accuracy Class</span>
                <span class="detail-val"><b>Class ${esc(repRes.accuracyClass || inst?.class || 'III')}</b></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Target Guidance (~0.8 Max)</span>
                <span class="detail-val"><code>${repRes.targetTestLoad !== null ? repRes.targetTestLoad + ' ' + esc(unit) : '—'}</code></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Weighings Recorded</span>
                <span class="detail-val"><b>${repRes.actualRepetitions} / ${repRes.requiredRepetitions || '—'}</b></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Applicable Table 6 MPE</span>
                <span class="detail-val"><code>±${repRes.applicableMpe} ${esc(unit)}</code> (±${repRes.mpeMultiplier} e)</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Highest Indication</span>
                <span class="detail-val"><code>${repRes.highestIndication !== null ? Number(repRes.highestIndication).toFixed(3) + ' ' + esc(unit) : '—'}</code></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Lowest Indication</span>
                <span class="detail-val"><code>${repRes.lowestIndication !== null ? Number(repRes.lowestIndication).toFixed(3) + ' ' + esc(unit) : '—'}</code></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Repeatability Difference</span>
                <span class="detail-val"><b>${repRes.repeatabilityDifference !== null ? repRes.repeatabilityDifference + ' ' + esc(unit) : '—'}</b></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Series Compliance</span>
                <span class="detail-val"><b>${repRes.complianceResult}</b></span>
              </div>
            </div>

            <div style="font-size:12.5px;color:#355361;margin-top:8px;">
              ${esc(repRes.explanation)}
            </div>
          </div>
        `;
      }).join('');

      rptSummaryHtml = `
        <div style="margin-top:20px;">
          <h3 style="margin:0 0 8px;">Repeatability Series Metrological Analysis</h3>
          ${seriesCards}
        </div>
      `;
    }

    stepBody = `
      ${panel('5. MPE Results & Metrological Compliance', `
        <div class="toolbar" style="margin-bottom:12px;">
          <div>
            <span class="muted small" style="font-weight:700;">Evaluation Type:</span>
            <b>${esc(e.evaluationType === 'INITIAL_VERIFICATION' ? 'Initial Verification' : 'In-Service Inspection')}</b> &nbsp;|&nbsp;
            <span class="muted small" style="font-weight:700;">Rule Version:</span>
            <code>${esc(e.ruleVersion || 'UNCONFIGURED')}</code>
          </div>
          <div class="inline">
            <span class="muted small" style="font-weight:700;">Compliance Mode:</span>
            <div class="mode-toggle">
              <button type="button" class="${e.complianceMode === 'DEMO' ? 'active-demo' : ''}" data-toggle-mode="DEMO">DEMO Simulation</button>
              <button type="button" class="${e.complianceMode === 'VERIFIED_R76' ? 'active' : ''}" data-toggle-mode="VERIFIED_R76">VERIFIED_R76</button>
            </div>
          </div>
        </div>

        ${isDemo ? `
          <div class="callout" style="background:#fff7e6;border-color:#f5d998;color:#7e5b15;">
            <strong>DEMO COMPLIANCE MODE:</strong>
            Demo compliance values — not for regulatory use. Synthetic tolerance bands (±1e / ±2e / ±3e) active for UI testing.
          </div>
        ` : `
          <div class="callout" style="background:#eaf6f5;border-color:#b4e3df;color:#135955;">
            <strong>VERIFIED OIML R 76-1:2006 COMPLIANCE MODE (RULE PACKAGE: oiml-r76-1-2006):</strong>
            Verified Section 3.5.1 Table 6 MPE rules active for <b>Weighing Performance</b>, Section 3.6.1 / Annex A.4.10 active for <b>Repeatability</b>, Section 3.6.2 / Annex A.4.7 active for <b>Eccentric Loading</b>, Section 3.5.3.3 / 4.6.3 / Annex A.4.6 active for <b>Tare</b>, Section 4.5.1–4.5.7 / Annex A.4.2 active for <b>Zero-Related Tests</b>, Section 3.9.4.1 / Annex A.4.11.1 active for <b>Creep</b>, and Section 3.9.4.2 / Annex A.4.11.2 active for <b>Zero Return</b>. Remaining test procedure (Temperature) strictly evaluates to <b>REFERENCE REQUIRED</b> until its normative rule definition is configured.
          </div>
        `}

        ${hasNearLimit ? `
          <div class="callout warn" style="background:#fff2d9;border-color:#f2ce8a;color:#8f6000;">
            <strong>⚠ ADVISORY NOTICE — NEAR PERMISSIBLE LIMIT:</strong>
            One or more observations are operating within 75% of the configured demo permissible limit. This is an informational advisory and does not fail the test run.
          </div>
        ` : ''}

        ${table(
          ['Test', 'Applied Load (L)', 'Indication (I)', 'Interval (e)', 'Load / e', 'Calculated Error (E)', 'Applicable MPE', 'Result', 'OIML Rule Reference', 'Rule Version', 'Traceability Analysis'],
          resultRows,
          'No observations recorded. Return to Step 4 to enter observations.'
        )}

        <!-- Repeatability Series Metrological Analysis -->
        ${rptSummaryHtml}

        <!-- Error Visualization Chart -->
        ${renderErrorChart(e.observations, inst, e.complianceMode, e.evaluationType)}
      `)}
    `;
  }

  // -----------------------------------------------------------
  // STEP 5: REVIEW, EVALUATION SUMMARY & WORKFLOW
  // -----------------------------------------------------------
  else if (step === 5) {
    const isDemo = e.complianceMode === 'DEMO';

    const summaryCards = e.tests.map(tName => {
      const normTest = oimlRuleService.normalizeTestType(tName);
      const testObs = e.observations.filter(o => oimlRuleService.normalizeTestType(o.test) === normTest);
      let statusBadge = '<span class="badge" style="background:#eee;">INCOMPLETE (0 obs)</span>';

      if (testObs.length > 0) {
        if (!isDemo) {
          if (normTest === 'WEIGHING_PERFORMANCE') {
            const results = testObs.map(o => oimlRuleService.evaluateObservation({
              accuracyClass: inst?.class,
              e: inst?.e,
              d: inst?.d,
              max: inst?.max,
              min: inst?.min,
              unit: inst?.unit,
              referenceLoad: o.reference,
              scaleReading: o.indication,
              evaluationType: e.evaluationType,
              testType: o.test,
              ruleVersion: e.ruleVersion,
              complianceMode: e.complianceMode
            }));
            const hasFail = results.some(r => r.complianceResult === 'FAIL');
            const hasRef = results.some(r => r.complianceResult === 'REFERENCE_REQUIRED');
            if (hasFail) statusBadge = '<span class="badge bad">FAIL</span>';
            else if (hasRef) statusBadge = '<span class="badge warn">REFERENCE REQUIRED</span>';
            else statusBadge = '<span class="badge good">PASS</span>';
          } else if (normTest === 'REPEATABILITY') {
            if (typeof OimlR76RepeatabilityRules !== 'undefined') {
              const seriesIds = [...new Set(testObs.map(o => o.seriesId || 'RPT-001'))];
              let allSeriesPass = true;
              let anyFail = false;
              let anyNotEval = false;
              let anyRefReq = false;

              for (const sId of seriesIds) {
                const sObs = testObs.filter(o => (o.seriesId || 'RPT-001') === sId);
                const repRes = OimlR76RepeatabilityRules.evaluateRepeatabilitySeries({
                  accuracyClass: inst?.class,
                  evaluationType: e.evaluationType,
                  referenceLoad: sObs[0]?.reference,
                  maxCapacity: inst?.max,
                  e: inst?.e,
                  unit: inst?.unit,
                  seriesId: sId,
                  readings: sObs
                });
                if (repRes.complianceResult === 'FAIL') anyFail = true;
                if (repRes.complianceResult === 'NOT_EVALUATED') anyNotEval = true;
                if (repRes.complianceResult === 'REFERENCE_REQUIRED') anyRefReq = true;
                if (repRes.complianceResult !== 'PASS') allSeriesPass = false;
              }

              if (anyFail) statusBadge = '<span class="badge bad">FAIL</span>';
              else if (anyNotEval) statusBadge = '<span class="badge warn" style="background:#eaf0f2;color:#355361;">NOT EVALUATED</span>';
              else if (anyRefReq) statusBadge = '<span class="badge warn">REFERENCE REQUIRED</span>';
              else if (allSeriesPass) statusBadge = '<span class="badge good">PASS</span>';
              else statusBadge = '<span class="badge warn">REFERENCE REQUIRED</span>';
            } else {
              statusBadge = '<span class="badge warn">REFERENCE REQUIRED</span>';
            }
          } else if (normTest === 'TARE' || normTest === 'ECCENTRIC_LOADING') {
            // TARE and ECCENTRIC_LOADING: resolve each observation using verified engine
            const results = testObs.map(o => oimlRuleService.evaluateObservation({
              accuracyClass: inst?.class,
              e: inst?.e,
              d: inst?.d,
              max: inst?.max,
              min: inst?.min,
              unit: inst?.unit,
              referenceLoad: o.reference,
              scaleReading: o.indication,
              evaluationType: e.evaluationType,
              testType: o.test,
              ruleVersion: e.ruleVersion,
              complianceMode: e.complianceMode
            }));
            const hasFail = results.some(r => r.complianceResult === 'FAIL');
            const hasRef = results.some(r => r.complianceResult === 'REFERENCE_REQUIRED');
            if (hasFail) statusBadge = '<span class="badge bad">FAIL</span>';
            else if (hasRef) statusBadge = '<span class="badge warn">REFERENCE REQUIRED</span>';
            else statusBadge = '<span class="badge good">PASS</span>';
          } else if (normTest === 'ZERO_RELATED_TESTS') {
            // ZERO: use verified ZeroRules per Section 4.5.2 (zero deviation per observation)
            if (typeof OimlR76ZeroRules !== 'undefined') {
              const numE = Number(inst?.e) || 0.01;
              const numD = Number(inst?.d) || numE;
              const allowedDev = numE * 0.25;
              const zeroResults = testObs.map(o => {
                const deviation = Number(o.indication) - Number(o.reference);
                const absDeviation = Math.abs(deviation);
                return { complianceResult: absDeviation <= allowedDev + 1e-9 ? 'PASS' : 'FAIL' };
              });
              const hasFail = zeroResults.some(r => r.complianceResult === 'FAIL');
              if (hasFail) statusBadge = '<span class="badge bad">FAIL</span>';
              else statusBadge = '<span class="badge good">PASS</span>';
            } else {
              statusBadge = '<span class="badge warn">REFERENCE REQUIRED</span>';
            }
          } else if (normTest === 'CREEP') {
            // CREEP: evaluate the full series using OimlR76CreepRules
            if (typeof OimlR76CreepRules !== 'undefined') {
              const numE = Number(inst?.e) || 0.01;
              const observations = testObs.map(o => ({
                nominalTimeMinutes: Number(o.nominalTimeMinutes || o.reference || 0),
                indication: Number(o.indication),
                additionalLoad: Number(o.additionalLoad || o.deltaL || 0),
                appliedLoad: Number(o.appliedLoad || inst?.max || 0)
              }));
              const creepResult = OimlR76CreepRules.evaluateCreep({
                accuracyClass: inst?.class,
                appliedLoad: Number(observations[0]?.appliedLoad || inst?.max || 0),
                e: numE,
                unit: inst?.unit || 'kg',
                evaluationType: e.evaluationType || 'INITIAL_VERIFICATION',
                measurementMethod: 'DIRECT',
                observations
              });
              if (creepResult.complianceResult === 'PASS') {
                statusBadge = '<span class="badge good">PASS</span>';
              } else if (creepResult.complianceResult === 'FAIL') {
                statusBadge = '<span class="badge bad">FAIL</span>';
              } else if (creepResult.complianceResult === 'NOT_APPLICABLE') {
                statusBadge = '<span class="badge" style="background:#e8f0e8;color:#2d5c2d;">NOT APPLICABLE</span>';
              } else if (creepResult.requiresExtendedTest) {
                statusBadge = '<span class="badge warn" style="background:#fff2d9;color:#8f6000;">EXTENDED TEST REQUIRED</span>';
              } else {
                statusBadge = '<span class="badge warn" style="background:#eaf0f2;color:#355361;">NOT EVALUATED</span>';
              }
            } else {
              statusBadge = '<span class="badge warn">REFERENCE REQUIRED</span>';
            }
          } else if (normTest === 'ZERO_RETURN') {
            // ZERO_RETURN: evaluate using OimlR76ZeroReturnRules
            if (typeof OimlR76ZeroReturnRules !== 'undefined') {
              const lastObs = testObs[testObs.length - 1];
              const zrResult = OimlR76ZeroReturnRules.evaluateZeroReturn({
                accuracyClass: inst?.class,
                appliedLoad: lastObs.appliedLoad !== undefined ? Number(lastObs.appliedLoad) : (lastObs.reference !== undefined ? Number(lastObs.reference) : Number(inst?.max)),
                maxCapacity: Number(inst?.max),
                loadingDurationMinutes: lastObs.loadingDurationMinutes !== undefined ? Number(lastObs.loadingDurationMinutes) : 30,
                initialZeroIndication: lastObs.initialZeroIndication !== undefined ? Number(lastObs.initialZeroIndication) : (lastObs.reference !== undefined ? Number(lastObs.reference) : 0),
                returnedZeroIndication: lastObs.returnedZeroIndication !== undefined ? Number(lastObs.returnedZeroIndication) : Number(lastObs.indication),
                e: Number(inst?.e),
                unit: inst?.unit || 'kg',
                isMultiInterval: !!lastObs.isMultiInterval,
                e1: lastObs.e1,
                isMultipleRange: !!lastObs.isMultipleRange,
                ranges: lastObs.ranges,
                activeRange: lastObs.activeRange,
                hasAutomaticZeroSetting: !!lastObs.hasAutomaticZeroSetting,
                hasZeroTracking: !!lastObs.hasZeroTracking,
                automaticZeroDisabledDuringTest: lastObs.automaticZeroDisabledDuringTest !== undefined ? lastObs.automaticZeroDisabledDuringTest : true,
                zeroTrackingDisabledDuringTest: lastObs.zeroTrackingDisabledDuringTest !== undefined ? lastObs.zeroTrackingDisabledDuringTest : true,
                lowestRangeFollowUpObservations: lastObs.lowestRangeFollowUpObservations || []
              });
              if (zrResult.complianceResult === 'PASS') {
                statusBadge = '<span class="badge good">PASS</span>';
              } else if (zrResult.complianceResult === 'FAIL') {
                statusBadge = '<span class="badge bad">FAIL</span>';
              } else if (zrResult.complianceResult === 'NOT_APPLICABLE') {
                statusBadge = '<span class="badge" style="background:#e8f0e8;color:#2d5c2d;">NOT APPLICABLE</span>';
              } else if (zrResult.complianceResult === 'NOT_EVALUATED') {
                statusBadge = '<span class="badge warn" style="background:#eaf0f2;color:#355361;">NOT EVALUATED</span>';
              } else {
                statusBadge = '<span class="badge warn">REFERENCE REQUIRED</span>';
              }
            } else {
              statusBadge = '<span class="badge warn">REFERENCE REQUIRED</span>';
            }
          } else {
            // Unimplemented in verified mode (Temperature)
            statusBadge = '<span class="badge warn">REFERENCE REQUIRED</span>';
          }
        } else {
          const results = testObs.map(o => oimlRuleService.evaluateObservation({
            accuracyClass: inst?.class,
            e: inst?.e,
            d: inst?.d,
            max: inst?.max,
            min: inst?.min,
            unit: inst?.unit,
            referenceLoad: o.reference,
            scaleReading: o.indication,
            evaluationType: e.evaluationType,
            testType: o.test,
            complianceMode: e.complianceMode
          }));
          const hasFail = results.some(r => r.complianceResult === 'FAIL');
          const hasWarn = results.some(r => r.isNearLimit);

          if (hasFail) statusBadge = '<span class="badge bad">DEMO FAIL</span>';
          else if (hasWarn) statusBadge = '<span class="badge warn">PASS ⚠ NEAR LIMIT</span>';
          else statusBadge = '<span class="badge good">DEMO PASS</span>';
        }
      }

      return `
        <div class="card" style="padding:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <strong style="font-size:15px;margin:0;">${esc(tName)}</strong>
            ${statusBadge}
          </div>
          <div style="font-size:13px;color:#5a7582;">
            Observations: <b>${testObs.length}</b> points logged
          </div>
        </div>
      `;
    }).join('');

    stepBody = `
      ${panel('6. Evaluation Review & Workflow Transition', `
        <div class="callout info">
          <strong>Review Workflow Lifecycle:</strong>
          <code>DRAFT</code> ➔ <code>IN PROGRESS</code> ➔ <code>SUBMITTED FOR REVIEW</code> ➔ <code>UNDER REVIEW</code> ➔ <code>COMPLETED</code> (or <code>RETURN FOR CORRECTION</code>)
        </div>

        <div style="margin:20px 0;">
          <div class="toolbar" style="margin-bottom:8px;">
            <h3 style="margin:0;">Test Execution Summary</h3>
            <div class="muted small">
              Evaluation Type: <b>${esc(e.evaluationType === 'INITIAL_VERIFICATION' ? 'Initial Verification' : 'In-Service Inspection')}</b> ·
              Mode: <b>${esc(e.complianceMode)}</b> ·
              Rule: <code>${esc(e.ruleVersion || 'UNCONFIGURED')}</code>
            </div>
          </div>
          <div class="cards" style="grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));margin-bottom:20px;">
            ${summaryCards || '<p class="muted">No tests selected.</p>'}
          </div>
        </div>

        <div class="panel" style="background:#f8fbfc;border-color:#dbe6e9;">
          <h3 style="margin-top:0;">Technical Comments & Sign-off</h3>
          <div class="formgrid">
            <div class="field">
              <label for="tester-comments">Tester Observations & Notes</label>
              <textarea id="tester-comments" placeholder="Comments from metrology tester..." ${isLocked ? 'disabled' : ''}>${esc(e.comments || '')}</textarea>
            </div>
            <div class="field">
              <label for="reviewer-comments">Reviewer Audit & Correction Notes</label>
              <textarea id="reviewer-comments" placeholder="Reviewer notes (required if returning for correction)..." ${role === 'TESTER' ? 'disabled' : ''}>${esc(e.reviewerComments || '')}</textarea>
            </div>
          </div>

          <div class="actions" style="margin-top:16px;">
            <button class="btn" data-action="save-draft">💾 Save Draft</button>

            <!-- TESTER Actions -->
            ${(role === 'TESTER' || role === 'ADMIN') && ['DRAFT', 'IN_PROGRESS', 'RETURNED_FOR_CORRECTION'].includes(e.status) ? `
              <button class="btn primary" data-action="submit-for-review" ${!e.observations.length ? 'disabled' : ''}>
                Submit for Review →
              </button>
            ` : ''}

            <!-- REVIEWER Actions -->
            ${(role === 'REVIEWER' || role === 'ADMIN') && e.status === 'SUBMITTED_FOR_REVIEW' ? `
              <button class="btn" data-action="mark-under-review">Begin Review (Under Review)</button>
            ` : ''}

            ${(role === 'REVIEWER' || role === 'ADMIN') && ['SUBMITTED_FOR_REVIEW', 'UNDER_REVIEW'].includes(e.status) ? `
              <button class="btn danger" data-action="return-for-correction">↩ Return for Correction</button>
              <button class="btn primary" data-action="complete-evaluation">✔ Approve & Complete Evaluation</button>
            ` : ''}
          </div>
        </div>

        <div style="margin-top:24px;">
          <h3>Evaluation Event & Audit Timeline</h3>
          ${table(
            ['Timestamp', 'Actor', 'Action Taken'],
            e.events.slice().reverse().map(ev => `<tr>
              <td><code>${new Date(ev.at).toLocaleString()}</code></td>
              <td><b>${esc(ev.actor)}</b></td>
              <td>${esc(ev.action)}</td>
            </tr>`),
            'No events recorded.'
          )}
        </div>
      `)}
    `;
  }

  // -----------------------------------------------------------
  // STEP 6: REPORT PREVIEW, ATTACHMENTS & PRINT
  // -----------------------------------------------------------
  else if (step === 6) {
    const attachments = e.attachments || [];
    stepBody = `
      ${panel('7. Attachments & Printable Demonstration Report', `
        <div class="callout">
          <strong>Official Demonstration Report:</strong> Generates a printable type evaluation document with complete traceability, error tables, and attached photographs.
        </div>

        <!-- Attachments Section -->
        <div style="margin:20px 0;">
          <div class="toolbar" style="margin-bottom:12px;">
            <div>
              <h3 style="margin:0 0 4px;">Photo & Document Attachments</h3>
              <p class="muted" style="margin:0;font-size:12px;">Attach photos of instrument, nameplate, display, or test setup.</p>
            </div>
            <button class="btn small primary" data-action="add-attachment">+ Upload Attachment</button>
          </div>

          <div class="attachments-grid">
            ${attachments.length ? attachments.map(att => `
              <div class="attachment-card">
                <img class="attachment-thumb" src="${att.url}" alt="${esc(att.name)}" data-view-attachment="${att.id}">
                <div class="attachment-body">
                  <div>
                    <div class="attachment-meta">
                      <span class="badge" style="background:#e8f2f5;color:#184554;font-size:10px;">${esc(att.category)}</span>
                      <small class="muted">${esc(att.name.slice(0, 16))}</small>
                    </div>
                    <div class="attachment-desc" style="margin-top:6px;">${esc(att.desc || 'No description.')}</div>
                  </div>
                  <div class="right" style="margin-top:10px;">
                    <button class="btn small danger" data-delete-attachment="${att.id}">Remove</button>
                  </div>
                </div>
              </div>
            `).join('') : '<div class="empty" style="grid-column:1/-1;">No photos or artifacts attached yet. Click "+ Upload Attachment" above.</div>'}
          </div>
        </div>

        <!-- Report Generation Box -->
        <div class="panel" style="background:#fdfefe;border-color:#cddde2;margin-top:24px;">
          <div class="toolbar">
            <div>
              <h3 style="margin:0 0 4px;">Printable Metrological Evaluation Report</h3>
              <p class="muted" style="margin:0;font-size:13px;">
                ${e.report ? `Report Reference: <b>${esc(e.report.number)}</b> · Evaluation Type: <b>${esc(e.evaluationType === 'INITIAL_VERIFICATION' ? 'Initial' : 'In-Service')}</b> · Rule Version: <code>${esc(e.ruleVersion || 'UNCONFIGURED')}</code>` : 'Generate report to enable official printable preview.'}
              </p>
            </div>
            <div class="inline">
              ${!e.report ? `
                <button class="btn primary" data-action="generate-report">⚡ Generate Demo Report</button>
              ` : `
                <button class="btn primary" data-action="print-report">🖨️ Print Report</button>
              `}
            </div>
          </div>

          ${e.report ? `
            <div style="background:#f8fafb;border:1px solid #dce5e8;border-radius:8px;padding:18px;margin-top:14px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                  <span class="eyebrow">DEMONSTRATION REPORT PREVIEW</span>
                  <h2 style="font-size:18px;margin:2px 0 0;">${esc(e.report.number)}</h2>
                </div>
                <div>${badge(e.status)}</div>
              </div>
              <p style="font-size:13px;color:#506d7a;margin:8px 0 0;">
                Certified laboratory conditions, ${e.observations.length} observations, decimal calculation traces, and ${attachments.length} attachments are packaged in this report.
              </p>
            </div>
          ` : ''}
        </div>
      `)}
    `;
  }

  // Bottom Wizard Navigation Bar
  const bottomWizardNav = `
    <div class="toolbar" style="margin-top:24px;padding-top:16px;border-top:1px solid #dce5e8;">
      <div>
        <button class="btn" data-action="continue-later">← Save & Continue Later</button>
      </div>
      <div class="inline">
        <button class="btn" data-action="save-draft">Save Draft</button>
        <button class="btn" data-step="${Math.max(0, step - 1)}" ${step === 0 ? 'disabled' : ''}>← Previous</button>
        ${step < 6 ? `
          <button class="btn primary" data-step="${step + 1}">Next Step →</button>
        ` : `
          <button class="btn primary" data-action="finish-wizard">Finish & Go to Overview</button>
        `}
      </div>
    </div>
  `;

  return headerNavigation + stepBody + bottomWizardNav;
}

// -------------------------------------------------------------
// 12.6 REVIEW QUEUE PAGE
// -------------------------------------------------------------
function reviews() {
  const pending = db.evaluations.filter(e => ['SUBMITTED_FOR_REVIEW', 'UNDER_REVIEW'].includes(e.status));
  return panel('Awaiting Technical Review',
    table(
      ['Evaluation ID', 'Instrument Model', 'Evaluation Type', 'Compliance Mode', 'Tester', 'Date Submitted', 'Status', 'Actions'],
      pending.map(e => {
        const inst = instrumentService.getById(e.instrument);
        return `<tr>
          <td><button class="link" data-review="${e.id}"><b>${e.id}</b></button></td>
          <td>${esc(inst?.model || '—')}</td>
          <td><span class="badge" style="font-size:10px;">${esc(e.evaluationType === 'INITIAL_VERIFICATION' ? 'Initial' : 'In-Service')}</span></td>
          <td><span class="badge ${e.complianceMode === 'DEMO' ? 'warn' : 'good'}" style="font-size:10px;">${esc(e.complianceMode)}</span></td>
          <td>${esc(e.tester)}</td>
          <td>${esc(e.events.at(-1)?.at?.slice(0, 10))}</td>
          <td>${badge(e.status)}</td>
          <td>
            <button class="btn small primary" data-review="${e.id}">Open Review Dossier</button>
          </td>
        </tr>`;
      }),
      'The review queue is clear. No evaluations are currently awaiting review.'
    )
  );
}

// -------------------------------------------------------------
// 12.7 REPORT REPOSITORY PAGE
// -------------------------------------------------------------
let reportStatusFilter = '';
let reportMfgFilter = '';

function reports() {
  let list = db.evaluations.filter(e => e.report);

  if (reportStatusFilter) {
    list = list.filter(e => e.status === reportStatusFilter);
  }
  if (reportMfgFilter) {
    list = list.filter(e => {
      const inst = instrumentService.getById(e.instrument);
      return inst && inst.manufacturer === reportMfgFilter;
    });
  }
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(e =>
      e.report.number.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q) ||
      (instrumentService.getById(e.instrument)?.model || '').toLowerCase().includes(q)
    );
  }

  const rows = list.map(e => {
    const inst = instrumentService.getById(e.instrument);
    const mfg = inst ? manufacturerService.getById(inst.manufacturer) : null;
    return `<tr>
      <td><button class="link" data-report="${e.id}"><b>${esc(e.report.number)}</b></button></td>
      <td><code>${e.id}</code></td>
      <td>${esc(inst?.model || '—')}</td>
      <td>${esc(mfg?.name || '—')}</td>
      <td><span class="badge" style="font-size:10px;">${esc(e.evaluationType === 'INITIAL_VERIFICATION' ? 'Initial' : 'In-Service')}</span></td>
      <td><code>${esc(e.ruleVersion || 'UNCONFIGURED')}</code></td>
      <td>${badge(e.status)}</td>
      <td>
        <div class="inline">
          <button class="btn small" data-report="${e.id}">View</button>
          <button class="btn small primary" data-print-direct="${e.id}">Print</button>
        </div>
      </td>
    </tr>`;
  });

  return `
    <div class="toolbar">
      <div class="filter-bar">
        <input id="search" type="search" placeholder="Search report #, model..." value="${esc(query)}" aria-label="Search reports">
        <select id="report-status-filter" aria-label="Filter status">
          <option value="">All Statuses</option>
          <option value="COMPLETED" ${reportStatusFilter === 'COMPLETED' ? 'selected' : ''}>COMPLETED</option>
          <option value="SUBMITTED_FOR_REVIEW" ${reportStatusFilter === 'SUBMITTED_FOR_REVIEW' ? 'selected' : ''}>SUBMITTED FOR REVIEW</option>
          <option value="UNDER_REVIEW" ${reportStatusFilter === 'UNDER_REVIEW' ? 'selected' : ''}>UNDER REVIEW</option>
        </select>
        <select id="report-mfg-filter" aria-label="Filter manufacturer">
          <option value="">All Manufacturers</option>
          ${db.manufacturers.map(m => `<option value="${m.id}" ${reportMfgFilter === m.id ? 'selected' : ''}>${esc(m.name)}</option>`).join('')}
        </select>
        ${(reportStatusFilter || reportMfgFilter || query) ? `
          <button class="btn small subtle" data-action="clear-report-filters">Clear Filters</button>
        ` : ''}
      </div>
    </div>

    ${panel('Type Evaluation Report Repository',
      table(
        ['Report Number', 'Evaluation ID', 'Model', 'Manufacturer', 'Evaluation Type', 'Rule Version', 'Workflow Status', 'Actions'],
        rows,
        'No matching reports found in repository.'
      )
    )}
  `;
}

// -------------------------------------------------------------
// 12.8 RULE MANAGEMENT (VERIFIED OIML R76 PREPARATION)
// -------------------------------------------------------------
function rules() {
  return panel('Versioned Metrology Rule Sets', `
    <div class="callout" style="background:#eaf6f5;border-color:#b4e3df;color:#135955;">
      <strong>VERIFIED OIML R 76 CONFIGURATION STATUS:</strong>
      Verified rule package <strong>oiml-r76-1-2006</strong> is loaded and active for
      <strong>WEIGHING_PERFORMANCE</strong> (Section 3.5.1 Table 6 / Section 3.5.2),
      <strong>REPEATABILITY</strong> (Section 3.6.1 / Annex A.4.10),
      <strong>ECCENTRIC_LOADING</strong> (Section 3.6.2 / Annex A.4.7),
      <strong>TARE</strong> (Section 3.5.3.3, 3.5.3.4, 4.6.3 / Annex A.4.6.1, A.4.6.2, A.4.6.3), and
      <strong>ZERO_RELATED_TESTS</strong> (Section 4.5.1, 4.5.2, 4.5.5, 4.5.6, 4.5.7 / Annex A.4.2.1, A.4.2.2, A.4.2.3),
      <strong>CREEP</strong> (Section 3.9.4 / Section 3.9.4.1 / Annex A.4.11.1), and
      <strong>ZERO_RETURN</strong> (Section 3.9.4 / Section 3.9.4.2 / Annex A.4.11.2).
      Remaining test procedure (Temperature) strictly evaluates to <strong>REFERENCE REQUIRED</strong> until its normative rule definition is configured.
    </div>

    ${table(
      ['Rule Package Identifier', 'Normative Standard', 'Configured Version', 'Verification State', 'Compliance Dispatch'],
      [
        `<tr>
          <td><b>oiml-r76-1-2006</b></td>
          <td>OIML R 76-1:2006 (Non-automatic weighing instruments)</td>
          <td><code>2006 Edition (Table 6, Annex A.4.10, A.4.7, A.4.6, A.4.2, A.4.11)</code></td>
          <td><span class="badge good">VERIFIED ACTIVE</span></td>
          <td>Verified rules active for <b>WEIGHING_PERFORMANCE</b>, <b>REPEATABILITY</b>, <b>ECCENTRIC_LOADING</b>, <b>TARE</b>, <b>ZERO_RELATED_TESTS</b>, <b>CREEP</b> &amp; <b>ZERO_RETURN</b>; Temperature returns <b>REFERENCE REQUIRED</b></td>
        </tr>`,
        `<tr>
          <td><b>DEMO-SIM-ENGINE</b></td>
          <td>Synthetic UI Simulation Mode (Stepped ±1e/2e/3e)</td>
          <td><code>DEMO-SIM-2026</code></td>
          <td><span class="badge good">SIMULATION ACTIVE</span></td>
          <td>Demonstrates UI workflow (Clearly marked: Not for regulatory use)</td>
        </tr>`
      ]
    )}

    <p class="muted spaced">
      Official production deployments connect verified OIML R 76 normative rule packages (including maximum permissible errors for Class I, II, III, and IIII instruments across initial verification and in-service inspection, tare balancing, repeatability ranges, and temperature influence bounds).
    </p>
  `);
}

// -------------------------------------------------------------
// 12.9 AUDIT LOG
// -------------------------------------------------------------
function audit() {
  return panel('System Activity & Compliance Audit Log',
    table(
      ['Timestamp', 'Actor Role', 'Entity Reference', 'Action Performed'],
      db.audit.map(a => `<tr>
        <td><code>${new Date(a.at).toLocaleString()}</code></td>
        <td><b>${esc(a.actor)}</b></td>
        <td><code>${esc(a.entity)}</code></td>
        <td>${esc(a.action)}</td>
      </tr>`),
      'No audit history logged.'
    )
  );
}

// -------------------------------------------------------------
// 13. ATTACHMENT MODAL
// -------------------------------------------------------------
function addAttachmentModal(evalId) {
  const d = modal(`
    <div class="modal-header">
      <div>
        <div class="eyebrow">EVALUATION ATTACHMENTS</div>
        <h2>Upload Photographic Evidence</h2>
      </div>
    </div>
    <form id="attachment-form" class="formgrid spaced">
      ${selectField('Attachment Category', 'category', [
        ['Instrument', 'Instrument Front / Perspective'],
        ['Name Plate', 'Name Plate / Metrological Markings'],
        ['Display', 'Weight Indicator Display'],
        ['Test Setup', 'Test Weights & Load Setup'],
        ['Supporting Document', 'Calibration Certificate / Manual'],
        ['Other', 'Other Evidence']
      ])}
      ${field('Photo Description / Caption', 'desc', '', 'text', false, 'placeholder="e.g. Front view of scale on marble test bench"')}
      <div class="field wide">
        <label for="photo-file">Select Image File (PNG, JPG, SVG, WebP) *</label>
        <input id="photo-file" type="file" accept="image/*" required>
        <div id="file-preview-wrap" style="margin-top:10px;display:none;">
          <img id="file-preview" style="max-height:160px;border-radius:6px;border:1px solid #ccc;display:block;">
        </div>
      </div>
      <div class="field wide actions">
        <button class="btn" type="button" data-close>Cancel</button>
        <button class="btn primary" type="submit">Attach Photo</button>
      </div>
    </form>
  `);

  let loadedUrl = '';
  const fileInput = d.querySelector('#photo-file');
  fileInput.onchange = ev => {
    const file = ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e2 => {
      loadedUrl = e2.result;
      const prevWrap = d.querySelector('#file-preview-wrap');
      const prevImg = d.querySelector('#file-preview');
      prevImg.src = loadedUrl;
      prevWrap.style.display = 'block';
    };
    reader.readAsDataURL(file);
  };

  d.querySelector('#attachment-form').onsubmit = ev => {
    ev.preventDefault();
    if (!loadedUrl) return toast('Please select an image file to upload.');
    const v = formData(ev.target);
    const fileName = fileInput.files[0]?.name || 'Photo.jpg';
    evaluationService.addAttachment(evalId, {
      name: fileName,
      category: v.category,
      desc: v.desc,
      url: loadedUrl
    });
    toast('Photo attached successfully');
    d.close();
    render();
  };
}

// -------------------------------------------------------------
// 14. GLOBAL SEARCH LOGIC
// -------------------------------------------------------------
function performGlobalSearch(rawTerm) {
  const term = rawTerm.trim().toLowerCase();
  const resWrap = $('#global-search-results');
  if (!resWrap) return;

  if (!term) {
    resWrap.style.display = 'none';
    resWrap.innerHTML = '';
    return;
  }

  const mfgMatches = db.manufacturers.filter(m =>
    m.name.toLowerCase().includes(term) || m.country.toLowerCase().includes(term)
  ).slice(0, 3);

  const instMatches = db.instruments.filter(i =>
    i.model.toLowerCase().includes(term) || i.serial.toLowerCase().includes(term)
  ).slice(0, 3);

  const evalMatches = db.evaluations.filter(e =>
    e.id.toLowerCase().includes(term) || (e.tester && e.tester.toLowerCase().includes(term))
  ).slice(0, 4);

  const reportMatches = db.evaluations.filter(e =>
    e.report && e.report.number.toLowerCase().includes(term)
  ).slice(0, 3);

  const total = mfgMatches.length + instMatches.length + evalMatches.length + reportMatches.length;

  if (total === 0) {
    resWrap.innerHTML = `<div class="search-item muted">No results found for "${esc(rawTerm)}"</div>`;
    resWrap.style.display = 'block';
    return;
  }

  let html = '';

  if (evalMatches.length) {
    html += `<div class="search-group-title">Evaluations</div>`;
    html += evalMatches.map(e => `
      <button class="search-item" data-open="${e.id}">
        <strong>${e.id}</strong>
        <span>${esc(instrumentService.getById(e.instrument)?.model || '')} (${e.status})</span>
      </button>
    `).join('');
  }

  if (instMatches.length) {
    html += `<div class="search-group-title">Instruments</div>`;
    html += instMatches.map(i => `
      <button class="search-item" data-view-instrument="${i.id}">
        <strong>${esc(i.model)}</strong>
        <span>S/N: ${esc(i.serial)}</span>
      </button>
    `).join('');
  }

  if (mfgMatches.length) {
    html += `<div class="search-group-title">Manufacturers</div>`;
    html += mfgMatches.map(m => `
      <button class="search-item" data-view-manufacturer="${m.id}">
        <strong>${esc(m.name)}</strong>
        <span>${esc(m.country)}</span>
      </button>
    `).join('');
  }

  if (reportMatches.length) {
    html += `<div class="search-group-title">Reports</div>`;
    html += reportMatches.map(e => `
      <button class="search-item" data-report="${e.id}">
        <strong>${esc(e.report.number)}</strong>
        <span>${esc(e.id)}</span>
      </button>
    `).join('');
  }

  resWrap.innerHTML = html;
  resWrap.style.display = 'block';

  resWrap.querySelectorAll('[data-open]').forEach(b => {
    b.onclick = () => {
      resWrap.style.display = 'none';
      show('evaluation', b.dataset.open, 0);
    };
  });
  resWrap.querySelectorAll('[data-view-instrument]').forEach(b => {
    b.onclick = () => {
      resWrap.style.display = 'none';
      viewInstrumentModal(instrumentService.getById(b.dataset.viewInstrument));
    };
  });
  resWrap.querySelectorAll('[data-view-manufacturer]').forEach(b => {
    b.onclick = () => {
      resWrap.style.display = 'none';
      viewManufacturerModal(manufacturerService.getById(b.dataset.viewManufacturer));
    };
  });
  resWrap.querySelectorAll('[data-report]').forEach(b => {
    b.onclick = () => {
      resWrap.style.display = 'none';
      show('evaluation', b.dataset.report, 6);
    };
  });
}

// -------------------------------------------------------------
// 15. EVENT BINDINGS & ACTIONS
// -------------------------------------------------------------
function bind() {
  $$('[data-page]').forEach(b => {
    b.onclick = () => show(b.dataset.page);
  });

  const roleSelect = $('#role');
  if (roleSelect) {
    roleSelect.onchange = e => {
      role = e.target.value;
      sessionStorage.setItem('nawi_role', role);
      toast(`Role switched to ${role}`);
      render();
    };
  }

  const searchInput = $('#search');
  if (searchInput) {
    searchInput.oninput = e => {
      const pos = e.target.selectionStart;
      query = e.target.value;
      render();
      const ref = $('#search');
      if (ref) {
        ref.focus();
        ref.setSelectionRange(pos, pos);
      }
    };
  }

  const globalInput = $('#global-search');
  if (globalInput) {
    globalInput.oninput = e => {
      performGlobalSearch(e.target.value);
    };
    globalInput.onkeydown = e => {
      if (e.key === 'Escape') {
        const dd = $('#global-search-results');
        if (dd) dd.style.display = 'none';
      }
    };
  }

  document.addEventListener('click', e => {
    if (!e.target.closest('.global-search-wrap')) {
      const dd = $('#global-search-results');
      if (dd) dd.style.display = 'none';
    }
  });

  document.onkeydown = e => {
    if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
      e.preventDefault();
      const gi = $('#global-search');
      if (gi) {
        gi.focus();
        gi.select();
      }
    }
  };

  $$('[data-open]').forEach(b => {
    b.onclick = () => show('evaluation', b.dataset.open, 0);
  });

  $$('[data-review]').forEach(b => {
    b.onclick = () => show('evaluation', b.dataset.review, 5);
  });
  $$('[data-report]').forEach(b => {
    b.onclick = () => show('evaluation', b.dataset.report, 6);
  });
  $$('[data-print-direct]').forEach(b => {
    b.onclick = () => reportService.printReport(b.dataset.printDirect);
  });

  $$('[data-step]').forEach(b => {
    b.onclick = () => {
      step = +b.dataset.step;
      render();
    };
  });

  // Toggle Compliance Mode (DEMO vs VERIFIED_R76)
  $$('[data-toggle-mode]').forEach(b => {
    b.onclick = () => {
      const e = evaluationService.getById(active);
      if (!e) return;
      const newMode = b.dataset.toggleMode;
      if (e.complianceMode === newMode) return;
      e.complianceMode = newMode;
      e.ruleVersion = (newMode === 'VERIFIED_R76') ? 'oiml-r76-1-2006' : 'DEMO-SIM-2026';
      mockDataService.save(db);
      evaluationService.addEvent(active, `Compliance mode switched to ${newMode}`);
      toast(`Compliance mode switched to ${newMode}`);
      render();
    };
  });

  // Manufacturer actions
  $$('[data-view-manufacturer]').forEach(b => {
    b.onclick = () => viewManufacturerModal(manufacturerService.getById(b.dataset.viewManufacturer));
  });
  $$('[data-edit-manufacturer]').forEach(b => {
    b.onclick = () => addManufacturerModal(manufacturerService.getById(b.dataset.editManufacturer));
  });
  $$('[data-delete-manufacturer]').forEach(b => {
    b.onclick = () => {
      const mId = b.dataset.deleteManufacturer;
      const m = manufacturerService.getById(mId);
      if (!confirm(`Are you sure you want to delete manufacturer "${m?.name}"?`)) return;
      const res = manufacturerService.delete(mId);
      if (res.success) {
        toast('Manufacturer deleted successfully');
        render();
      } else {
        toast(res.message);
      }
    };
  });

  // Instrument actions
  $$('[data-view-instrument]').forEach(b => {
    b.onclick = () => viewInstrumentModal(instrumentService.getById(b.dataset.viewInstrument));
  });
  $$('[data-edit-instrument]').forEach(b => {
    b.onclick = () => addInstrumentModal(instrumentService.getById(b.dataset.editInstrument));
  });
  $$('[data-history]').forEach(b => {
    b.onclick = () => viewInstrumentModal(instrumentService.getById(b.dataset.history));
  });
  $$('[data-delete-instrument]').forEach(b => {
    b.onclick = () => {
      const iId = b.dataset.deleteInstrument;
      const inst = instrumentService.getById(iId);
      if (!confirm(`Are you sure you want to delete instrument "${inst?.model} (${inst?.serial})"?`)) return;
      const res = instrumentService.delete(iId);
      if (res.success) {
        toast('Instrument deleted successfully');
        render();
      } else {
        toast(res.message);
      }
    };
  });

  // Test Selection toggles
  $$('[data-toggle-test]').forEach(card => {
    card.onclick = () => {
      const e = evaluationService.getById(active);
      if (!e) return;
      const tId = card.dataset.toggleTest;
      if (e.tests.includes(tId)) {
        if (e.tests.length === 1) return toast('At least one test module must remain selected.');
        e.tests = e.tests.filter(x => x !== tId);
      } else {
        e.tests.push(tId);
      }
      evaluationService.addEvent(active, `Test module selection updated: ${tId}`);
      mockDataService.save(db);
      render();
    };
  });

  // Observation presets
  $$('.preset-btn').forEach(btn => {
    btn.onclick = () => {
      const refInput = $('#reference');
      if (refInput) {
        refInput.value = btn.dataset.preset;
        refInput.dispatchEvent(new Event('input'));
      }
    };
  });

  // Live error calculation in Observation Form (Step 3)
  const refInput = $('#reference');
  const indInput = $('#indication');
  const liveErrorEl = $('#live-error-calc');
  window.toggleZeroReturnInstrumentFields = function(val) {
    const mi = $('#multiIntervalFields');
    const mr = $('#multipleRangeFields');
    if (mi) mi.style.display = val === 'MULTI' ? 'block' : 'none';
    if (mr) mr.style.display = val === 'MULTIPLE_RANGE' ? 'block' : 'none';
    updateLiveError();
  };

  function updateLiveError() {
    if (!refInput || !indInput || !liveErrorEl) return;
    const rVal = refInput.value.trim();
    const iVal = indInput.value.trim();
    const normTest = oimlRuleService.normalizeTestType(currentObsTest);
    if (normTest === 'ZERO_RETURN') {
      if (rVal !== '' && iVal !== '') {
        const e = evaluationService.getById(active);
        const inst = e ? instrumentService.getById(e.instrument) : null;
        const diff = calculationService.decimalSafeSubtract(iVal, rVal);
        const absDiff = Math.abs(diff);
        const instTypeSel = $('#instrumentTypeSelect')?.value || 'SINGLE';
        let allowed = Number(inst?.e || 0.01) * 0.5;
        let intLabel = '0.5e';
        if (instTypeSel === 'MULTI') {
          const e1Val = Number($('#e1')?.value) || Number(inst?.e || 0.01);
          allowed = Number((e1Val * 0.5).toFixed(6));
          intLabel = '0.5e₁';
        } else if (instTypeSel === 'MULTIPLE_RANGE') {
          const eiVal = Number($('#e_i')?.value) || Number(inst?.e || 0.01);
          allowed = Number((eiVal * 0.5).toFixed(6));
          intLabel = '0.5e_i';
        }
        const isPass = absDiff <= allowed + 1e-9;
        liveErrorEl.innerHTML = `Initial Zero: <code>${rVal}</code> &nbsp;|&nbsp; Returned Zero: <code>${iVal}</code> &nbsp;|&nbsp; ` +
          `Deviation: <strong>${diff >= 0 ? '+' : ''}${diff} ${inst?.unit || ''}</strong> &nbsp;|&nbsp; ` +
          `|Dev|: <strong>${absDiff}</strong> &nbsp;|&nbsp; Allowed (${intLabel}): <strong>±${allowed}</strong> &nbsp;|&nbsp; ` +
          `Result: <span class="badge ${isPass ? 'good' : 'bad'}" style="font-size:11px;">${isPass ? 'PASS' : 'FAIL'}</span>`;
      } else {
        liveErrorEl.innerHTML = `Zero Return Deviation: —`;
      }
      return;
    }
    if (rVal !== '' && iVal !== '') {
      const diff = calculationService.decimalSafeSubtract(iVal, rVal);
      const diffStr = calculationService.formatError(diff);
      const e = evaluationService.getById(active);
      const inst = e ? instrumentService.getById(e.instrument) : null;
      const mOverE = oimlRuleService.calculateLoadInIntervals(rVal, inst?.e);
      liveErrorEl.innerHTML = `Calculated Error: <strong>${diffStr} ${inst?.unit || ''}</strong> &nbsp;|&nbsp; Load: <code>${mOverE} e</code>`;
    } else {
      liveErrorEl.innerHTML = `Calculated Error: —`;
    }
  }
  if (refInput) refInput.oninput = updateLiveError;
  if (indInput) indInput.oninput = updateLiveError;
  const e1Input = $('#e1');
  if (e1Input) e1Input.oninput = updateLiveError;
  const eiInput = $('#e_i');
  if (eiInput) eiInput.oninput = updateLiveError;

  // Procedure selector in Step 3
  const obsTestSel = $('#obs-test-selector');
  if (obsTestSel) {
    obsTestSel.onchange = ev => {
      currentObsTest = ev.target.value;
      render();
    };
  }

  // Repeatability Series submission & live calculation
  const rptForm = $('#repeatability-series-form');
  if (rptForm) {
    const presetBtn = $('#rpt-preset-target');
    if (presetBtn) {
      presetBtn.onclick = () => {
        const e = evaluationService.getById(active);
        const inst = instrumentService.getById(e.instrument);
        const maxVal = Number(inst?.max) || 0;
        const refInput = $('#rpt-reference');
        if (refInput) {
          refInput.value = (maxVal * 0.8).toFixed(2);
          updateRptLiveCalc();
        }
      };
    }

    function updateRptLiveCalc() {
      const e = evaluationService.getById(active);
      const inst = instrumentService.getById(e.instrument);
      const refVal = $('#rpt-reference')?.value?.trim();
      const readingEls = $$('.rpt-reading-input');
      const readVals = [];
      readingEls.forEach(el => {
        if (el.value.trim() !== '') readVals.push(Number(el.value));
      });

      const maxEl = $('#rpt-live-max');
      const minEl = $('#rpt-live-min');
      const diffEl = $('#rpt-live-diff');
      const mpeEl = $('#rpt-live-mpe');

      if (readVals.length > 0) {
        const highest = Math.max(...readVals);
        const lowest = Math.min(...readVals);
        if (maxEl) maxEl.textContent = `${highest.toFixed(3)} ${inst?.unit || ''}`;
        if (minEl) minEl.textContent = `${lowest.toFixed(3)} ${inst?.unit || ''}`;
        if (diffEl) {
          const diff = calculationService.decimalSafeSubtract(highest, lowest);
          diffEl.textContent = `${diff} ${inst?.unit || ''}`;
        }
      } else {
        if (maxEl) maxEl.textContent = '—';
        if (minEl) minEl.textContent = '—';
        if (diffEl) diffEl.textContent = '—';
      }

      if (refVal !== '' && !isNaN(Number(refVal)) && typeof OimlR76MpeRules !== 'undefined') {
        const numE = Number(inst?.e) || 0.01;
        const mOverE = Number((Number(refVal) / numE).toFixed(2));
        const lookup = OimlR76MpeRules.lookupMpeBand(inst?.class, mOverE, e.evaluationType);
        if (lookup && lookup.resolved && mpeEl) {
          const mpe = OimlR76MpeRules.safeMultiply(lookup.multiplier, numE);
          mpeEl.textContent = `±${mpe} ${inst?.unit || ''} (±${lookup.multiplier}e)`;
        } else if (mpeEl) {
          mpeEl.textContent = '—';
        }
      } else if (mpeEl) {
        mpeEl.textContent = '—';
      }
    }

    $('#rpt-reference')?.addEventListener('input', updateRptLiveCalc);
    $$('.rpt-reading-input').forEach(inp => inp.addEventListener('input', updateRptLiveCalc));

    rptForm.onsubmit = ev => {
      ev.preventDefault();
      const e = evaluationService.getById(active);
      const inst = instrumentService.getById(e.instrument);
      const maxVal = Number(inst?.max) || 10000;
      const seriesId = ($('#rpt-series-id')?.value || 'RPT-001').trim();
      const refVal = $('#rpt-reference')?.value?.trim();
      const remarks = ($('#rpt-remarks')?.value || '').trim();

      if (!refVal || isNaN(Number(refVal)) || Number(refVal) < 0 || Number(refVal) > maxVal) {
        return toast(`Reference load must be between 0 and instrument Max capacity (${maxVal} ${inst?.unit})`);
      }

      const readingEls = $$('.rpt-reading-input');
      const enteredReadings = [];
      readingEls.forEach((el, idx) => {
        const val = el.value.trim();
        if (val !== '') {
          enteredReadings.push({
            sequenceNumber: idx + 1,
            value: val
          });
        }
      });

      if (enteredReadings.length === 0) {
        return toast('Please enter at least one indication reading.');
      }

      const normClass = String(inst?.class || 'III').toUpperCase().trim();
      const reqReps = (normClass === 'I' || normClass === 'II') ? 6 : 3;

      enteredReadings.forEach(r => {
        evaluationService.addObservation(active, {
          test: 'Repeatability',
          seriesId,
          sequenceNumber: r.sequenceNumber,
          reference: refVal,
          indication: r.value,
          remarks: remarks || `Repeatability Series ${seriesId} (Run ${r.sequenceNumber}/${reqReps})`
        });
      });

      if (enteredReadings.length < reqReps) {
        toast(`Recorded ${enteredReadings.length} of ${reqReps} required weighings for series ${seriesId} (Additional observations required)`);
      } else {
        toast(`Repeatability series ${seriesId} recorded (${enteredReadings.length} weighings)`);
      }
      render();
    };
  }

  // New Observation submission (Single observation)
  const obsForm = $('#new-observation-form');
  if (obsForm) {
    obsForm.onsubmit = ev => {
      ev.preventDefault();
      const v = formData(obsForm);
      const e = evaluationService.getById(active);
      const inst = instrumentService.getById(e.instrument);
      const maxVal = Number(inst?.max) || 10000;

      const isZeroTest = oimlRuleService.normalizeTestType(v.test || currentObsTest).includes('ZERO');
      if (!isZeroTest && (Number(v.reference) < 0 || Number(v.reference) > maxVal)) {
        return toast(`Reference load must be between 0 and instrument Max capacity (${maxVal} ${inst?.unit})`);
      }

      if (oimlRuleService.normalizeTestType(v.test || currentObsTest) === 'ZERO_RETURN') {
        v.initialZeroIndication = Number(v.reference);
        v.returnedZeroIndication = Number(v.indication);
        v.appliedLoad = Number(v.appliedLoad || inst?.max || 0);
        v.loadingDurationMinutes = Number(v.loadingDurationMinutes || 30);
        const instType = v.instrumentTypeSelect || 'SINGLE';
        v.isMultiInterval = instType === 'MULTI';
        v.isMultipleRange = instType === 'MULTIPLE_RANGE';
        if (v.isMultiInterval) {
          v.e1 = Number(v.e1);
        } else if (v.isMultipleRange) {
          v.Max1 = Number(v.Max1);
          v.e1 = Number(v.mr_e1);
          v.activeRange = v.activeRange || '2';
          v.e_i = Number(v.e_i);
          v.ranges = [
            { rangeId: 1, Max_i: Number(v.Max1), e_i: Number(v.mr_e1) },
            { rangeId: v.activeRange, Max_i: Number(inst?.max), e_i: Number(v.e_i) }
          ];
          if (v.followUpReadings) {
            const parts = v.followUpReadings.split(',').map(s => s.trim()).filter(s => s !== '');
            v.lowestRangeFollowUpObservations = parts.map((s, idx) => ({
              time: idx * (5 / Math.max(1, parts.length - 1)),
              nearZeroIndication: Number(s)
            })).filter(o => !isNaN(o.nearZeroIndication));
          }
        }
        v.automaticZeroDisabledDuringTest = !!$('#autoZeroDisabled')?.checked;
        v.zeroTrackingDisabledDuringTest = !!$('#zeroTrackDisabled')?.checked;
        v.hasAutomaticZeroSetting = true;
        v.hasZeroTracking = true;
      }

      evaluationService.addObservation(active, v);
      toast('Observation recorded successfully');
      render();
    };
  }

  // Delete Observation
  $$('[data-delete-obs]').forEach(b => {
    b.onclick = () => {
      evaluationService.deleteObservation(active, b.dataset.deleteObs);
      toast('Observation deleted');
      render();
    };
  });

  // Edit Observation Modal
  $$('[data-edit-obs]').forEach(b => {
    b.onclick = () => {
      const e = evaluationService.getById(active);
      const inst = instrumentService.getById(e.instrument);
      const obs = e.observations.find(o => o.id === b.dataset.editObs);
      if (!obs) return;

      const d = modal(`
        <div class="modal-header">
          <div>
            <div class="eyebrow">OBSERVATION EDIT</div>
            <h2>Edit Observation Data Point</h2>
          </div>
        </div>
        <form id="edit-obs-form" class="formgrid spaced">
          ${selectField('Test Category', 'test', (e.tests.length ? e.tests : ['Weighing Performance']).map(t => [t, t]), obs.test)}
          ${field('Reference Load (' + esc(inst?.unit) + ')', 'reference', obs.reference, 'number', true, 'step="any" min="0"')}
          ${field('Indication Reading (' + esc(inst?.unit) + ')', 'indication', obs.indication, 'number', true, 'step="any"')}
          ${field('Remarks', 'remarks', obs.remarks || '')}
          <div class="field wide actions">
            <button class="btn" type="button" data-close>Cancel</button>
            <button class="btn primary" type="submit">Update Observation</button>
          </div>
        </form>
      `);

      d.querySelector('#edit-obs-form').onsubmit = ev => {
        ev.preventDefault();
        const v = formData(ev.target);
        evaluationService.updateObservation(active, obs.id, v);
        toast('Observation updated');
        d.close();
        render();
      };
    };
  });

  // "Why This Result?" action
  $$('[data-why-result]').forEach(b => {
    b.onclick = () => {
      const e = evaluationService.getById(active);
      const inst = instrumentService.getById(e.instrument);
      const obs = e.observations.find(o => o.id === b.dataset.whyResult);
      if (!obs) return;
      showWhyThisResult(obs, inst, e);
    };
  });

  // Laboratory conditions form submission
  const condForm = $('#conditions-form');
  if (condForm) {
    condForm.onsubmit = ev => {
      ev.preventDefault();
      const v = formData(condForm);
      const e = evaluationService.getById(active);
      Object.assign(e, v);
      evaluationService.addEvent(active, `Laboratory conditions updated (${v.evaluationType === 'INITIAL_VERIFICATION' ? 'Initial Verification' : 'In-Service Inspection'})`);
      toast('Laboratory conditions and evaluation profile saved');
      render();
    };
  }

  // Report filter listeners
  const statusFilterSelect = $('#report-status-filter');
  if (statusFilterSelect) {
    statusFilterSelect.onchange = e => {
      reportStatusFilter = e.target.value;
      render();
    };
  }
  const mfgFilterSelect = $('#report-mfg-filter');
  if (mfgFilterSelect) {
    mfgFilterSelect.onchange = e => {
      reportMfgFilter = e.target.value;
      render();
    };
  }

  // Attachment view modal
  $$('[data-view-attachment]').forEach(img => {
    img.onclick = () => {
      const e = evaluationService.getById(active);
      const att = e?.attachments?.find(a => a.id === img.dataset.viewAttachment);
      if (!att) return;
      modal(`
        <div class="modal-header">
          <div>
            <div class="eyebrow">${esc(att.category)}</div>
            <h2>${esc(att.name)}</h2>
          </div>
        </div>
        <div style="text-align:center;margin:15px 0;">
          <img src="${att.url}" style="max-width:100%;max-height:70vh;border-radius:6px;box-shadow:0 4px 20px #0002;">
        </div>
        <p style="font-size:14px;color:#333;margin:8px 0;">${esc(att.desc || 'No description.')}</p>
        <div class="actions">
          <button class="btn primary" type="button" data-close>Close</button>
        </div>
      `, '780px');
    };
  });

  // Delete attachment
  $$('[data-delete-attachment]').forEach(b => {
    b.onclick = () => {
      if (!confirm('Are you sure you want to remove this photo attachment?')) return;
      evaluationService.deleteAttachment(active, b.dataset.deleteAttachment);
      toast('Photo attachment removed');
      render();
    };
  });

  // Action buttons
  $$('[data-action]').forEach(b => {
    b.onclick = () => {
      const a = b.dataset.action;
      const e = evaluationService.getById(active);

      if (a === 'new-evaluation') newEvaluationModal();
      if (a === 'add-manufacturer') addManufacturerModal();
      if (a === 'add-instrument') addInstrumentModal();

      if (a === 'reset-demo-data') {
        if (!confirm('Reset local demo database to initial sample data?')) return;
        mockDataService.reset();
        db = mockDataService.getDb();
        render();
      }

      if (a === 'clear-report-filters') {
        reportStatusFilter = '';
        reportMfgFilter = '';
        query = '';
        render();
      }

      if (a === 'select-all-tests' && e) {
        e.tests = ALL_TEST_MODULES.map(t => t.id);
        evaluationService.addEvent(active, 'All test modules selected');
        render();
      }

      if (a === 'clear-all-tests' && e) {
        e.tests = ['Weighing Performance'];
        evaluationService.addEvent(active, 'Test selection reset to Weighing Performance');
        render();
      }

      if (a === 'add-attachment' && e) {
        addAttachmentModal(active);
      }

      if (a === 'save-draft' && e) {
        const testerComments = $('#tester-comments')?.value;
        const reviewerComments = $('#reviewer-comments')?.value;
        if (testerComments !== undefined) e.comments = testerComments;
        if (reviewerComments !== undefined) e.reviewerComments = reviewerComments;
        mockDataService.save(db);
        toast('Evaluation saved as draft');
      }

      if (a === 'continue-later' && e) {
        mockDataService.save(db);
        show('evaluations');
        toast('Evaluation progress saved. You can resume anytime.');
      }

      if (a === 'finish-wizard') {
        show('evaluations');
        toast('Evaluation wizard completed.');
      }

      if (a === 'submit-for-review' && e) {
        if (!e.lab || !e.date) return toast('Please save laboratory conditions in Step 2 before submitting.');
        if (!e.observations.length) return toast('Please enter observations before submitting for review.');
        const testerComments = $('#tester-comments')?.value;
        if (testerComments !== undefined) e.comments = testerComments;
        e.status = 'SUBMITTED_FOR_REVIEW';
        evaluationService.addEvent(active, 'Submitted for technical review');
        render();
        toast('Evaluation submitted for review');
      }

      if (a === 'mark-under-review' && e) {
        e.status = 'UNDER_REVIEW';
        evaluationService.addEvent(active, 'Technical review commenced');
        render();
        toast('Evaluation status updated: UNDER REVIEW');
      }

      if (a === 'return-for-correction' && e) {
        const revNotes = $('#reviewer-comments')?.value?.trim();
        if (!revNotes) {
          return toast('Reviewer comment is required when returning an evaluation for correction.');
        }
        e.reviewerComments = revNotes;
        e.status = 'RETURNED_FOR_CORRECTION';
        evaluationService.addEvent(active, `Returned for correction: ${revNotes}`);
        render();
        toast('Evaluation returned for correction');
      }

      if (a === 'complete-evaluation' && e) {
        const revNotes = $('#reviewer-comments')?.value?.trim();
        if (revNotes) e.reviewerComments = revNotes;
        reportService.generateReport(active);
        render();
        toast('Evaluation completed & demo report generated!');
      }

      if (a === 'generate-report' && e) {
        reportService.generateReport(active);
        render();
        toast('Demo report generated successfully');
      }

      if (a === 'print-report' && e) {
        reportService.printReport(active);
      }
    };
  });
}

// -------------------------------------------------------------
// 16. INITIALIZATION
// -------------------------------------------------------------
render();
