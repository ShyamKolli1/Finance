// Firebase Cloud Sync Manager
// Syncs data between localStorage and Firebase Cloud

const SYNC_ENABLED_KEY = 'firestoreSyncEnabled';

// Get current user ID from Firebase Auth
function getUserId() {
  if (!window.firebaseAuth || !window.firebaseAuth.currentUser) {
    console.warn('⚠️ No user logged in');
    return null;
  }
  return window.firebaseAuth.currentUser.uid;
}

// Get user email
function getUserEmail() {
  if (!window.firebaseAuth || !window.firebaseAuth.currentUser) {
    return null;
  }
  return window.firebaseAuth.currentUser.email;
}

// Check if sync is enabled
function isSyncEnabled() {
  return localStorage.getItem(SYNC_ENABLED_KEY) === 'true';
}

// Enable cloud sync
function enableSync() {
  localStorage.setItem(SYNC_ENABLED_KEY, 'true');
  console.log('✅ Cloud sync enabled');
  syncToCloud();
}

// Disable cloud sync
function disableSync() {
  localStorage.setItem(SYNC_ENABLED_KEY, 'false');
  console.log('❌ Cloud sync disabled');
}

// Sync local data to cloud
async function syncToCloud() {
  const userId = getUserId();
  if (!isSyncEnabled() || !window.firebaseDb || !userId) return;
  
  try {
    const financeData = localStorage.getItem('financeData');
    const financeLabels = localStorage.getItem('financeLabels');
    
    if (financeData) {
      const dataRef = window.firebaseDoc(window.firebaseDb, 'users', userId, 'finance', 'transactions');
      await window.firebaseSetDoc(dataRef, {
        data: financeData,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    }
    
    if (financeLabels) {
      const labelsRef = window.firebaseDoc(window.firebaseDb, 'users', userId, 'finance', 'labels');
      await window.firebaseSetDoc(labelsRef, {
        data: financeLabels,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    }
    
    console.log('☁️ Data synced to cloud');
  } catch (error) {
    console.error('Sync to cloud failed:', error);
  }
}

// Sync cloud data to local
async function syncFromCloud() {
  const userId = getUserId();
  if (!isSyncEnabled() || !window.firebaseDb || !userId) return;
  
  try {
    
    // Get transactions
    const dataRef = window.firebaseDoc(window.firebaseDb, 'users', userId, 'finance', 'transactions');
    const dataSnap = await window.firebaseGetDoc(dataRef);
    
    if (dataSnap.exists()) {
      const cloudData = dataSnap.data().data;
      localStorage.setItem('financeData', cloudData);
      console.log('☁️ Transactions synced from cloud');
    }
    
    // Get labels
    const labelsRef = window.firebaseDoc(window.firebaseDb, 'users', userId, 'finance', 'labels');
    const labelsSnap = await window.firebaseGetDoc(labelsRef);
    
    if (labelsSnap.exists()) {
      const cloudLabels = labelsSnap.data().data;
      localStorage.setItem('financeLabels', cloudLabels);
      console.log('☁️ Labels synced from cloud');
    }
    
    // Reload the page data
    if (typeof loadData === 'function') loadData();
    if (typeof render === 'function') render();
    
  } catch (error) {
    console.error('Sync from cloud failed:', error);
  }
}

// Real-time listener for cloud changes
function setupRealtimeSync() {
  const userId = getUserId();
  if (!isSyncEnabled() || !window.firebaseDb || !userId) return;
  
  // Listen for transaction changes
  const dataRef = window.firebaseDoc(window.firebaseDb, 'users', userId, 'finance', 'transactions');
  window.firebaseOnSnapshot(dataRef, (doc) => {
    if (doc.exists()) {
      const cloudData = doc.data().data;
      const localData = localStorage.getItem('financeData');
      
      // Only update if cloud data is different
      if (cloudData !== localData) {
        localStorage.setItem('financeData', cloudData);
        console.log('🔄 Real-time update: Transactions updated from cloud');
        
        // Reload the page data
        if (typeof loadData === 'function') loadData();
        if (typeof render === 'function') render();
        if (typeof initCharts === 'function') initCharts();
      }
    }
  });
  
  // Listen for label changes
  const labelsRef = window.firebaseDoc(window.firebaseDb, 'users', userId, 'finance', 'labels');
  window.firebaseOnSnapshot(labelsRef, (doc) => {
    if (doc.exists()) {
      const cloudLabels = doc.data().data;
      const localLabels = localStorage.getItem('financeLabels');
      
      // Only update if cloud data is different
      if (cloudLabels !== localLabels) {
        localStorage.setItem('financeLabels', cloudLabels);
        console.log('🔄 Real-time update: Labels updated from cloud');
        
        // Reload labels
        if (typeof updateLabels === 'function') updateLabels();
      }
    }
  });
  
  console.log('👂 Real-time sync listener active');
}

// Initialize sync on page load
window.addEventListener('load', () => {
  if (window.firebaseAuth) {
    window.firebaseOnAuthStateChanged(window.firebaseAuth, (user) => {
      if (user && isSyncEnabled() && window.firebaseDb) {
        console.log('👤 Logged in as:', user.email);
        syncFromCloud();
        setupRealtimeSync();
      } else if (!user) {
        console.log('👤 Not logged in');
      }
    });
  }
});

// Logout function
async function logout() {
  try {
    await window.firebaseSignOut(window.firebaseAuth);
    localStorage.setItem(SYNC_ENABLED_KEY, 'false');
    console.log('👋 Logged out');
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Logout failed:', error);
    alert('Logout failed. Please try again.');
  }
}

// Auto-sync when data changes
const originalSetItem = Storage.prototype.setItem;
Storage.prototype.setItem = function(key, value) {
  originalSetItem.call(this, key, value);
  
  // Sync to cloud when finance data changes
  if ((key === 'financeData' || key === 'financeLabels') && isSyncEnabled()) {
    syncToCloud();
  }
};

// Export functions
window.CloudSync = {
  enable: enableSync,
  disable: disableSync,
  isEnabled: isSyncEnabled,
  syncToCloud: syncToCloud,
  syncFromCloud: syncFromCloud,
  getUserId: getUserId,
  getUserEmail: getUserEmail,
  logout: logout
};

console.log('✅ Cloud Sync Manager loaded');
