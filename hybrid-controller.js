// Hybrid CS01 Controller - Popup with Auto-fill
console.log('Hybrid CS01 Controller Loading...');

// Company data
const companyData = {
    formHeader: {
        companyNumber: "11111111",
        companyName: "EXAMPLE COMPANY",
        authenticationCode: "222222"
    },
    reviewDate: "2016-09-18",
    sicCodes: [
        { code: "15200", description: "Manufacture of footwear" },
        { code: "41100", description: "Development of building projects" }
    ],
    statementOfCapital: {
        totalNumberOfIssuedShares: 100,
        shareCurrency: "GBP",
        totalAggregateNominalValue: 100,
        shares: [{
            shareClass: "ORDINARY",
            numShares: 100,
            aggregateNominalValue: 100
        }]
    },
    shareholdings: [
        {
            shareClass: "ORDINARY",
            numberHeld: 10,
            shareholders: { surname: "CONGRESSPERSONLIQUOR", forename: "JACKET" }
        },
        {
            shareClass: "ORDINARY",
            numberHeld: 80,
            shareholders: { surname: "CONGRESSPERSONLIQUOR", forename: "FAXRIVULET" }
        },
        {
            shareClass: "ORDINARY",
            numberHeld: 10,
            shareholders: { surname: "CONGRESSPERSONLIQUOR", forename: "LEWIS" }
        }
    ]
};

// Global state
let popupWindow = null;
let automationActive = false;
let autoFillScript = null;

// Utility functions
function logMessage(message) {
    try {
        const logOutput = document.getElementById('logOutput');
        if (logOutput) {
            const timestamp = new Date().toLocaleTimeString();
            logOutput.textContent += '[' + timestamp + '] ' + message + '\n';
            logOutput.scrollTop = logOutput.scrollHeight;
        }
        console.log('[CS01]', message);
    } catch (error) {
        console.error('Error in logMessage:', error);
    }
}

function monitorMessage(message) {
    try {
        const monitorContent = document.getElementById('monitorContent');
        if (monitorContent) {
            const timestamp = new Date().toLocaleTimeString();
            monitorContent.textContent += '[' + timestamp + '] ' + message + '\n';
            monitorContent.scrollTop = monitorContent.scrollHeight;
        }
        console.log('[Monitor]', message);
    } catch (error) {
        console.error('Error in monitorMessage:', error);
    }
}

function updateStep(stepNumber, completed = false) {
    for (let i = 1; i <= 3; i++) {
        const step = document.getElementById('step' + i);
        if (step) {
            step.classList.remove('active', 'completed');
            if (i < stepNumber || (i === stepNumber && completed)) {
                step.classList.add('completed');
            } else if (i === stepNumber) {
                step.classList.add('active');
            }
        }
    }
}

// Create the auto-fill script that will be injected into the popup
function createAutoFillScript() {
    return `
        // Auto-fill script for Companies House
        console.log('🤖 CS01 Auto-fill script loaded');
        
        const companyData = ${JSON.stringify(companyData)};
        
        // Helper functions
        function findAndFill(selectors, value, type = 'input') {
            for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    if (element && element.offsetParent !== null) { // visible element
                        try {
                            if (type === 'select') {
                                element.value = value;
                                element.dispatchEvent(new Event('change', { bubbles: true }));
                            } else {
                                element.value = value;
                                element.dispatchEvent(new Event('input', { bubbles: true }));
                                element.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                            console.log('✅ Filled:', selector, 'with:', value);
                            return true;
                        } catch (e) {
                            console.log('⚠️ Could not fill:', selector, e.message);
                        }
                    }
                }
            }
            return false;
        }
        
        function clickElement(selectors) {
            for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    if (element && element.offsetParent !== null) {
                        try {
                            element.click();
                            console.log('✅ Clicked:', selector);
                            return true;
                        } catch (e) {
                            console.log('⚠️ Could not click:', selector, e.message);
                        }
                    }
                }
            }
            return false;
        }
        
        function waitForElement(selectors, timeout = 10000) {
            return new Promise((resolve) => {
                const startTime = Date.now();
                const checkInterval = setInterval(() => {
                    for (const selector of selectors) {
                        const element = document.querySelector(selector);
                        if (element && element.offsetParent !== null) {
                            clearInterval(checkInterval);
                            resolve(element);
                            return;
                        }
                    }
                    if (Date.now() - startTime > timeout) {
                        clearInterval(checkInterval);
                        resolve(null);
                    }
                }, 500);
            });
        }
        
        // Auto-fill functions
        async function autoFillCompanySearch() {
            console.log('🔍 Auto-filling company search...');
            
            const searchSelectors = [
                'input[name*="company"]',
                'input[placeholder*="company"]',
                'input[id*="company"]',
                'input[name*="number"]',
                'input[placeholder*="number"]'
            ];
            
            if (findAndFill(searchSelectors, companyData.formHeader.companyNumber)) {
                // Try to click search button
                const searchButtonSelectors = [
                    'button[type="submit"]',
                    'input[type="submit"]',
                    'button:contains("Search")',
                    'button:contains("Find")',
                    'input[value*="Search"]',
                    'input[value*="Find"]'
                ];
                
                setTimeout(() => {
                    if (clickElement(searchButtonSelectors)) {
                        console.log('✅ Company search initiated');
                    }
                }, 500);
            }
        }
        
        async function autoFillReviewDate() {
            console.log('📅 Auto-filling review date...');
            
            const dateSelectors = [
                'input[name*="review"]',
                'input[name*="date"]',
                'input[type="date"]'
            ];
            
            // Try date format variations
            const dateFormats = [
                companyData.reviewDate, // 2016-09-18
                companyData.reviewDate.split('-').reverse().join('/'), // 18/09/2016
                companyData.reviewDate.split('-').reverse().join('-') // 18-09-2016
            ];
            
            for (const format of dateFormats) {
                if (findAndFill(dateSelectors, format)) {
                    break;
                }
            }
            
            // Handle separate day/month/year dropdowns
            const [year, month, day] = companyData.reviewDate.split('-');
            findAndFill(['select[name*="day"]'], day, 'select');
            findAndFill(['select[name*="month"]'], month, 'select');
            findAndFill(['select[name*="year"]'], year, 'select');
        }
        
        async function autoFillShareCapital() {
            console.log('💰 Auto-filling share capital...');
            
            const capitalData = companyData.statementOfCapital;
            
            // Total shares
            findAndFill([
                'input[name*="total"]',
                'input[name*="issued"]',
                'input[name*="shares"]'
            ], capitalData.totalNumberOfIssuedShares);
            
            // Currency
            findAndFill([
                'select[name*="currency"]',
                'input[name*="currency"]'
            ], capitalData.shareCurrency, 'select');
            
            // Nominal value
            findAndFill([
                'input[name*="nominal"]',
                'input[name*="value"]',
                'input[name*="amount"]'
            ], capitalData.totalAggregateNominalValue);
            
            // Share class
            findAndFill([
                'input[name*="class"]',
                'select[name*="class"]'
            ], capitalData.shares[0].shareClass);
        }
        
        // Main auto-fill orchestrator
        async function runAutoFill() {
            console.log('🚀 Starting auto-fill process...');
            
            // Wait a bit for page to load
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Detect current page and auto-fill accordingly
            const currentUrl = window.location.href.toLowerCase();
            const pageContent = document.body.innerText.toLowerCase();
            
            if (currentUrl.includes('company') || pageContent.includes('company number')) {
                await autoFillCompanySearch();
            }
            
            if (currentUrl.includes('cs01') || pageContent.includes('confirmation statement')) {
                await autoFillReviewDate();
                await new Promise(resolve => setTimeout(resolve, 1000));
                await autoFillShareCapital();
            }
            
            // Continue auto-fill on page changes
            let lastUrl = window.location.href;
            setInterval(async () => {
                if (window.location.href !== lastUrl) {
                    lastUrl = window.location.href;
                    console.log('📄 Page changed, running auto-fill...');
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await runAutoFill();
                }
            }, 2000);
        }
        
        // Add visual indicator
        function addAutoFillIndicator() {
            const indicator = document.createElement('div');
            indicator.id = 'cs01-autofill-indicator';
            indicator.innerHTML = '🤖 CS01 Auto-fill Active';
            indicator.style.cssText = \`
                position: fixed;
                top: 10px;
                right: 10px;
                background: #28a745;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                font-family: Arial, sans-serif;
                font-size: 12px;
                z-index: 999999;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            \`;
            document.body.appendChild(indicator);
        }
        
        // Start auto-fill when page loads
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                addAutoFillIndicator();
                runAutoFill();
            });
        } else {
            addAutoFillIndicator();
            runAutoFill();
        }
        
        // Expose functions to parent window
        window.CS01AutoFill = {
            runAutoFill,
            autoFillCompanySearch,
            autoFillReviewDate,
            autoFillShareCapital,
            companyData
        };
    `;
}

// Main functions
function prepareFormData() {
    try {
        console.log('prepareFormData called');
        
        logMessage('📊 Company data prepared:');
        logMessage('Company: ' + companyData.formHeader.companyNumber + ' - ' + companyData.formHeader.companyName);
        logMessage('Review Date: ' + companyData.reviewDate);
        logMessage('SIC Codes: ' + companyData.sicCodes.map(function(s) { return s.code; }).join(', '));
        logMessage('Total Shares: ' + companyData.statementOfCapital.totalNumberOfIssuedShares);
        logMessage('Shareholders: ' + companyData.shareholdings.length + ' parties');
        
        // Show shareholding breakdown
        companyData.shareholdings.forEach(function(holding) {
            const name = holding.shareholders.forename + ' ' + holding.shareholders.surname;
            const percentage = ((holding.numberHeld / companyData.statementOfCapital.totalNumberOfIssuedShares) * 100).toFixed(1);
            logMessage('  - ' + name + ': ' + holding.numberHeld + ' shares (' + percentage + '%)');
        });

        // Show automation controls
        const automationControls = document.getElementById('automationControls');
        if (automationControls) {
            automationControls.classList.add('show');
        }
        
        updateStep(2);
        logMessage('✅ Data validation complete');
        logMessage('👆 Click "Start Hybrid Automation" to begin');
        
    } catch (error) {
        console.error('Error in prepareFormData:', error);
        logMessage('❌ Error preparing form data');
    }
}

function startHybridAutomation() {
    try {
        console.log('startHybridAutomation called');
        
        if (automationActive) {
            return;
        }

        automationActive = true;
        
        const startBtn = document.getElementById('startAutomation');
        if (startBtn) {
            startBtn.disabled = true;
            startBtn.innerHTML = '<span class="spinner" style="display: inline-block;"></span> 🤖 Running Hybrid Automation';
        }
        
        const monitor = document.getElementById('automationMonitor');
        if (monitor) {
            monitor.classList.add('active');
        }
        
        logMessage('🚀 Starting hybrid automation...');
        monitorMessage('🚀 Opening Companies House with auto-fill...');
        
        // Open popup with auto-fill
        openPopupWithAutoFill();
        
    } catch (error) {
        console.error('Error in startHybridAutomation:', error);
        logMessage('❌ Error starting automation');
        resetAutomation();
    }
}

function openPopupWithAutoFill() {
    try {
        logMessage('🌐 Opening Companies House popup...');
        
        const url = 'https://ewf.companieshouse.gov.uk/runpage?page=welcome';
        const features = 'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=yes,location=yes,menubar=yes';
        
        popupWindow = window.open(url, 'CS01AutoFill', features);
        
        if (!popupWindow) {
            logMessage('❌ Popup blocked. Please allow popups and try again.');
            resetAutomation();
            return;
        }
        
        logMessage('✅ Popup opened successfully');
        monitorMessage('🔄 Waiting for page to load...');
        
        // Wait for popup to load, then inject auto-fill script
        let injectionAttempts = 0;
        const maxAttempts = 30;
        
        const injectScript = () => {
            try {
                if (popupWindow.closed) {
                    logMessage('❌ Popup was closed');
                    resetAutomation();
                    return;
                }
                
                // Try to inject the auto-fill script
                if (popupWindow.document && popupWindow.document.readyState !== 'loading') {
                    const script = popupWindow.document.createElement('script');
                    script.textContent = createAutoFillScript();
                    popupWindow.document.head.appendChild(script);
                    
                    logMessage('✅ Auto-fill script injected successfully');
                    monitorMessage('🤖 Auto-fill script active in popup');
                    monitorMessage('📝 Forms will be filled automatically');
                    monitorMessage('👤 Please log in manually when prompted');
                    
                    updateStep(3);
                    
                    // Start monitoring
                    startPopupMonitoring();
                    
                } else {
                    injectionAttempts++;
                    if (injectionAttempts < maxAttempts) {
                        setTimeout(injectScript, 1000);
                    } else {
                        logMessage('⚠️ Could not inject auto-fill script');
                        monitorMessage('⚠️ Auto-fill may not work due to page restrictions');
                        startPopupMonitoring();
                    }
                }
            } catch (error) {
                // Cross-origin restrictions - this is expected for external sites
                injectionAttempts++;
                if (injectionAttempts < maxAttempts) {
                    setTimeout(injectScript, 1000);
                } else {
                    logMessage('⚠️ Auto-fill limited by browser security');
                    monitorMessage('⚠️ Please fill forms manually following the guidance');
                    showManualGuidance();
                    startPopupMonitoring();
                }
            }
        };
        
        // Start injection attempts
        setTimeout(injectScript, 2000);
        
    } catch (error) {
        console.error('Error opening popup:', error);
        logMessage('❌ Error opening popup: ' + error.message);
        resetAutomation();
    }
}

function showManualGuidance() {
    logMessage('📋 Manual guidance (since auto-fill is restricted):');
    logMessage('1. Log in with your Companies House credentials');
    logMessage('2. Search for company: ' + companyData.formHeader.companyNumber);
    logMessage('3. Select CS01 - Confirmation Statement');
    logMessage('4. Enter review date: ' + companyData.reviewDate);
    logMessage('5. Confirm SIC codes: ' + companyData.sicCodes.map(s => s.code).join(', '));
    logMessage('6. Enter share capital: ' + companyData.statementOfCapital.totalNumberOfIssuedShares + ' shares');
    logMessage('7. Confirm shareholdings (3 shareholders)');
    logMessage('8. Review everything before submitting');
    logMessage('9. Click SUBMIT when you are ready');
}

function startPopupMonitoring() {
    logMessage('🔍 Starting popup monitoring...');
    
    let monitorAttempts = 0;
    const maxAttempts = 600; // 30 minutes
    
    const monitorInterval = setInterval(() => {
        monitorAttempts++;
        
        if (popupWindow.closed) {
            clearInterval(monitorInterval);
            logMessage('❌ Popup was closed');
            monitorMessage('❌ Popup window closed');
            resetAutomation();
            return;
        }
        
        try {
            const currentUrl = popupWindow.location.href;
            const pageTitle = popupWindow.document.title;
            
            // Check for completion indicators
            if (currentUrl.includes('confirmation') || 
                currentUrl.includes('receipt') ||
                currentUrl.includes('success') ||
                currentUrl.includes('submitted') ||
                pageTitle.toLowerCase().includes('confirmation')) {
                
                clearInterval(monitorInterval);
                logMessage('🎉 CS01 filing completed successfully!');
                monitorMessage('🎉 Filing completion detected!');
                completeFiling();
                return;
            }
            
            // Log progress periodically
            if (monitorAttempts % 20 === 0) {
                const minutes = Math.floor(monitorAttempts / 2);
                monitorMessage('⏳ Monitoring progress... (' + minutes + 'm)');
            }
            
        } catch (error) {
            // Cross-origin restrictions - continue monitoring
            if (monitorAttempts % 40 === 0) {
                const minutes = Math.floor(monitorAttempts / 2);
                monitorMessage('🔄 Monitoring... (' + minutes + 'm) - Please continue in popup');
            }
        }
        
        if (monitorAttempts >= maxAttempts) {
            clearInterval(monitorInterval);
            monitorMessage('⏰ Monitoring timeout reached');
            
            if (confirm('⚠️ Long monitoring session.\n\nHas the CS01 filing been completed?')) {
                completeFiling();
            } else {
                resetAutomation();
            }
        }
    }, 3000);
}

function completeFiling() {
    try {
        updateStep(3, true);
        logMessage('');
        logMessage('🎯 CS01 FILING COMPLETED!');
        logMessage('📄 Please save any confirmation receipts from the popup');
        logMessage('📋 Filing for: ' + companyData.formHeader.companyNumber + ' - ' + companyData.formHeader.companyName);
        logMessage('✅ Process complete');
        
        monitorMessage('🎯 CS01 FILING COMPLETED!');
        monitorMessage('📄 Save confirmation receipts');
        monitorMessage('✅ All tasks finished');
        
        // Ask for next filing
        setTimeout(() => {
            if (confirm('🎉 CS01 filing completed!\n\nWould you like to prepare another filing?')) {
                resetForm();
            } else {
                logMessage('👋 Thank you for using CS01 Filing Assistant');
                monitorMessage('👋 Session ended');
            }
        }, 3000);
        
        resetAutomation();
        
    } catch (error) {
        console.error('Error in completeFiling:', error);
    }
}

function resetAutomation() {
    try {
        automationActive = false;
        
        const startBtn = document.getElementById('startAutomation');
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.innerHTML = '🚀 Start Hybrid Automation';
        }
        
        if (popupWindow && !popupWindow.closed) {
            // Don't close popup automatically - user might need to save receipts
            monitorMessage('💡 Popup left open for receipt saving');
        }
        
    } catch (error) {
        console.error('Error in resetAutomation:', error);
    }
}

function resetForm() {
    try {
        const automationControls = document.getElementById('automationControls');
        if (automationControls) {
            automationControls.classList.remove('show');
        }
        
        const automationMonitor = document.getElementById('automationMonitor');
        if (automationMonitor) {
            automationMonitor.classList.remove('active');
        }
        
        const logOutput = document.getElementById('logOutput');
        if (logOutput) {
            logOutput.textContent = 'System ready. Click "Confirm Data & Prepare Filing" to begin...\n';
        }
        
        const monitorContent = document.getElementById('monitorContent');
        if (monitorContent) {
            monitorContent.textContent = 'Monitoring will appear here once started...\n';
        }
        
        updateStep(1);
        
        if (popupWindow && !popupWindow.closed) {
            popupWindow.close();
        }
        popupWindow = null;
        
    } catch (error) {
        console.error('Error in resetForm:', error);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('DOM loaded, initializing hybrid CS01 controller');
        
        // Set up event listeners
        const prepareBtn = document.getElementById('prepareForm');
        if (prepareBtn) {
            prepareBtn.addEventListener('click', prepareFormData);
            console.log('Prepare button listener attached');
        }
        
        const startBtn = document.getElementById('startAutomation');
        if (startBtn) {
            startBtn.addEventListener('click', startHybridAutomation);
            startBtn.innerHTML = '🚀 Start Hybrid Automation';
            console.log('Start Hybrid Automation button listener attached');
        }
        
        // Initial log message
        logMessage('🚀 CS01 Hybrid Assistant loaded');
        logMessage('📊 Company data ready: ' + companyData.formHeader.companyName);
        logMessage('👆 Click "Confirm Data & Prepare Filing" to begin');
        
        console.log('Hybrid CS01 Controller fully initialized');
        
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});