
const STORAGE_KEY = 'rpaRoiCalculatorScenariosV1';
const THEME_KEY = 'rpaRoiCalculatorTheme';
let currentStep = 1;
let currentScenario = 'expected';
let charts = {};

const metricConfig = [
  { key: 'annualVolume', label: 'Annual volume', type: 'number' },
  { key: 'currentManualHours', label: 'Current annual manual hours', type: 'number' },
  { key: 'futureHumanHours', label: 'Future annual human hours', type: 'number' },
  { key: 'grossHoursSaved', label: 'Gross hours saved', type: 'number' },
  { key: 'realizedHoursSaved', label: 'Realized hours saved', type: 'number' },
  { key: 'annualBenefit', label: 'Annual gross benefit', type: 'currency' },
  { key: 'annualRecurringCost', label: 'Annual recurring cost', type: 'currency' },
  { key: 'oneTimeInvestment', label: 'One-time investment', type: 'currency' },
  { key: 'year1NetBenefit', label: 'Year 1 net benefit', type: 'currency' },
  { key: 'periodNetBenefit', label: 'Period net benefit', type: 'currency' },
  { key: 'costPerTransactionBefore', label: 'Cost per transaction before', type: 'currency' },
  { key: 'costPerTransactionAfter', label: 'Cost per transaction after', type: 'currency' },
];

const defaultState = {
  projectName: 'Sample RPA Project',
  department: 'Operations',
  currency: 'EUR',
  analysisYears: 3,
  automationType: 'unattended',
  vendorMode: 'neutral',
  processCount: 1,
  discountRatePct: 0,
  attendedUsers: 0,
  unattendedBots: 1,
  hostedBots: 0,
  transactionsPerDay: 120,
  workingDaysPerMonth: 22,
  seasonalityAdjustmentPct: 0,
  manualMinutesPerTransaction: 12,
  employeesInProcess: 4,
  loadedHourlyCost: 25,
  overtimeHoursPerMonth: 20,
  overtimeHourlyCost: 35,
  currentErrorRatePct: 5,
  reworkMinutesPerError: 8,
  costPerError: 10,
  slaPenaltyAnnual: 2000,
  backlogCostAnnual: 1500,
  automationCoveragePct: 80,
  botMinutesPerTransaction: 2,
  remainingHumanMinutesPerTransaction: 2.5,
  exceptionRatePct: 12,
  exceptionHandlingMinutes: 10,
  postAutomationErrorRatePct: 1.5,
  availabilityPct: 97,
  botRunsPerDay: 6,
  goLiveMonth: 4,
  rampUpMonths: 2,
  stabilizationLossPct: 5,
  realizationFactorPct: 65,
  implementationHourlyRate: 45,
  discoveryHours: 20,
  designHours: 24,
  developmentHours: 120,
  testingHours: 40,
  pmHours: 18,
  infraSetupHours: 12,
  securitySetupHours: 10,
  documentationHours: 10,
  trainingHours: 8,
  changeHours: 8,
  partnerCost: 0,
  setupFees: 0,
  hypercareCost: 600,
  contingencyPct: 10,
  annualLicenseCost: 3600,
  annualBotCost: 1800,
  annualOrchestratorCost: 900,
  annualHostingCost: 1200,
  supportHoursPerMonth: 6,
  supportHourlyRate: 35,
  monitoringHoursPerMonth: 4,
  monitoringHourlyRate: 30,
  maintenanceHoursPerMonth: 6,
  maintenanceHourlyRate: 40,
  ownerHoursPerMonth: 2,
  ownerHourlyRate: 28,
  annualComplianceCost: 500,
  contractorAvoidanceAnnual: 0,
  hiringAvoidanceAnnual: 0,
  revenueAccelerationAnnual: 0,
  otherAnnualBenefit: 0,
  softBenefits: '',
};

const templates = {
  invoice: {
    projectName: 'Invoice Processing',
    department: 'Finance',
    transactionsPerDay: 150,
    manualMinutesPerTransaction: 11,
    currentErrorRatePct: 4.5,
    reworkMinutesPerError: 9,
    automationCoveragePct: 82,
    remainingHumanMinutesPerTransaction: 2.5,
    exceptionRatePct: 10,
    exceptionHandlingMinutes: 10,
    developmentHours: 140,
    annualLicenseCost: 4200,
    annualBotCost: 2100,
  },
  onboarding: {
    projectName: 'Employee Onboarding',
    department: 'HR',
    transactionsPerDay: 12,
    manualMinutesPerTransaction: 45,
    currentErrorRatePct: 6,
    reworkMinutesPerError: 15,
    automationCoveragePct: 70,
    remainingHumanMinutesPerTransaction: 14,
    exceptionRatePct: 20,
    exceptionHandlingMinutes: 18,
    developmentHours: 110,
    annualLicenseCost: 3000,
    annualBotCost: 1200,
  },
  dataEntry: {
    projectName: 'Data Entry',
    department: 'Shared Services',
    transactionsPerDay: 260,
    manualMinutesPerTransaction: 6,
    currentErrorRatePct: 5,
    reworkMinutesPerError: 7,
    automationCoveragePct: 85,
    remainingHumanMinutesPerTransaction: 1.2,
    exceptionRatePct: 8,
    exceptionHandlingMinutes: 8,
    developmentHours: 90,
  },
  reports: {
    projectName: 'Report Generation',
    department: 'Reporting',
    transactionsPerDay: 18,
    manualMinutesPerTransaction: 50,
    currentErrorRatePct: 3,
    reworkMinutesPerError: 20,
    automationCoveragePct: 75,
    remainingHumanMinutesPerTransaction: 10,
    exceptionRatePct: 9,
    exceptionHandlingMinutes: 15,
    developmentHours: 130,
  },
  reconciliation: {
    projectName: 'Reconciliations',
    department: 'Finance',
    transactionsPerDay: 55,
    manualMinutesPerTransaction: 28,
    currentErrorRatePct: 4,
    reworkMinutesPerError: 18,
    automationCoveragePct: 78,
    remainingHumanMinutesPerTransaction: 5,
    exceptionRatePct: 14,
    exceptionHandlingMinutes: 16,
    developmentHours: 150,
  },
  serviceLookup: {
    projectName: 'Customer Service Lookup',
    department: 'Customer Operations',
    transactionsPerDay: 140,
    manualMinutesPerTransaction: 7,
    currentErrorRatePct: 2.5,
    reworkMinutesPerError: 6,
    automationCoveragePct: 65,
    remainingHumanMinutesPerTransaction: 2,
    exceptionRatePct: 18,
    exceptionHandlingMinutes: 9,
    developmentHours: 80,
    annualLicenseCost: 2400,
  },
};

document.addEventListener('DOMContentLoaded', () => {
  renderStepper();
  applySavedTheme();
  loadState();
  bindEvents();
  showStep(currentStep);
  calculateAndRender();
  renderSavedScenarios();
});

function bindEvents() {
  document.getElementById('nextStepBtn').addEventListener('click', () => {
    currentStep = Math.min(7, currentStep + 1);
    showStep(currentStep);
  });

  document.getElementById('prevStepBtn').addEventListener('click', () => {
    currentStep = Math.max(1, currentStep - 1);
    showStep(currentStep);
  });

  document.getElementById('calcBtn').addEventListener('click', calculateAndRender);
  document.getElementById('saveScenarioBtn').addEventListener('click', saveScenario);
  document.getElementById('exportJsonBtn').addEventListener('click', exportJson);
  document.getElementById('exportCsvBtn').addEventListener('click', exportCsv);
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  document.getElementById('shareBtn').addEventListener('click', copyShareLink);
  document.getElementById('pdfBtn').addEventListener('click', exportPdf);
  document.getElementById('resetBtn').addEventListener('click', resetDefaults);
  document.getElementById('applyTemplateBtn').addEventListener('click', applyTemplate);
  document.getElementById('applyVendorPresetBtn').addEventListener('click', applyVendorPricing);

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentScenario = btn.dataset.scenario;
      document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      calculateAndRender();
    });
  });

  document.getElementById('roiForm').addEventListener('input', () => {
    calculateAndRender(false);
  });
}

function renderStepper() {
  const stepper = document.getElementById('stepper');
  stepper.innerHTML = '';
  for (let i = 1; i <= 7; i += 1) {
    const pill = document.createElement('div');
    pill.className = 'step-pill';
    pill.textContent = i;
    pill.dataset.step = String(i);
    pill.addEventListener('click', () => {
      currentStep = i;
      showStep(currentStep);
    });
    stepper.appendChild(pill);
  }
}

function showStep(step) {
  document.querySelectorAll('.step').forEach(section => {
    section.classList.toggle('active', Number(section.dataset.step) === step);
  });
  document.querySelectorAll('.step-pill').forEach(pill => {
    const stepNo = Number(pill.dataset.step);
    pill.classList.toggle('active', stepNo === step);
    pill.classList.toggle('completed', stepNo < step);
  });
  document.getElementById('prevStepBtn').disabled = step === 1;
  document.getElementById('nextStepBtn').disabled = step === 7;
}

function applySavedTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  document.body.classList.toggle('light', saved === 'light');
}

function toggleTheme() {
  document.body.classList.toggle('light');
  localStorage.setItem(THEME_KEY, document.body.classList.contains('light') ? 'light' : 'dark');
}

function loadState() {
  const urlState = decodeStateFromUrl();
  const state = { ...defaultState, ...(urlState || {}) };
  populateForm(state);
}

function resetDefaults() {
  populateForm(defaultState);
  calculateAndRender();
}

function applyTemplate() {
  const selected = document.getElementById('templateSelect').value;
  if (!selected || !templates[selected]) return;
  const merged = { ...getFormState(), ...templates[selected] };
  populateForm(merged);
  calculateAndRender();
}

function applyVendorPricing() {
  const state = getFormState();
  const mode = state.vendorMode;
  let patch = {};

  if (mode === 'powerAutomate') {
    patch.annualLicenseCost = (state.attendedUsers * 15 * 12);
    patch.annualBotCost = (state.unattendedBots * 150 * 12);
    patch.annualHostingCost = (state.hostedBots * 215 * 12);
    patch.annualOrchestratorCost = 0;
  } else if (mode === 'uipath') {
    patch.annualLicenseCost = (state.attendedUsers * 420) + (state.unattendedBots * 2200);
    patch.annualBotCost = (state.unattendedBots * 1800);
    patch.annualOrchestratorCost = 1200;
    patch.annualHostingCost = state.hostedBots * 1200;
  } else if (mode === 'custom') {
    patch.annualLicenseCost = state.attendedUsers * 600 + state.unattendedBots * 2000;
    patch.annualBotCost = state.unattendedBots * 1400;
    patch.annualOrchestratorCost = 1000;
    patch.annualHostingCost = state.hostedBots * 1000;
  }

  populateForm({ ...state, ...patch });
  calculateAndRender();
}

function populateForm(state) {
  const form = document.getElementById('roiForm');
  Object.entries(state).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);
    if (!field) return;
    field.value = value;
  });
}

function getFormState() {
  const form = document.getElementById('roiForm');
  const data = {};
  Array.from(form.elements).forEach(el => {
    if (!el.name) return;
    const raw = el.value;
    if (el.tagName === 'TEXTAREA') {
      data[el.name] = raw;
      return;
    }
    if (el.type === 'number') {
      data[el.name] = raw === '' ? 0 : Number(raw);
    } else {
      data[el.name] = raw;
    }
  });
  return data;
}

function scenarioAdjustedState(base, scenario) {
  const state = { ...base };

  const applyCostMultiplier = (multiplier) => {
    ['partnerCost','setupFees','hypercareCost','annualLicenseCost','annualBotCost','annualOrchestratorCost','annualHostingCost','annualComplianceCost'].forEach(k => {
      state[k] = Number(state[k]) * multiplier;
    });
    ['discoveryHours','designHours','developmentHours','testingHours','pmHours','infraSetupHours','securitySetupHours','documentationHours','trainingHours','changeHours','supportHoursPerMonth','monitoringHoursPerMonth','maintenanceHoursPerMonth'].forEach(k => {
      state[k] = Number(state[k]) * multiplier;
    });
  };

  if (scenario === 'conservative') {
    state.automationCoveragePct = clamp(Number(state.automationCoveragePct) - 10, 0, 100);
    state.exceptionRatePct = clamp(Number(state.exceptionRatePct) * 1.2, 0, 100);
    state.realizationFactorPct = clamp(Number(state.realizationFactorPct) - 15, 0, 100);
    state.postAutomationErrorRatePct = clamp(Number(state.postAutomationErrorRatePct) * 1.2, 0, 100);
    state.availabilityPct = clamp(Number(state.availabilityPct) - 3, 0, 100);
    state.stabilizationLossPct = clamp(Number(state.stabilizationLossPct) + 5, 0, 100);
    state.contractorAvoidanceAnnual = Number(state.contractorAvoidanceAnnual) * 0.9;
    state.hiringAvoidanceAnnual = Number(state.hiringAvoidanceAnnual) * 0.9;
    state.revenueAccelerationAnnual = Number(state.revenueAccelerationAnnual) * 0.9;
    state.otherAnnualBenefit = Number(state.otherAnnualBenefit) * 0.9;
    applyCostMultiplier(1.1);
  } else if (scenario === 'optimistic') {
    state.automationCoveragePct = clamp(Number(state.automationCoveragePct) + 5, 0, 100);
    state.exceptionRatePct = clamp(Number(state.exceptionRatePct) * 0.9, 0, 100);
    state.realizationFactorPct = clamp(Number(state.realizationFactorPct) + 10, 0, 100);
    state.postAutomationErrorRatePct = clamp(Number(state.postAutomationErrorRatePct) * 0.9, 0, 100);
    state.availabilityPct = clamp(Number(state.availabilityPct) + 1.5, 0, 100);
    state.stabilizationLossPct = clamp(Number(state.stabilizationLossPct) - 2, 0, 100);
    state.contractorAvoidanceAnnual = Number(state.contractorAvoidanceAnnual) * 1.05;
    state.hiringAvoidanceAnnual = Number(state.hiringAvoidanceAnnual) * 1.05;
    state.revenueAccelerationAnnual = Number(state.revenueAccelerationAnnual) * 1.05;
    state.otherAnnualBenefit = Number(state.otherAnnualBenefit) * 1.05;
    applyCostMultiplier(0.95);
  }

  return state;
}

function calculateAndRender(showToast = false) {
  const baseState = getFormState();
  const expected = calculateScenario(baseState, 'expected');
  const conservative = calculateScenario(baseState, 'conservative');
  const optimistic = calculateScenario(baseState, 'optimistic');
  const scenarioMap = { expected, conservative, optimistic };
  const chosen = scenarioMap[currentScenario];

  renderSummary(expected);
  renderMetrics(chosen);
  renderWarnings(chosen.warnings);
  renderConfidence(chosen.confidence);
  renderScenarioCompare(expected, conservative, optimistic);
  renderCharts(chosen);
  if (showToast) {
    alert('ROI calculated.');
  }
}

function calculateScenario(baseState, scenario) {
  return computeScenario(baseState, scenario, true);
}

function computeScenario(baseState, scenario, withSensitivity) {
  const state = scenarioAdjustedState(baseState, scenario);
  const currency = state.currency || 'EUR';
  const analysisYears = clamp(Number(state.analysisYears || 3), 1, 5);
  const processCount = Math.max(1, Number(state.processCount || 1));
  const annualVolume = Math.max(
    0,
    Number(state.transactionsPerDay) *
      Number(state.workingDaysPerMonth) *
      12 *
      (1 + Number(state.seasonalityAdjustmentPct) / 100) *
      processCount
  );

  const currentManualHours = annualVolume * Number(state.manualMinutesPerTransaction) / 60;
  const currentReworkHours = annualVolume * (Number(state.currentErrorRatePct) / 100) * Number(state.reworkMinutesPerError) / 60;
  const currentOvertimeHours = Number(state.overtimeHoursPerMonth) * 12 * processCount;
  const currentRegularLaborCost = (currentManualHours + currentReworkHours) * Number(state.loadedHourlyCost);
  const currentOvertimeCost = currentOvertimeHours * Number(state.overtimeHourlyCost);
  const currentErrorCost = (annualVolume * (Number(state.currentErrorRatePct) / 100) * Number(state.costPerError)) +
    Number(state.slaPenaltyAnnual) + Number(state.backlogCostAnnual);
  const currentTotalCost = currentRegularLaborCost + currentOvertimeCost + currentErrorCost;

  const automationCoverage = clamp(Number(state.automationCoveragePct) / 100, 0, 1);
  const exceptionRate = clamp(Number(state.exceptionRatePct) / 100, 0, 1);
  const postErrorRate = clamp(Number(state.postAutomationErrorRatePct) / 100, 0, 1);
  const availability = clamp(Number(state.availabilityPct) / 100, 0, 1);
  const realization = clamp(Number(state.realizationFactorPct) / 100, 0, 1);
  const stabilizationFactor = 1 - clamp(Number(state.stabilizationLossPct) / 100, 0, 1);

  const automatedVolume = annualVolume * automationCoverage;
  const exceptionVolume = automatedVolume * exceptionRate;
  const futureBaseHumanHours = annualVolume * Number(state.remainingHumanMinutesPerTransaction) / 60;
  const futureExceptionHours = exceptionVolume * Number(state.exceptionHandlingMinutes) / 60;
  const futureReworkHours = annualVolume * postErrorRate * Number(state.reworkMinutesPerError) / 60;
  const futureHumanHours = futureBaseHumanHours + futureExceptionHours + futureReworkHours;

  const grossHoursSaved = Math.max(0, (currentManualHours + currentReworkHours + currentOvertimeHours) - futureHumanHours);
  const realizedHoursSaved = grossHoursSaved * realization;
  const regularLaborSavings = Math.max(0, realizedHoursSaved * Number(state.loadedHourlyCost));
  const overtimeReductionValue = currentOvertimeCost * Math.min(1, automationCoverage * realization * availability * stabilizationFactor);
  const futureErrorCost = (annualVolume * postErrorRate * Number(state.costPerError)) +
    (Number(state.slaPenaltyAnnual) + Number(state.backlogCostAnnual)) * Math.max(0, 1 - automationCoverage * availability * stabilizationFactor);
  const errorSavings = Math.max(0, currentErrorCost - futureErrorCost);

  const annualBenefit = (
    regularLaborSavings +
    overtimeReductionValue +
    errorSavings +
    Number(state.contractorAvoidanceAnnual) +
    Number(state.hiringAvoidanceAnnual) +
    Number(state.revenueAccelerationAnnual) +
    Number(state.otherAnnualBenefit)
  );

  const implementationHours = [
    'discoveryHours','designHours','developmentHours','testingHours','pmHours','infraSetupHours',
    'securitySetupHours','documentationHours','trainingHours','changeHours'
  ].reduce((sum, key) => sum + Number(state[key] || 0), 0);

  const implementationBaseCost =
    implementationHours * Number(state.implementationHourlyRate) +
    Number(state.partnerCost) +
    Number(state.setupFees) +
    Number(state.hypercareCost);

  const oneTimeInvestment = implementationBaseCost * (1 + Number(state.contingencyPct) / 100);

  const annualRecurringCost =
    Number(state.annualLicenseCost) +
    Number(state.annualBotCost) +
    Number(state.annualOrchestratorCost) +
    Number(state.annualHostingCost) +
    Number(state.supportHoursPerMonth) * Number(state.supportHourlyRate) * 12 +
    Number(state.monitoringHoursPerMonth) * Number(state.monitoringHourlyRate) * 12 +
    Number(state.maintenanceHoursPerMonth) * Number(state.maintenanceHourlyRate) * 12 +
    Number(state.ownerHoursPerMonth) * Number(state.ownerHourlyRate) * 12 +
    Number(state.annualComplianceCost);

  const monthsActiveYear1 = clamp(13 - Number(state.goLiveMonth), 0, 12);
  const rampUpMonths = Math.max(0, Number(state.rampUpMonths));
  const rampFactor = monthsActiveYear1 === 0
    ? 0
    : rampUpMonths <= 0
      ? 1
      : (Math.max(0, monthsActiveYear1 - rampUpMonths) + (Math.min(monthsActiveYear1, rampUpMonths) * 0.5)) / monthsActiveYear1;
  const year1Benefit = annualBenefit * (monthsActiveYear1 / 12) * rampFactor * availability * stabilizationFactor;
  const year1RecurringCost = annualRecurringCost * (monthsActiveYear1 / 12);
  const year1NetBenefit = year1Benefit - year1RecurringCost - oneTimeInvestment;
  const year1Cost = year1RecurringCost + oneTimeInvestment;
  const year1RoiPct = year1Cost > 0 ? (year1NetBenefit / year1Cost) * 100 : 0;

  const steadyAnnualNet = annualBenefit * availability * stabilizationFactor - annualRecurringCost;
  const totalBenefits = year1Benefit + Math.max(0, analysisYears - 1) * annualBenefit * availability * stabilizationFactor;
  const totalCosts = oneTimeInvestment + year1RecurringCost + Math.max(0, analysisYears - 1) * annualRecurringCost;
  const periodNetBenefit = totalBenefits - totalCosts;
  const periodRoiPct = totalCosts > 0 ? (periodNetBenefit / totalCosts) * 100 : 0;

  const monthlyNetSteady = steadyAnnualNet / 12;
  const paybackMonths = monthlyNetSteady > 0 ? oneTimeInvestment / monthlyNetSteady : null;

  const costPerTransactionBefore = annualVolume > 0 ? currentTotalCost / annualVolume : 0;
  const futureOperatingCost = annualRecurringCost + (futureHumanHours * Number(state.loadedHourlyCost)) + futureErrorCost;
  const costPerTransactionAfter = annualVolume > 0 ? futureOperatingCost / annualVolume : 0;

  const cashFlows = buildCashFlows(oneTimeInvestment, year1Benefit, year1RecurringCost, annualBenefit * availability * stabilizationFactor, annualRecurringCost, analysisYears);
  const npv = calculateNpv(cashFlows, Number(state.discountRatePct) / 100);
  const irr = calculateIrr(cashFlows);

  const warnings = buildWarnings(state, {
    annualVolume,
    automationCoverage,
    futureHumanHours,
    currentManualHours,
    grossHoursSaved,
    annualRecurringCost,
    annualBenefit,
    paybackMonths,
    realization,
    exceptionRate,
    costPerTransactionBefore,
    costPerTransactionAfter,
  });

  const confidence = deriveConfidence(state, warnings.length);
  const sensitivity = withSensitivity ? calculateSensitivity(baseState, scenario) : [];

  return {
    scenario,
    currency,
    state,
    annualVolume,
    currentManualHours,
    futureHumanHours,
    grossHoursSaved,
    realizedHoursSaved,
    annualBenefit,
    annualRecurringCost,
    oneTimeInvestment,
    year1NetBenefit,
    year1RoiPct,
    periodNetBenefit,
    periodRoiPct,
    paybackMonths,
    costPerTransactionBefore,
    costPerTransactionAfter,
    npv,
    irr,
    warnings,
    confidence,
    cashFlows,
    benefitBreakdown: {
      laborSavings: regularLaborSavings,
      overtimeReduction: overtimeReductionValue,
      errorSavings,
      contractorAvoidance: Number(state.contractorAvoidanceAnnual),
      hiringAvoidance: Number(state.hiringAvoidanceAnnual),
      revenueAcceleration: Number(state.revenueAccelerationAnnual),
      otherBenefit: Number(state.otherAnnualBenefit),
    },
    scenarioSnapshot: {
      year1RoiPct,
      periodRoiPct,
      paybackMonths,
      periodNetBenefit,
    },
    sensitivity,
  };
}

function buildCashFlows(oneTimeInvestment, year1Benefit, year1RecurringCost, steadyAnnualBenefit, annualRecurringCost, years) {
  const flows = [-oneTimeInvestment];
  flows.push(year1Benefit - year1RecurringCost);
  for (let year = 2; year <= years; year += 1) {
    flows.push(steadyAnnualBenefit - annualRecurringCost);
  }
  return flows;
}

function calculateNpv(cashFlows, discountRate) {
  return cashFlows.reduce((sum, cf, index) => sum + (cf / Math.pow(1 + discountRate, index)), 0);
}

function calculateIrr(cashFlows) {
  let low = -0.9;
  let high = 5;
  let mid = 0;
  let npvLow = calculateNpv(cashFlows, low);
  let npvHigh = calculateNpv(cashFlows, high);

  if (Math.sign(npvLow) === Math.sign(npvHigh)) return null;

  for (let i = 0; i < 80; i += 1) {
    mid = (low + high) / 2;
    const value = calculateNpv(cashFlows, mid);
    if (Math.abs(value) < 1e-7) return mid;
    if (Math.sign(value) === Math.sign(npvLow)) {
      low = mid;
      npvLow = value;
    } else {
      high = mid;
      npvHigh = value;
    }
  }
  return mid;
}

function buildWarnings(state, metrics) {
  const warnings = [];
  if (metrics.annualVolume <= 0) warnings.push('Annual volume is zero or negative, so the model cannot produce meaningful ROI.');
  if (metrics.automationCoverage < 0.35) warnings.push('Automation coverage is low, so the process may not be a strong RPA candidate yet.');
  if (metrics.exceptionRate > 0.25) warnings.push('Exception rate is high. Unattended ROI may be overstated unless exception handling is reduced.');
  if (metrics.realization < 0.4) warnings.push('Realization factor is low, which means most time savings may become capacity only, not true financial savings.');
  if (metrics.futureHumanHours >= metrics.currentManualHours * 0.75) warnings.push('Post-automation human effort remains high versus today, so the process redesign may need improvement.');
  if (metrics.annualRecurringCost > metrics.annualBenefit * 0.8) warnings.push('Recurring run cost is high relative to benefit. Review license and maintenance assumptions.');
  if (metrics.paybackMonths === null) warnings.push('There is no payback with the current steady-state assumptions.');
  if (metrics.costPerTransactionAfter >= metrics.costPerTransactionBefore) warnings.push('Cost per transaction after automation is not better than the current state.');
  if (Number(state.maintenanceHoursPerMonth) < 2) warnings.push('Maintenance hours look low. Most production automations need ongoing support and change effort.');
  return warnings.length ? warnings : ['No major realism warnings detected from the current assumptions.'];
}

function deriveConfidence(state, warningCount) {
  let score = 100;
  if (Number(state.exceptionRatePct) > 20) score -= 20;
  if (Number(state.realizationFactorPct) < 50) score -= 20;
  if (Number(state.maintenanceHoursPerMonth) < 3) score -= 10;
  if (Number(state.automationCoveragePct) < 50) score -= 10;
  score -= warningCount * 5;

  if (score >= 75) {
    return { label: 'High', className: 'good', explanation: 'Inputs look reasonably balanced and the business case is not relying on one fragile assumption.' };
  }
  if (score >= 50) {
    return { label: 'Medium', className: 'warn', explanation: 'The estimate is usable, but several assumptions should be validated before decision-making.' };
  }
  return { label: 'Low', className: 'bad', explanation: 'The result is highly sensitive to uncertain assumptions or has weak automation economics.' };
}

function calculateSensitivity(baseState, scenario) {
  const inputs = [
    { key: 'manualMinutesPerTransaction', label: 'Manual minutes/transaction' },
    { key: 'loadedHourlyCost', label: 'Loaded hourly cost' },
    { key: 'automationCoveragePct', label: 'Automation coverage %' },
    { key: 'exceptionRatePct', label: 'Exception rate %' },
    { key: 'realizationFactorPct', label: 'Realization factor %' },
    { key: 'annualLicenseCost', label: 'Annual license cost' },
    { key: 'developmentHours', label: 'Development hours' },
    { key: 'maintenanceHoursPerMonth', label: 'Maintenance hrs/month' },
  ];

  const baseResult = computeScenario(baseState, scenario, false);
  const baseRoi = baseResult.periodRoiPct;

  return inputs.map(item => {
    const plusState = { ...baseState, [item.key]: Number(baseState[item.key] || 0) * 1.1 };
    const minusState = { ...baseState, [item.key]: Number(baseState[item.key] || 0) * 0.9 };
    const plusRoi = computeScenario(plusState, scenario, false).periodRoiPct;
    const minusRoi = computeScenario(minusState, scenario, false).periodRoiPct;
    return {
      label: item.label,
      impact: Math.max(Math.abs(plusRoi - baseRoi), Math.abs(minusRoi - baseRoi)),
    };
  }).sort((a, b) => b.impact - a.impact).slice(0, 6);
}

function renderSummary(expected) {
  document.getElementById('year1RoiOutput').textContent = formatPercent(expected.year1RoiPct);
  document.getElementById('periodRoiOutput').textContent = formatPercent(expected.periodRoiPct);
  document.getElementById('paybackOutput').textContent = expected.paybackMonths ? `${expected.paybackMonths.toFixed(1)} months` : 'No payback';
  document.getElementById('npvOutput').textContent = formatCurrency(expected.npv, expected.currency);
}

function renderMetrics(result) {
  const grid = document.getElementById('metricsGrid');
  grid.innerHTML = '';
  metricConfig.forEach(metric => {
    const card = document.createElement('article');
    card.className = 'metric-card';
    const label = document.createElement('span');
    label.textContent = metric.label;
    const value = document.createElement('strong');
    value.textContent = metric.type === 'currency'
      ? formatCurrency(result[metric.key], result.currency)
      : formatNumber(result[metric.key]);
    card.appendChild(label);
    card.appendChild(value);
    grid.appendChild(card);
  });
}

function renderWarnings(warnings) {
  const list = document.getElementById('warningsList');
  list.innerHTML = '';
  warnings.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
}

function renderConfidence(confidence) {
  const box = document.getElementById('confidenceBox');
  box.innerHTML = `
    <span class="confidence-pill ${confidence.className}">${confidence.label}</span>
    <span>${confidence.explanation}</span>
  `;
}

function renderScenarioCompare(expected, conservative, optimistic) {
  const table = document.getElementById('scenarioCompareTable');
  table.innerHTML = `
    <thead>
      <tr>
        <th>Scenario</th>
        <th>Year 1 ROI</th>
        <th>${expected.state.analysisYears}-Year ROI</th>
        <th>Payback</th>
      </tr>
    </thead>
    <tbody>
      ${renderScenarioRow('Conservative', conservative)}
      ${renderScenarioRow('Expected', expected)}
      ${renderScenarioRow('Optimistic', optimistic)}
    </tbody>
  `;
}

function renderScenarioRow(label, item) {
  return `
    <tr>
      <td>${label}</td>
      <td>${formatPercent(item.year1RoiPct)}</td>
      <td>${formatPercent(item.periodRoiPct)}</td>
      <td>${item.paybackMonths ? `${item.paybackMonths.toFixed(1)} mo` : 'No payback'}</td>
    </tr>
  `;
}

function renderCharts(result) {
  renderBenefitChart(result);
  renderCostPerTxChart(result);
  renderCashFlowChart(result);
  renderSensitivityChart(result);
}

function renderBenefitChart(result) {
  const labels = ['Labor', 'Overtime', 'Error', 'Contractor', 'Hiring', 'Revenue', 'Other'];
  const data = [
    result.benefitBreakdown.laborSavings,
    result.benefitBreakdown.overtimeReduction,
    result.benefitBreakdown.errorSavings,
    result.benefitBreakdown.contractorAvoidance,
    result.benefitBreakdown.hiringAvoidance,
    result.benefitBreakdown.revenueAcceleration,
    result.benefitBreakdown.otherBenefit,
  ];
  updateChart('benefitChart', 'doughnut', {
    labels,
    datasets: [{ data }]
  }, {
    plugins: { legend: { position: 'bottom' } }
  });
}

function renderCostPerTxChart(result) {
  updateChart('costPerTxChart', 'bar', {
    labels: ['Before automation', 'After automation'],
    datasets: [{ data: [result.costPerTransactionBefore, result.costPerTransactionAfter] }]
  }, {
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  });
}

function renderCashFlowChart(result) {
  updateChart('cashFlowChart', 'line', {
    labels: result.cashFlows.map((_, idx) => `Year ${idx}`),
    datasets: [{
      data: cumulative(result.cashFlows),
      tension: 0.25,
      fill: false
    }]
  }, {
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: false } }
  });
}

function renderSensitivityChart(result) {
  updateChart('sensitivityChart', 'bar', {
    labels: result.sensitivity.map(x => x.label),
    datasets: [{ data: result.sensitivity.map(x => x.impact) }]
  }, {
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: { x: { beginAtZero: true } }
  });
}

function updateChart(id, type, data, options) {
  const canvas = document.getElementById(id);
  if (!canvas) return;

  if (charts[id]) {
    charts[id].destroy();
    delete charts[id];
  }

  canvas.removeAttribute('width');
  canvas.removeAttribute('height');
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  charts[id] = new Chart(canvas, {
    type,
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 100,
      animation: false,
      ...options
    }
  });
}

function cumulative(values) {
  const output = [];
  let running = 0;
  values.forEach(v => {
    running += v;
    output.push(running);
  });
  return output;
}

function saveScenario() {
  const state = getFormState();
  const result = calculateScenario(state, 'expected');
  const scenarios = getSavedScenarios();
  scenarios.unshift({
    id: cryptoRandomId(),
    savedAt: new Date().toISOString(),
    state,
    result: {
      currency: result.currency,
      year1RoiPct: result.year1RoiPct,
      periodRoiPct: result.periodRoiPct,
      paybackMonths: result.paybackMonths,
      periodNetBenefit: result.periodNetBenefit,
    }
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios.slice(0, 20)));
  renderSavedScenarios();
}

function renderSavedScenarios() {
  const container = document.getElementById('savedScenariosList');
  const scenarios = getSavedScenarios();
  if (!scenarios.length) {
    container.innerHTML = '<div class="empty-state">No scenarios saved yet.</div>';
    return;
  }
  container.innerHTML = '';
  scenarios.forEach(item => {
    const wrapper = document.createElement('article');
    wrapper.className = 'saved-item';
    wrapper.innerHTML = `
      <div class="saved-title-row">
        <div>
          <strong>${escapeHtml(item.state.projectName || 'Untitled scenario')}</strong><br />
          <small>${escapeHtml(item.state.department || 'No department')} · ${new Date(item.savedAt).toLocaleString()}</small>
        </div>
        <small>${item.state.currency} · ${Number(item.state.analysisYears)} year(s)</small>
      </div>
      <div>
        <small>
          Year 1 ROI: ${formatPercent(item.result.year1RoiPct)} ·
          Period ROI: ${formatPercent(item.result.periodRoiPct)} ·
          Payback: ${item.result.paybackMonths ? `${item.result.paybackMonths.toFixed(1)} months` : 'No payback'}
        </small>
      </div>
      <div class="saved-actions">
        <button type="button" data-action="load" data-id="${item.id}">Load</button>
        <button type="button" class="ghost-button" data-action="share" data-id="${item.id}">Copy link</button>
        <button type="button" class="ghost-button" data-action="delete" data-id="${item.id}">Delete</button>
      </div>
    `;
    container.appendChild(wrapper);
  });

  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const { action, id } = btn.dataset;
      if (action === 'load') {
        const scenario = getSavedScenarios().find(x => x.id === id);
        if (!scenario) return;
        populateForm(scenario.state);
        calculateAndRender();
      } else if (action === 'share') {
        const scenario = getSavedScenarios().find(x => x.id === id);
        if (!scenario) return;
        copyStateLink(scenario.state);
      } else if (action === 'delete') {
        const updated = getSavedScenarios().filter(x => x.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        renderSavedScenarios();
      }
    });
  });
}

function getSavedScenarios() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function exportJson() {
  const state = getFormState();
  downloadFile(
    `${safeFileName(state.projectName || 'rpa-roi')}-assumptions.json`,
    'application/json',
    JSON.stringify(state, null, 2)
  );
}

function exportCsv() {
  const state = getFormState();
  const rows = [['field', 'value']];
  Object.entries(state).forEach(([key, value]) => rows.push([key, String(value)]));
  const csv = rows.map(row => row.map(csvCell).join(',')).join('\n');
  downloadFile(`${safeFileName(state.projectName || 'rpa-roi')}-assumptions.csv`, 'text/csv', csv);
}

function exportPdf() {
  const element = document.getElementById('resultsArea');
  const project = getFormState().projectName || 'rpa-roi-results';
  window.html2pdf().set({
    margin: 0.35,
    filename: `${safeFileName(project)}-results.pdf`,
    image: { type: 'jpeg', quality: 0.96 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  }).from(element).save();
}

function copyShareLink() {
  copyStateLink(getFormState());
}

function copyStateLink(state) {
  const url = `${location.origin}${location.pathname}#data=${encodeState(state)}`;
  navigator.clipboard.writeText(url).then(() => {
    alert('Share link copied.');
  }).catch(() => {
    prompt('Copy this share link:', url);
  });
}

function encodeState(state) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
}

function decodeStateFromUrl() {
  try {
    const hash = location.hash || '';
    if (!hash.startsWith('#data=')) return null;
    const payload = hash.replace('#data=', '');
    return JSON.parse(decodeURIComponent(escape(atob(payload))));
  } catch {
    return null;
  }
}

function downloadFile(fileName, mimeType, content) {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

function formatCurrency(value, currency) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatNumber(value) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  }).format(Number(value || 0));
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

function csvCell(value) {
  const text = String(value ?? '');
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function safeFileName(value) {
  return String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'file';
}

function cryptoRandomId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value)));
}

function escapeHtml(text) {
  return String(text ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
