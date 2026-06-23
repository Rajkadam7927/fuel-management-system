'use strict';

const STORE = {
  users: 'fms_users_v3',
  session: 'fms_session_v3',
  entries: 'fms_entries_v3',
  settings: 'fms_settings_v3',
  audit: 'fms_audit_v3',
  masters: 'fms_masters_v3',
  sheetConnection: 'fms_sheet_connection_cache_v3'
};

const state = {
  users: [],
  entries: [],
  audit: [],
  settings: {},
  masters: {},
  user: null,
  page: 'dashboard'
};

const $ = (id) => document.getElementById(id);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
let lastVehicleNotice = '';
let vehicleLookupToken = 0;

const ICONS = {
  dashboard: '<svg viewBox="0 0 24 24"><path d="M4 13h7V4H4v9Zm0 7h7v-5H4v5Zm9 0h7v-9h-7v9Zm0-16v5h7V4h-7Z"/></svg>',
  fuel: '<svg viewBox="0 0 24 24"><path d="M6 2h9a2 2 0 0 1 2 2v16H4V4a2 2 0 0 1 2-2Zm1 3v5h7V5H7Zm11 2 3 3v8a2 2 0 1 1-4 0V8h1Z"/></svg>',
  approve: '<svg viewBox="0 0 24 24"><path d="m9 16.2-3.5-3.5L4 14.2l5 5L20 8.2 18.5 7 9 16.2Z"/></svg>',
  entries: '<svg viewBox="0 0 24 24"><path d="M5 4h14v2H5V4Zm0 5h14v2H5V9Zm0 5h14v2H5v-2Zm0 5h10v2H5v-2Z"/></svg>',
  vendor: '<svg viewBox="0 0 24 24"><path d="M4 4h16l1 6H3l1-6Zm1 8h14v8H5v-8Zm3 2v4h3v-4H8Z"/></svg>',
  card: '<svg viewBox="0 0 24 24"><path d="M3 6h18v12H3V6Zm2 3v2h14V9H5Zm0 5v2h6v-2H5Z"/></svg>',
  vehicle: '<svg viewBox="0 0 24 24"><path d="M6 6h10l3 5v6h-2a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H3v-6l3-5Zm1 2-2 3h12l-2-3H7Z"/></svg>',
  driver: '<svg viewBox="0 0 24 24"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 8a8 8 0 0 1 16 0H4Z"/></svg>',
  location: '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Zm0 9.5A2.5 2.5 0 1 0 12 6a2.5 2.5 0 0 0 0 5.5Z"/></svg>',
  types: '<svg viewBox="0 0 24 24"><path d="M4 5h7v7H4V5Zm9 0h7v7h-7V5ZM4 14h7v5H4v-5Zm9 0h7v5h-7v-5Z"/></svg>',
  report: '<svg viewBox="0 0 24 24"><path d="M5 3h14v18H5V3Zm3 4v2h8V7H8Zm0 4v2h8v-2H8Zm0 4v2h5v-2H8Z"/></svg>',
  map: '<svg viewBox="0 0 24 24"><path d="m9 4 6 2 5-2v16l-5 2-6-2-5 2V6l5-2Zm1 2.3v11.4l4 1.3V7.6l-4-1.3Z"/></svg>',
  mileage: '<svg viewBox="0 0 24 24"><path d="M12 4a9 9 0 0 1 9 9c0 2.4-.9 4.6-2.4 6.2H5.4A9 9 0 0 1 12 4Zm0 3a1 1 0 0 0-1 1v5.3l4.2 2.5 1-1.7-3.2-1.9V8a1 1 0 0 0-1-1Z"/></svg>',
  alert: '<svg viewBox="0 0 24 24"><path d="M12 2 1 21h22L12 2Zm1 15h-2v2h2v-2Zm0-7h-2v5h2v-5Z"/></svg>',
  users: '<svg viewBox="0 0 24 24"><path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 21a7 7 0 0 1 14 0H2Zm13.5-6a5.5 5.5 0 0 1 6.5 6h-4.2a8.7 8.7 0 0 0-2.3-6Z"/></svg>',
  settings: '<svg viewBox="0 0 24 24"><path d="M19.4 13.5c.1-.5.1-1 .1-1.5s0-1-.1-1.5l2-1.5-2-3.5-2.4 1a8 8 0 0 0-2.6-1.5L14 2h-4l-.4 2.5A8 8 0 0 0 7 6L4.6 5l-2 3.5 2 1.5a9.8 9.8 0 0 0 0 3l-2 1.5 2 3.5L7 18a8 8 0 0 0 2.6 1.5L10 22h4l.4-2.5A8 8 0 0 0 17 18l2.4 1 2-3.5-2-1.5ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z"/></svg>',
  audit: '<svg viewBox="0 0 24 24"><path d="M4 3h16v18H4V3Zm4 4v2h8V7H8Zm0 4v2h8v-2H8Zm0 4v2h5v-2H8Z"/></svg>'
};

const seededVehicles = ['MH14CL1050','MH02CE9719','MH04FK2543','MH04GP0255','MH04JU4253','MH04JU8167','MH12FC9641','MH12HB9040','MH12KQ5454','MH12SF9987','MH14CL0530','MH14CL0562','MH14CL0616','MH14CL0636','MH14CL0739','MH14CL0783','MH14CL0802','MH14CL0817','MH14CL0870','MH14CL0911','MH14CL0959','MH14CL1051','MH14CL1123','MH14CL1205','MH14CL1225','MH14CL1270','MH14CL1320','MH46AH7272','MH48K0195','RJ12PA7977'];
const seededPilots = ['Ajay Patil','Abhijeet Rawool','Ajay Pawar','Akash Himborade','Amol Bangar','Anil Gaikwad','Arun Dhumal','Dinesh Pawar','Ganesh Chavan','Hitesh Patil','Kishor Sutar','Mahesh Vaykule','Nilesh Gare','Pravin Kolekar','Rohit Sonawane','Sachin Raut','Sandeep Jadhav','Santosh Harad','Satish Yadav','Sunil Chavan','Tushar Yenpure','Vijay Wagh','Vishal Kadam','Yogesh Desale'];
const seededLocations = ['Alandi Rural Hospital','Aundh District Hospital','Baramati Rural Hospital','Bhor Rural Hospital','Chakan Rural Hospital','Daund Sub District Hospital','Indapur Sub District Hospital','Junnar Rural Hospital','Kalwa Chatrapati Shivaji Hospital','Manchar Sub District Hospital','Pimpri YCM Hospital','Rajgurunagar Rural Hospital','Saswad Rural Hospital','Shahapur Sub District Hospital','Shirur Rural Hospital','Thane District Hospital','Ulhasnagar Central Hospital','Vadgaon Maval Rural Hospital'];

document.addEventListener('DOMContentLoaded', init);

async function init() {
  loadState();
  await ensureDefaultUsers();
  wireEvents();
  fillMasterControls();
  updateClock();
  setInterval(updateClock, 60000);
  const remembered = localStorage.getItem('fms_remember_user');
  if (remembered) {
    $('loginUser').value = remembered;
    $('rememberMe').checked = true;
  }
  const saved = sessionStorage.getItem(STORE.session);
  if (saved) {
    const session = safeJson(saved, null);
    state.user = state.users.find((u) => u.username === session?.username && u.active !== false) || null;
  }
  state.user ? showApp() : showLogin();
}

function loadState() {
  state.users = safeJson(localStorage.getItem(STORE.users), []);
  state.entries = safeJson(localStorage.getItem(STORE.entries), []);
  state.audit = safeJson(localStorage.getItem(STORE.audit), []);
  state.settings = {
    googleScriptUrl: APP_CONFIG.googleScriptUrl || '',
    globalGoogleScriptUrl: '',
    monthlyBudget: 2500000,
    lowMileageLimit: 8,
    lastSyncTime: '',
    lastSyncError: '',
    lastConnectionCheck: '',
    sheetConnected: false,
    googleScriptOverride: false,
    ...safeJson(localStorage.getItem(STORE.settings), {})
  };
  const cachedConnection = safeJson(localStorage.getItem(STORE.sheetConnection), null);
  if (!APP_CONFIG.googleScriptUrl && cachedConnection?.googleScriptUrl && !state.settings.globalGoogleScriptUrl) state.settings.globalGoogleScriptUrl = cachedConnection.googleScriptUrl;
  if (cachedConnection?.lastSyncTime && !state.settings.lastSyncTime) state.settings.lastSyncTime = cachedConnection.lastSyncTime;
  state.masters = {
    districts: [...APP_CONFIG.defaults.districts],
    clusters: [...APP_CONFIG.defaults.clusters],
    vendors: APP_CONFIG.defaults.vendors.map((name, i) => ({ id: uid(), name, contact: '', district: APP_CONFIG.defaults.districts[i % APP_CONFIG.defaults.districts.length], active: true })),
    cards: seededVehicles.slice(0, 10).map((vehicle, i) => ({ id: uid(), cardNo: 'FUEL-' + String(1000 + i), vehicle, vendor: APP_CONFIG.defaults.vendors[i % APP_CONFIG.defaults.vendors.length], limit: 60000, status: 'Active' })),
    vehicles: seededVehicles.map((number, i) => ({ id: uid(), number, type: APP_CONFIG.defaults.vehicleTypes[i % APP_CONFIG.defaults.vehicleTypes.length], district: APP_CONFIG.defaults.districts[i % APP_CONFIG.defaults.districts.length], location: seededLocations[i % seededLocations.length], status: 'Active' })),
    drivers: seededPilots.map((name, i) => ({ id: uid(), name, mobile: '9' + String(800000000 + i * 7911).slice(0, 9), pilotId: 'PIL' + String(1000 + i), district: APP_CONFIG.defaults.districts[i % APP_CONFIG.defaults.districts.length], status: 'Active' })),
    locations: seededLocations.map((name, i) => ({ id: uid(), name, district: APP_CONFIG.defaults.districts[i % APP_CONFIG.defaults.districts.length], cluster: APP_CONFIG.defaults.clusters[i % APP_CONFIG.defaults.clusters.length], adm: '', dm: '' })),
    vehicleTypes: APP_CONFIG.defaults.vehicleTypes.map((name, i) => ({ id: uid(), name, fuel: i === 2 ? 'PETROL' : 'DIESEL', mileageTarget: i === 1 ? 7 : 10, active: true })),
    ...safeJson(localStorage.getItem(STORE.masters), {})
  };
  saveMasters();
}

async function ensureDefaultUsers() {
  if (state.users.length) return;
  const defaults = [
    ['superadmin', 'ef6129290c7d371da2598cd4c1e9725514397d18ebabca118c206df1ec6c5a11', 'SuperAdmin', 'Super Admin', 'Pune'],
    ['admin', 'a36aef5a11c4073fbe60314fc9df530a9d5f986533594d1f5190742ff9e0e408', 'Admin', 'District Admin', 'Pune'],
    ['operator', 'e5acb4dbf79bf17638db57ab11b92fee8f8047b07c67b3896a8f1af80aafde3f', 'Operator', 'Fuel Operator', 'Pune'],
    ['viewer', '16a6746ed035d9b663c14e17b003df87a475237ac1a1b7806aba0144d8065f69', 'Viewer', 'Report Viewer', '']
  ];
  for (const [username, passwordHash, role, name, district] of defaults) {
    state.users.push({ id: uid(), username, passwordHash, role, name, district, active: true, createdAt: nowIso() });
  }
  saveUsers();
}

function wireEvents() {
  $('loginForm').addEventListener('submit', login);
  $('togglePassword').addEventListener('click', () => {
    const input = $('loginPass');
    input.type = input.type === 'password' ? 'text' : 'password';
    $('togglePassword').textContent = input.type === 'password' ? 'Show' : 'Hide';
  });
  $('forgotPassword').addEventListener('click', () => toast('Please contact your Super Admin for account access assistance.', 'info'));
  $('logoutBtn').addEventListener('click', logout);
  $('menuToggle').addEventListener('click', () => $('sidebar').classList.toggle('open'));
  document.body.addEventListener('click', (event) => {
    const nav = event.target.closest('[data-nav]');
    if (nav) showPage(nav.dataset.nav);
    const action = event.target.closest('[data-action]');
    if (action) runAction(action.dataset.action, action.dataset.id || '', action.dataset.kind || '');
  });
  ['price','volume','currentKm','previousKm'].forEach((id) => $(id).addEventListener('input', calculateFuel));
  $('vehicleNumber').addEventListener('input', autofillVehicle);
  $('vehicleNumber').addEventListener('change', autofillVehicle);
  $('fuelEntryForm').addEventListener('submit', (event) => {
    event.preventDefault();
    saveEntry(false);
  });
  $('saveSyncEntryBtn').addEventListener('click', () => saveEntry(true));
  $('resetEntryBtn').addEventListener('click', resetEntryForm);
  $('entrySearch').addEventListener('input', renderEntries);
  $('entryDistrictFilter').addEventListener('change', renderEntries);
  $('refreshDashboardBtn').addEventListener('click', renderDashboard);
  $('dashboardDate').addEventListener('change', renderDashboard);
  $('dashboardDistrict').addEventListener('change', renderDashboard);
  $('dashboardCluster').addEventListener('change', renderDashboard);
  $('refreshCentralDataBtn').addEventListener('click', () => loadCentralData({ showToast: true, reason: 'manual' }));
  $('exportEntriesBtn').addEventListener('click', () => exportRows('fuel-entries', entriesForUser()));
  $('printEntriesBtn').addEventListener('click', () => window.print());
  $('saveSettingsBtn').addEventListener('click', saveSettings);
  $('testConnectionBtn').addEventListener('click', testSheetConnection);
  $('removeConnectionBtn').addEventListener('click', removeSheetConnection);
  $('syncAllBtn').addEventListener('click', () => syncPendingEntries(true));
  $('backupBtn').addEventListener('click', backupJson);
  $('restoreBtn').addEventListener('click', () => $('restoreFile').click());
  $('restoreFile').addEventListener('change', restoreJson);
  $('clearAuditBtn').addEventListener('click', clearAudit);
  setInterval(() => syncPendingEntries(false), 60000);
  setInterval(() => loadCentralData({ showToast: false, reason: 'auto' }), 120000);
}

async function login(event) {
  event.preventDefault();
  const username = $('loginUser').value.trim().toLowerCase();
  const password = $('loginPass').value;
  const hash = await sha256(password);
  const user = state.users.find((u) => u.username === username && u.passwordHash === hash && u.active !== false);
  if (!user) {
    $('loginError').textContent = 'Invalid access details.';
    $('loginError').classList.remove('hidden');
    $('loginForm').classList.remove('shake');
    void $('loginForm').offsetWidth;
    $('loginForm').classList.add('shake');
    return;
  }
  $('loginError').classList.add('hidden');
  state.user = user;
  sessionStorage.setItem(STORE.session, JSON.stringify({ username: user.username, role: user.role }));
  $('rememberMe').checked ? localStorage.setItem('fms_remember_user', username) : localStorage.removeItem('fms_remember_user');
  audit('Login', 'User signed in');
  await showApp();
}

function logout() {
  audit('Logout', 'User signed out');
  state.user = null;
  sessionStorage.removeItem(STORE.session);
  showLogin();
}

function showLogin() {
  $('loginScreen').classList.remove('hidden');
  $('appShell').classList.add('hidden');
}

async function showApp() {
  $('loginScreen').classList.add('hidden');
  $('appShell').classList.remove('hidden');
  buildNav();
  updateUserChrome();
  await refreshGlobalSheetConnection();
  await loadCentralData({ showToast: true, reason: 'login' });
  await syncPendingEntries(false);
  showPage('dashboard');
}

function buildNav() {
  const allowed = permissions().pages;
  $('navMenu').innerHTML = APP_CONFIG.navMenu.map((section) => {
    const items = section.items.filter((item) => allowed.includes(item.page));
    if (!items.length) return '';
    return `<div class="nav-section"><span>${section.section}</span>${items.map((item) => `<button id="nav-${item.page}" type="button" data-nav="${item.page}" class="nav-item">${ICONS[item.icon] || ''}<span>${item.label}</span></button>`).join('')}</div>`;
  }).join('');
}

function showPage(page) {
  if (!canAccess(page)) {
    toast('Access denied for your role.', 'danger');
    return;
  }
  state.page = page;
  $$('.page').forEach((el) => el.classList.remove('active'));
  $$('.nav-item').forEach((el) => el.classList.remove('active'));
  $('page-' + page)?.classList.add('active');
  $('nav-' + page)?.classList.add('active');
  $('pageTitle').textContent = titleFor(page);
  $('sidebar').classList.remove('open');
  renderPage(page);
}

function renderPage(page) {
  if (page === 'dashboard') renderDashboard();
  if (page === 'fuel-entry') prepareEntryPage();
  if (page === 'fuel-approval') renderApprovals();
  if (page === 'fuel-entries') renderEntries();
  if (page === 'fuel-vendors') renderCrud('fuelVendorsCrud', 'vendors');
  if (page === 'fuel-cards') renderCrud('fuelCardsCrud', 'cards');
  if (page === 'vehicles') renderCrud('vehiclesCrud', 'vehicles');
  if (page === 'drivers') renderCrud('driversCrud', 'drivers');
  if (page === 'base-locations') renderCrud('baseLocationsCrud', 'locations');
  if (page === 'vehicle-types') renderCrud('vehicleTypesCrud', 'vehicleTypes');
  if (page.endsWith('-report')) renderReport(page);
  if (page === 'users') renderUsers();
  if (page === 'settings') renderSettings();
  if (page === 'audit-log') renderAudit();
}

function prepareEntryPage() {
  resetEntryForm();
  $('fuelDate').value = today();
  $('callingDate').value = today();
}

function updateUserChrome() {
  const user = state.user;
  const initials = (user.name || user.username).split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  $('userAvatar').textContent = initials;
  $('userInfoName').textContent = user.name || user.username;
  $('userInfoRole').textContent = user.role;
  $('sidebarUserName').textContent = user.name || user.username;
  $('sidebarUserRole').textContent = user.role + (user.district ? ' / ' + user.district : '');
  updateSheetStatus();
}

function fillMasterControls() {
  optionize('vendor', vendors(), 'name', 'name');
  optionize('fuelProduct', APP_CONFIG.defaults.products);
  optionize('district', state.masters.districts);
  optionize('cluster', state.masters.clusters);
  optionize('entryDistrictFilter', ['All Districts', ...state.masters.districts]);
  optionize('dashboardDistrict', ['All Districts', ...state.masters.districts]);
  optionize('dashboardCluster', ['All Clusters', ...state.masters.clusters]);
  optionize('newRole', APP_CONFIG.roles);
  optionize('newDistrict', ['All Districts', ...state.masters.districts]);
  $('vehicleList').innerHTML = state.masters.vehicles.map((v) => `<option value="${escapeHtml(v.number)}"></option>`).join('');
  $('pilotList').innerHTML = state.masters.drivers.map((d) => `<option value="${escapeHtml(d.name)}"></option>`).join('');
  $('baseLocationList').innerHTML = state.masters.locations.map((l) => `<option value="${escapeHtml(l.name)}"></option>`).join('');
}

function calculateFuel() {
  const price = number('price');
  const volume = number('volume');
  const current = number('currentKm');
  const previous = number('previousKm');
  $('amount').value = price && volume ? (price * volume).toFixed(2) : '';
  const total = current > previous ? current - previous : 0;
  $('totalKm').value = total || '';
  $('mileage').value = total && volume ? (total / volume).toFixed(2) : '';
  updateVehicleInfoPanel();
}

function autofillVehicle(event) {
  const vehicle = $('vehicleNumber').value.trim();
  const lookupToken = ++vehicleLookupToken;
  resetVehicleAutofillFields();
  if (!vehicle) {
    updateVehicleInfoPanel();
    return;
  }
  const master = vehicleMaster(vehicle);
  const location = master ? baseLocationMaster(master.location) : null;
  if (master) {
    $('vehicleType').value = master.type || '';
    $('district').value = master.district || $('district').value;
    $('baseLocation').value = master.location || '';
    $('cluster').value = location?.cluster || $('cluster').value;
    $('adm').value = location?.adm || '';
    $('dm').value = location?.dm || '';
    lockVehicleMasterFields(true);
  } else {
    lockVehicleMasterFields(false);
  }
  const cardInfo = fuelCardInfo(vehicle);
  fillFuelCardFields(cardInfo);
  const last = latestVehicleEntry(vehicle, $('editEntryId').value);
  const knownVehicle = !!master || cardInfo.assigned || state.entries.some((entry) => String(entry.vehicleNumber || '').toLowerCase() === vehicle.toLowerCase());
  const shouldNotify = event?.type === 'change' || knownVehicle;
  if (last) {
    $('previousKm').value = last.currentKm || '';
    $('pilotName').value = last.pilotName || '';
    $('pilotMobile').value = last.pilotMobile || '';
    $('pilotId').value = last.pilotId || '';
    if (!master) {
      $('district').value = last.district || $('district').value;
      $('cluster').value = last.cluster || $('cluster').value;
      $('baseLocation').value = last.baseLocation || '';
      $('adm').value = last.adm || '';
      $('dm').value = last.dm || '';
    }
    calculateFuel();
    notifyVehicleAutofill(vehicle, 'Vehicle details auto-filled from the latest entry.', 'success', shouldNotify);
  } else {
    $('previousKm').value = '';
    calculateFuel();
    notifyVehicleAutofill(vehicle, 'No previous fuel entry found for this vehicle.', 'info', shouldNotify);
  }
  updateVehicleInfoPanel({ vehicle, master, location, cardInfo, last });
  hydrateVehicleFromSheet(vehicle, event, lookupToken);
}

async function hydrateVehicleFromSheet(vehicle, event, lookupToken) {
  const url = sheetUrl();
  if (!url) return;
  try {
    const result = await postToSheet(url, { action: 'getVehicleDetails', vehicleNumber: vehicle, sheet: APP_CONFIG.googleSheetName });
    if (lookupToken !== vehicleLookupToken || $('vehicleNumber').value.trim().toLowerCase() !== vehicle.toLowerCase()) return;
    if (result.status && !['success', 'ok'].includes(String(result.status).toLowerCase())) return;
    const remoteMaster = vehicleMasterFromSheet(result.vehicle);
    const remoteLocation = vehicleLocationFromSheet(result.vehicle);
    const remoteCardInfo = fuelCardInfoFromSheet(result.fuelCard, result.budget);
    const remoteLast = result.lastEntry || null;
    if (remoteMaster) {
      $('vehicleType').value = remoteMaster.type || '';
      $('district').value = remoteMaster.district || '';
      $('baseLocation').value = remoteMaster.location || '';
      $('cluster').value = remoteLocation?.cluster || '';
      $('adm').value = remoteLocation?.adm || '';
      $('dm').value = remoteLocation?.dm || '';
      lockVehicleMasterFields(true);
    }
    if (remoteCardInfo) fillFuelCardFields(remoteCardInfo);
    if (remoteLast) {
      $('previousKm').value = remoteLast.currentKm || '';
      calculateFuel();
      notifyVehicleAutofill(vehicle, 'Vehicle details auto-filled from Google Sheet master data.', 'success', event?.type === 'change');
    } else if (event?.type === 'change') {
      notifyVehicleAutofill(vehicle, 'No previous fuel entry found for this vehicle.', 'info', true);
    }
    updateVehicleInfoPanel({ vehicle, master: remoteMaster || vehicleMaster(vehicle), location: remoteLocation, cardInfo: remoteCardInfo || fuelCardInfo(vehicle), last: remoteLast || latestVehicleEntry(vehicle, $('editEntryId').value) });
  } catch (error) {
    updateVehicleInfoPanel();
  }
}

function notifyVehicleAutofill(vehicle, message, type, shouldNotify) {
  const key = `${vehicle}|${message}`;
  if (!shouldNotify || lastVehicleNotice === key) return;
  lastVehicleNotice = key;
  toast(message, type);
}

function resetVehicleAutofillFields() {
  ['vehicleType','baseLocation','adm','dm','pilotName','pilotMobile','pilotId','previousKm','fuelCardNumber','fuelCardVendor','fuelCardMonthlyBudget','fuelCardUsedBudget','fuelCardRemainingBudget','fuelCardBudgetStatus'].forEach((id) => {
    if ($(id)) $(id).value = '';
  });
  ['district','cluster'].forEach((id) => { if ($(id)) $(id).value = ''; });
  lockVehicleMasterFields(false);
}

function lockVehicleMasterFields(locked) {
  ['district','cluster'].forEach((id) => { if ($(id)) $(id).disabled = locked; });
  ['vehicleType','baseLocation','adm','dm'].forEach((id) => { if ($(id)) $(id).readOnly = locked; });
}

function vehicleMaster(vehicle) {
  const selected = String(vehicle || '').trim().toLowerCase();
  return state.masters.vehicles.find((v) => String(v.number || '').toLowerCase() === selected);
}

function baseLocationMaster(locationName) {
  const selected = String(locationName || '').trim().toLowerCase();
  return state.masters.locations.find((l) => String(l.name || '').toLowerCase() === selected);
}

function assignedFuelCard(vehicle) {
  const selected = String(vehicle || '').trim().toLowerCase();
  return state.masters.cards.find((card) => String(card.vehicle || '').toLowerCase() === selected && String(card.status || 'Active').toLowerCase() !== 'inactive');
}

function fuelCardInfo(vehicle) {
  const card = assignedFuelCard(vehicle);
  if (!card) return { assigned: false, cardNo: 'No Fuel Card Assigned', vendor: '-', monthlyBudget: 0, usedBudget: 0, remainingBudget: 0, status: 'No Fuel Card Assigned', tone: 'gray' };
  const monthlyBudget = Number(card.limit || card.monthlyBudget || 0);
  const month = today().slice(0, 7);
  const usedBudget = entriesForUser().filter((entry) => String(entry.vehicleNumber || '').toLowerCase() === String(vehicle || '').toLowerCase() && String(entry.fuelDate || '').slice(0, 7) === month).reduce((total, entry) => total + (Number(entry.amount) || 0), 0);
  const remainingBudget = Math.max(0, monthlyBudget - usedBudget);
  const pct = monthlyBudget ? (remainingBudget / monthlyBudget) * 100 : 0;
  const tone = monthlyBudget ? (pct > 25 ? 'green' : pct >= 10 ? 'orange' : 'red') : 'gray';
  const status = monthlyBudget ? (tone === 'green' ? 'Healthy' : tone === 'orange' ? 'Watch' : 'Critical') : 'No Budget';
  return { assigned: true, cardNo: card.cardNo || '-', vendor: card.vendor || '-', monthlyBudget, usedBudget, remainingBudget, status, tone };
}

function vehicleMasterFromSheet(vehicle) {
  if (!vehicle) return null;
  return {
    number: vehicle.vehicleNumber || vehicle.number || '',
    type: vehicle.vehicleType || vehicle.type || '',
    location: vehicle.baseLocation || vehicle.location || '',
    district: vehicle.district || '',
    status: vehicle.status || ''
  };
}

function vehicleLocationFromSheet(vehicle) {
  if (!vehicle) return null;
  return { name: vehicle.baseLocation || '', cluster: vehicle.cluster || '', adm: vehicle.adm || '', dm: vehicle.dm || '' };
}

function fuelCardInfoFromSheet(card, budget) {
  if (!card && !budget?.assigned) return null;
  if (!card) return { assigned: false, cardNo: 'No Fuel Card Assigned', vendor: '-', monthlyBudget: 0, usedBudget: 0, remainingBudget: 0, status: 'No Fuel Card Assigned', tone: 'gray' };
  const monthlyBudget = Number(budget?.monthlyBudget ?? card.monthlyBudget ?? card.limit ?? 0);
  const usedBudget = Number(budget?.usedBudget ?? 0);
  const remainingBudget = Number(budget?.remainingBudget ?? Math.max(0, monthlyBudget - usedBudget));
  return {
    assigned: true,
    cardNo: card.fuelCardNumber || card.cardNo || '-',
    vendor: card.vendor || '-',
    monthlyBudget,
    usedBudget,
    remainingBudget,
    status: budget?.status || 'Healthy',
    tone: budget?.tone || 'green'
  };
}

function fillFuelCardFields(info) {
  $('fuelCardNumber').value = info.cardNo || '';
  $('fuelCardVendor').value = info.vendor || '';
  $('fuelCardMonthlyBudget').value = info.assigned ? 'INR ' + money(info.monthlyBudget) : '';
  $('fuelCardUsedBudget').value = info.assigned ? 'INR ' + money(info.usedBudget) : '';
  $('fuelCardRemainingBudget').value = info.assigned ? 'INR ' + money(info.remainingBudget) : '';
  $('fuelCardBudgetStatus').value = info.status || '';
}

function latestVehicleEntry(vehicle, excludeId = '') {
  const selected = String(vehicle || '').trim().toLowerCase();
  return state.entries
    .filter((entry) => String(entry.vehicleNumber || '').toLowerCase() === selected && entry.id !== excludeId && Number(entry.currentKm))
    .sort((a, b) => vehicleEntrySortValue(b) - vehicleEntrySortValue(a))[0] || null;
}

function vehicleEntrySortValue(entry) {
  if (entry.updatedAt || entry.createdAt) return new Date(entry.updatedAt || entry.createdAt).getTime();
  const dateKey = plainDate(entry.fuelDate);
  return dateKey ? Number(dateKey.replace(/-/g, '')) : 0;
}

function updateVehicleInfoPanel(snapshot = {}) {
  const panel = $('vehicleInfoPanel');
  if (!panel) return;
  const vehicle = snapshot.vehicle || $('vehicleNumber').value.trim();
  if (!vehicle) {
    panel.innerHTML = '<div class="vehicle-info-empty">Select a vehicle to view master, fuel card, and last fuel details.</div>';
    return;
  }
  const master = snapshot.master || vehicleMaster(vehicle);
  const location = snapshot.location || (master ? baseLocationMaster(master.location) : null);
  const cardInfo = snapshot.cardInfo || fuelCardInfo(vehicle);
  const last = Object.prototype.hasOwnProperty.call(snapshot, 'last') ? snapshot.last : latestVehicleEntry(vehicle, $('editEntryId').value);
  const values = [
    ['Vehicle Number', vehicle.toUpperCase()],
    ['Vehicle Type', master?.type || '-'],
    ['Base Location', master?.location || '-'],
    ['District', master?.district || '-'],
    ['Cluster', location?.cluster || $('cluster').value || '-'],
    ['ADM', location?.adm || $('adm').value || '-'],
    ['DM', location?.dm || $('dm').value || '-'],
    ['Fuel Card Number', cardInfo.cardNo || '-'],
    ['Fuel Card Vendor', cardInfo.vendor || '-'],
    ['Monthly Budget', cardInfo.assigned ? 'INR ' + money(cardInfo.monthlyBudget) : '-'],
    ['Used Budget', cardInfo.assigned ? 'INR ' + money(cardInfo.usedBudget) : '-'],
    ['Remaining Budget', cardInfo.assigned ? 'INR ' + money(cardInfo.remainingBudget) : '-'],
    ['Last Fuel Date', last?.fuelDate ? dateIn(last.fuelDate) : '-'],
    ['Last Fuel Volume', last?.volume ? litre(last.volume) : '-'],
    ['Last Current KM', last?.currentKm ? Number(last.currentKm).toLocaleString('en-IN') : '-']
  ];
  panel.innerHTML = `<div class="vehicle-info-head"><h4>Vehicle Information</h4><span class="budget-status ${cardInfo.tone || 'gray'}">${escapeHtml(cardInfo.status || 'No Fuel Card Assigned')}</span></div><div class="vehicle-info-grid">${values.map(([label, value]) => `<div class="vehicle-info-item"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`).join('')}</div>`;
}

async function saveEntry(syncAfter) {
  if (!permissions().canCreate) return toast('Your role cannot create fuel entries.', 'danger');
  calculateFuel();
  const required = ['fuelDate','callingDate','vehicleNumber','vendor','fuelProduct','price','volume','amount','district'];
  const missing = required.filter((id) => !String($(id).value || '').trim());
  if (missing.length) return toast('Please complete all required fuel fields.', 'danger');
  const current = number('currentKm');
  const previous = number('previousKm');
  if (current && previous && current <= previous) return toast('Current KM must be greater than Previous KM.', 'danger');
  const id = $('editEntryId').value || uid();
  const entry = {
    id,
    fuelDate: $('fuelDate').value,
    callingDate: $('callingDate').value,
    vehicleNumber: $('vehicleNumber').value.trim().toUpperCase(),
    pilotName: $('pilotName').value.trim(),
    pilotMobile: $('pilotMobile').value.trim(),
    pilotId: $('pilotId').value.trim(),
    vendor: $('vendor').value,
    fuelProduct: $('fuelProduct').value,
    vehicleType: $('vehicleType').value,
    price: number('price'),
    volume: number('volume'),
    amount: number('amount'),
    currentKm: number('currentKm'),
    previousKm: number('previousKm'),
    totalKm: number('totalKm'),
    mileage: number('mileage'),
    district: $('district').value,
    cluster: $('cluster').value,
    baseLocation: $('baseLocation').value.trim(),
    adm: $('adm').value.trim(),
    dm: $('dm').value.trim(),
    fuelCardNumber: $('fuelCardNumber').value,
    fuelCardVendor: $('fuelCardVendor').value,
    fuelCardMonthlyBudget: $('fuelCardMonthlyBudget').value,
    fuelCardUsedBudget: $('fuelCardUsedBudget').value,
    fuelCardRemainingBudget: $('fuelCardRemainingBudget').value,
    fuelCardBudgetStatus: $('fuelCardBudgetStatus').value,
    remarks: $('remarks').value.trim(),
    status: permissions().canApprove ? 'Approved' : 'Pending',
    syncStatus: 'Pending Sync',
    syncedAt: '',
    syncError: '',
    createdBy: state.user.username,
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
  const existing = state.entries.findIndex((item) => item.id === id);
  if (existing >= 0) state.entries[existing] = { ...state.entries[existing], ...entry, createdAt: state.entries[existing].createdAt || entry.createdAt };
  else state.entries.push(entry);
  saveEntries();
  audit(existing >= 0 ? 'Updated fuel entry' : 'Created fuel entry', entry.vehicleNumber + ' / INR ' + money(entry.amount));
  const synced = await syncEntryToSheet(state.entries.find((item) => item.id === id), { silent: true });
  toast(synced ? 'Fuel entry saved and synced successfully.' : 'Saved locally. Sync pending.', synced ? 'success' : 'warning');
  resetEntryForm();
  showPage('fuel-entries');
}

function resetEntryForm() {
  lockVehicleMasterFields(false);
  $('fuelEntryForm').reset();
  lastVehicleNotice = '';
  $('editEntryId').value = '';
  $('entryModeBadge').textContent = 'New Entry';
  $('entryModeBadge').className = 'badge blue';
  $('fuelDate').value = today();
  $('callingDate').value = today();
  $('fuelProduct').value = APP_CONFIG.defaults.products[0];
  resetVehicleAutofillFields();
  updateVehicleInfoPanel();
}

function renderDashboard() {
  if (!$('dashboardDate').value) $('dashboardDate').value = today();
  const selectedDate = $('dashboardDate').value || today();
  const selectedDistrict = $('dashboardDistrict').value;
  const selectedCluster = $('dashboardCluster').value;
  let data = entriesForUser();
  if (selectedDistrict && selectedDistrict !== 'All Districts') data = data.filter((e) => e.district === selectedDistrict);
  if (selectedCluster && selectedCluster !== 'All Clusters') data = data.filter((e) => e.cluster === selectedCluster);
  const todayRows = data.filter((e) => e.fuelDate === selectedDate);
  const monthRows = data.filter((e) => e.fuelDate.slice(0, 7) === today().slice(0, 7));
  const totalKm = sum(todayRows, 'totalKm');
  const avgMileage = average(data.map((e) => e.mileage).filter(Boolean));
  const drivers = new Set(state.masters.drivers.map((d) => d.name)).size;
  const cards = [
    ["Today's Fuel", litre(sum(todayRows, 'volume')), 'fuel'],
    ["Today's Cost", 'INR ' + money(sum(todayRows, 'amount')), 'cost'],
    ["Today's KM", totalKm.toLocaleString('en-IN'), 'km'],
    ['Average Mileage', avgMileage ? avgMileage.toFixed(2) + ' km/L' : '0 km/L', 'mileage'],
    ['Total Refills', String(data.length), 'refills'],
    ['Pending Approvals', String(data.filter((e) => e.status === 'Pending').length), 'pending'],
    ['Monthly Cost', 'INR ' + money(sum(monthRows, 'amount')), 'monthly-cost'],
    ['Monthly Fuel', litre(sum(monthRows, 'volume')), 'monthly-fuel'],
    ['Total Vehicles', String(state.masters.vehicles.length), 'vehicles'],
    ['Total Drivers', String(drivers), 'drivers']
  ];
  $('dashboardCards').innerHTML = cards.map(([label, value, tone]) => `<div class="kpi-card ${tone}"><span>${label}</span><strong>${value}</strong><small>${dashboardSub(label, data)}</small></div>`).join('');
  renderLineChart('fuelTrendChart', dailySeries(data, 14, 'amount'), 'INR');
  renderBarChart('districtChart', aggregate(data, 'district', 'volume'), 'L');
  renderBarChart('vehicleChart', aggregate(data, 'vehicleNumber', 'volume', 8), 'L');
  renderBarChart('vendorChart', aggregate(data, 'vendor', 'amount'), 'INR');
  renderBudget(monthRows);
  renderAlerts(data);
  $('recentFuelBody').innerHTML = data.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10).map(entryRow).join('') || emptyRow(8);
}

function renderBudget(rows) {
  const spent = sum(rows, 'amount');
  const budget = Number(state.settings.monthlyBudget) || 1;
  const percent = Math.min(100, (spent / budget) * 100);
  $('budgetAnalysis').innerHTML = `<div class="budget-line"><span>Monthly Budget</span><strong>INR ${money(budget)}</strong></div><div class="budget-bar"><i style="width:${percent}%"></i></div><div class="budget-line"><span>Used</span><strong>${percent.toFixed(1)}%</strong></div><div class="budget-line"><span>Balance</span><strong>INR ${money(Math.max(0, budget - spent))}</strong></div>`;
}

function renderAlerts(data) {
  const low = data.filter((e) => e.mileage && e.mileage < state.settings.lowMileageLimit);
  const pending = data.filter((e) => e.status === 'Pending');
  const high = data.filter((e) => e.volume > 100);
  $('alertList').innerHTML = [
    ['Low mileage vehicles', low.length, 'warning'],
    ['Pending approvals', pending.length, 'info'],
    ['High volume refills', high.length, 'danger'],
    ['Google Sheets status', state.settings.sheetConnected ? 'Connected' : 'Offline Mode', state.settings.sheetConnected ? 'success' : 'warning']
  ].map(([label, value, tone]) => `<div class="alert-row ${tone}"><span>${label}</span><strong>${value}</strong></div>`).join('');
}

function renderEntries() {
  const q = $('entrySearch').value.trim().toLowerCase();
  const district = $('entryDistrictFilter').value;
  let rows = entriesForUser();
  if (district && district !== 'All Districts') rows = rows.filter((e) => e.district === district);
  if (q) rows = rows.filter((e) => Object.values(e).some((value) => String(value).toLowerCase().includes(q)));
  $('entriesBody').innerHTML = rows.slice().sort((a, b) => b.fuelDate.localeCompare(a.fuelDate)).map((e) => `<tr>
    <td>${dateIn(e.fuelDate)}</td><td><strong>${escapeHtml(e.vehicleNumber)}</strong></td><td>${escapeHtml(e.pilotName)}</td><td>${escapeHtml(e.vendor)}</td><td>${escapeHtml(e.fuelProduct)}</td>
    <td>${litre(e.volume)}</td><td>INR ${money(e.amount)}</td><td>${e.totalKm || 0}</td><td>${e.mileage ? e.mileage.toFixed(2) : '-'}</td><td>${statusBadge(e.status)} ${syncBadge(e)}</td>
    <td class="row-actions">${rowActions(e)}</td></tr>`).join('') || emptyRow(11);
}

function renderApprovals() {
  const pending = entriesForUser().filter((e) => e.status === 'Pending');
  const approved = entriesForUser().filter((e) => e.status === 'Approved');
  $('approvalCards').innerHTML = [
    ['Pending', pending.length],
    ['Approved', approved.length],
    ['Pending Value', 'INR ' + money(sum(pending, 'amount'))]
  ].map(([label, value]) => `<div class="kpi-card"><span>${label}</span><strong>${value}</strong></div>`).join('');
  $('approvalBody').innerHTML = pending.map((e) => `<tr><td>${dateIn(e.fuelDate)}</td><td>${escapeHtml(e.vehicleNumber)}</td><td>${escapeHtml(e.vendor)}</td><td>INR ${money(e.amount)}</td><td>${statusBadge(e.status)}</td><td>${permissions().canApprove ? `<button class="success-btn small" data-action="approveEntry" data-id="${e.id}" type="button">Approve</button>` : '-'}</td></tr>`).join('') || emptyRow(6);
}

function renderCrud(containerId, kind) {
  const cfg = crudConfig(kind);
  const rows = state.masters[kind] || [];
  $(containerId).innerHTML = `<div class="panel"><div class="panel-head"><h3>${cfg.title}</h3></div>
    <form class="crud-form" data-action="addMaster" data-kind="${kind}">${cfg.fields.map((field) => fieldInput(field)).join('')}<button class="primary-btn" type="submit">Add</button></form>
    <div class="table-wrap"><table><thead><tr>${cfg.fields.map((f) => `<th>${f.label}</th>`).join('')}<th>Action</th></tr></thead><tbody>${rows.map((row) => `<tr>${cfg.fields.map((f) => `<td>${escapeHtml(row[f.key])}</td>`).join('')}<td>${permissions().canDelete ? `<button class="danger-btn small" data-action="deleteMaster" data-kind="${kind}" data-id="${row.id}" type="button">Delete</button>` : '-'}</td></tr>`).join('') || emptyRow(cfg.fields.length + 1)}</tbody></table></div></div>`;
  $(containerId).querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    addMaster(kind, event.currentTarget);
  });
}

function renderReport(page) {
  const dedicatedReports = {
    'vehicle-report': renderVehicleReport,
    'vendor-report': renderVendorReport,
    'mileage-report': renderMileageReport,
    'exception-report': renderExceptionReport,
    'cluster-report': renderClusterReport
  };
  if (dedicatedReports[page]) {
    dedicatedReports[page]();
    return;
  }
  const cfg = reportConfig(page);
  const container = $(cfg.container);
  if (!container.dataset.ready) {
    container.innerHTML = `<div class="panel report-shell"><div class="panel-head"><h3>${cfg.title}</h3><div class="toolbar"><input id="${cfg.key}Search" placeholder="Search report"><button id="${cfg.key}Export" class="outline-btn" type="button">Export Excel</button><button id="${cfg.key}Print" class="outline-btn" type="button">Print</button></div></div>
      <div class="filters">${cfg.filters.map((filter) => `<label>${filter.label}<input id="${cfg.key}${filter.id}" type="${filter.type}" value="${filter.value || ''}"></label>`).join('')}<label>District<select id="${cfg.key}District"></select></label><button id="${cfg.key}Run" class="primary-btn" type="button">Run Report</button></div>
      <div id="${cfg.key}Summary" class="kpi-grid compact"></div><div id="${cfg.key}Chart" class="chart report-chart"></div><div class="table-wrap"><table><thead><tr>${cfg.columns.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody id="${cfg.key}Body"></tbody></table></div></div>`;
    optionize(cfg.key + 'District', ['All Districts', ...state.masters.districts]);
    $(cfg.key + 'Run').addEventListener('click', () => drawReport(cfg));
    $(cfg.key + 'Search').addEventListener('input', () => drawReport(cfg));
    $(cfg.key + 'Export').addEventListener('click', () => exportRows(cfg.key, reportRows(cfg)));
    $(cfg.key + 'Print').addEventListener('click', () => window.print());
    container.dataset.ready = '1';
  }
  drawReport(cfg);
}

function drawReport(cfg) {
  const rows = reportRows(cfg);
  const volume = sum(rows, 'volume');
  const amount = sum(rows, 'amount');
  const avg = average(rows.map((e) => e.mileage).filter(Boolean));
  $(cfg.key + 'Summary').innerHTML = [
    ['Entries', rows.length],
    ['Fuel', litre(volume)],
    ['Cost', 'INR ' + money(amount)],
    ['Avg Mileage', avg ? avg.toFixed(2) + ' km/L' : '0 km/L']
  ].map(([label, value]) => `<div class="kpi-card"><span>${label}</span><strong>${value}</strong></div>`).join('');
  const grouped = cfg.group ? aggregate(rows, cfg.group, cfg.metric || 'amount') : dailySeries(rows, 14, 'amount');
  cfg.group ? renderBarChart(cfg.key + 'Chart', grouped, cfg.metric === 'volume' ? 'L' : 'INR') : renderLineChart(cfg.key + 'Chart', grouped, 'INR');
  $(cfg.key + 'Body').innerHTML = rows.map((e) => `<tr>${cfg.map(e).map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('') || emptyRow(cfg.columns.length);
}

function reportRows(cfg) {
  let rows = entriesForUser();
  const district = $(cfg.key + 'District')?.value;
  const search = $(cfg.key + 'Search')?.value.trim().toLowerCase();
  const from = $(cfg.key + 'From')?.value;
  const to = $(cfg.key + 'To')?.value;
  const month = $(cfg.key + 'Month')?.value;
  if (month) rows = rows.filter((e) => e.fuelDate.slice(0, 7) === month);
  if (from) rows = rows.filter((e) => e.fuelDate >= from);
  if (to) rows = rows.filter((e) => e.fuelDate <= to);
  if (district && district !== 'All Districts') rows = rows.filter((e) => e.district === district);
  if (cfg.exception) rows = exceptionRows(rows);
  if (search) rows = rows.filter((e) => Object.values(e).some((value) => String(value).toLowerCase().includes(search)));
  return rows.slice().sort((a, b) => b.fuelDate.localeCompare(a.fuelDate));
}

function renderDedicatedReportShell(containerId, title, filters, columns, chartTitle) {
  const container = $(containerId);
  if (container.dataset.reportReady === title) return;
  const key = containerId.replace('Report', 'Rpt');
  container.innerHTML = `<div class="panel report-shell dedicated-report"><div class="panel-head"><h3>${title}</h3><div class="toolbar"><button id="${key}Export" class="outline-btn" type="button">Export Excel</button><button id="${key}Print" class="outline-btn" type="button">Print</button></div></div>
    <div class="filters">${filters.map((filter) => reportFilterMarkup(key, filter)).join('')}<button id="${key}Run" class="primary-btn" type="button">Run Report</button></div>
    <div id="${key}Summary" class="kpi-grid compact"></div><div class="report-chart-title">${chartTitle}</div><div id="${key}Chart" class="chart report-chart"></div>
    <div class="table-wrap"><table id="${key}Table"><thead><tr>${columns.map((column) => `<th>${column}</th>`).join('')}</tr></thead><tbody id="${key}Body"></tbody></table></div></div>`;
  filters.forEach((filter) => hydrateReportFilter(key, filter));
  $(key + 'Run').addEventListener('click', () => renderPage(state.page));
  $(key + 'Export').addEventListener('click', () => exportReportTable(key + 'Table', key));
  $(key + 'Print').addEventListener('click', () => window.print());
  container.dataset.reportReady = title;
}

function reportFilterMarkup(key, filter) {
  if (filter.type === 'select') return `<label>${filter.label}<select id="${key}${filter.id}"></select></label>`;
  if (filter.type === 'datalist') return `<label>${filter.label}<input id="${key}${filter.id}" list="${key}${filter.id}List" value="${escapeHtml(filter.value || '')}"><datalist id="${key}${filter.id}List"></datalist></label>`;
  return `<label>${filter.label}<input id="${key}${filter.id}" type="${filter.type}" value="${escapeHtml(filter.value || '')}"></label>`;
}

function hydrateReportFilter(key, filter) {
  if (filter.type === 'select') optionize(key + filter.id, filter.options);
  if (filter.type === 'datalist') optionize(key + filter.id + 'List', filter.options);
}

function dedicatedRows(key, filters = {}) {
  let rows = entriesForUser();
  const from = $(key + 'From')?.value;
  const to = $(key + 'To')?.value;
  const district = $(key + 'District')?.value;
  const vehicle = $(key + 'Vehicle')?.value.trim().toLowerCase();
  const vehicleType = $(key + 'VehicleType')?.value;
  const vendor = $(key + 'Vendor')?.value;
  const product = $(key + 'Product')?.value;
  const cluster = $(key + 'Cluster')?.value;
  if (from) rows = rows.filter((e) => e.fuelDate >= from);
  if (to) rows = rows.filter((e) => e.fuelDate <= to);
  if (district && district !== 'All Districts') rows = rows.filter((e) => e.district === district);
  if (vehicle && vehicle !== 'all vehicles') rows = rows.filter((e) => (e.vehicleNumber || '').toLowerCase() === vehicle);
  if (vehicleType && vehicleType !== 'All Vehicle Types') rows = rows.filter((e) => vehicleTypeFor(e.vehicleNumber) === vehicleType);
  if (vendor && vendor !== 'All Vendors') rows = rows.filter((e) => e.vendor === vendor);
  if (product && product !== 'All Products') rows = rows.filter((e) => e.fuelProduct === product);
  if (cluster && cluster !== 'All Clusters') rows = rows.filter((e) => e.cluster === cluster);
  if (filters.withMileage) rows = rows.filter((e) => e.mileage);
  return rows;
}

function vehicleReportOptions() {
  const vehicles = state.masters.vehicles
    .map((vehicle) => vehicle.number)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  return ['All Vehicles', ...vehicles];
}

function renderVehicleReport() {
  const key = 'vehicleRpt';
  renderDedicatedReportShell('vehicleReport', 'Vehicle Report', [
    { id: 'From', label: 'From Date', type: 'date', value: monthStart() },
    { id: 'To', label: 'To Date', type: 'date', value: today() },
    { id: 'Vehicle', label: 'Ambulance No / Vehicle No', type: 'datalist', value: 'All Vehicles', options: vehicleReportOptions() },
    { id: 'District', label: 'District', type: 'select', options: ['All Districts', ...state.masters.districts] },
    { id: 'VehicleType', label: 'Vehicle Type', type: 'select', options: ['All Vehicle Types', ...APP_CONFIG.defaults.vehicleTypes] }
  ], ['Ambulance No','District','Vehicle Type','Total Fills','Total Volume (L)','Total Amount (₹)','Total KM','Avg KM/L','Last Fill Date','Status'], 'Top 10 Vehicles by Fuel Consumption');
  optionize('vehicleRptVehicleList', vehicleReportOptions());
  const rows = dedicatedRows(key);
  const grouped = groupByVehicle(rows);
  const latest = rows.map((e) => e.fuelDate).sort().pop();
  $('vehicleRptSummary').innerHTML = kpiCards([
    ['Total Vehicles', grouped.length],
    ['Total Fuel Volume', litre(sum(rows, 'volume'))],
    ['Total Amount', 'INR ' + money(sum(rows, 'amount'))],
    ['Total KM', sum(rows, 'totalKm').toLocaleString('en-IN')],
    ['Avg KM/L', average(grouped.map((v) => v.avgMileage).filter(Boolean)).toFixed(2)],
    ['Last Fill Date', latest ? dateIn(latest) : '-']
  ]);
  renderBarChart('vehicleRptChart', grouped.map((v) => ({ label: v.vehicleNumber, value: v.volume })).sort((a, b) => b.value - a.value).slice(0, 10), 'L');
  $('vehicleRptBody').innerHTML = grouped.map((v) => `<tr><td><strong>${escapeHtml(v.vehicleNumber)}</strong></td><td>${escapeHtml(v.district)}</td><td>${escapeHtml(v.vehicleType)}</td><td>${v.fills}</td><td>${litre(v.volume)}</td><td>INR ${money(v.amount)}</td><td>${v.totalKm.toLocaleString('en-IN')}</td><td>${v.avgMileage ? v.avgMileage.toFixed(2) : '-'}</td><td>${dateIn(v.lastFillDate)}</td><td>${statusBadge(v.status)}</td></tr>`).join('') || emptyRow(10);
}

function renderVendorReport() {
  const key = 'vendorRpt';
  renderDedicatedReportShell('vendorReport', 'Vendor Report', [
    { id: 'From', label: 'From Date', type: 'date', value: monthStart() },
    { id: 'To', label: 'To Date', type: 'date', value: today() },
    { id: 'Vendor', label: 'Vendor', type: 'select', options: ['All Vendors', ...vendors().map((v) => v.name)] },
    { id: 'District', label: 'District', type: 'select', options: ['All Districts', ...state.masters.districts] },
    { id: 'Product', label: 'Fuel Product', type: 'select', options: ['All Products', ...APP_CONFIG.defaults.products] }
  ], ['Vendor','Transactions','Total Volume (L)','Total Amount (₹)','Avg Price/L','Share %','Fuel Product','District'], 'Vendor Share by Volume');
  const rows = dedicatedRows(key);
  const grouped = groupByField(rows, 'vendor').map((item) => {
    const itemRows = item.rows;
    return { vendor: item.label, transactions: itemRows.length, volume: sum(itemRows, 'volume'), amount: sum(itemRows, 'amount'), avgPrice: average(itemRows.map((e) => e.price).filter(Boolean)), product: uniqueLabel(itemRows, 'fuelProduct'), district: uniqueLabel(itemRows, 'district') };
  }).sort((a, b) => b.volume - a.volume);
  const topVendor = grouped[0]?.vendor || '-';
  const totalVolume = sum(grouped, 'volume');
  $('vendorRptSummary').innerHTML = kpiCards([
    ['Total Vendors', grouped.length],
    ['Total Transactions', rows.length],
    ['Total Volume', litre(totalVolume)],
    ['Total Amount', 'INR ' + money(sum(rows, 'amount'))],
    ['Avg Price/L', 'INR ' + money(average(rows.map((e) => e.price).filter(Boolean)))],
    ['Top Vendor', topVendor]
  ]);
  renderBarChart('vendorRptChart', grouped.map((v) => ({ label: v.vendor, value: v.volume })), 'L');
  $('vendorRptBody').innerHTML = grouped.map((v) => `<tr><td><strong>${escapeHtml(v.vendor)}</strong></td><td>${v.transactions}</td><td>${litre(v.volume)}</td><td>INR ${money(v.amount)}</td><td>INR ${money(v.avgPrice)}</td><td>${totalVolume ? ((v.volume / totalVolume) * 100).toFixed(1) : '0.0'}%</td><td>${escapeHtml(v.product)}</td><td>${escapeHtml(v.district)}</td></tr>`).join('') || emptyRow(8);
}

function renderMileageReport() {
  const key = 'mileageRpt';
  renderDedicatedReportShell('mileageReport', 'Mileage Report', [
    { id: 'From', label: 'From Date', type: 'date', value: monthStart() },
    { id: 'To', label: 'To Date', type: 'date', value: today() },
    { id: 'District', label: 'District', type: 'select', options: ['All Districts', ...state.masters.districts] },
    { id: 'Vehicle', label: 'Vehicle No', type: 'text' },
    { id: 'Threshold', label: 'Minimum KM/L Threshold', type: 'number', value: state.settings.lowMileageLimit || 8 },
    { id: 'VehicleType', label: 'Vehicle Type', type: 'select', options: ['All Vehicle Types', ...APP_CONFIG.defaults.vehicleTypes] }
  ], ['Ambulance No','District','Vehicle Type','Total Fills','Total KM','Total Volume (L)','KM/L','Status','Remark'], 'Mileage Comparison by Vehicle');
  const threshold = Number($('mileageRptThreshold').value || state.settings.lowMileageLimit || 8);
  const grouped = groupByVehicle(dedicatedRows(key, { withMileage: true })).map((vehicle) => ({ ...vehicle, statusText: vehicle.avgMileage < threshold ? 'Low Mileage' : 'Normal' }));
  const mileages = grouped.map((v) => v.avgMileage).filter(Boolean);
  $('mileageRptSummary').innerHTML = kpiCards([
    ['Total Vehicles', grouped.length],
    ['Avg Mileage', mileages.length ? average(mileages).toFixed(2) + ' km/L' : '0 km/L'],
    ['Low Mileage Vehicles', grouped.filter((v) => v.statusText === 'Low Mileage').length],
    ['Best Mileage', mileages.length ? Math.max(...mileages).toFixed(2) + ' km/L' : '-'],
    ['Worst Mileage', mileages.length ? Math.min(...mileages).toFixed(2) + ' km/L' : '-']
  ]);
  renderBarChart('mileageRptChart', grouped.map((v) => ({ label: v.vehicleNumber, value: v.avgMileage })).sort((a, b) => b.value - a.value).slice(0, 10), '');
  $('mileageRptBody').innerHTML = grouped.map((v) => `<tr><td><strong>${escapeHtml(v.vehicleNumber)}</strong></td><td>${escapeHtml(v.district)}</td><td>${escapeHtml(v.vehicleType)}</td><td>${v.fills}</td><td>${v.totalKm.toLocaleString('en-IN')}</td><td>${litre(v.volume)}</td><td>${v.avgMileage ? v.avgMileage.toFixed(2) : '-'}</td><td><span class="badge ${v.statusText === 'Low Mileage' ? 'red' : 'green'}">${v.statusText}</span></td><td>${v.statusText === 'Low Mileage' ? 'Review driving pattern, fuel quality, and maintenance.' : 'Within threshold.'}</td></tr>`).join('') || emptyRow(9);
}

function renderExceptionReport() {
  const key = 'exceptionRpt';
  renderDedicatedReportShell('exceptionReport', 'Exception Report', [
    { id: 'From', label: 'From Date', type: 'date', value: monthStart() },
    { id: 'To', label: 'To Date', type: 'date', value: today() },
    { id: 'District', label: 'District', type: 'select', options: ['All Districts', ...state.masters.districts] },
    { id: 'Type', label: 'Exception Type', type: 'select', options: ['All Exception Types','Low Mileage','Multiple Refills','High Fuel Quantity','Missing KM Reading','No Fuel Entry','Fuel Budget Exceeded','Pending Approval'] },
    { id: 'Severity', label: 'Severity', type: 'select', options: ['All Severities','High','Medium','Low'] }
  ], ['Date','Ambulance No','District','Exception Type','Detail','Severity','Action Required'], 'Exception Count by Type');
  const rows = buildExceptionRecords(dedicatedRows(key));
  const type = $('exceptionRptType').value;
  const severity = $('exceptionRptSeverity').value;
  const filtered = rows.filter((row) => (type === 'All Exception Types' || row.type === type) && (severity === 'All Severities' || row.severity === severity));
  $('exceptionRptSummary').innerHTML = kpiCards([
    ['High Severity', filtered.filter((r) => r.severity === 'High').length],
    ['Medium Severity', filtered.filter((r) => r.severity === 'Medium').length],
    ['Low Severity', filtered.filter((r) => r.severity === 'Low').length],
    ['Total Flags', filtered.length]
  ]);
  renderBarChart('exceptionRptChart', groupObjects(filtered, 'type').map((item) => ({ label: item.label, value: item.rows.length })), '');
  $('exceptionRptBody').innerHTML = filtered.map((r) => `<tr><td>${r.date ? dateIn(r.date) : '-'}</td><td><strong>${escapeHtml(r.vehicleNumber)}</strong></td><td>${escapeHtml(r.district)}</td><td>${escapeHtml(r.type)}</td><td>${escapeHtml(r.detail)}</td><td><span class="badge ${severityTone(r.severity)}">${r.severity}</span></td><td>${escapeHtml(r.action)}</td></tr>`).join('') || emptyRow(7);
}

function renderClusterReport() {
  const key = 'clusterRpt';
  renderDedicatedReportShell('clusterReport', 'Cluster Report', [
    { id: 'From', label: 'From Date', type: 'date', value: monthStart() },
    { id: 'To', label: 'To Date', type: 'date', value: today() },
    { id: 'District', label: 'District', type: 'select', options: ['All Districts', ...state.masters.districts] },
    { id: 'Cluster', label: 'Cluster', type: 'select', options: ['All Clusters', ...state.masters.clusters] }
  ], ['Cluster','District','Total Vehicles','Total Fills','Total Volume (L)','Total Amount (₹)','Avg KM/L'], 'Cluster-wise Fuel Consumption');
  const rows = dedicatedRows(key);
  const grouped = groupByField(rows, 'cluster').map((item) => {
    const itemRows = item.rows;
    return { cluster: item.label, district: uniqueLabel(itemRows, 'district'), vehicles: new Set(itemRows.map((e) => e.vehicleNumber)).size, fills: itemRows.length, volume: sum(itemRows, 'volume'), amount: sum(itemRows, 'amount'), avgMileage: average(itemRows.map((e) => e.mileage).filter(Boolean)) };
  }).sort((a, b) => b.volume - a.volume);
  $('clusterRptSummary').innerHTML = kpiCards([
    ['Total Clusters', grouped.length],
    ['Total Refills', rows.length],
    ['Total Volume', litre(sum(rows, 'volume'))],
    ['Total Amount', 'INR ' + money(sum(rows, 'amount'))],
    ['Avg KM/L', average(grouped.map((c) => c.avgMileage).filter(Boolean)).toFixed(2)]
  ]);
  renderBarChart('clusterRptChart', grouped.map((c) => ({ label: c.cluster, value: c.volume })), 'L');
  $('clusterRptBody').innerHTML = grouped.map((c) => `<tr><td><strong>${escapeHtml(c.cluster)}</strong></td><td>${escapeHtml(c.district)}</td><td>${c.vehicles}</td><td>${c.fills}</td><td>${litre(c.volume)}</td><td>INR ${money(c.amount)}</td><td>${c.avgMileage ? c.avgMileage.toFixed(2) : '-'}</td></tr>`).join('') || emptyRow(7);
}

function renderUsers() {
  const canManage = permissions().canManageUsers;
  $('userForm').style.display = canManage ? 'grid' : 'none';
  $('addUserBtn').onclick = addUser;
  $('usersBody').innerHTML = state.users.map((u) => `<tr><td><strong>${u.username}</strong></td><td>${escapeHtml(u.name)}</td><td>${roleBadge(u.role)}</td><td>${u.district || 'All'}</td><td>${u.active === false ? '<span class="badge red">Inactive</span>' : '<span class="badge green">Active</span>'}</td><td>${canManage ? `<button class="outline-btn small" data-action="toggleUser" data-id="${u.id}" type="button">${u.active === false ? 'Activate' : 'Deactivate'}</button><button class="outline-btn small" data-action="resetUserPassword" data-id="${u.id}" type="button">Reset Access</button>` : '-'}</td></tr>`).join('');
}

async function addUser() {
  const username = $('newUsername').value.trim().toLowerCase();
  const name = $('newName').value.trim();
  const role = $('newRole').value;
  const district = $('newDistrict').value;
  const password = $('newPassword').value;
  if (!username || !name || !role || password.length < 8) return toast('User ID, role, and 8+ character access key are required.', 'danger');
  if (state.users.some((u) => u.username === username)) return toast('User ID already exists.', 'danger');
  state.users.push({ id: uid(), username, name, role, district, passwordHash: await sha256(password), active: true, createdAt: nowIso() });
  saveUsers();
  audit('Created user', username);
  renderUsers();
  toast('User created.', 'success');
}

function renderSettings() {
  const isSuper = state.user.role === 'SuperAdmin';
  $('googleScriptUrl').value = sheetUrl() || '';
  $('monthlyBudget').value = state.settings.monthlyBudget || 0;
  $('lowMileageLimit').value = state.settings.lowMileageLimit || 8;
  $('googleScriptUrl').closest('.form-grid').style.display = isSuper ? 'grid' : 'none';
  $('googleScriptUrl').closest('.panel').querySelector('.actions').style.display = isSuper ? 'flex' : 'none';
  $('saveSettingsBtn').style.display = isSuper ? 'inline-flex' : 'none';
  $('testConnectionBtn').style.display = isSuper ? 'inline-flex' : 'none';
  $('removeConnectionBtn').style.display = isSuper ? 'inline-flex' : 'none';
  $('syncAllBtn').style.display = isSuper ? 'inline-flex' : 'none';
  renderSheetConnectionStatus();
}

async function saveSettings() {
  if (state.user.role !== 'SuperAdmin') return toast('Only Super Admin can change system settings.', 'danger');
  const url = $('googleScriptUrl').value.trim();
  if (!url) return toast('Enter Google Apps Script Web App URL.', 'danger');
  state.settings.monthlyBudget = number('monthlyBudget');
  state.settings.lowMileageLimit = number('lowMileageLimit') || 8;
  state.settings.googleScriptUrl = url;
  state.settings.globalGoogleScriptUrl = url;
  state.settings.googleScriptOverride = true;
  saveSettingsLocal();
  try {
    await postToSheet(url, { action: 'saveGlobalSettings', settings: { googleScriptUrl: url }, savedBy: state.user.username });
    cacheSheetConnection(url);
    audit('Updated Google Sheet connection', 'Global URL saved');
    toast('Global Google Sheet connection saved.', 'success');
  } catch (error) {
    cacheSheetConnection(url);
    toast('Connection saved locally. Apps Script must support saveGlobalSettings for global sharing.', 'warning');
  }
  updateSheetStatus();
  renderSheetConnectionStatus();
}

function renderAudit() {
  $('auditBody').innerHTML = state.audit.slice().reverse().map((a) => `<tr><td>${dateTime(a.time)}</td><td>${escapeHtml(a.user)}</td><td>${escapeHtml(a.action)}</td><td>${escapeHtml(a.details)}</td></tr>`).join('') || emptyRow(4);
}

function runAction(action, id, kind) {
  if (action === 'editEntry') editEntry(id);
  if (action === 'deleteEntry') deleteEntry(id);
  if (action === 'approveEntry') approveEntry(id);
  if (action === 'deleteMaster') deleteMaster(kind, id);
  if (action === 'toggleUser') toggleUser(id);
  if (action === 'resetUserPassword') resetUserPassword(id);
}

function editEntry(id) {
  if (!permissions().canEdit) return toast('Your role cannot edit entries.', 'danger');
  const entry = state.entries.find((e) => e.id === id);
  if (!entry) return;
  showPage('fuel-entry');
  Object.entries({
    editEntryId: entry.id, fuelDate: entry.fuelDate, callingDate: entry.callingDate, vehicleNumber: entry.vehicleNumber, pilotName: entry.pilotName,
    pilotMobile: entry.pilotMobile, pilotId: entry.pilotId, vendor: entry.vendor, fuelProduct: entry.fuelProduct, vehicleType: entry.vehicleType, price: entry.price, volume: entry.volume,
    amount: entry.amount, currentKm: entry.currentKm, previousKm: entry.previousKm, totalKm: entry.totalKm, mileage: entry.mileage, district: entry.district,
    cluster: entry.cluster, baseLocation: entry.baseLocation, adm: entry.adm, dm: entry.dm, fuelCardNumber: entry.fuelCardNumber, fuelCardVendor: entry.fuelCardVendor,
    fuelCardMonthlyBudget: entry.fuelCardMonthlyBudget, fuelCardUsedBudget: entry.fuelCardUsedBudget, fuelCardRemainingBudget: entry.fuelCardRemainingBudget,
    fuelCardBudgetStatus: entry.fuelCardBudgetStatus, remarks: entry.remarks
  }).forEach(([key, value]) => { if ($(key)) $(key).value = value || ''; });
  const master = vehicleMaster(entry.vehicleNumber);
  const location = master ? baseLocationMaster(master.location) : null;
  const cardInfo = fuelCardInfo(entry.vehicleNumber);
  if (master) {
    $('vehicleType').value = master.type || $('vehicleType').value;
    lockVehicleMasterFields(true);
  }
  fillFuelCardFields(cardInfo);
  updateVehicleInfoPanel({ vehicle: entry.vehicleNumber, master, location, cardInfo, last: latestVehicleEntry(entry.vehicleNumber, entry.id) });
  $('entryModeBadge').textContent = 'Edit Entry';
  $('entryModeBadge').className = 'badge amber';
}

function deleteEntry(id) {
  if (!permissions().canDelete) return toast('Your role cannot delete entries.', 'danger');
  if (!confirm('Delete this fuel entry?')) return;
  const entry = state.entries.find((e) => e.id === id);
  state.entries = state.entries.filter((e) => e.id !== id);
  saveEntries();
  audit('Deleted fuel entry', entry?.vehicleNumber || id);
  renderEntries();
  toast('Entry deleted.', 'success');
}

function approveEntry(id) {
  if (!permissions().canApprove) return toast('Your role cannot approve entries.', 'danger');
  const entry = state.entries.find((e) => e.id === id);
  if (!entry) return;
  entry.status = 'Approved';
  entry.approvedBy = state.user.username;
  entry.approvedAt = nowIso();
  saveEntries();
  audit('Approved fuel entry', entry.vehicleNumber + ' / INR ' + money(entry.amount));
  renderApprovals();
  toast('Entry approved.', 'success');
}

function addMaster(kind, form) {
  if (!permissions().canCreate) return toast('No permission to create records.', 'danger');
  const cfg = crudConfig(kind);
  const item = { id: uid() };
  cfg.fields.forEach((field) => item[field.key] = form.elements[field.key].value.trim());
  if (Object.values(item).some((v, i) => i > 0 && !v)) return toast('Please fill all fields.', 'danger');
  state.masters[kind].push(item);
  saveMasters();
  fillMasterControls();
  audit('Created master record', cfg.title + ': ' + Object.values(item)[1]);
  renderCrud(form.closest('[id]').id, kind);
  toast('Record added.', 'success');
}

function deleteMaster(kind, id) {
  if (!permissions().canDelete) return toast('No permission to delete records.', 'danger');
  state.masters[kind] = state.masters[kind].filter((row) => row.id !== id);
  saveMasters();
  fillMasterControls();
  audit('Deleted master record', kind + ' / ' + id);
  renderPage(state.page);
  toast('Record deleted.', 'success');
}

function toggleUser(id) {
  const user = state.users.find((u) => u.id === id);
  if (!user || user.id === state.user.id) return toast('You cannot deactivate your own account.', 'danger');
  user.active = user.active === false;
  saveUsers();
  audit('Updated user status', user.username);
  renderUsers();
}

async function resetUserPassword(id) {
  const user = state.users.find((u) => u.id === id);
  if (!user) return;
  const password = prompt('Enter a new access key for ' + user.username + ' (minimum 8 characters)');
  if (!password || password.length < 8) return toast('Access key must be at least 8 characters.', 'danger');
  user.passwordHash = await sha256(password);
  saveUsers();
  audit('Reset access key', user.username);
  toast('Access key updated.', 'success');
}

async function loadCentralData(options = {}) {
  const url = sheetUrl();
  if (!state.user || !url) {
    state.settings.sheetConnected = false;
    updateSheetStatus();
    return false;
  }
  try {
    const data = await postToSheet(url, { action: 'getAllData', sheet: APP_CONFIG.googleSheetName });
    if (data.status && !['success', 'ok'].includes(String(data.status).toLowerCase())) throw new Error(data.message || 'Central data fetch failed');
    applyCentralData(data);
    state.settings.sheetConnected = true;
    state.settings.lastSyncError = '';
    state.settings.lastSyncTime = nowIso();
    state.settings.lastConnectionCheck = nowIso();
    saveSettingsLocal();
    updateSheetStatus();
    renderCurrentView();
    if (options.showToast) toast('Latest Google Sheet data loaded.', 'success');
    return true;
  } catch (error) {
    state.settings.sheetConnected = false;
    state.settings.lastSyncError = error.message || 'Central data fetch failed';
    saveSettingsLocal();
    updateSheetStatus();
    if (options.showToast || options.reason === 'login') toast('Using offline cached data', 'warning');
    return false;
  }
}

function applyCentralData(data) {
  const pending = pendingSyncEntries();
  const centralEntries = (data.fuelData || []).map(normalizeCentralEntry).filter((entry) => entry.id || entry.vehicleNumber);
  state.entries = mergeCentralWithPending(centralEntries, pending);

  const vehicles = (data.vehicleMaster || data.vehicles || []).map(normalizeVehicleMaster).filter((vehicle) => vehicle.number);
  const cards = (data.fuelCardMaster || data.fuelCards || []).map(normalizeFuelCard).filter((card) => card.vehicle || card.cardNo);
  if (vehicles.length) {
    state.masters.vehicles = vehicles;
    state.masters.districts = uniqueSorted([...APP_CONFIG.defaults.districts, ...vehicles.map((v) => v.district).filter(Boolean)]);
    state.masters.clusters = uniqueSorted([...APP_CONFIG.defaults.clusters, ...vehicles.map((v) => v.cluster).filter(Boolean)]);
    state.masters.locations = uniqueByName(vehicles.filter((v) => v.location).map((v) => ({ id: uid(), name: v.location, district: v.district, cluster: v.cluster, adm: v.adm, dm: v.dm })));
  }
  if (cards.length) state.masters.cards = cards;

  const sheetSettings = normalizeCentralSettings(data.settings);
  state.settings = { ...state.settings, ...sheetSettings, googleScriptUrl: state.settings.googleScriptUrl || APP_CONFIG.googleScriptUrl || '' };
  if (data.auditLog) state.audit = data.auditLog.map(normalizeAuditRow).filter((row) => row.action || row.details);

  saveEntries();
  saveMasters();
  saveSettingsLocal();
  saveAudit();
  fillMasterControls();
}

function mergeCentralWithPending(centralEntries, pendingEntries) {
  const map = new Map();
  centralEntries.forEach((entry) => map.set(entry.id || uid(), { ...entry, syncStatus: 'Synced', syncError: '' }));
  pendingEntries.forEach((entry) => {
    const key = entry.id || uid();
    if (!map.has(key) || isPendingSync(entry)) map.set(key, entry);
  });
  return Array.from(map.values());
}

function normalizeCentralEntry(row) {
  const id = row.id || row.ID || row.entryId || uid();
  return {
    id,
    fuelDate: isoFromSheet(row.fuelDate || row['Fuel Date']),
    callingDate: isoFromSheet(row.callingDate || row['Calling Date']),
    vehicleNumber: String(row.vehicleNumber || row['Ambulance No / Vehicle No'] || row['Vehicle Number'] || '').trim().toUpperCase(),
    pilotName: row.pilotName || '',
    pilotMobile: row.pilotMobile || '',
    pilotId: row.pilotId || '',
    vendor: row.vendor || '',
    fuelProduct: row.fuelProduct || '',
    vehicleType: row.vehicleType || '',
    price: Number(row.price || 0),
    volume: Number(row.volume || 0),
    amount: Number(row.amount || 0),
    currentKm: Number(row.currentKm || 0),
    previousKm: Number(row.previousKm || 0),
    totalKm: Number(row.totalKm || 0),
    mileage: Number(row.mileage || 0),
    district: row.district || '',
    cluster: row.cluster || '',
    baseLocation: row.baseLocation || '',
    adm: row.adm || '',
    dm: row.dm || '',
    fuelCardNumber: row.fuelCardNumber || '',
    fuelCardVendor: row.fuelCardVendor || '',
    fuelCardMonthlyBudget: row.fuelCardMonthlyBudget || '',
    fuelCardUsedBudget: row.fuelCardUsedBudget || '',
    fuelCardRemainingBudget: row.fuelCardRemainingBudget || '',
    fuelCardBudgetStatus: row.fuelCardBudgetStatus || '',
    remarks: row.remarks || '',
    status: row.status || row.approvalStatus || 'Approved',
    syncStatus: 'Synced',
    syncedAt: row.syncedAt || '',
    syncError: row.syncError || '',
    createdBy: row.createdBy || '',
    createdAt: row.createdAt || row.fuelDate || nowIso(),
    updatedAt: row.updatedAt || row.createdAt || nowIso()
  };
}

function normalizeVehicleMaster(row) {
  return {
    id: uid(),
    number: String(row.vehicleNumber || row.number || '').trim().toUpperCase(),
    type: row.vehicleType || row.type || '',
    location: row.baseLocation || row.location || '',
    district: row.district || '',
    cluster: row.cluster || '',
    adm: row.adm || '',
    dm: row.dm || '',
    status: row.status || 'Active'
  };
}

function normalizeFuelCard(row) {
  return {
    id: uid(),
    vehicle: String(row.vehicleNumber || row.vehicle || '').trim().toUpperCase(),
    cardNo: row.fuelCardNumber || row.cardNo || '',
    vendor: row.vendor || '',
    limit: Number(row.monthlyBudget || row.limit || 0),
    status: row.status || 'Active'
  };
}

function normalizeCentralSettings(settings) {
  if (!settings) return {};
  if (!Array.isArray(settings)) return settings;
  return settings.reduce((acc, row) => {
    if (!row.settingKey) return acc;
    if (row.settingKey === 'globalSettings') return { ...acc, ...safeJson(row.settingValue, {}) };
    acc[row.settingKey] = row.settingValue;
    return acc;
  }, {});
}

function normalizeAuditRow(row) {
  return { id: uid(), time: row.timestamp || row.time || nowIso(), user: row.user || '', action: row.action || '', details: row.details || row.source || '' };
}

function renderCurrentView() {
  fillMasterControls();
  if (state.page) renderPage(state.page);
}

async function syncEntryToSheet(entry, options = {}) {
  const url = sheetUrl();
  if (!entry) return false;
  if (!url) {
    markEntryPending(entry, 'Offline Mode');
    if (!options.silent) toast('Offline Mode. Entry remains Pending Sync.', 'warning');
    return false;
  }
  try {
    const result = await postToSheet(url, { action: 'addEntry', sheet: APP_CONFIG.googleSheetName, data: entry });
    if (result.status && !['success', 'ok'].includes(String(result.status).toLowerCase())) throw new Error(result.message || 'Sync rejected');
    entry.syncStatus = 'Synced';
    entry.syncedAt = nowIso();
    entry.syncError = '';
    state.settings.lastSyncTime = entry.syncedAt;
    state.settings.sheetConnected = true;
    state.settings.lastSyncError = '';
    saveEntries();
    saveSettingsLocal();
    cacheSheetConnection(url);
    updateSheetStatus();
    if (options.refresh !== false) await loadCentralData({ showToast: false, reason: 'after-save' });
    if (!options.silent) toast('Entry synced to Google Sheets.', 'success');
    return true;
  } catch (error) {
    state.settings.sheetConnected = false;
    state.settings.lastSyncError = error.message || 'Google Sheets sync failed';
    saveSettingsLocal();
    markEntryPending(entry, error.message);
    if (!options.silent) toast('Google Sheets sync failed. Entry remains Pending Sync.', 'danger');
    return false;
  }
}

async function syncPendingEntries(showToast = false) {
  const url = sheetUrl();
  const pending = pendingSyncEntries();
  updateSheetStatus();
  if (!pending.length) {
    if (showToast) toast('No pending sync data.', 'success');
    return;
  }
  if (!url) {
    state.settings.sheetConnected = false;
    state.settings.lastSyncError = 'Offline Mode';
    saveSettingsLocal();
    updateSheetStatus();
    if (showToast) toast('Offline Mode. Pending data remains local.', 'warning');
    return;
  }
  try {
    const result = await postToSheet(url, { action: 'bulkAdd', sheet: APP_CONFIG.googleSheetName, data: pending });
    if (result.status && !['success', 'ok'].includes(String(result.status).toLowerCase())) throw new Error(result.message || 'Bulk sync rejected');
    const syncedAt = nowIso();
    const pendingIds = new Set(pending.map((entry) => entry.id));
    state.entries.forEach((entry) => {
      if (!pendingIds.has(entry.id)) return;
      entry.syncStatus = 'Synced';
      entry.syncedAt = syncedAt;
      entry.syncError = '';
    });
    state.settings.lastSyncTime = syncedAt;
    state.settings.sheetConnected = true;
    state.settings.lastSyncError = '';
    saveEntries();
    saveSettingsLocal();
    audit('Synced pending entries', pending.length + ' rows');
    await loadCentralData({ showToast: false, reason: 'pending-sync' });
    updateSheetStatus();
    renderCurrentView();
    if (showToast) toast('Pending records synced successfully.', 'success');
  } catch (error) {
    state.settings.sheetConnected = false;
    state.settings.lastSyncError = error.message || 'Pending sync failed';
    state.entries.forEach((entry) => {
      if (isPendingSync(entry)) {
        entry.syncStatus = 'Sync Failed';
        entry.syncError = state.settings.lastSyncError;
      }
    });
    saveEntries();
    saveSettingsLocal();
    updateSheetStatus();
    if (state.page === 'settings') renderSheetConnectionStatus();
    if (showToast) toast('Pending records sync failed. Records remain pending.', 'danger');
  }
}

async function syncAllToSheet() {
  await syncPendingEntries(true);
}

async function testSheetConnection() {
  if (state.user.role !== 'SuperAdmin') return toast('Only Super Admin can test the connection.', 'danger');
  const url = $('googleScriptUrl').value.trim() || sheetUrl();
  if (!url) return toast('Enter Google Apps Script Web App URL.', 'danger');
  try {
    const result = await postToSheet(url, { action: 'testConnection', sheet: APP_CONFIG.googleSheetName });
    if (result.status && !['success', 'ok'].includes(String(result.status).toLowerCase())) throw new Error(result.message || 'Connection rejected');
    state.settings.sheetConnected = true;
    state.settings.lastSyncError = '';
    saveSettingsLocal();
    updateSheetStatus();
    toast('Google Sheet connection test successful.', 'success');
  } catch (error) {
    state.settings.sheetConnected = false;
    state.settings.lastSyncError = error.message || 'Connection test failed';
    saveSettingsLocal();
    updateSheetStatus();
    toast('Connection test failed: ' + error.message, 'danger');
  }
}

async function removeSheetConnection() {
  if (state.user.role !== 'SuperAdmin') return toast('Only Super Admin can remove the connection.', 'danger');
  if (!confirm('Remove global Google Sheet connection? Pending local data will remain saved.')) return;
  const url = sheetUrl();
  if (url) {
    try {
      await postToSheet(url, { action: 'removeGlobalSettings', removedBy: state.user.username });
    } catch (error) {
      toast('Remote removal failed; local connection cache cleared.', 'warning');
    }
  }
  state.settings.googleScriptUrl = '';
  state.settings.globalGoogleScriptUrl = '';
  state.settings.googleScriptOverride = false;
  localStorage.removeItem(STORE.sheetConnection);
  saveSettingsLocal();
  updateSheetStatus();
  renderSheetConnectionStatus();
  audit('Removed Google Sheet connection', 'Global URL removed');
}

async function refreshGlobalSheetConnection() {
  const url = sheetUrl();
  if (!url) {
    updateSheetStatus();
    return;
  }
  try {
    const result = await postToSheet(url, { action: 'getGlobalSettings', sheet: APP_CONFIG.googleSheetName });
    const globalUrl = result?.settings?.googleScriptUrl || result?.googleScriptUrl || result?.data?.googleScriptUrl;
    if (globalUrl) {
      state.settings.globalGoogleScriptUrl = globalUrl;
      state.settings.googleScriptUrl = state.settings.googleScriptUrl || globalUrl;
      state.settings.lastConnectionCheck = nowIso();
      state.settings.lastSyncError = '';
      cacheSheetConnection(globalUrl);
      saveSettingsLocal();
    }
  } catch {
    state.settings.lastConnectionCheck = nowIso();
    saveSettingsLocal();
  }
  updateSheetStatus();
}

async function postToSheet(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('HTTP ' + response.status);
  const text = await response.text();
  if (!text) return { status: 'success' };
  try {
    return JSON.parse(text);
  } catch {
    return { status: 'success', raw: text };
  }
}

function markEntryPending(entry, reason) {
  entry.syncStatus = 'Pending Sync';
  entry.syncError = reason || '';
  saveEntries();
  updateSheetStatus();
}

function isPendingSync(entry) {
  return ['Pending Sync', 'Sync Failed'].includes(entry.syncStatus);
}

function pendingSyncEntries() {
  return state.entries.filter(isPendingSync);
}

function cacheSheetConnection(url) {
  localStorage.setItem(STORE.sheetConnection, JSON.stringify({ googleScriptUrl: url, lastSyncTime: state.settings.lastSyncTime || '', cachedAt: nowIso() }));
}

function saveSettingsLocal() {
  localStorage.setItem(STORE.settings, JSON.stringify(state.settings));
}

function renderSheetConnectionStatus() {
  const el = $('sheetConnectionStatus');
  if (!el) return;
  const connected = state.settings.sheetConnected === true;
  const lastError = state.settings.lastSyncError || '-';
  el.innerHTML = kpiCards([
    ['Google Sheet', connected ? 'Connected' : 'Not Connected'],
    ['Pending Sync Count', pendingSyncEntries().length],
    ['Last Sync Time', state.settings.lastSyncTime ? dateTime(state.settings.lastSyncTime) : '-'],
    ['Last Sync Error', lastError]
  ]);
}

function backupJson() {
  download(JSON.stringify({ entries: state.entries, masters: state.masters, settings: state.settings, audit: state.audit, exportedAt: nowIso() }, null, 2), 'fuel-management-backup.json', 'application/json');
}

function restoreJson(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const data = safeJson(reader.result, null);
    if (!data) return toast('Invalid JSON file.', 'danger');
    if (Array.isArray(data.entries)) state.entries = data.entries;
    if (data.masters) state.masters = data.masters;
    if (data.settings) state.settings = data.settings;
    if (Array.isArray(data.audit)) state.audit = data.audit;
    saveEntries(); saveMasters(); saveSettingsLocal(); saveAudit();
    fillMasterControls();
    renderPage(state.page);
    toast('Backup restored.', 'success');
  };
  reader.readAsText(file);
  event.target.value = '';
}

function clearAudit() {
  if (!permissions().canDelete) return toast('No permission.', 'danger');
  if (!confirm('Clear audit log?')) return;
  state.audit = [];
  saveAudit();
  renderAudit();
}

function exportRows(name, rows) {
  if (!permissions().canExport) return toast('Export is not permitted for your role.', 'danger');
  const headers = ['Date','Calling Date','Vehicle','Pilot','Mobile','Pilot ID','Vendor','Product','Price','Volume','Amount','Current KM','Previous KM','Total KM','Mileage','District','Cluster','Base Location','ADM','DM','Status','Remarks'];
  const html = `<table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((e) => `<tr>${[dateIn(e.fuelDate),dateIn(e.callingDate),e.vehicleNumber,e.pilotName,e.pilotMobile,e.pilotId,e.vendor,e.fuelProduct,e.price,e.volume,e.amount,e.currentKm,e.previousKm,e.totalKm,e.mileage,e.district,e.cluster,e.baseLocation,e.adm,e.dm,e.status,e.remarks].map((v) => `<td>${escapeHtml(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  download(html, name + '-' + today() + '.xls', 'application/vnd.ms-excel');
  toast('Excel export downloaded.', 'success');
}

function download(content, filename, type) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([content], { type }));
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function renderLineChart(id, series, prefix) {
  const el = $(id);
  const values = series.map((x) => x.value);
  const max = Math.max(1, ...values);
  const points = series.map((x, i) => {
    const px = series.length === 1 ? 0 : (i / (series.length - 1)) * 100;
    const py = 88 - (x.value / max) * 76;
    return `${px},${py}`;
  }).join(' ');
  el.innerHTML = `<svg class="line-svg" viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="${points}" fill="none" stroke="#0b6fd3" stroke-width="3" vector-effect="non-scaling-stroke"/><polygon points="0,96 ${points} 100,96" fill="rgba(11,111,211,.10)"/></svg><div class="chart-labels">${series.map((x) => `<span><b>${prefix === 'INR' ? 'INR ' + money(x.value) : x.value}</b>${x.label}</span>`).join('')}</div>`;
}

function renderBarChart(id, rows, unit) {
  const el = $(id);
  const max = Math.max(1, ...rows.map((r) => r.value));
  el.innerHTML = `<div class="bars">${rows.slice(0, 8).map((r) => `<div class="bar-row"><span>${escapeHtml(r.label)}</span><div><i style="width:${Math.max(5, (r.value / max) * 100)}%"></i></div><strong>${unit === 'INR' ? 'INR ' + money(r.value) : Math.round(r.value) + unit}</strong></div>`).join('') || '<p class="muted">No chart data available.</p>'}</div>`;
}

function dailySeries(rows, days, metric) {
  const output = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = isoDate(date);
    output.push({ label: key.slice(5), value: sum(rows.filter((e) => e.fuelDate === key), metric) });
  }
  return output;
}

function aggregate(rows, key, metric, limit = 8) {
  const map = new Map();
  rows.forEach((row) => {
    const label = row[key] || 'Unknown';
    map.set(label, (map.get(label) || 0) + (Number(row[metric]) || 0));
  });
  return Array.from(map, ([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, limit);
}

function getUnifiedEntries() {
  const map = new Map();
  state.entries.forEach((entry) => {
    const key = entry.id || `${entry.vehicleNumber || ''}-${entry.createdAt || ''}-${entry.fuelDate || ''}`;
    if (!map.has(key) || isPendingSync(entry)) map.set(key, entry);
  });
  return Array.from(map.values());
}

function entriesForUser() {
  const perms = permissions();
  const entries = getUnifiedEntries();
  if (perms.seeAllDistricts || !state.user?.district) return entries;
  return entries.filter((e) => e.district === state.user.district);
}

function exceptionRows(rows) {
  const lowLimit = Number(state.settings.lowMileageLimit) || 8;
  const counts = {};
  rows.forEach((e) => counts[e.fuelDate + e.vehicleNumber] = (counts[e.fuelDate + e.vehicleNumber] || 0) + 1);
  return rows.filter((e) => (e.mileage && e.mileage < lowLimit) || e.volume > 100 || counts[e.fuelDate + e.vehicleNumber] > 1 || e.status === 'Pending');
}

function crudConfig(kind) {
  const map = {
    vendors: { title: 'Fuel Vendors', fields: [{ key: 'name', label: 'Vendor Name' }, { key: 'contact', label: 'Contact' }, { key: 'district', label: 'District' }, { key: 'active', label: 'Status' }] },
    cards: { title: 'Fuel Cards', fields: [{ key: 'cardNo', label: 'Card No' }, { key: 'vehicle', label: 'Vehicle' }, { key: 'vendor', label: 'Vendor' }, { key: 'limit', label: 'Limit' }, { key: 'status', label: 'Status' }] },
    vehicles: { title: 'Vehicles', fields: [{ key: 'number', label: 'Vehicle Number' }, { key: 'type', label: 'Type' }, { key: 'district', label: 'District' }, { key: 'location', label: 'Base Location' }, { key: 'status', label: 'Status' }] },
    drivers: { title: 'Drivers', fields: [{ key: 'name', label: 'Driver Name' }, { key: 'mobile', label: 'Mobile' }, { key: 'pilotId', label: 'Pilot ID' }, { key: 'district', label: 'District' }, { key: 'status', label: 'Status' }] },
    locations: { title: 'Base Locations', fields: [{ key: 'name', label: 'Location' }, { key: 'district', label: 'District' }, { key: 'cluster', label: 'Cluster' }, { key: 'adm', label: 'ADM' }, { key: 'dm', label: 'DM' }] },
    vehicleTypes: { title: 'Vehicle Types', fields: [{ key: 'name', label: 'Type' }, { key: 'fuel', label: 'Fuel' }, { key: 'mileageTarget', label: 'Mileage Target' }, { key: 'active', label: 'Status' }] }
  };
  return map[kind];
}

function reportConfig(page) {
  const baseMap = (e) => [dateIn(e.fuelDate), escapeHtml(e.vehicleNumber), escapeHtml(e.district), escapeHtml(e.vendor), litre(e.volume), 'INR ' + money(e.amount), e.mileage ? e.mileage.toFixed(2) : '-', statusBadge(e.status)];
  const common = { filters: [{ id: 'From', label: 'From', type: 'date', value: monthStart() }, { id: 'To', label: 'To', type: 'date', value: today() }], columns: ['Date','Vehicle','District','Vendor','Fuel','Amount','Mileage','Status'], map: baseMap };
  const configs = {
    'daily-report': { ...common, key: 'daily', container: 'dailyReport', title: 'Daily Report', filters: [{ id: 'From', label: 'Date', type: 'date', value: today() }, { id: 'To', label: 'To', type: 'date', value: today() }] },
    'weekly-report': { ...common, key: 'weekly', container: 'weeklyReport', title: 'Weekly Report' },
    'monthly-report': { ...common, key: 'monthly', container: 'monthlyReport', title: 'Monthly Report', filters: [{ id: 'Month', label: 'Month', type: 'month', value: today().slice(0, 7) }] },
    'district-report': { ...common, key: 'districtRpt', container: 'districtReport', title: 'District Report', group: 'district', metric: 'volume' }
  };
  return configs[page];
}

function fieldInput(field) {
  return `<label>${field.label}<input name="${field.key}" required></label>`;
}

function rowActions(e) {
  const parts = [];
  if (permissions().canEdit) parts.push(`<button class="outline-btn small" data-action="editEntry" data-id="${e.id}" type="button">Edit</button>`);
  if (permissions().canApprove && e.status === 'Pending') parts.push(`<button class="success-btn small" data-action="approveEntry" data-id="${e.id}" type="button">Approve</button>`);
  if (permissions().canDelete) parts.push(`<button class="danger-btn small" data-action="deleteEntry" data-id="${e.id}" type="button">Delete</button>`);
  return parts.join(' ') || '-';
}

function entryRow(e) {
  return `<tr><td>${dateIn(e.fuelDate)}</td><td><strong>${escapeHtml(e.vehicleNumber)}</strong></td><td>${escapeHtml(e.pilotName)}</td><td>${escapeHtml(e.district)}</td><td>${escapeHtml(e.vendor)}</td><td>${litre(e.volume)}</td><td>INR ${money(e.amount)}</td><td>${e.mileage ? e.mileage.toFixed(2) + ' km/L' : '-'}</td></tr>`;
}

function kpiCards(items) {
  return items.map(([label, value]) => `<div class="kpi-card"><span>${label}</span><strong>${value}</strong></div>`).join('');
}

function groupByVehicle(rows) {
  return groupByField(rows, 'vehicleNumber').map((item) => {
    const itemRows = item.rows;
    const vehicle = state.masters.vehicles.find((v) => v.number === item.label);
    const volume = sum(itemRows, 'volume');
    const totalKm = sum(itemRows, 'totalKm');
    const mileages = itemRows.map((e) => e.mileage).filter(Boolean);
    return {
      vehicleNumber: item.label,
      district: vehicle?.district || uniqueLabel(itemRows, 'district'),
      vehicleType: vehicleTypeFor(item.label),
      fills: itemRows.length,
      volume,
      amount: sum(itemRows, 'amount'),
      totalKm,
      avgMileage: volume ? totalKm / volume : average(mileages),
      lastFillDate: itemRows.map((e) => e.fuelDate).sort().pop() || '',
      status: itemRows.some((e) => e.status === 'Pending') ? 'Pending' : 'Approved'
    };
  }).sort((a, b) => b.volume - a.volume);
}

function groupByField(rows, key) {
  const map = new Map();
  rows.forEach((row) => {
    const label = row[key] || 'Unknown';
    if (!map.has(label)) map.set(label, []);
    map.get(label).push(row);
  });
  return Array.from(map, ([label, groupedRows]) => ({ label, rows: groupedRows }));
}

function groupObjects(rows, key) {
  const map = new Map();
  rows.forEach((row) => {
    const label = row[key] || 'Unknown';
    if (!map.has(label)) map.set(label, []);
    map.get(label).push(row);
  });
  return Array.from(map, ([label, groupedRows]) => ({ label, rows: groupedRows }));
}

function vehicleTypeFor(vehicleNumber) {
  return state.masters.vehicles.find((vehicle) => vehicle.number === vehicleNumber)?.type || 'Unknown';
}

function uniqueLabel(rows, key) {
  const values = [...new Set(rows.map((row) => row[key]).filter(Boolean))];
  if (!values.length) return 'Unknown';
  return values.length === 1 ? values[0] : 'Multiple';
}

function buildExceptionRecords(rows) {
  const records = [];
  const lowLimit = Number(state.settings.lowMileageLimit) || 8;
  const byVehicleDate = {};
  rows.forEach((entry) => {
    const key = entry.fuelDate + '|' + entry.vehicleNumber;
    byVehicleDate[key] = (byVehicleDate[key] || 0) + 1;
  });
  rows.forEach((entry) => {
    if (entry.mileage && entry.mileage < lowLimit) records.push(exceptionRecord(entry, 'Low Mileage', `${entry.mileage.toFixed(2)} km/L is below ${lowLimit} km/L`, 'Medium', 'Review vehicle maintenance and driving pattern'));
    if (byVehicleDate[entry.fuelDate + '|' + entry.vehicleNumber] > 1) records.push(exceptionRecord(entry, 'Multiple Refills', `${byVehicleDate[entry.fuelDate + '|' + entry.vehicleNumber]} refills recorded on same date`, 'Medium', 'Verify refill slips and approval trail'));
    if (entry.volume > 100) records.push(exceptionRecord(entry, 'High Fuel Quantity', `${litre(entry.volume)} recorded in one transaction`, 'High', 'Validate tank capacity and vendor bill'));
    if (!entry.currentKm || !entry.previousKm || !entry.totalKm) records.push(exceptionRecord(entry, 'Missing KM Reading', 'Current, previous, or total KM is missing', 'High', 'Update KM readings before reporting'));
    if (entry.status === 'Pending') records.push(exceptionRecord(entry, 'Pending Approval', 'Fuel entry is awaiting approval', 'Medium', 'Approve or reject the transaction'));
  });
  const from = $('exceptionRptFrom')?.value;
  const to = $('exceptionRptTo')?.value;
  const district = $('exceptionRptDistrict')?.value;
  const coveredVehicles = new Set(rows.map((entry) => entry.vehicleNumber));
  state.masters.vehicles
    .filter((vehicle) => !coveredVehicles.has(vehicle.number))
    .filter((vehicle) => !district || district === 'All Districts' || vehicle.district === district)
    .forEach((vehicle) => records.push({ date: to || from || today(), vehicleNumber: vehicle.number, district: vehicle.district || '-', type: 'No Fuel Entry', detail: 'No fuel entry found in selected period', severity: 'Low', action: 'Confirm whether vehicle was active in this period' }));
  const budget = Number(state.settings.monthlyBudget) || 0;
  if (budget && sum(rows, 'amount') > budget) {
    records.push({ date: to || today(), vehicleNumber: 'All', district: district && district !== 'All Districts' ? district : 'All', type: 'Fuel Budget Exceeded', detail: `Selected period amount INR ${money(sum(rows, 'amount'))} exceeds budget INR ${money(budget)}`, severity: 'High', action: 'Review budget allocation and exceptions' });
  }
  return records;
}

function exceptionRecord(entry, type, detail, severity, action) {
  return { date: entry.fuelDate, vehicleNumber: entry.vehicleNumber, district: entry.district || '-', type, detail, severity, action };
}

function severityTone(severity) {
  return severity === 'High' ? 'red' : severity === 'Medium' ? 'amber' : 'green';
}

function exportReportTable(tableId, filename) {
  if (!permissions().canExport) return toast('Export is not permitted for your role.', 'danger');
  const table = $(tableId);
  if (!table) return toast('Report table is not available.', 'danger');
  download(table.outerHTML, filename + '-' + today() + '.xls', 'application/vnd.ms-excel');
  toast('Excel export downloaded.', 'success');
}

function saveEntries() { localStorage.setItem(STORE.entries, JSON.stringify(state.entries)); }
function saveUsers() { localStorage.setItem(STORE.users, JSON.stringify(state.users)); }
function saveMasters() { localStorage.setItem(STORE.masters, JSON.stringify(state.masters)); }
function saveAudit() { localStorage.setItem(STORE.audit, JSON.stringify(state.audit)); }

function audit(action, details) {
  if (!state.user) return;
  state.audit.push({ id: uid(), time: nowIso(), user: state.user.username, action, details });
  saveAudit();
}

function permissions() {
  return APP_CONFIG.rolePermissions[state.user?.role] || { pages: [], canCreate: false, canEdit: false, canDelete: false, canExport: false, canManageUsers: false };
}

function canAccess(page) {
  return permissions().pages.includes(page);
}

function vendors() {
  return state.masters.vendors.filter((v) => v.active !== 'Inactive' && v.active !== false);
}

function sheetUrl() {
  if (state.settings.googleScriptOverride) return state.settings.globalGoogleScriptUrl || state.settings.googleScriptUrl || APP_CONFIG.googleScriptUrl || '';
  return APP_CONFIG.googleScriptUrl || state.settings.globalGoogleScriptUrl || state.settings.googleScriptUrl || '';
}

function updateSheetStatus() {
  const connected = state.settings.sheetConnected === true;
  $('sheetStatus').textContent = connected ? 'Google Sheet Connected' : 'Offline Mode';
  $('sheetStatus').className = 'sheet-status ' + (connected ? 'ok' : 'warn');
  renderSheetConnectionStatus();
}

function updateClock() {
  $('todayClock').textContent = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

function optionize(id, rows, valueKey, labelKey) {
  const el = $(id);
  if (!el) return;
  el.innerHTML = rows.map((row) => {
    const value = typeof row === 'object' ? row[valueKey] : row;
    const label = typeof row === 'object' ? row[labelKey] : row;
    return `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;
  }).join('');
}

function roleBadge(role) {
  const tone = role === 'SuperAdmin' ? 'purple' : role === 'Admin' ? 'blue' : role === 'Operator' ? 'green' : 'gray';
  return `<span class="badge ${tone}">${role}</span>`;
}

function statusBadge(status) {
  const tone = status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'amber';
  return `<span class="badge ${tone}">${status || 'Pending'}</span>`;
}

function syncBadge(entry) {
  const synced = entry.syncStatus === 'Synced';
  const label = synced ? 'Synced' : 'Pending Sync';
  return `<span class="badge ${synced ? 'green' : 'amber'}">${label}</span>`;
}

function dashboardSub(label, data) {
  if (label.includes('Today')) return today();
  if (label.includes('Monthly')) return new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  return data.length ? 'Live data' : 'No records yet';
}

function emptyRow(cols) {
  return `<tr><td colspan="${cols}" class="empty-cell">No records found</td></tr>`;
}

function titleFor(page) {
  const item = APP_CONFIG.navMenu.flatMap((s) => s.items).find((i) => i.page === page);
  return item ? item.label : 'Dashboard';
}

function number(id) {
  return Number($(id).value || 0);
}

function sum(rows, key) {
  return rows.reduce((total, row) => total + (Number(row[key]) || 0), 0);
}

function average(rows) {
  return rows.length ? rows.reduce((a, b) => a + b, 0) / rows.length : 0;
}

function money(value) {
  return Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

function litre(value) {
  return Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 1 }) + ' L';
}

function dateIn(value) {
  const iso = plainDate(value);
  if (!iso) return '-';
  const parts = iso.split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : iso;
}

function dateTime(value) {
  return value ? new Date(value).toLocaleString('en-IN') : '-';
}

function today() {
  return isoDate(new Date());
}

function monthStart() {
  return today().slice(0, 7) + '-01';
}

function isoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isoFromSheet(value) {
  if (!value) return '';
  return plainDate(value);
}

function plainDate(value) {
  if (!value) return '';
  const text = String(value).trim();
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const slash = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (slash) return `${slash[3]}-${String(slash[2]).padStart(2, '0')}-${String(slash[1]).padStart(2, '0')}`;
  return text.slice(0, 10);
}

function nowIso() {
  return new Date().toISOString();
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function safeJson(value, fallback) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

function uniqueSorted(values) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b)));
}

function uniqueByName(rows) {
  const map = new Map();
  rows.forEach((row) => {
    if (!row.name || map.has(row.name)) return;
    map.set(row.name, row);
  });
  return Array.from(map.values());
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

async function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function toast(message, type = 'info') {
  $('toast').textContent = message;
  $('toast').className = 'toast show ' + type;
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => $('toast').className = 'toast', 3000);
}
