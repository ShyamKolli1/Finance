// Firebase Cloud Sync Manager
// Syncs data between localStorage and Firebase Cloud

const SYNC_ENABLED_KEY = 'firestoreSyncEnabled';

// Get current user ID from Firebase Auth
function getUserId() {
  if (!window.firebaseAuth || !window.firebaseAuth.currentUser) {
    console.warn('⚠️ No user logged in - cannot get user ID');
    return null;
  }
  const uid = window.firebaseAuth.currentUser.uid;
  console.log('🆔 Current User ID:', uid);
  return uid;
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

function refreshUiAfterSync() {
  if (typeof window.loadData === 'function') {
    window.loadData();
  }

  const refreshFns = [
    'updateLabels',
    'updateLabelList',
    'loadLabels',
    'render',
    'renderAll',
    'initCharts',
    'populateLabelCompareList',
    'updateMonthlyAnalytics'
  ];

  refreshFns.forEach((fnName) => {
    if (typeof window[fnName] === 'function') {
      try {
        window[fnName]();
      } catch (e) {
        console.warn(`⚠️ UI refresh skipped for ${fnName}:`, e.message);
      }
    }
  });
}

// Enable cloud sync
function enableSync() {
  localStorage.setItem(SYNC_ENABLED_KEY, 'true');
  console.log('✅ Cloud sync enabled');
  
  // Sync to cloud immediately
  syncToCloud();
  
  // Setup real-time listeners
  setupRealtimeSync();
}

// Disable cloud sync
function disableSync() {
  localStorage.setItem(SYNC_ENABLED_KEY, 'false');
  console.log('❌ Cloud sync disabled');
}

// Sync local data to cloud
async function syncToCloud() {
  const userId = getUserId();
  if (!isSyncEnabled() || !window.firebaseDb || !userId) {
    console.warn('⚠️ Cannot sync to cloud:', { enabled: isSyncEnabled(), db: !!window.firebaseDb, userId });
    return;
  }
  
  try {
    const financeData = localStorage.getItem('financeData');
    const financeLabels = localStorage.getItem('financeLabels');
    
    console.log('☁️ Syncing to cloud for user:', userId);
    
    if (financeData) {
      const dataRef = window.firebaseDoc(window.firebaseDb, 'users', userId, 'finance', 'transactions');
      await window.firebaseSetDoc(dataRef, {
        data: financeData,
        lastUpdated: new Date().toISOString(),
        deviceInfo: navigator.userAgent.substring(0, 100)
      }, { merge: true });
      console.log('✅ Transactions synced to cloud');
    }
    
    if (financeLabels) {
      const labelsRef = window.firebaseDoc(window.firebaseDb, 'users', userId, 'finance', 'labels');
      await window.firebaseSetDoc(labelsRef, {
        data: financeLabels,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      console.log('✅ Labels synced to cloud');
    }
    
    console.log('☁️ ✅ Data synced to cloud successfully');
  } catch (error) {
    console.error('❌ Sync to cloud failed:', error);
    console.error('Error details:', error.message, error.code);
  }
}

// Sync cloud data to local
async function syncFromCloud() {
  const userId = getUserId();
  if (!isSyncEnabled() || !window.firebaseDb || !userId) {
    console.warn('⚠️ Cannot sync from cloud:', { enabled: isSyncEnabled(), db: !!window.firebaseDb, userId });
    return;
  }
  
  try {
    console.log('📥 Syncing from cloud for user:', userId);
    
    // Get transactions
    const dataRef = window.firebaseDoc(window.firebaseDb, 'users', userId, 'finance', 'transactions');
    const dataSnap = await window.firebaseGetDoc(dataRef);
    
    if (dataSnap.exists()) {
      const cloudData = dataSnap.data().data;
      localStorage.setItem('financeData', cloudData);
      console.log('✅ Transactions synced from cloud');
    } else {
      console.log('ℹ️ No transactions in cloud yet');
    }
    
    // Get labels
    const labelsRef = window.firebaseDoc(window.firebaseDb, 'users', userId, 'finance', 'labels');
    const labelsSnap = await window.firebaseGetDoc(labelsRef);
    
    if (labelsSnap.exists()) {
      const cloudLabels = labelsSnap.data().data;
      localStorage.setItem('financeLabels', cloudLabels);
      console.log('✅ Labels synced from cloud');
    } else {
      console.log('ℹ️ No labels in cloud yet');
    }
    
    refreshUiAfterSync();
    
    console.log('📥 ✅ Cloud data synced successfully');
  } catch (error) {
    console.error('❌ Sync from cloud failed:', error);
    console.error('Error details:', error.message, error.code);
  }
}

// Real-time listener for cloud changes
function setupRealtimeSync() {
  const userId = getUserId();
  if (!isSyncEnabled() || !window.firebaseDb || !userId) {
    console.warn('⚠️ Cannot setup real-time sync:', { enabled: isSyncEnabled(), db: !!window.firebaseDb, userId });
    return;
  }
  
  console.log('📡 Setting up real-time sync for user:', userId);
  
  // Listen for transaction changes
  const dataRef = window.firebaseDoc(window.firebaseDb, 'users', userId, 'finance', 'transactions');
  window.firebaseOnSnapshot(dataRef, (doc) => {
    if (doc.exists()) {
      const cloudData = doc.data().data;
      const localData = localStorage.getItem('financeData');
      
      // Only update if cloud data is different
      if (cloudData !== localData) {
        // Temporarily disable auto-sync to avoid loop
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = Storage.prototype.setItem.__original || Storage.prototype.setItem;
        localStorage.setItem('financeData', cloudData);
        localStorage.setItem = originalSetItem;
        
        console.log('🔄 Real-time update: Transactions updated from cloud');
        
        refreshUiAfterSync();
      }
    }
  }, (error) => {
    console.error('Real-time sync error (transactions):', error);
  });
  
  // Listen for label changes
  const labelsRef = window.firebaseDoc(window.firebaseDb, 'users', userId, 'finance', 'labels');
  window.firebaseOnSnapshot(labelsRef, (doc) => {
    if (doc.exists()) {
      const cloudLabels = doc.data().data;
      const localLabels = localStorage.getItem('financeLabels');
      
      // Only update if cloud data is different
      if (cloudLabels !== localLabels) {
        // Temporarily disable auto-sync to avoid loop
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = Storage.prototype.setItem.__original || Storage.prototype.setItem;
        localStorage.setItem('financeLabels', cloudLabels);
        localStorage.setItem = originalSetItem;
        
        console.log('🔄 Real-time update: Labels updated from cloud');
        
        refreshUiAfterSync();
      }
    }
  }, (error) => {
    console.error('Real-time sync error (labels):', error);
  });
  
  console.log('👂 Real-time sync listener active');
}

// Initialize sync on page load
window.addEventListener('load', () => {
  if (window.firebaseAuth) {
    window.firebaseOnAuthStateChanged(window.firebaseAuth, (user) => {
      if (user && window.firebaseDb) {
        console.log('═══════════════════════════════════════');
        console.log('👤 Logged in as:', user.email);
        console.log('🆔 User ID:', user.uid);
        console.log('📍 Cloud Storage Path: /users/' + user.uid + '/finance/');
        console.log('⚠️ SYNC REQUIREMENT: Use this SAME email on all devices!');
        console.log('═══════════════════════════════════════');
        
        // Auto-enable sync for logged in users
        if (!isSyncEnabled()) {
          localStorage.setItem(SYNC_ENABLED_KEY, 'true');
          console.log('✅ Auto-enabled cloud sync');
        }
        
        if (isSyncEnabled()) {
          console.log('📥 Downloading data from cloud...');
          syncFromCloud();
          console.log('📡 Setting up real-time sync...');
          setupRealtimeSync();
        }
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
Storage.prototype.setItem.__original = originalSetItem;

Storage.prototype.setItem = function(key, value) {
  originalSetItem.call(this, key, value);
  
  // Sync to cloud when finance data changes
  if ((key === 'financeData' || key === 'financeLabels') && isSyncEnabled()) {
    console.log('💾 Local data changed, syncing to cloud...', key);
    setTimeout(() => syncToCloud(), 100); // Small delay to batch updates
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
