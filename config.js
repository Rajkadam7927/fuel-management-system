const APP_CONFIG = {
  appName: 'Fuel Management System',
  companyName: 'SUMEET SSG MAHARASHTRA EMS PRIVATE LIMITED',
  subtitle: 'Maharashtra 108 Ambulance Services (MEMS)',
  version: '3.0.0',
  googleScriptUrl: '',
  googleSheetName: 'Fuel Data',
  roles: ['SuperAdmin', 'Admin', 'Operator', 'Viewer'],
  rolePermissions: {
    SuperAdmin: {
      pages: ['dashboard','fuel-entry','fuel-approval','fuel-entries','fuel-vendors','fuel-cards','vehicles','drivers','base-locations','vehicle-types','daily-report','weekly-report','monthly-report','district-report','vehicle-report','vendor-report','mileage-report','exception-report','cluster-report','users','settings','audit-log'],
      canCreate: true, canEdit: true, canDelete: true, canApprove: true, canExport: true, canManageUsers: true, seeAllDistricts: true
    },
    Admin: {
      pages: ['dashboard','fuel-entry','fuel-approval','fuel-entries','fuel-vendors','fuel-cards','vehicles','drivers','base-locations','vehicle-types','daily-report','weekly-report','monthly-report','district-report','vehicle-report','vendor-report','mileage-report','exception-report','cluster-report','settings','audit-log'],
      canCreate: true, canEdit: true, canDelete: true, canApprove: true, canExport: true, canManageUsers: false, seeAllDistricts: false
    },
    Operator: {
      pages: ['dashboard','fuel-entry','fuel-entries','daily-report','weekly-report','monthly-report','district-report','vehicle-report','vendor-report','mileage-report','exception-report','cluster-report'],
      canCreate: true, canEdit: false, canDelete: false, canApprove: false, canExport: true, canManageUsers: false, seeAllDistricts: false
    },
    Viewer: {
      pages: ['dashboard','fuel-entries','daily-report','weekly-report','monthly-report','district-report','vehicle-report','vendor-report','mileage-report','exception-report','cluster-report'],
      canCreate: false, canEdit: false, canDelete: false, canApprove: false, canExport: true, canManageUsers: false, seeAllDistricts: true
    }
  },
  navMenu: [
    { section: 'Dashboard', items: [{ page: 'dashboard', icon: 'dashboard', label: 'Dashboard' }] },
    { section: 'Fuel Management', items: [
      { page: 'fuel-entry', icon: 'fuel', label: 'Fuel Entry' },
      { page: 'fuel-approval', icon: 'approve', label: 'Fuel Approval' },
      { page: 'fuel-entries', icon: 'entries', label: 'Fuel Entries' },
      { page: 'fuel-vendors', icon: 'vendor', label: 'Fuel Vendors' },
      { page: 'fuel-cards', icon: 'card', label: 'Fuel Cards' }
    ] },
    { section: 'Fleet Management', items: [
      { page: 'vehicles', icon: 'vehicle', label: 'Vehicles' },
      { page: 'drivers', icon: 'driver', label: 'Drivers' },
      { page: 'base-locations', icon: 'location', label: 'Base Locations' },
      { page: 'vehicle-types', icon: 'types', label: 'Vehicle Types' }
    ] },
    { section: 'Reports', items: [
      { page: 'daily-report', icon: 'report', label: 'Daily Reports' },
      { page: 'weekly-report', icon: 'report', label: 'Weekly Reports' },
      { page: 'monthly-report', icon: 'report', label: 'Monthly Reports' },
      { page: 'district-report', icon: 'map', label: 'District Reports' },
      { page: 'vehicle-report', icon: 'vehicle', label: 'Vehicle Reports' },
      { page: 'vendor-report', icon: 'vendor', label: 'Vendor Reports' },
      { page: 'mileage-report', icon: 'mileage', label: 'Mileage Reports' },
      { page: 'exception-report', icon: 'alert', label: 'Exception Reports' },
      { page: 'cluster-report', icon: 'map', label: 'Cluster Reports' }
    ] },
    { section: 'Administration', items: [
      { page: 'users', icon: 'users', label: 'Users' },
      { page: 'settings', icon: 'settings', label: 'Settings' },
      { page: 'audit-log', icon: 'audit', label: 'Audit Log' }
    ] }
  ],
  defaults: {
    districts: ['Pune', 'Thane', 'Nashik', 'Nagpur', 'Aurangabad', 'Kolhapur', 'Solapur'],
    clusters: ['Pune Urban', 'Pune Rural', 'Thane Urban', 'Thane Rural', 'Nashik', 'Nagpur', 'Kolhapur'],
    vendors: ['BPCL', 'HPCL', 'IOCL', 'Reliance Petroleum', 'Nayara Energy'],
    products: ['DIESEL', 'PETROL', 'CNG'],
    vehicleTypes: ['BLS Ambulance', 'ALS Ambulance', 'Bike Responder', 'Support Vehicle']
  }
};
