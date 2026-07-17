// ===== 32 STUDENTS WITH REAL DATA =====
const STUDENTS = [
    { id: '251802', password: 'pass959', name: 'MD. SABBIN AHMED SANDO'},
    { id: '251803', password: 'pass170', name: 'SABRINA YASMIN' },
    { id: '251804', password: 'pass328', name: 'KH. SABBIR AHAMMED' },
    { id: '251806', password: 'pass505', name: 'LABANNO ROY' },
    { id: '251808', password: 'pass111', name: 'SABRINA YASMIN BORNA'},
    { id: '251809', password: 'pass999', name: 'MD. JAHID HASAN'},
    { id: '251810', password: 'pass325', name: 'MD. TAHMID SAYEM'},
    { id: '251811', password: 'pass436', name: 'MD. MOSTAKIM BILLAH MOON'},
    { id: '251813', password: 'pass547', name: 'SANAULLAH KAISHER JONY'},
    { id: '251814', password: 'pass658', name: 'SUMIYA ISLAM'},
    { id: '251815', password: 'pass069', name: 'PRANTA PAUL'},
    { id: '251816', password: 'pass780', name: 'SHAHARIA HASSAN AKASH'},
    { id: '251817', password: 'pass322', name: 'ARONNO KUMAR TARAFDER'},
    { id: '251819', password: 'pass599', name: 'ROCON UDDIN MAHMUD'},
    { id: '251820', password: 'pass989', name: 'MUBTASIM FUAD SAMIN'},
    { id: '251821', password: 'pass202', name: 'SOYAIB AHAMMEFD'},
    { id: '251822', password: 'pass317', name: 'SAKIM AHSAN'},
    { id: '251824', password: 'pass369', name: 'SHAIDUL BHUYAN'},
    { id: '251825', password: 'pass000', name: 'MD. ASHRAFUL ISLAM RAFI'},
    { id: '251826', password: 'pass490', name: 'MOTASADDIK AHAMMED'},
    { id: '251827', password: 'pass539', name: 'MD. MOSHIUR RAHMAN'},
    { id: '251828', password: 'pass686', name: 'SUPTO GHOSH'},
    { id: '251829', password: 'pass792', name: 'ALVEE HASAN'},
    { id: '251830', password: 'pass801', name: 'HOBAYSHA HAFIZ SAJUTY'},
    { id: '251831', password: 'pass912', name: 'MD. RATHUL HOSSEN'},
    { id: '251832', password: 'pass780', name: 'MD. HAFIZUR RAHMAN ZAHID'},
    { id: '251834', password: 'pass892', name: 'SAMIA FERDOUS MOHUA'},
    { id: '251835', password: 'pass275', name: 'TITU ROY'},
    { id: '251837', password: 'pass386', name: 'MD. IMAM MEHEDI'},
    { id: '251838', password: 'pass497', name: 'TIRTHA RAY'},
    { id: '251839', password: 'pass508', name: 'PIOUS DEWAN'},
    { id: '241822', password: 'pass670', name: 'DIGANTA DAS TONOY'}
];

// All students are candidates - Show names only for voting
const CANDIDATES = STUDENTS.map(s => ({ 
    id: s.id, 
    name: s.name,
    bg: s.bg,
    home: s.home
}));

// ===== STATE =====
let currentUser = null;
let selectedCR = null;
let selectedACR = null;

// ===== SECURE INITIALIZATION =====
function initializeSystem() {
    if (!localStorage.getItem('votes')) {
        const initialVotes = {
            cr: {},
            acr: {},
            votedStudents: [],
            voterHistory: {}
        };
        CANDIDATES.forEach(c => {
            initialVotes.cr[c.id] = 0;
            initialVotes.acr[c.id] = 0;
        });
        localStorage.setItem('votes', JSON.stringify(initialVotes));
        console.log('✅ System initialized with 32 students');
        console.log('🔒 Double-vote protection: ENABLED');
    }
}

// ===== LOGIN =====
function login() {
    const id = document.getElementById('studentId').value.trim();
    const password = document.getElementById('password').value.trim();
    const messageDiv = document.getElementById('loginMessage');

    if (!id || !password) {
        messageDiv.className = 'message error';
        messageDiv.textContent = '❌ Please enter both ID and Password';
        return;
    }

    const student = STUDENTS.find(s => s.id === id);
    if (!student) {
        messageDiv.className = 'message error';
        messageDiv.textContent = '❌ Invalid Student ID';
        return;
    }

    if (student.password !== password) {
        messageDiv.className = 'message error';
        messageDiv.textContent = '❌ Incorrect Password';
        return;
    }

    const votesData = JSON.parse(localStorage.getItem('votes'));
    
    // Check if already voted
    if (votesData.votedStudents.includes(id)) {
        messageDiv.className = 'message error';
        messageDiv.textContent = `❌ SECURITY: ${student.name} has already voted! One vote per student.`;
        console.warn(`🔒 ${student.name} (${id}) attempted to vote again`);
        return;
    }

    // Login success
    currentUser = student;
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('votingSection').style.display = 'block';
    document.getElementById('welcomeUser').innerHTML = `
        👋 Welcome, <strong>${student.name}</strong> (ID: ${student.id})
        <span class="security-badge">🔒 Secure Session</span>
    `;
    messageDiv.textContent = '';
    messageDiv.className = 'message';

    loadCandidates('cr');
    loadCandidates('acr');
    console.log(`✅ ${student.name} logged in at ${new Date().toLocaleString()}`);
}

// ===== LOAD CANDIDATES (Show Names Only) =====
function loadCandidates(position) {
    const container = document.getElementById(`${position}Candidates`);
    const currentUserId = currentUser ? currentUser.id : null;
    
    container.innerHTML = CANDIDATES.map(c => {
        const isSelf = c.id === currentUserId;
        const student = STUDENTS.find(s => s.id === c.id);
        return `
            <div class="candidate-card" onclick="selectCandidate('${position}', '${c.id}')" id="${position}_${c.id}">
                <div class="name">${student.name} ${isSelf ? '🙋' : ''}</div>
                <div class="details">ID: ${c.id} | ${student.home}</div>
                ${isSelf ? '<div class="self-badge">YOU</div>' : ''}
            </div>
        `;
    }).join('');
}

// ===== SELECT CANDIDATE =====
function selectCandidate(position, candidateId) {
    document.querySelectorAll(`#${position}Candidates .candidate-card`).forEach(card => {
        card.classList.remove('selected');
    });

    const selectedCard = document.getElementById(`${position}_${candidateId}`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    if (position === 'cr') {
        selectedCR = candidateId;
    } else {
        selectedACR = candidateId;
    }

    if (selectedCR && selectedACR && selectedCR === selectedACR) {
        document.getElementById('voteMessage').className = 'message error';
        document.getElementById('voteMessage').textContent = '⚠️ CR and ACR cannot be the same person!';
    } else {
        document.getElementById('voteMessage').textContent = '';
        document.getElementById('voteMessage').className = 'message';
    }
}

// ===== SUBMIT VOTE =====
function submitVote() {
    if (!currentUser) return;

    const messageDiv = document.getElementById('voteMessage');

    if (!selectedCR || !selectedACR) {
        messageDiv.className = 'message error';
        messageDiv.textContent = '❌ Please select both CR and ACR candidates';
        return;
    }

    if (selectedCR === selectedACR) {
        messageDiv.className = 'message error';
        messageDiv.textContent = '❌ CR and ACR cannot be the same person!';
        return;
    }

    const votesData = JSON.parse(localStorage.getItem('votes'));
    if (votesData.votedStudents.includes(currentUser.id)) {
        messageDiv.className = 'message error';
        messageDiv.textContent = '❌ SECURITY: You have already voted!';
        return;
    }

    const crCandidate = STUDENTS.find(s => s.id === selectedCR);
    const acrCandidate = STUDENTS.find(s => s.id === selectedACR);

    // Record vote
    votesData.cr[selectedCR] = (votesData.cr[selectedCR] || 0) + 1;
    votesData.acr[selectedACR] = (votesData.acr[selectedACR] || 0) + 1;
    votesData.votedStudents.push(currentUser.id);
    votesData.voterHistory[currentUser.id] = {
        voterName: currentUser.name,
        votedForCR: crCandidate.name,
        votedForACR: acrCandidate.name,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('votes', JSON.stringify(votesData));

    let successMsg = `✅ VOTE RECORDED!<br>`;
    successMsg += `📌 CR: <strong>${crCandidate.name}</strong><br>`;
    successMsg += `📌 ACR: <strong>${acrCandidate.name}</strong>`;
    messageDiv.className = 'message success';
    messageDiv.innerHTML = successMsg;

    console.log(`✅ ${currentUser.name} voted for CR: ${crCandidate.name}, ACR: ${acrCandidate.name}`);

    document.querySelectorAll('.candidate-card').forEach(card => {
        card.style.pointerEvents = 'none';
        card.style.opacity = '0.6';
        card.classList.add('disabled');
    });
    document.getElementById('submitBtn').disabled = true;
}

// ===== LOGOUT =====
function logout() {
    if (currentUser) {
        console.log(`👋 ${currentUser.name} logged out`);
    }
    currentUser = null;
    selectedCR = null;
    selectedACR = null;
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('votingSection').style.display = 'none';
    document.getElementById('studentId').value = '';
    document.getElementById('password').value = '';
    document.getElementById('loginMessage').textContent = '';
    document.getElementById('loginMessage').className = 'message';
    document.getElementById('voteMessage').textContent = '';
    document.getElementById('voteMessage').className = 'message';
    document.getElementById('submitBtn').disabled = false;
}

// ===== SHOW RESULTS =====
function showResults() {
    const votesData = JSON.parse(localStorage.getItem('votes'));
    const resultsDiv = document.getElementById('results');

    let crWinner = null, crMaxVotes = -1;
    let acrWinner = null, acrMaxVotes = -1;

    CANDIDATES.forEach(c => {
        const crVotes = votesData.cr[c.id] || 0;
        const acrVotes = votesData.acr[c.id] || 0;
        if (crVotes > crMaxVotes) {
            crMaxVotes = crVotes;
            crWinner = c;
        }
        if (acrVotes > acrMaxVotes) {
            acrMaxVotes = acrVotes;
            acrWinner = c;
        }
    });

    const totalVotes = votesData.votedStudents.length;
    const remainingVoters = 32 - totalVotes;

    let html = `<h4>📊 Election Results</h4>`;
    html += `<div class="result-item" style="background:#e8f0fe;border-left-color:#667eea;">
        <strong>📌 Voter Turnout:</strong> ${totalVotes}/32 (${Math.round(totalVotes/32*100)}%)
        ${remainingVoters > 0 ? `- ${remainingVoters} haven't voted` : ' 🎉 ALL VOTED!'}
    </div>`;
    
    if (totalVotes > 0) {
        const crStudent = STUDENTS.find(s => s.id === crWinner.id);
        const acrStudent = STUDENTS.find(s => s.id === acrWinner.id);
        html += `<div class="result-item winner">🏆 <strong>CR Winner:</strong> ${crStudent.name} (ID: ${crWinner.id}) - ${crMaxVotes} votes</div>`;
        html += `<div class="result-item winner">🏆 <strong>ACR Winner:</strong> ${acrStudent.name} (ID: ${acrWinner.id}) - ${acrMaxVotes} votes</div>`;
    }

    // Full breakdown
    html += `<h4 style="margin-top:20px;">📋 Full Vote Breakdown</h4>`;
    CANDIDATES.forEach(c => {
        const crVotes = votesData.cr[c.id] || 0;
        const acrVotes = votesData.acr[c.id] || 0;
        if (crVotes > 0 || acrVotes > 0) {
            const student = STUDENTS.find(s => s.id === c.id);
            html += `<div class="result-item">${student.name} → CR: ${crVotes} | ACR: ${acrVotes}</div>`;
        }
    });

    resultsDiv.innerHTML = html;
}

// ===== EXPORT DATA =====
function exportData() {
    const votesData = JSON.parse(localStorage.getItem('votes'));
    const dataStr = JSON.stringify(votesData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voting_data_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('📥 Data exported successfully!');
}

// ===== RESET SYSTEM =====
function resetSystem() {
    if (confirm('⚠️ ARE YOU SURE? This will delete ALL votes permanently!')) {
        if (confirm('🔒 FINAL WARNING: All voting data will be deleted. Continue?')) {
            localStorage.removeItem('votes');
            initializeSystem();
            document.getElementById('results').innerHTML = '<p style="color:green;">✅ System has been reset</p>';
            logout();
            alert('🔄 System reset successfully!');
        }
    }
}

// ===== KEYBOARD SUPPORT =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        if (document.getElementById('loginSection').style.display !== 'none') {
            login();
        }
    }
});