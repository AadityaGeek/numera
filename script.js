/**
 * Numera - Modern Mathematical Toolkit
 * Clean, fast, accessible calculation engine
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTabs();
    initKeyboardShortcuts();
});

/* ==========================================================================
   THEME TOGGLE
   ========================================================================== */

function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const savedTheme = localStorage.getItem('numera_theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('numera_theme', newTheme);
        });
    }
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.getElementById('themeIcon');
    if (!themeIcon) return;

    if (theme === 'dark') {
        // Render Moon icon
        themeIcon.innerHTML = `
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        `;
    } else {
        // Render Sun icon
        themeIcon.innerHTML = `
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        `;
    }
}

/* ==========================================================================
   TAB NAVIGATION
   ========================================================================== */

function initTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    const panels = document.querySelectorAll('.tool-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');

            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            panels.forEach(p => {
                p.classList.remove('active');
            });

            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
                // Focus the first input of the active tool
                const firstInput = targetPanel.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                }
            }
        });
    });
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const modal = document.getElementById('contactModal');
            if (modal && modal.classList.contains('open')) return;
            const activeCard = document.querySelector('.tool-card.active');
            if (!activeCard) return;
            const primaryBtn = activeCard.querySelector('.btn-primary');
            if (primaryBtn) {
                primaryBtn.click();
            }
        } else if (e.key === 'Escape') {
            closeContactModal();
        }
    });

    // Close modal on backdrop click
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeContactModal();
            }
        });
    }
}

/* ==========================================================================
   DEVELOPER CONTACT MODAL
   ========================================================================== */

function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
    }
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    }
}

/* ==========================================================================
   HELPER UTILITIES
   ========================================================================== */

function showError(errorBoxId, message) {
    const box = document.getElementById(errorBoxId);
    if (!box) return;
    box.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>${message}</span>
    `;
    box.classList.add('visible');
}

function hideError(errorBoxId) {
    const box = document.getElementById(errorBoxId);
    if (box) {
        box.classList.remove('visible');
        box.innerHTML = '';
    }
}

function showResultBox(boxId) {
    const box = document.getElementById(boxId);
    if (box) box.classList.add('visible');
}

function hideResultBox(boxId) {
    const box = document.getElementById(boxId);
    if (box) box.classList.remove('visible');
}

function formatSuperscript(num) {
    const superscripts = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
        '-': '⁻'
    };
    return String(num).split('').map(ch => superscripts[ch] || ch).join('');
}

function copyResult(resultBoxId) {
    const box = document.getElementById(resultBoxId);
    if (!box) return;
    const copyBtn = box.querySelector('.btn-copy');

    // Gather text from result items
    const values = box.querySelectorAll('.result-item-value, .result-item-detail');
    let textToCopy = '';
    values.forEach(v => {
        const text = v.innerText.trim();
        if (text && text !== '-') {
            textToCopy += (textToCopy ? ' | ' : '') + text;
        }
    });

    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
        if (copyBtn) {
            const originalContent = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Copied!</span>
            `;
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.innerHTML = originalContent;
                copyBtn.classList.remove('copied');
            }, 2000);
        }
    }).catch(() => {
        console.error('Failed to copy to clipboard');
    });
}

function parseNumberList(str) {
    if (!str) return [];
    return str
        .replace(/[,;\s]+/g, ' ')
        .trim()
        .split(' ')
        .map(v => Number(v))
        .filter(n => !isNaN(n) && n !== 0);
}

/* ==========================================================================
   EXAMPLE CHIPS HANDLER
   ========================================================================== */

function setExample(tool, data) {
    if (tool === 'root') {
        document.getElementById('rootNumber').value = data.num;
        document.getElementById('rootRange').value = data.root;
        updateRootValue(data.root);
        calculateRoot();
    } else if (tool === 'power') {
        document.getElementById('powerBase').value = data.base;
        document.getElementById('powerExp').value = data.exp;
        calculatePower();
    } else if (tool === 'quotient') {
        document.getElementById('dividend').value = data.dividend;
        document.getElementById('divisor').value = data.divisor;
        calculateQuotientAndRemainder();
    } else if (tool === 'lcm') {
        document.getElementById('lcmRange').value = data.val;
        calculateLCM();
    } else if (tool === 'hcf') {
        document.getElementById('hcfRange').value = data.val;
        calculateHCF();
    } else if (tool === 'factor') {
        document.getElementById('factorNumber').value = data.num;
        calculateFactorsAndPrimeFactors();
    }
}

/* ==========================================================================
   TOOL 1: ROOT CALCULATION
   ========================================================================== */

function updateRootValue(value) {
    const valElem = document.getElementById('rootValue');
    if (valElem) valElem.innerText = value;
    // Auto-recalculate if number is filled
    const numInput = document.getElementById('rootNumber');
    if (numInput && numInput.value !== '') {
        calculateRoot();
    }
}

function calculateRoot() {
    hideError('rootErrorBox');
    const numVal = document.getElementById('rootNumber').value.trim();
    const rootVal = parseFloat(document.getElementById('rootRange').value);

    if (numVal === '') {
        showError('rootErrorBox', 'Please enter a number.');
        hideResultBox('rootResultBox');
        return;
    }

    const number = parseFloat(numVal);

    if (isNaN(number)) {
        showError('rootErrorBox', 'Please enter a valid numeric value.');
        hideResultBox('rootResultBox');
        return;
    }

    if (number < 0 && rootVal % 2 === 0) {
        showError('rootErrorBox', `Even root (${rootVal}) of a negative number is not a real number.`);
        hideResultBox('rootResultBox');
        return;
    }

    let result;
    if (number < 0 && rootVal % 2 !== 0) {
        result = -Math.pow(Math.abs(number), 1 / rootVal);
    } else {
        result = Math.pow(number, 1 / rootVal);
    }

    // Format output
    const formattedResult = Number.isInteger(result) ? result : Number(result.toFixed(6));
    const labelElem = document.getElementById('rootResultLabel');
    if (labelElem) {
        labelElem.innerText = rootVal === 2 ? `√${number}` : `${formatSuperscript(rootVal)}√${number}`;
    }
    document.getElementById('rootResultVal').innerText = formattedResult;
    showResultBox('rootResultBox');
}

function clearRoot() {
    document.getElementById('rootNumber').value = '';
    document.getElementById('rootRange').value = '2';
    updateRootValue('2');
    hideError('rootErrorBox');
    hideResultBox('rootResultBox');
    document.getElementById('rootNumber').focus();
}

/* ==========================================================================
   TOOL 2: POWER CALCULATION
   ========================================================================== */

function calculatePower() {
    hideError('powerErrorBox');
    const baseVal = document.getElementById('powerBase').value.trim();
    const expVal = document.getElementById('powerExp').value.trim();

    if (baseVal === '' || expVal === '') {
        showError('powerErrorBox', 'Please enter both a base and an exponent.');
        hideResultBox('powerResultBox');
        return;
    }

    const base = parseFloat(baseVal);
    const exponent = parseFloat(expVal);

    if (isNaN(base) || isNaN(exponent)) {
        showError('powerErrorBox', 'Please enter valid numerical values.');
        hideResultBox('powerResultBox');
        return;
    }

    if (base === 0 && exponent < 0) {
        showError('powerErrorBox', 'Cannot raise 0 to a negative exponent (division by zero).');
        hideResultBox('powerResultBox');
        return;
    }

    const result = Math.pow(base, exponent);
    const formattedResult = Number.isInteger(result) ? result : (Math.abs(result) > 1e12 || Math.abs(result) < 1e-6 ? result.toExponential(6) : Number(result.toFixed(8)));

    const labelElem = document.getElementById('powerResultLabel');
    if (labelElem) {
        labelElem.innerText = `${base}${formatSuperscript(exponent)}`;
    }
    document.getElementById('powerResultVal').innerText = formattedResult;
    showResultBox('powerResultBox');
}

function clearPower() {
    document.getElementById('powerBase').value = '';
    document.getElementById('powerExp').value = '';
    hideError('powerErrorBox');
    hideResultBox('powerResultBox');
    document.getElementById('powerBase').focus();
}

/* ==========================================================================
   TOOL 3: EUCLIDEAN DIVISION (QUOTIENT & REMAINDER)
   ========================================================================== */

function calculateQuotientAndRemainder() {
    hideError('quotientErrorBox');
    const divVal = document.getElementById('dividend').value.trim();
    const divisorVal = document.getElementById('divisor').value.trim();

    if (divVal === '' || divisorVal === '') {
        showError('quotientErrorBox', 'Please enter both a dividend and a divisor.');
        hideResultBox('quotientResultBox');
        return;
    }

    const dividend = parseFloat(divVal);
    const divisor = parseFloat(divisorVal);

    if (isNaN(dividend) || isNaN(divisor)) {
        showError('quotientErrorBox', 'Please enter valid numerical values.');
        hideResultBox('quotientResultBox');
        return;
    }

    if (divisor === 0) {
        showError('quotientErrorBox', 'Division by zero is undefined.');
        hideResultBox('quotientResultBox');
        return;
    }

    const quotient = Math.trunc(dividend / divisor);
    const remainder = Number((dividend - (quotient * divisor)).toFixed(8));

    document.getElementById('quotientVal').innerText = quotient;
    document.getElementById('remainderVal').innerText = remainder;
    document.getElementById('divisionFormulaVal').innerText = `${dividend} = (${divisor} × ${quotient}) + ${remainder}`;
    showResultBox('quotientResultBox');
}

function clearQuotient() {
    document.getElementById('dividend').value = '';
    document.getElementById('divisor').value = '';
    hideError('quotientErrorBox');
    hideResultBox('quotientResultBox');
    document.getElementById('dividend').focus();
}

/* ==========================================================================
   TOOL 4: LCM CALCULATION
   ========================================================================== */

const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        const t = b;
        b = a % b;
        a = t;
    }
    return a;
};

const lcmTwo = (a, b) => {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
};

function calculateLCM() {
    hideError('lcmErrorBox');
    const inputStr = document.getElementById('lcmRange').value.trim();

    if (!inputStr) {
        showError('lcmErrorBox', 'Please enter two or more positive numbers.');
        hideResultBox('lcmResultBox');
        return;
    }

    const numbers = parseNumberList(inputStr);

    if (numbers.length < 2) {
        showError('lcmErrorBox', 'Please enter at least 2 non-zero numbers separated by commas or spaces.');
        hideResultBox('lcmResultBox');
        return;
    }

    const result = numbers.reduce((acc, num) => lcmTwo(acc, num));
    document.getElementById('lcmResultLabel').innerText = `LCM(${numbers.join(', ')})`;
    document.getElementById('lcmResultVal').innerText = result;
    showResultBox('lcmResultBox');
}

function clearLCM() {
    document.getElementById('lcmRange').value = '';
    hideError('lcmErrorBox');
    hideResultBox('lcmResultBox');
    document.getElementById('lcmRange').focus();
}

/* ==========================================================================
   TOOL 5: HCF / GCD CALCULATION
   ========================================================================== */

function calculateHCF() {
    hideError('hcfErrorBox');
    const inputStr = document.getElementById('hcfRange').value.trim();

    if (!inputStr) {
        showError('hcfErrorBox', 'Please enter two or more numbers.');
        hideResultBox('hcfResultBox');
        return;
    }

    const numbers = parseNumberList(inputStr);

    if (numbers.length < 2) {
        showError('hcfErrorBox', 'Please enter at least 2 non-zero numbers separated by commas or spaces.');
        hideResultBox('hcfResultBox');
        return;
    }

    const result = numbers.reduce((acc, num) => gcd(acc, num));
    document.getElementById('hcfResultLabel').innerText = `GCD / HCF(${numbers.join(', ')})`;
    document.getElementById('hcfResultVal').innerText = result;
    showResultBox('hcfResultBox');
}

function clearHCF() {
    document.getElementById('hcfRange').value = '';
    hideError('hcfErrorBox');
    hideResultBox('hcfResultBox');
    document.getElementById('hcfRange').focus();
}

/* ==========================================================================
   TOOL 6: FACTORS AND PRIME FACTORIZATION
   ========================================================================== */

function calculateFactorsAndPrimeFactors() {
    hideError('factorErrorBox');
    const val = document.getElementById('factorNumber').value.trim();

    if (!val) {
        showError('factorErrorBox', 'Please enter a positive integer.');
        hideResultBox('factorResultBox');
        return;
    }

    const number = parseInt(val, 10);

    if (isNaN(number) || number < 1) {
        showError('factorErrorBox', 'Please enter a valid positive integer (>= 1).');
        hideResultBox('factorResultBox');
        return;
    }

    if (number > 100000000) {
        showError('factorErrorBox', 'Number is too large for client-side factor computation (max 100,000,000).');
        hideResultBox('factorResultBox');
        return;
    }

    // 1. Find all divisors
    let smallDivisors = [];
    let largeDivisors = [];
    const limit = Math.floor(Math.sqrt(number));

    for (let i = 1; i <= limit; i++) {
        if (number % i === 0) {
            smallDivisors.push(i);
            if (i !== number / i) {
                largeDivisors.unshift(number / i);
            }
        }
    }
    const allDivisors = smallDivisors.concat(largeDivisors);

    // 2. Prime Factorization
    let n = number;
    let primeFactorMap = {};

    for (let d = 2; d * d <= n; d++) {
        while (n % d === 0) {
            primeFactorMap[d] = (primeFactorMap[d] || 0) + 1;
            n /= d;
        }
    }
    if (n > 1) {
        primeFactorMap[n] = (primeFactorMap[n] || 0) + 1;
    }

    // Format prime exponent form
    let primeParts = [];
    let primeList = [];
    for (const [p, count] of Object.entries(primeFactorMap)) {
        primeList.push(p);
        if (count > 1) {
            primeParts.push(`${p}${formatSuperscript(count)}`);
        } else {
            primeParts.push(`${p}`);
        }
    }

    const canonicalForm = number === 1 ? '1' : `${primeParts.join(' × ')} = ${number}`;
    const primeFactorsStr = number === 1 ? 'None (Unit)' : primeList.join(', ');

    document.getElementById('primeFactorExpVal').innerText = canonicalForm;
    document.getElementById('primeFactorVal').innerText = primeFactorsStr;
    document.getElementById('factorCountLabel').innerText = `All Divisors (${allDivisors.length} total)`;
    document.getElementById('factorVal').innerText = allDivisors.join(', ');

    showResultBox('factorResultBox');
}

function clearFactors() {
    document.getElementById('factorNumber').value = '';
    hideError('factorErrorBox');
    hideResultBox('factorResultBox');
    document.getElementById('factorNumber').focus();
}
