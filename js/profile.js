let terminalUser = 'guest';
let terminalContent, currentLine, commandHistory = [], historyIndex = -1, currentCommand = '';

// Wait for DOM and user info
function setupTerminalWithUser(userName) {
    terminalUser = userName || 'guest';
    terminalContent = document.getElementById('terminal-content');
    commandHistory = [];
    historyIndex = -1;
    currentCommand = '';
    terminalContent.innerHTML = '';
    addNewInputLine();
}

const commands = {
    'help': () => {
        return `Available commands:\nclear      - Clear terminal screen\nhelp       - Show this help\nmyorders   - Show your orders`;
    },
    'clear': () => {
        terminalContent.innerHTML = '';
        addNewInputLine();
        return null;
    },
    'myorders': () => {
        return 'Order history feature coming soon!';
    }
};

function addNewInputLine() {
    // Remove any existing input line
    const prevInput = terminalContent.querySelector('input.command-input');
    if (prevInput && prevInput.parentElement) {
        prevInput.parentElement.remove();
    }
    const newLine = document.createElement('div');
    newLine.className = 'line';
    newLine.innerHTML = `
        <span class="prompt">C:\\Users\\${terminalUser}&gt;</span>
        <input class="command-input" id="current-line" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
    `;
    terminalContent.appendChild(newLine);
    currentLine = terminalContent.querySelector('#current-line');
    currentLine.value = '';
    currentLine.focus();
    terminalContent.scrollTop = terminalContent.scrollHeight;
    // Attach listeners
    currentLine.addEventListener('input', (e) => {
        currentCommand = e.target.value;
    });
    currentLine.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                processCommand();
                break;
            case 'ArrowUp':
                navigateHistory('up');
                e.preventDefault();
                break;
            case 'ArrowDown':
                navigateHistory('down');
                e.preventDefault();
                break;
        }
    });
    terminalContent.addEventListener('click', () => {
        currentLine.focus();
    });
}

function processCommand() {
    const cmd = currentCommand.trim().toLowerCase();
    // Remove the current input line before displaying output
    const lastInput = terminalContent.querySelector('input.command-input');
    if (lastInput && lastInput.parentElement) {
        lastInput.parentElement.remove();
    }
    // Show the entered command
    const commandDiv = document.createElement('div');
    commandDiv.className = 'line';
    commandDiv.innerHTML = `<span class="prompt">C:\\Users\\${terminalUser}&gt;</span><span class="command-text">${currentCommand}</span>`;
    terminalContent.appendChild(commandDiv);
    // If clear, run clear and return
    if (cmd === 'clear') {
        commands['clear']();
        currentCommand = '';
        return;
    }
    // Show output if any
    if (currentCommand.trim()) {
        const output = document.createElement('div');
        output.className = 'output';
        if (commands[cmd]) {
            const result = commands[cmd]();
            if (result !== null) {
                output.textContent = result;
                terminalContent.appendChild(output);
            }
        } else {
            output.textContent = `'${currentCommand}' is not recognized as an internal or external command.`;
            terminalContent.appendChild(output);
        }
    }
    if (currentCommand.trim()) {
        commandHistory.push(currentCommand);
        historyIndex = commandHistory.length;
    }
    currentCommand = '';
    addNewInputLine();
}

function updateCurrentLine() {
    if (currentLine) {
        currentLine.value = currentCommand;
    }
}

function navigateHistory(direction) {
    if (commandHistory.length === 0) return;
    if (direction === 'up') {
        historyIndex = Math.max(0, historyIndex - 1);
    } else {
        historyIndex = Math.min(commandHistory.length, historyIndex + 1);
    }
    currentCommand = historyIndex < commandHistory.length ? commandHistory[historyIndex] : '';
    updateCurrentLine();
}

// Wait for DOM and user info from profile.html
window.addEventListener('DOMContentLoaded', () => {
    // Try to get username from the profile card
    let name = 'guest';
    const nameEl = document.getElementById('profile-name');
    if (nameEl && nameEl.textContent && nameEl.textContent !== 'Loading...') {
        name = nameEl.textContent;
    }
    setupTerminalWithUser(name);
    // Listen for profile name changes (in case loaded async)
    const observer = new MutationObserver(() => {
        let newName = nameEl.textContent;
        if (newName && newName !== 'Loading...' && newName !== terminalUser) {
            setupTerminalWithUser(newName);
        }
    });
    observer.observe(nameEl, { childList: true });
});
