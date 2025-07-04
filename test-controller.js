// Simple CS01 Controller - Test Version
console.log('Starting CS01 Controller...');

// Test if script is loading
alert('Controller script loaded successfully!');

// Company data
const companyData = {
    companyNumber: "11111111",
    companyName: "EXAMPLE COMPANY",
    authCode: "222222",
    reviewDate: "2016-09-18"
};

// Global variables
let webfilingWindow = null;
let automationActive = false;

// Simple logging function
function addLog(message) {
    console.log('[CS01]', message);
    const logElement = document.getElementById('logOutput');
    if (logElement) {
        const time = new Date().toLocaleTimeString();
        logElement.innerHTML += `[${time}] ${message}<br>`;
        logElement.scrollTop = logElement.scrollHeight;
    } else {
        console.log('Log element not found');
    }
}

// Test function 1
function prepareFormData() {
    console.log('prepareFormData called!');
    alert('Prepare Form Data button clicked!');
    
    addLog('📊 Preparing company data...');
    addLog(`Company: ${companyData.companyNumber} - ${companyData.companyName}`);
    addLog(`Review Date: ${companyData.reviewDate}`);
    addLog(`Auth Code: ${companyData.authCode}`);
    
    // Show automation controls
    const controls = document.getElementById('automationControls');
    if (controls) {
        controls.style.display = 'block';
        addLog('✅ Automation controls shown');
    }
    
    // Update step
    updateProgressStep(2);
    addLog('✅ Data preparation complete');
}

// Test function 2
function openCompaniesHouse() {
    console.log('openCompaniesHouse called!');
    alert('Open Companies House button clicked!');
    
    addLog('🌐 Opening Companies House WebFiling...');
    
    const url = 'https://ewf.companieshouse.gov.uk/runpage?page=welcome';
    
    try {
        webfilingWindow = window.open(url, 'CompaniesHouse', 'width=1200,height=800');
        
        if (webfilingWindow) {
            addLog('✅ WebFiling window opened successfully');
            updateWindowStatus('Opened');
            
            // Enable check login button
            const checkBtn = document.getElementById('checkLoginBtn');
            if (checkBtn) {
                checkBtn.disabled = false;
                addLog('🔓 Check Login button enabled');
            }
        } else {
            addLog('❌ Failed to open window - check popup blockers');
        }
    } catch (error) {
        addLog('❌ Error opening window: ' + error.message);
    }
}

// Test function 3
function checkExternalLogin() {
    console.log('checkExternalLogin called!');
    alert('Check Login button clicked!');
    
    addLog('🔍 Checking login status...');
    
    if (!webfilingWindow || webfilingWindow.closed) {
        addLog('❌ WebFiling window not open');
        return;
    }
    
    // Simulate login check
    addLog('✅ Login status checked');
    updateLoginStatus('Please verify manually');
    
    // Enable start automation
    const startBtn = document.getElementById('startAutomation');
    if (startBtn) {
        startBtn.disabled = false;
        addLog('🚀 Start Automation button enabled');
    }
}

// Test function 4
function startAutomation() {
    console.log('startAutomation called!');
    alert('Start Automation button clicked!');
    
    if (automationActive) {
        addLog('⚠️ Automation already running');
        return;
    }
    
    automationActive = true;
    addLog('🚀 Starting CS01 automation...');
    
    // Show spinner
    const spinner = document.getElementById('automationSpinner');
    if (spinner) {
        spinner.style.display = 'inline-block';
    }
    
    // Show monitor
    const monitor = document.getElementById('automationMonitor');
    if (monitor) {
        monitor.classList.add('active');
        addMonitorLog('🤖 Automation started');
    }
    
    updateProgressStep(3);
    
    // Simulate automation steps
    setTimeout(() => {
        addLog('📋 Step 1: Navigate to CS01 filing');
        addMonitorLog('📋 Navigating to CS01 form...');
    }, 1000);
    
    setTimeout(() => {
        addLog('📅 Step 2: Enter review date');
        addMonitorLog('📅 Entering review date...');
    }, 2000);
    
    setTimeout(() => {
        addLog('✅ Automation simulation complete');
        addMonitorLog('✅ All steps completed');
        resetAutomation();
    }, 5000);
}

// Helper functions
function addMonitorLog(message) {
    const monitor = document.getElementById('monitorContent');
    if (monitor) {
        const time = new Date().toLocaleTimeString();
        monitor.innerHTML += `[${time}] ${message}<br>`;
        monitor.scrollTop = monitor.scrollHeight;
    }
}

function updateProgressStep(stepNum) {
    for (let i = 1; i <= 3; i++) {
        const step = document.getElementById(`step${i}`);
        if (step) {
            step.classList.remove('active', 'completed');
            if (i < stepNum) {
                step.classList.add('completed');
            } else if (i === stepNum) {
                step.classList.add('active');
            }
        }
    }
}

function updateWindowStatus(status) {
    const element = document.getElementById('windowStatus');
    if (element) {
        element.textContent = status;
    }
}

function updateLoginStatus(status) {
    const element = document.getElementById('loginStatusText');
    if (element) {
        element.textContent = status;
    }
}

function resetAutomation() {
    automationActive = false;
    
    const spinner = document.getElementById('automationSpinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
    
    const startBtn = document.getElementById('startAutomation');
    if (startBtn) {
        startBtn.disabled = false;
    }
    
    addLog('🔄 Automation reset');
}

// Initialize when page loads
function initializeController() {
    console.log('Initializing controller...');
    
    // Test if elements exist
    const elements = [
        'prepareForm',
        'openWebFiling', 
        'checkLoginBtn',
        'startAutomation',
        'logOutput'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✅ Found element: ${id}`);
        } else {
            console.log(`❌ Missing element: ${id}`);
        }
    });
    
    // Add event listeners with direct assignment
    const prepareBtn = document.getElementById('prepareForm');
    if (prepareBtn) {
        prepareBtn.onclick = prepareFormData;
        console.log('✅ Prepare button connected');
    }
    
    const openBtn = document.getElementById('openWebFiling');
    if (openBtn) {
        openBtn.onclick = openCompaniesHouse;
        console.log('✅ Open button connected');
    }
    
    const checkBtn = document.getElementById('checkLoginBtn');
    if (checkBtn) {
        checkBtn.onclick = checkExternalLogin;
        console.log('✅ Check button connected');
    }
    
    const startBtn = document.getElementById('startAutomation');
    if (startBtn) {
        startBtn.onclick = startAutomation;
        console.log('✅ Start button connected');
    }
    
    // Initial message
    addLog('🚀 CS01 Filing Assistant ready');
    addLog('👆 Click "Confirm Data & Prepare Filing" to start');
    
    console.log('Controller initialization complete!');
}

// Wait for DOM and initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeController);
} else {
    initializeController();
}

// Also try immediate initialization
setTimeout(initializeController, 100);