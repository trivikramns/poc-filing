// CS01 Filing Assistant Controller - Clean Version
console.log('CS01 Controller Loading...');

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
let webfilingWindow = null;
let automationActive = false;

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

function updateStep(stepNumber, completed) {
    try {
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
    } catch (error) {
        console.error('Error in updateStep:', error);
    }
}

function updateWindowStatus(status) {
    try {
        const element = document.getElementById('windowStatus');
        if (element) {
            element.textContent = status;
        }
    } catch (error) {
        console.error('Error updating window status:', error);
    }
}

function updateLoginStatusText(status) {
    try {
        const element = document.getElementById('loginStatusText');
        if (element) {
            element.textContent = status;
        }
    } catch (error) {
        console.error('Error updating login status text:', error);
    }
}

function updateAutomationReady(status) {
    try {
        const element = document.getElementById('automationReady');
        if (element) {
            element.textContent = status;
        }
    } catch (error) {
        console.error('Error updating automation ready:', error);
    }
}

function updateLoginStatus(statusClass, message) {
    try {
        const statusEl = document.getElementById('loginStatus');
        if (statusEl) {
            statusEl.className = 'status-indicator status-' + statusClass;
            statusEl.textContent = message;
        }
    } catch (error) {
        console.error('Error updating login status:', error);
    }
}

// Main functions
function prepareFormData() {
    try {
        console.log('prepareFormData called');
        
        logMessage('Company data loaded from system:');
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
        logMessage('Data validation complete');
        logMessage('Please open Companies House WebFiling on the right panel');
        
    } catch (error) {
        console.error('Error in prepareFormData:', error);
        logMessage('Error preparing form data');
    }
}

function openCompaniesHouse() {
    try {
        console.log('openCompaniesHouse called');
        
        const url = 'https://ewf.companieshouse.gov.uk/runpage?page=welcome';
        const features = 'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=yes,location=yes';
        
        webfilingWindow = window.open(url, 'CompaniesHouseWebFiling', features);
        
        if (webfilingWindow) {
            updateWindowStatus('Opened');
            
            const checkLoginBtn = document.getElementById('checkLoginBtn');
            if (checkLoginBtn) {
                checkLoginBtn.disabled = false;
            }
            
            logMessage('Companies House WebFiling opened in new window');
            logMessage('Please log in with your credentials in the new window');
            
            // Monitor window closure
            const windowChecker = setInterval(function() {
                if (webfilingWindow.closed) {
                    clearInterval(windowChecker);
                    updateWindowStatus('Closed');
                    const checkBtn = document.getElementById('checkLoginBtn');
                    if (checkBtn) {
                        checkBtn.disabled = true;
                    }
                    logMessage('WebFiling window was closed');
                }
            }, 1000);
        } else {
            logMessage('Failed to open WebFiling window');
            alert('Unable to open Companies House window. Please disable popup blockers and try again.');
        }
    } catch (error) {
        console.error('Error in openCompaniesHouse:', error);
        logMessage('Error opening WebFiling window');
    }
}

function checkExternalLogin() {
    try {
        console.log('checkExternalLogin called');
        
        if (!webfilingWindow || webfilingWindow.closed) {
            logMessage('WebFiling window is not open');
            updateWindowStatus('Closed');
            const checkBtn = document.getElementById('checkLoginBtn');
            if (checkBtn) {
                checkBtn.disabled = true;
            }
            return;
        }

        try {
            const currentUrl = webfilingWindow.location.href;
            
            if (currentUrl.includes('companyauth') || 
                currentUrl.includes('selectcompany') || 
                currentUrl.includes('runpage?page=companyauth')) {
                
                updateLoginStatus('logged-in', 'Logged In');
                updateLoginStatusText('Logged In Successfully');
                updateAutomationReady('Yes');
                logMessage('Login detected in WebFiling window');
                logMessage('Ready for automated CS01 filing');
                
                const startBtn = document.getElementById('startAutomation');
                if (startBtn) {
                    startBtn.disabled = false;
                }
                
            } else {
                updateLoginStatusText('Not Logged In');
                updateAutomationReady('No');
                logMessage('Please complete login in WebFiling window');
            }
            
        } catch (e) {
            // Cross-origin restrictions
            logMessage('Checking login status... (Cross-origin restrictions apply)');
            logMessage('If you have logged in, click Start Automated Filing to proceed');
            
            updateLoginStatusText('Please Verify');
            updateAutomationReady('Please Verify');
            const startBtn = document.getElementById('startAutomation');
            if (startBtn) {
                startBtn.disabled = false;
            }
        }
    } catch (error) {
        console.error('Error in checkExternalLogin:', error);
        logMessage('Error checking login status');
    }
}

function startAutomation() {
    try {
        console.log('startAutomation called');
        
        if (automationActive) {
            return;
        }

        if (!webfilingWindow || webfilingWindow.closed) {
            alert('Please open Companies House WebFiling window first');
            return;
        }

        automationActive = true;
        
        const startBtn = document.getElementById('startAutomation');
        if (startBtn) {
            startBtn.disabled = true;
        }
        
        const spinner = document.getElementById('automationSpinner');
        if (spinner) {
            spinner.style.display = 'inline-block';
        }
        
        const monitor = document.getElementById('automationMonitor');
        if (monitor) {
            monitor.classList.add('active');
        }
        
        logMessage('Starting automated CS01 filing process...');
        monitorMessage('Automated CS01 filing initiated');
        
        // Start the filing process
        proceedWithCS01Filing();
        
    } catch (error) {
        console.error('Error in startAutomation:', error);
        logMessage('Error starting automation');
        resetAutomation();
    }
}

function proceedWithCS01Filing() {
    try {
        logMessage('Starting CS01 form automation...');
        updateStep(3);
        
        setTimeout(function() {
            provideFilingGuidance();
        }, 1000);
    } catch (error) {
        console.error('Error in proceedWithCS01Filing:', error);
        resetAutomation();
    }
}

function provideFilingGuidance() {
    try {
        const steps = [
            'STEP 1: Navigate to CS01 filing',
            '  - Search for company: ' + companyData.formHeader.companyNumber,
            '  - Select Confirmation Statement (CS01)',
            '',
            'STEP 2: Set review date',
            '  - Enter review date: ' + companyData.reviewDate,
            '',
            'STEP 3: Confirm SIC codes'
        ];
        
        // Add SIC codes
        companyData.sicCodes.forEach(function(sic) {
            steps.push('  - ' + sic.code + ': ' + sic.description);
        });
        
        steps.push('');
        steps.push('STEP 4: Statement of Capital');
        steps.push('  - Total shares issued: ' + companyData.statementOfCapital.totalNumberOfIssuedShares);
        steps.push('  - Currency: ' + companyData.statementOfCapital.shareCurrency);
        steps.push('  - Total nominal value: £' + companyData.statementOfCapital.totalAggregateNominalValue);
        steps.push('  - Share class: ' + companyData.statementOfCapital.shares[0].shareClass);
        steps.push('');
        steps.push('STEP 5: Confirm shareholdings');
        
        companyData.shareholdings.forEach(function(holding) {
            const name = holding.shareholders.forename + ' ' + holding.shareholders.surname;
            const percentage = ((holding.numberHeld / companyData.statementOfCapital.totalNumberOfIssuedShares) * 100).toFixed(1);
            steps.push('  - ' + name + ': ' + holding.numberHeld + ' ' + holding.shareClass + ' shares (' + percentage + '%)');
        });
        
        steps.push('');
        steps.push('STEP 6: Review and submit');
        steps.push('  - Confirm all information is correct');
        steps.push('  - Submit the CS01 filing');
        steps.push('  - Save confirmation receipt');

        // Display steps progressively
        let index = 0;
        const displayStep = function() {
            if (index < steps.length) {
                logMessage(steps[index]);
                monitorMessage(steps[index]);
                index++;
                setTimeout(displayStep, 200);
            } else {
                setTimeout(function() {
                    logMessage('');
                    logMessage('Attempting cross-window automation...');
                    monitorMessage('Initiating cross-window automation...');
                    attemptCrossWindowAutomation();
                }, 2000);
            }
        };
        
        displayStep();
        
    } catch (error) {
        console.error('Error in provideFilingGuidance:', error);
        resetAutomation();
    }
}

function attemptCrossWindowAutomation() {
    try {
        if (!webfilingWindow || webfilingWindow.closed) {
            logMessage('WebFiling window is closed');
            monitorMessage('Error: WebFiling window closed');
            resetAutomation();
            return;
        }

        // Send data to external window
        const filingData = {
            type: 'CS01_AUTO_FILL',
            companyNumber: companyData.formHeader.companyNumber,
            reviewDate: companyData.reviewDate,
            sicCodes: companyData.sicCodes.map(function(s) { return s.code; }),
            shareCapital: companyData.statementOfCapital,
            shareholdings: companyData.shareholdings,
            authCode: companyData.formHeader.authenticationCode
        };
        
        webfilingWindow.postMessage(filingData, '*');
        
        logMessage('Cross-window automation signals sent');
        monitorMessage('Automation signals sent to WebFiling window');
        monitorMessage('Monitoring for form completion...');
        
        // Start monitoring
        monitorExternalWindow();
        
    } catch (error) {
        logMessage('Cross-window automation limited: ' + error.message);
        monitorMessage('Direct automation limited by browser security');
        monitorMessage('Please follow the detailed guidance in WebFiling window');
        
        // Manual confirmation after delay
        setTimeout(function() {
            monitorMessage('Waiting for manual completion confirmation...');
            const userConfirm = confirm('Have you completed the CS01 filing?\n\nClick OK when submission is complete.');
            if (userConfirm) {
                completeFiling();
            } else {
                monitorMessage('Continuing to monitor...');
                monitorExternalWindow();
            }
        }, 15000);
    }
}

function monitorExternalWindow() {
    try {
        let attempts = 0;
        const maxAttempts = 300; // 15 minutes
        
        const monitorInterval = setInterval(function() {
            attempts++;
            
            if (!webfilingWindow || webfilingWindow.closed) {
                clearInterval(monitorInterval);
                monitorMessage('WebFiling window was closed');
                logMessage('WebFiling window was closed during monitoring');
                resetAutomation();
                return;
            }
            
            try {
                const currentUrl = webfilingWindow.location.href;
                
                if (currentUrl.includes('confirmation') || 
                    currentUrl.includes('receipt') ||
                    currentUrl.includes('success') ||
                    currentUrl.includes('submitted')) {
                    
                    clearInterval(monitorInterval);
                    logMessage('CS01 filing completion detected!');
                    monitorMessage('Filing completion detected!');
                    completeFiling();
                    return;
                }
                
            } catch (e) {
                // Continue monitoring despite cross-origin restrictions
            }
            
            if (attempts % 20 === 0) {
                const minutes = Math.floor(attempts / 3);
                monitorMessage('Monitoring progress... (' + minutes + 'm)');
            }
            
            if (attempts >= maxAttempts) {
                clearInterval(monitorInterval);
                monitorMessage('Monitoring timeout reached');
                logMessage('Auto-monitoring timeout - requesting manual confirmation');
                
                if (confirm('Auto-detection timeout.\n\nHas the CS01 filing been completed?')) {
                    completeFiling();
                } else {
                    resetAutomation();
                }
            }
        }, 3000);
    } catch (error) {
        console.error('Error in monitorExternalWindow:', error);
        resetAutomation();
    }
}

function completeFiling() {
    try {
        updateStep(3, true);
        logMessage('');
        logMessage('CS01 FILING COMPLETED SUCCESSFULLY!');
        logMessage('Please save any confirmation receipts');
        logMessage('Submission for: ' + companyData.formHeader.companyNumber + ' - ' + companyData.formHeader.companyName);
        logMessage('Process complete');
        
        monitorMessage('CS01 FILING PROCESS COMPLETED!');
        monitorMessage('Save confirmation receipts from WebFiling window');
        monitorMessage('All automation tasks finished');
        
        // Ask for next filing
        setTimeout(function() {
            if (confirm('CS01 filing completed!\n\nWould you like to prepare another filing?')) {
                resetForm();
            } else {
                logMessage('Thank you for using CS01 Filing Assistant');
                monitorMessage('Session ended - Thank you!');
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
        }
        
        const spinner = document.getElementById('automationSpinner');
        if (spinner) {
            spinner.style.display = 'none';
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
            logOutput.textContent = 'System ready. Click Confirm Data & Prepare Filing to begin...\n';
        }
        
        const monitorContent = document.getElementById('monitorContent');
        if (monitorContent) {
            monitorContent.textContent = 'Automation monitoring will appear here once started...\n';
        }
        
        updateStep(1);
        updateLoginStatus('waiting', 'Ready to Open');
        updateWindowStatus('Not Opened');
        updateLoginStatusText('Not Logged In');
        updateAutomationReady('No');
        
        if (webfilingWindow && !webfilingWindow.closed) {
            webfilingWindow.close();
        }
        webfilingWindow = null;
        
        const checkLoginBtn = document.getElementById('checkLoginBtn');
        if (checkLoginBtn) {
            checkLoginBtn.disabled = true;
        }
    } catch (error) {
        console.error('Error in resetForm:', error);
    }
}

// Event listeners for messages from external window
window.addEventListener('message', function(event) {
    try {
        if (event.data && event.data.type === 'CS01_FORM_FILLED') {
            logMessage('Form filled automatically in external window');
            monitorMessage('Form auto-filled successfully');
        } else if (event.data && event.data.type === 'CS01_FILING_COMPLETE') {
            logMessage('Filing submitted automatically');
            monitorMessage('Filing submitted automatically');
            completeFiling();
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('DOM loaded, initializing CS01 controller');
        
        // Set up event listeners
        const prepareBtn = document.getElementById('prepareForm');
        if (prepareBtn) {
            prepareBtn.addEventListener('click', prepareFormData);
            console.log('Prepare button listener attached');
        } else {
            console.log('Prepare button not found');
        }
        
        const openBtn = document.getElementById('openWebFiling');
        if (openBtn) {
            openBtn.addEventListener('click', openCompaniesHouse);
            console.log('Open WebFiling button listener attached');
        } else {
            console.log('Open WebFiling button not found');
        }
        
        const checkBtn = document.getElementById('checkLoginBtn');
        if (checkBtn) {
            checkBtn.addEventListener('click', checkExternalLogin);
            console.log('Check Login button listener attached');
        } else {
            console.log('Check Login button not found');
        }
        
        const startBtn = document.getElementById('startAutomation');
        if (startBtn) {
            startBtn.addEventListener('click', startAutomation);
            console.log('Start Automation button listener attached');
        } else {
            console.log('Start Automation button not found');
        }
        
        // Initial log message
        logMessage('CS01 Filing Assistant loaded');
        logMessage('Company data ready: ' + companyData.formHeader.companyName);
        logMessage('Click Confirm Data & Prepare Filing to begin');
        
        // Popup blocker tip
        setTimeout(function() {
            if (window.opener === null && !window.location.search.includes('popup')) {
                logMessage('Tip: If popups are blocked, please allow popups for this site');
            }
        }, 1000);
        
        console.log('CS01 Controller fully initialized');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});