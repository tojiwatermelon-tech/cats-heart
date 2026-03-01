/* 
   app.js 
   Standalone logic for Cat's Heart v2 
*/

const app = {
    data: {},
    vaultPassword: '04092025',
    isTipActive: false,

    init() {
        this.loadEmbeddedData();
        this.initStarryNight();
        this.runIntroSequence();
    },

    loadEmbeddedData() {
        try {
            const dataElement = document.getElementById('app-data');
            this.data = JSON.parse(dataElement.textContent);
        } catch (e) {
            console.error("Data Parse Error:", e);
        }
    },

    initStarryNight() {
        const container = document.getElementById('star-container');
        const starCount = 150;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star star-pulse';
            const size = Math.random() * 3;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            container.appendChild(star);
        }
    },

    runIntroSequence() {
        const lines = document.querySelectorAll('.intro-text');
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('animate');
                if (index === lines.length - 1) {
                    setTimeout(() => this.showWelcome(), 2000);
                }
            }, index * 1300);
        });

        // Binding the enter button separately
        document.getElementById('btn-enter').onclick = () => this.showHome();
    },

    showWelcome() {
        this.switchScreen('intro-screen', 'welcome-screen');
    },

    showHome() {
        this.switchScreen('welcome-screen', 'home-screen');
        this.bindFeatureButtons();
        this.startTipInterval();
    },

    switchScreen(fromId, toId) {
        const from = document.getElementById(fromId);
        const to = document.getElementById(toId);
        from.classList.remove('active');
        setTimeout(() => {
            to.classList.add('active');
            this.hapticFeedback('single');
        }, 1000);
    },

    bindFeatureButtons() {
        // Late binding as requested
        document.getElementById('feat-connection').onclick = () => this.openConnectionModal();
        document.getElementById('feat-vault').onclick = () => this.openVaultAuth();
        document.getElementById('feat-affirmations').onclick = () => this.openAffirmations();
        document.getElementById('feat-challenges').onclick = () => this.openChallenges();
        document.getElementById('feat-mood').onclick = () => this.openMoodLog();
        document.getElementById('feat-future').onclick = () => this.openFuture();
        document.getElementById('btn-random-tip').onclick = () => this.showRandomTip();

        document.getElementById('modal-close').onclick = () => this.closeModal();
        window.onclick = (event) => {
            if (event.target == document.getElementById('modal-overlay')) {
                this.closeModal();
            }
        };
    },

    /* Reusable Modal Rendering */
    renderModal(title, contentHtml) {
        const body = document.getElementById('modal-body');
        body.innerHTML = `<h3>${title}</h3><div class="modal-inner-content">${contentHtml}</div>`;
        document.getElementById('modal-overlay').classList.add('active');
        this.hapticFeedback('single');
    },

    closeModal() {
        document.getElementById('modal-overlay').classList.remove('active');
        this.hapticFeedback('single');
    },

    /* Feature: Connection */
    openConnectionModal() {
        const moods = Object.keys(this.data.connection);
        let html = `<p>How are you feeling, my Dark Knight?</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 1.5rem;">
                        ${moods.map(m => `<button class="btn btn-soft" onclick="app.showLetter('${m}')">${m}</button>`).join('')}
                    </div>`;
        this.renderModal("Our Connection", html);
    },

    showLetter(mood) {
        const text = this.data.connection[mood];
        let html = `<p class="sacramento" style="font-size: 1.8rem; margin-bottom: 2rem;">"${text}"</p>
                    <button class="btn" onclick="app.openConnectionModal()">Back</button>`;
        this.renderModal(`Open When: ${mood}`, html);
    },

    /* Feature: Vault */
    openVaultAuth() {
        let html = `<p>Enter our secret alignment code:</p>
                    <input type="password" id="vault-input" placeholder="DDMMYYYY" style="width: 100%; padding: 1rem; border-radius: 12px; border: 1px solid var(--rose-gold); margin: 1.5rem 0;">
                    <button class="btn" onclick="app.unlockVault()">Unlock Fragment</button>`;
        this.renderModal("The Vault", html);
    },

    unlockVault() {
        const input = document.getElementById('vault-input').value;
        if (input === this.vaultPassword) {
            this.hapticFeedback('double');
            this.showVaultLetters();
        } else {
            alert("Alignment Mismatch. Access Denied.");
        }
    },

    showVaultLetters() {
        const letters = this.data.vault;
        let html = `<div style="text-align: left;">
                        ${letters.map(l => `
                            <div style="margin-bottom: 2rem; border-bottom: 1px solid var(--lavender); padding-bottom: 1rem;">
                                <h4 class="sacramento" style="font-size: 1.6rem;">${l.title}</h4>
                                <p style="font-size: 0.95rem;">${l.text}</p>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn" onclick="app.closeModal()">Close Vault</button>`;
        this.renderModal("Fragments of a Soul", html);
    },

    /* Feature: Affirmations */
    openAffirmations() {
        const items = this.data.affirmations;
        let html = `<div style="text-align: left;">
                        ${items.map((a, i) => `<p style="margin-bottom: 1.5rem; animation: fadeIn 0.5s forwards ${i * 0.2}s; opacity: 0;">✨ ${a}</p>`).join('')}
                    </div>`;
        this.renderModal("Daily Affirmations", html);
    },

    /* Feature: Challenges */
    openChallenges() {
        const items = this.data.challenges;
        let html = `<div style="text-align: left;">
                        ${items.map((c, i) => `<p style="margin-bottom: 1.5rem; animation: fadeIn 0.5s forwards ${i * 0.2}s; opacity: 0;">🎯 ${c}</p>`).join('')}
                    </div>`;
        this.renderModal("Mini Challenges", html);
    },

    /* Feature: Mood Log */
    openMoodLog() {
        const moods = Object.keys(this.data.moodResponses);
        let html = `<p>Choose an emotion you're carrying:</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 1.5rem;">
                        ${moods.map(m => `<button class="btn btn-soft" onclick="app.showMoodResponse('${m}')">${m}</button>`).join('')}
                    </div>`;
        this.renderModal("Mood Log", html);
    },

    showMoodResponse(mood) {
        const text = this.data.moodResponses[mood];
        let html = `<p class="sacramento" style="font-size: 1.8rem; margin-bottom: 2rem;">"${text}"</p>
                    <button class="btn" onclick="app.openMoodLog()">Back</button>`;
        this.renderModal(`Heart Alignment: ${mood}`, html);
    },

    /* Feature: Future */
    openFuture() {
        const future = this.data.future;
        let html = `<p class="sacramento" style="font-size: 1.6rem; line-height: 1.8; text-align: left;">${future.text}</p>`;
        this.renderModal(future.title, html);
    },

    /* Feature: Tips */
    showRandomTip() {
        const tips = this.data.tips;
        const tip = tips[Math.floor(Math.random() * tips.length)];
        this.renderModal("Catwoman's Tip", `<p style="font-size: 1.1rem;">"${tip}"</p>`);
    },

    startTipInterval() {
        // Automatic floating tips
        setInterval(() => {
            if (!this.isTipActive) {
                this.spawnFloatingTip();
            }
        }, 12000);
    },

    spawnFloatingTip() {
        this.isTipActive = true;
        const tipDisplay = document.getElementById('tip-display');
        const tips = this.data.tips;
        const tip = tips[Math.floor(Math.random() * tips.length)];

        const card = document.createElement('div');
        card.className = 'tip-card tip-slide-up';
        card.innerHTML = `<p><strong>Note:</strong> ${tip}</p>`;

        tipDisplay.appendChild(card);
        this.hapticFeedback('single');

        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translate(-50%, -50px)';
            card.style.transition = 'all 1s';
            setTimeout(() => {
                card.remove();
                this.isTipActive = false;
            }, 1000);
        }, 5000);
    },

    /* Feedback */
    hapticFeedback(type) {
        const overlay = document.getElementById('haptic-overlay');
        const pulse = () => {
            overlay.style.borderWidth = '1.5rem';
            setTimeout(() => overlay.style.borderWidth = '0', 150);
        };

        pulse();
        if (window.navigator.vibrate) {
            if (type === 'single') window.navigator.vibrate(60);
            else if (type === 'double') window.navigator.vibrate([60, 50, 60]);
        }
    }
};

// Global for inline handlers
window.app = app;
window.onload = () => app.init();
