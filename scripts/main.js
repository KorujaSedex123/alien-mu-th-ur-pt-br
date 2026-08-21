import gsap from "/scripts/greensock/esm/all.js";

console.error("lancement de muthur");
let currentReplySound = null;
let shouldContinueReplySound = false;
let socket;
let cerberusCountdownInterval = null;
let hackSuccessful = false;
let currentMuthurSession = {
    active: false,
    userId: null,
    userName: null
};
let currentGMProgress = null;

async function showBootSequence(isSpectator = false) {
    // Créer le conteneur principal
    const bootContainer = document.createElement('div');
    bootContainer.id = 'muthur-boot-sequence';
    bootContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: black;
        color: #00ff00;
        font-family: monospace;
        z-index: 999999;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    // Conteneur pour le contenu
    const content = document.createElement('div');
    content.style.cssText = `
        width: 80%;
        max-width: 800px;
        position: relative;
    `;
    bootContainer.appendChild(content);

    // NOUVEAU : Ajout du logo en arrière-plan
    const backgroundLogo = document.createElement('div');
    backgroundLogo.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: -1;
    `;
    // SVG retiré pour éviter les erreurs GSAP lorsqu'il n'est pas rendu
    backgroundLogo.innerHTML = '';

    bootContainer.appendChild(backgroundLogo);
    document.body.appendChild(bootContainer);

    try {
        gsap.timeline()
        .to(backgroundLogo, {
            opacity: 0.1,
            duration: 1.2,
            ease: 'power2.inOut'
        });
    } catch (e) { /* no-op if GSAP missing */ }

    // Logo Weyland-Yutani
    const logo = document.createElement('div');
    logo.innerHTML = `
         <pre style="color: #00ff00; font-size: 14px; line-height: 1.2; text-align: center; font-weight: bold;">
██     ██ ███████ ██    ██ ██       █████  ███    ██ ██████      ██    ██ ██    ██ ████████  █████  ███    ██ ██ 
██     ██ ██       ██  ██  ██       ██   ██ ████   ██ ██   ██      ██  ██  ██    ██    ██    ██   ██ ████   ██ ██ 
██  █  ██ █████     ████   ██       ███████ ██ ██  ██ ██   ██       ████   ██    ██    ██    ███████ ██ ██  ██ ██ 
██ ███ ██ ██         ██    ██       ██   ██ ██  ██ ██ ██   ██        ██    ██    ██    ██    ██   ██ ██  ██ ██ ██
 ███ ███  ███████    ██    ███████ ██   ██ ██   ████ ██████         ██     ██████     ██    ██   ██ ██   ████ ██ 
    </pre>
`;
    content.appendChild(logo);
    document.body.appendChild(bootContainer);

    // Effet de scanline
    const scanline = document.createElement('div');
    scanline.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: rgba(0, 255, 0, 0.2);
        pointer-events: none;
        z-index: 1000;
    `;
    bootContainer.appendChild(scanline);

    // Animation du scanline
    gsap.to(scanline, {
        top: '100%',
        duration: 2,
        repeat: -1,
        ease: 'none'
    });

    const crtOverlay = document.createElement('div');
    crtOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: 
            linear-gradient(rgba(18, 16, 16, 0.1) 50%, rgba(0, 255, 0, 0.08) 50%),
            linear-gradient(90deg, rgba(255, 0, 0, 0.1), rgba(0, 255, 0, 0.05), rgba(0, 0, 255, 0.1));
        background-size: 100% 3px, 3px 100%;
        pointer-events: none;
        z-index: 1000;
        animation: flicker 0.15s infinite;
        mix-blend-mode: screen;
        opacity: 0.5;
    `;

    // Animation de scintillement plus subtile
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    @keyframes flicker {
        0% { opacity: 0.5; }
        25% { opacity: 0.45; }
        50% { opacity: 0.5; }
        75% { opacity: 0.45; }
        100% { opacity: 0.5; }
    }
`;
    try { document.head.appendChild(styleSheet); } catch (e) {}

    // Vignette ajustée
    const vignette = document.createElement('div');
    vignette.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: radial-gradient(circle, transparent 40%, rgba(0, 255, 0, 0.1) 100%);
        pointer-events: none;
        z-index: 999;
        mix-blend-mode: screen;
    `;

    bootContainer.appendChild(vignette);
    bootContainer.appendChild(crtOverlay);

    // Séquence de démarrage
    const bootMessages = [
        'INITIALIZING MU/TH/UR 6000...',
        'LOADING CORE SYSTEMS...',
        'CHECKING MEMORY BANKS...',
        'INITIALIZING NEURAL NETWORKS...',
        'LOADING COMMAND PROTOCOLS...',
        'CHECKING LIFE SUPPORT SYSTEMS...',
        'INITIALIZING SECURITY PROTOCOLS...',
        'CONNECTING TO WEYLAND-YUTANI NETWORK...',
        'SYSTEM READY',
        'MUTHUR 6000 ONLINE',
        'INTERFACE 2037 READY'
    ];

    // Conteneur pour les messages
    const messageContainer = document.createElement('div');
    messageContainer.style.cssText = `
        margin-top: 2em;
        font-size: 24px;         
        line-height: 1.5;
        text-align: center;
        width: 100%;
        font-weight: bold;
    `;
    content.appendChild(messageContainer);

    // Animation du logo
    gsap.from(logo, {
        opacity: 0,
        duration: 2,
        ease: 'power2.inOut'
    });

    // Affichage progressif des messages
    for (let i = 0; i < bootMessages.length; i++) {
        const messageElement = document.createElement('div');
        messageElement.style.opacity = '0';
        messageElement.style.cssText = `
            opacity: 0;
            margin: 0.5em 0;
            text-shadow: 0 0 5px #00ff00;
        `;
        messageElement.innerHTML = `${bootMessages[i]}`;
        messageContainer.appendChild(messageElement);

        await new Promise(resolve => setTimeout(resolve, 800));

        gsap.to(messageElement, {
            opacity: 1,
            duration: 1,
            onComplete: () => {
                if (game.settings.get('alien-mu-th-ur', 'enableTypingSounds')) {
                    playComSound();
                }
            }
        });

        // Effet de glitch aléatoire
        if (Math.random() > 0.7) {
            gsap.to(messageElement, {
                skewX: "20deg",
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });
        }
    }

    await new Promise(resolve => setTimeout(resolve, 2500));

    // Effet de "power down" style terminal rétro
    gsap.to(content, {
        height: '2px',
        duration: 0.4,
        ease: 'power1.in',
        onComplete: () => {
            gsap.to(bootContainer, {
                background: '#0f0',
                duration: 0.1,
                onComplete: () => {
                    gsap.to(bootContainer, {
                        background: 'black',
                        opacity: 0,
                        duration: 0.3,
                        onComplete: () => {
                            bootContainer.remove();
                            if (!game.user.isGM) {
                                if (!isSpectator) {
                                    sendToGM(game.i18n.localize("MUTHUR.sessionStarted"), 'open');
                                    showMuthurInterface();
                                }
                            }
                        }
                    });
                }
            });
        }
    });
}

try { window.showBootSequence = showBootSequence; } catch (e) {}

function startCerberusCountdown(minutes) {
    const duration = Number.isFinite(minutes) && minutes > 0 ? minutes : 10;
    let timeLeft = duration * 60;

    cerberusCountdownInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const countdownText = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const chatCountdown = document.querySelector('.cerberus-countdown');
        const floatingCountdown = document.getElementById('cerberus-floating-countdown');

        if (chatCountdown) chatCountdown.textContent = countdownText;
        if (floatingCountdown) floatingCountdown.textContent = countdownText;

        if (timeLeft <= 10 && timeLeft > 0) {
            const audio = new Audio(`modules/alien-mu-th-ur/sounds/count/${timeLeft}.mp3`);
            audio.volume = game.settings.get('alien-mu-th-ur', 'typingSoundVolume');
            audio.play();
        }

        if (timeLeft % 30 === 0 && game.user.isGM) {
            const minuteLabel = minutes === 1 ?
                game.i18n.localize("MUTHUR.Time.Minute") :
                game.i18n.localize("MUTHUR.Time.Minutes");

            const secondLabel = seconds === 1 ?
                game.i18n.localize("MUTHUR.Time.Second") :
                game.i18n.localize("MUTHUR.Time.Seconds");

            let timeMessage;
            if (minutes > 0) {
                timeMessage = game.i18n.format("MUTHUR.Time.MinutesAndSeconds", {
                    minutes: minutes,
                    minuteLabel: minuteLabel,
                    seconds: seconds,
                    secondLabel: secondLabel
                });
            } else {
                timeMessage = game.i18n.format("MUTHUR.Time.OnlySeconds", {
                    seconds: seconds,
                    secondLabel: secondLabel
                });
            }

            if (game.settings.get('alien-mu-th-ur', 'enableTypingSounds')) {
                const audio = new Audio('modules/alien-mu-th-ur/sounds/pec_message/error.wav');
                audio.volume = game.settings.get('alien-mu-th-ur', 'typingSoundVolume');
                audio.play();
            }

            ChatMessage.create({
                content: `<span style="color: #ff0000; font-weight: bold;">${game.i18n.format("MOTHER.SpecialOrders.Cerberus.TimeRemaining", {
                    time: timeMessage
                })}</span>`,
                type: CONST.CHAT_MESSAGE_TYPES.EMOTE,
                speaker: { alias: "MUTHUR 6000" }
            });
        }

        if (timeLeft <= 0) {
            clearInterval(cerberusCountdownInterval);

            const cerberusWindow = document.getElementById('cerberus-floating-window');
            console.log("Fenêtre principale Cerberus trouvée:", cerberusWindow ? "oui" : "non");

            if (cerberusWindow) {
                cerberusWindow.style.animation = 'fadeOut 0.5s ease-out';
                setTimeout(() => {
                    cerberusWindow.remove();
                    console.log("Fenêtre principale Cerberus supprimée");
                }, 500);
            }

            const remainingElements = document.querySelectorAll('[class*="cerberus"]');
            remainingElements.forEach(element => {
                element.remove();
            });

            currentMuthurSession.active = false;
            currentMuthurSession.userId = null;
            currentMuthurSession.userName = null;

            setTimeout(() => {
                playEndSequence();
            }, 600);
        }
    }, 1000);

    return cerberusCountdownInterval;
}

function createFullScreenGlitch() {
    const glitchOverlay = document.createElement('div');
    glitchOverlay.id = 'muthur-glitch-overlay';
    glitchOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 999999;
        mix-blend-mode: difference;
        opacity: 0;
    `;
    document.body.appendChild(glitchOverlay);
    return glitchOverlay;
}

const glitchEffect = async () => {
    const gameCanvas = document.getElementById('board');
    const uiLayer = document.getElementById('ui-top');

    if (Math.random() > 0.7) {
        const effects = [
            async () => {
                const blackout = document.createElement('div');
                blackout.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: black;
                    z-index: 999999;
                    pointer-events: none;
                `;
                document.body.appendChild(blackout);
                await new Promise(resolve => setTimeout(resolve, 150));
                blackout.remove();
            },
            async () => {
                if (gameCanvas) {
                    gameCanvas.style.transform = `translateY(${Math.random() * 300 - 150}px)`;
                    await new Promise(resolve => setTimeout(resolve, 100));
                    gameCanvas.style.transform = '';
                }
            },
            async () => {
                if (gameCanvas) {
                    gameCanvas.style.filter = 'brightness(2) contrast(3) hue-rotate(90deg)';
                    await new Promise(resolve => setTimeout(resolve, 80));
                    gameCanvas.style.filter = '';
                }
            },
            async () => {
                const slice = document.createElement('div');
                const height = Math.random() * 100 + 50;
                const top = Math.random() * (window.innerHeight - height);
                slice.style.cssText = `
                    position: fixed;
                    top: ${top}px;
                    left: 0;
                    width: 100%;
                    height: ${height}px;
                    background: black;
                    z-index: 999999;
                    pointer-events: none;
                `;
                document.body.appendChild(slice);
                await new Promise(resolve => setTimeout(resolve, 120));
                slice.remove();
            }
        ];

        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        await randomEffect();
    }
};

function sendToGM(message, actionType = 'command', commandType = '') {
    if (!game.socket) {
        console.error("Socket non disponible!");
        return;
    }

    try {
        game.socket.emit('module.alien-mu-th-ur', {
            type: 'muthurCommand',
            command: message,
            user: game.user.name,
            userId: game.user.id,
            actionType: actionType,
            commandType: commandType,
            timestamp: Date.now()
        });

    } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
        ui.notifications.error("Erreur de communication avec MUTHUR");
    }
}

Hooks.once('init', () => {
    game.modules.get('alien-mu-th-ur').api = {
        version: "1.0.0"
    };

    game.i18n.translations = game.i18n.translations || {};

    CONFIG.MUTHUR = {
        translations: {}
    };

    game.settings.register('alien-mu-th-ur', 'customCommands', {
        name: 'ALIEN-MU-TH-UR.Settings.CustomCommands.Name',
        hint: 'ALIEN-MU-TH-UR.Settings.CustomCommands.Hint',
        scope: 'world',
        config: true,
        type: String,
        default: '{"EXEMPLO": "Resposta da MU/TH/UR para o comando exemplo."}',
        restricted: true
    });

    window.hackingSequences = [
        "> INITIALISATION BRUTE FORCE ATTACK...",
        "ssh -p 22 root@muthur6000.weyland-corp",
        "TRYING PASSWORD COMBINATIONS..."
    ];

    window.postPasswordSequences = [
        "PASSWORD FOUND: ********",
        "ACCESS GRANTED TO PRIMARY SYSTEMS",
        "> SWITCHING TO DICTIONARY ATTACK FOR SECONDARY SYSTEMS",
        "ATTEMPTING BYPASS OF SECURITY PROTOCOLS",
        "ACCESSING MAIN COMPUTER..."
    ];

    window.successSequences = [
        { text: 'MOTHER.IntrusionDetected', color: '#ff0000', type: 'error' },
        { text: 'MOTHER.SecurityProtocol', color: '#ff9900', type: 'error' },
        { text: 'MOTHER.CountermeasuresAttempt', color: '#00ff00', type: 'reply' },
        { text: 'MOTHER.CountermeasuresFailed', color: '#ff0000', type: 'error' },
        { text: 'MOTHER.RootAccess', color: '#ff0000', type: 'error' },
        { text: 'MOTHER.AdminPrivileges', color: '#00ff00', type: 'reply' },
        { text: 'MOTHER.SecurityDisabled', color: '#00ff00', type: 'reply' },
        { text: 'MOTHER.FullAccess', color: '#00ff00', type: 'reply' },
        { text: 'MOTHER.WelcomeAdmin', color: '#00ff00', type: 'reply' }
    ];

    window.failureSequences = [
        { text: 'MOTHER.IntrusionDetected', color: '#ff0000', type: 'error' },
        { text: 'MOTHER.SecurityProtocol', color: '#ff9900', type: 'error' },
        { text: 'MOTHER.CountermeasuresActivated', color: '#ff0000', type: 'error' },
        { text: 'MOTHER.TerminalLocked', color: '#ff0000', type: 'error' },
        { text: 'MOTHER.LocatingIntruder', color: '#ff9900', type: 'reply' },
        { text: 'MOTHER.IPRecorded', color: '#ff0000', type: 'error' },
        { text: 'MOTHER.AccessBlocked', color: '#ff0000', type: 'error' },
        { text: 'MOTHER.TerminalLocked24', color: '#ff0000', type: 'error' },
        { text: 'MOTHER.ForcedDisconnect3', color: '#ff0000', type: 'error' },
        { text: "2...", color: '#ff0000', type: 'error' },
        { text: "1...", color: '#ff0000', type: 'error' },
        { text: 'MOTHER.ConnectionTerminated', color: '#ff0000', type: 'error' }
    ];

    game.settings.register('alien-mu-th-ur', 'enableTypingSounds', {
        name: "MUTHUR.SETTINGS.typingSound.name",
        hint: "MUTHUR.SETTINGS.typingSound.hint",
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: value => {
            console.log("Sons de frappe:", value ? "activé" : "désactivé");
        }
    });

    const phSettings = [
        { key: 'phShowInHelp', scope: 'world', type: Boolean, def: true },
        { key: 'phSpecialOrders', scope: 'world', type: Boolean, def: true },
        { key: 'phCerberus', scope: 'world', type: Boolean, def: true },
        { key: 'phDoors', scope: 'world', type: Boolean, def: true },
        { key: 'phLights', scope: 'world', type: Boolean, def: true },
        { key: 'phAlarm', scope: 'world', type: Boolean, def: true },
        { key: 'phGas', scope: 'world', type: Boolean, def: true },
        { key: 'phCryo', scope: 'world', type: Boolean, def: true },
    ];
    for (const s of phSettings) {
        game.settings.register('alien-mu-th-ur', s.key, {
            name: `MUTHUR.SETTINGS.postHack.${s.key}.name`,
            hint: `MUTHUR.SETTINGS.postHack.${s.key}.hint`,
            scope: s.scope,
            config: true,
            type: s.type,
            default: s.def
        });
    }

    try {
        game.settings.register('alien-mu-th-ur', 'alarmSoundPath', {
            name: 'MUTHUR – Alarm sound',
            hint: 'Sélectionnez le son d\'alarme à jouer lors de l\'activation.',
            scope: 'world',
            config: true,
            type: String,
            default: '/modules/alien-mu-th-ur/sounds/reply/Computer_Reply_1.wav',
            filePicker: true
        });
    } catch (e) {}

    game.settings.register('alien-mu-th-ur', 'typingSoundVolume', {
        name: "MUTHUR.SETTINGS.typingSoundVolume.name",
        hint: "MUTHUR.SETTINGS.typingSoundVolume.hint",
        scope: 'client',
        config: true,
        type: Number,
        range: { min: 0, max: 1, step: 0.1 },
        default: 0.2
    });

    game.settings.register('alien-mu-th-ur', 'enableScanline', {
        name: "MUTHUR.SETTINGS.scanline.name",
        hint: "MUTHUR.SETTINGS.scanline.hint",
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: value => { console.log("Effet scanline:", value); }
    });

    game.settings.register('alien-mu-th-ur', 'scanlineSize', {
        name: "MUTHUR.SETTINGS.scanlineSize.name",
        hint: "MUTHUR.SETTINGS.scanlineSize.hint",
        scope: 'client',
        config: true,
        type: Number,
        range: { min: 10, max: 100, step: 5 },
        default: 30,
        onChange: value => { console.log("Taille du scanline:", value); }
    });

    game.settings.register('alien-mu-th-ur', 'enableTypewriter', {
        name: "MUTHUR.SETTINGS.typewriter.name",
        hint: "MUTHUR.SETTINGS.typewriter.hint",
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: value => { console.log("Effet typewriter:", value); }
    });

    game.settings.register('alien-mu-th-ur', 'allowHack', {
        name: "MUTHUR.SETTINGS.allowHack.name",
        hint: "MUTHUR.SETTINGS.allowHack.hint",
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
        restricted: true
    });

    game.settings.register('alien-mu-th-ur', 'allowDragGM', {
        name: 'MUTHUR.SETTINGS.allowDragGM.name',
        hint: 'MUTHUR.SETTINGS.allowDragGM.hint',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
        restricted: true
    });

    game.settings.register('alien-mu-th-ur', 'allowDragPlayers', {
        name: 'MUTHUR.SETTINGS.allowDragPlayers.name',
        hint: 'MUTHUR.SETTINGS.allowDragPlayers.hint',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        restricted: true
    });

    game.settings.register('alien-mu-th-ur', 'currentStatusKey', {
        name: 'MUTHUR.STATUS.current',
        hint: 'MUTHUR.STATUS.currentHint',
        scope: 'world',
        config: true,
        type: String,
        choices: {
            normal: 'MUTHUR.STATUS.presets.normal',
            anomalyDetected: 'MUTHUR.STATUS.presets.anomalyDetected',
            systemOffline: 'MUTHUR.STATUS.presets.systemOffline',
            degradedPerformance: 'MUTHUR.STATUS.presets.degradedPerformance',
            fireDetected: 'MUTHUR.STATUS.presets.fireDetected',
            quarantine: 'MUTHUR.STATUS.presets.quarantine',
            lockdown: 'MUTHUR.STATUS.presets.lockdown',
            intrusion: 'MUTHUR.STATUS.presets.intrusion',
            networkIssue: 'MUTHUR.STATUS.presets.networkIssue',
            custom: 'MUTHUR.STATUS.presets.custom'
        },
        default: 'normal',
        restricted: true
    });

    game.settings.register('alien-mu-th-ur', 'customStatusText', {
        name: 'MUTHUR.STATUS.customText',
        hint: 'MUTHUR.STATUS.customTextHint',
        scope: 'world',
        config: true,
        type: String,
        default: '',
        restricted: true
    });

    game.settings.register('alien-mu-th-ur', 'captainUserIds', {
        name: 'MUTHUR.ROLES.captains',
        hint: 'MUTHUR.ROLES.captainsHint',
        scope: 'world',
        config: false,
        type: Array,
        default: [],
        restricted: true
    });

    game.settings.register('alien-mu-th-ur', 'allowCaptainSpecialOrders', {
        name: 'MUTHUR.ROLES.allowCaptainOrders',
        hint: 'MUTHUR.ROLES.allowCaptainOrdersHint',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
        restricted: true
    });
});

window.MUTHUR = window.MUTHUR || {};
window.MUTHUR.updateColors = () => {
    const motherColor = game.settings.get('alien-mu-th-ur', 'motherResponseColor');
    const mamanMessages = document.querySelectorAll('.muthur-chat-log div');
    mamanMessages.forEach(msg => {
        if (msg.textContent.startsWith('/M')) {
            msg.style.color = motherColor;
        }
    });
};

window.MUTHUR.applyLightGlitch = (targetElement, durationMs = 1200) => {
    if (!targetElement) return;
    const originalTransform = targetElement.style.transform || '';
    const originalFilter = targetElement.style.filter || '';
    const start = performance.now();
    const tick = (now) => {
        const t = now - start;
        if (t >= durationMs) {
            targetElement.style.transform = originalTransform;
            targetElement.style.filter = originalFilter;
            return;
        }
        const dx = (Math.random() - 0.5) * 2;
        const skew = (Math.random() - 0.5) * 1.2;
        const hue = (Math.random() - 0.5) * 8;
        targetElement.style.transform = `translate(${dx}px,0) skewX(${skew}deg)`;
        targetElement.style.filter = `hue-rotate(${hue}deg) saturate(1.05)`;
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
};

window.MUTHUR.applyScreenGlitch = (durationMs = 1800) => {
    if (!document.getElementById('muthur-glitch-style')) {
        const style = document.createElement('style');
        style.id = 'muthur-glitch-style';
        style.textContent = `
        @keyframes muthur-glitch-bars { 0%{transform: translateY(-100%);} 100%{transform: translateY(100%);} }
        @keyframes muthur-glitch-shake { 0%,100%{ transform: translate(0,0) } 25%{ transform: translate(1px,-1px) } 50%{ transform: translate(-1px,1px) } 75%{ transform: translate(1px,1px) } }
        .muthur-glitch-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 100004; mix-blend-mode: lighten; }
        .muthur-glitch-noise { position:absolute; inset:0; background:
            repeating-linear-gradient(0deg, rgba(0,255,0,0.04) 0px, rgba(0,255,0,0.04) 2px, transparent 2px, transparent 4px),
            repeating-linear-gradient(90deg, rgba(255,0,0,0.03) 0px, rgba(0,0,255,0.03) 2px, transparent 2px, transparent 4px);
            animation: muthur-glitch-shake 0.08s infinite;
        }
        .muthur-glitch-bar { position:absolute; left:0; width:100%; height:14px; background: linear-gradient(90deg, rgba(0,255,0,0.25), rgba(255,255,255,0.12), rgba(0,255,0,0.25)); opacity:0.85;
            filter: blur(0.5px); animation: muthur-glitch-bars 0.7s linear infinite; }
        `;
        document.head.appendChild(style);
    }
    const overlay = document.createElement('div');
    overlay.className = 'muthur-glitch-overlay';
    const noise = document.createElement('div'); noise.className = 'muthur-glitch-noise'; overlay.appendChild(noise);
    for (let i=0;i<3;i++){ const bar = document.createElement('div'); bar.className = 'muthur-glitch-bar'; bar.style.animationDelay = `${Math.random()*0.6}s`; bar.style.height = `${10+Math.floor(Math.random()*10)}px`; overlay.appendChild(bar); }
    document.body.appendChild(overlay);

    const originalFilter = document.body.style.filter || '';
    document.body.style.filter = 'contrast(1.25) saturate(1.2) hue-rotate(6deg)';

    const container = document.getElementById('muthur-chat-container');
    const gmContainer = document.getElementById('gm-muthur-container');
    const shaken = container || gmContainer || document.body;
    const originalTransform = shaken.style.transform || '';
    const jitter = setInterval(()=>{
        const dx = (Math.random()-0.5)*3;
        const dy = (Math.random()-0.5)*3;
        const skew = (Math.random()-0.5)*1.5;
        shaken.style.transform = `translate(${dx}px,${dy}px) skewX(${skew}deg)`;
    }, 35);

    setTimeout(()=>{
        clearInterval(jitter);
        shaken.style.transform = originalTransform;
        document.body.style.filter = originalFilter;
        overlay.remove();
    }, durationMs);
};

async function typeWriterEffect(element, text, speed = 30) {
    element.textContent = '';
    let currentText = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

    for (let i = 0; i < text.length; i++) {
        for (let j = 0; j < 3; j++) {
            const randomChar = chars[Math.floor(Math.random() * chars.length)];
            element.textContent = currentText + randomChar;
            await new Promise(resolve => setTimeout(resolve, speed / 3));
        }
        currentText += text[i];
        element.textContent = currentText;
        await new Promise(resolve => setTimeout(resolve, speed));
    }
}

function updateSpectatorsWithMessage(text, prefix = '', color = '#00ff00', messageType = 'normal') {
    game.socket.emit('module.alien-mu-th-ur', {
        type: 'updateSpectators',
        text: text,
        prefix: prefix,
        color: color,
        messageType: messageType
    });
}

async function syncMessageToSpectators(chatLog, message, prefix = '', color = '#00ff00', messageType = 'normal') {
    const messageElement = displayMuthurMessage(chatLog, message, prefix, color, messageType);
    updateSpectatorsWithMessage(message, prefix, color, messageType);
    return messageElement;
}

async function displayMuthurMessage(chatLog, text, prefix = '', color = '#00ff00', messageType = 'normal') {
    const messageDiv = document.createElement('div');
    messageDiv.style.color = color;
    messageDiv.style.position = 'relative';
    messageDiv.style.minHeight = '25px';
    chatLog.appendChild(messageDiv);

    try { messageDiv.classList.add('message', messageType || 'normal'); } catch (e) {}

    const typewriterEnabled = game.settings.get('alien-mu-th-ur', 'enableTypewriter');
    const soundGloballyMuted = (window.MUTHUR && window.MUTHUR.muteForSpectator) ? true : false;
    const soundEnabled = !soundGloballyMuted && game.settings.get('alien-mu-th-ur', 'enableTypingSounds');
    const scanlineEnabled = game.settings.get('alien-mu-th-ur', 'enableScanline');

    try {
        if (soundEnabled) {
            switch (messageType) {
                case 'error':
                    await playErrorSound();
                    break;
                case 'communication':
                    await playComSoundThrottled();
                    break;
                case 'reply':
                    shouldContinueReplySound = true;
                    await playReplySound();
                    break;
                case 'normal':
                    await playReturnSound();
                    break;
            }
        }

        if (typewriterEnabled) {
            const lines = (prefix + text).split('\n');
            for (let i = 0; i < lines.length; i++) {
                const lineDiv = document.createElement('div');
                lineDiv.style.position = 'relative';
                messageDiv.appendChild(lineDiv);

                if (scanlineEnabled) {
                    const scanlineSize = game.settings.get('alien-mu-th-ur', 'scanlineSize');
                    const lineScanline = document.createElement('div');
                    lineScanline.style.cssText = `
                        position: absolute;
                        width: ${scanlineSize}px;
                        height: 25px;
                        background: radial-gradient(circle, ${color} 50%, rgba(${hexToRgb(color)}, 0.7) 70%, transparent 90%);
                        left: 100%;
                        top: 0;
                        filter: blur(2px) brightness(1.5);
                        opacity: 1;
                        pointer-events: none;
                        z-index: 1000;
                        box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
                    `;
                    lineDiv.appendChild(lineScanline);

                    await new Promise(resolve => {
                        lineScanline.animate([
                            { left: '100%', filter: 'blur(2px) brightness(1.5)' },
                            { left: `-${scanlineSize}px`, filter: 'blur(3px) brightness(2)' }
                        ], {
                            duration: 200,
                            easing: 'linear'
                        }).onfinish = () => {
                            lineScanline.remove();
                            resolve();
                        };
                    });
                }
                await typeWriterEffect(lineDiv, lines[i], 30);
            }
        } else {
            messageDiv.textContent = prefix ? prefix + text : text;
        }

        if (messageType === 'reply') { stopReplySound(); }
    } catch (error) {
        console.error("Erreur d'affichage:", error);
        messageDiv.textContent = prefix ? prefix + text : text;
        if (messageType === 'reply') { stopReplySound(); }
    }

    chatLog.scrollTop = chatLog.scrollHeight;
    return messageDiv;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
        '255, 255, 255';
}

function showMuthurInterface() {
    const existingChat = document.getElementById('muthur-chat-container');
    if (existingChat) {
        return existingChat;
    }

    const container = document.createElement('div');
    container.id = 'muthur-chat-container';
    
    if (currentMuthurSession.active && currentMuthurSession.userId !== game.user.id) {
        ui.notifications.warn(game.i18n.format("MUTHUR.sessionActiveWarning", { userName: currentMuthurSession.userName }));
        return;
    }

    if (!currentMuthurSession.active) {
        currentMuthurSession.active = true;
        currentMuthurSession.userId = game.user.id;
        currentMuthurSession.userName = game.user.name;

        game.socket.emit('module.alien-mu-th-ur', {
            type: 'sessionStatus',
            active: true,
            userId: game.user.id,
            userName: game.user.name
        });
    }

    const chatContainer = document.createElement('div');
    chatContainer.id = 'muthur-chat-container';

    const sidebar = document.getElementById('sidebar');
    const rightPosition = sidebar ? `${sidebar.offsetWidth + 20}px` : '320px';

    const allowPlayersDrag = (()=>{ try { return game.settings.get('alien-mu-th-ur','allowDragPlayers'); } catch(_) { return false; } })();
    chatContainer.style.cssText = `
        position: ${allowPlayersDrag ? 'absolute' : 'fixed'};
        bottom: 20px;
        right: ${rightPosition};
        width: 400px;
        height: 600px;
        background: black;
        border: 2px solid #00ff00;
        padding: 10px;
        font-family: monospace;
        z-index: 100000;
        display: flex;
        flex-direction: column;
    `;
    const chatLog = document.createElement('div');
    chatLog.className = 'muthur-chat-log';
    chatLog.style.cssText = `
        flex: 1;
        overflow-y: auto;
        margin-bottom: 10px;
        font-family: monospace;
        padding: 5px;
        background: rgba(0, 0, 0, 0.8);
    `;

    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = `
        display: flex;
        gap: 5px;
        width: 100%;
        align-items: center;
    `;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = game.i18n.localize("MUTHUR.inputPlaceholder");
    input.style.cssText = `
        flex: 1;
        background: black;
        border: 1px solid #00ff00;
        color: #00ff00;
        padding: 4px 6px;
        font-family: monospace;
        height: 24px;
    `;

    const sendButton = document.createElement('button');
    sendButton.className = 'muthur-enter-btn';
    sendButton.innerHTML = '<i class="fas fa-level-down-alt" style="transform: rotate(90deg);"></i>';
    sendButton.title = game.i18n.localize("MUTHUR.send");
    sendButton.style.cssText = `
        background: black;
        border: 1px solid #00ff00;
        color: #00ff00;
        cursor: pointer;
        font-family: monospace;
        height: 24px;
        width: 32px;
    `;

    inputContainer.appendChild(input);
    inputContainer.appendChild(sendButton);
    chatContainer.appendChild(chatLog);
    chatContainer.appendChild(inputContainer);
    document.body.appendChild(chatContainer);

    try {
        if (!game.user.isGM && allowPlayersDrag) {
            let dragging=false, sx=0, sy=0, ox=0, oy=0;
            const header = (()=> chatContainer.querySelector('.muthur-chat-header'))() || chatContainer;
            header.style.cursor = 'move';
            const start=(e)=>{
                const target = e.target;
                if (e.button !== undefined && e.button !== 0) return;
                if (target && target.closest && target.closest('input, textarea, button, select')) return;
                dragging=true;
                const r=chatContainer.getBoundingClientRect();
                sx=r.left; sy=r.top;
                ox=(e.touches?e.touches[0].clientX:e.clientX);
                oy=(e.touches?e.touches[0].clientY:e.clientY);
                e.preventDefault();
            };
            const move=(e)=>{ if(!dragging) return; const cx=(e.touches?e.touches[0].clientX:e.clientX); const cy=(e.touches?e.touches[0].clientY:e.clientY); chatContainer.style.left=(sx+(cx-ox))+'px'; chatContainer.style.top=(sy+(cy-oy))+'px'; chatContainer.style.right=''; chatContainer.style.bottom=''; };
            const end=()=>{ dragging=false; };
            header.addEventListener('mousedown', start); header.addEventListener('touchstart', start, {passive:false});
            window.addEventListener('mousemove', move); window.addEventListener('touchmove', move, {passive:false});
            window.addEventListener('mouseup', end); window.addEventListener('touchend', end);
        }
    } catch(_) {}

    syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.welcome"), '', '#00ff00', 'reply');

    async function handleCommand() {
        if (input.value.trim()) {
            const command = input.value.trim().toUpperCase();
            input.value = '';
            await syncMessageToSpectators(chatLog, command, '> ');
            chatLog.scrollTop = chatLog.scrollHeight;

            // --- INÍCIO: COMANDOS PERSONALIZADOS ---
            try {
                const settingsStr = game.settings.get('alien-mu-th-ur', 'customCommands');
                if (settingsStr && settingsStr.trim() !== "") {
                    const customCommandsObj = JSON.parse(settingsStr);
                    
                    // Verifica se o comando exato existe no JSON cadastrado
                    if (customCommandsObj[command]) {
                        const resposta = customCommandsObj[command];
                        
                        // Envia a resposta sincronizada para o jogador e espectadores
                        await syncMessageToSpectators(chatLog, resposta, '', '#00ff00', 'reply');
                        
                        // Notifica o GM no painel dele que um comando válido foi usado
                        if (!game.user.isGM) {
                            sendToGM(command, 'command', 'valid');
                        }
                        return; // Encerra a função para não dar "Command Not Found"
                    }
                }
            } catch (e) {
                console.error("MUTHUR | Erro de formatação no JSON de comandos personalizados:", e);
            }
            // --- FIM: COMANDOS PERSONALIZADOS ---

            const motherPrefix = "/M";

            const orderWords = [
                game.i18n.localize('MOTHER.Keywords.Ordre').toUpperCase(),
                'ORDER'
            ];
            const specialWords = [
                game.i18n.localize('MOTHER.Keywords.Special').toUpperCase(),
                game.i18n.localize('MOTHER.Keywords.Special2').toUpperCase()
            ];
            const protocolWords = [
                game.i18n.localize('MOTHER.Keywords.Protocol').toUpperCase(),
                'PROTOCOL'
            ];

            const isValidNumber = (num) => /^(937|938|939|\d{3})$/.test(num);

            const isSpecialOrder = (cmd) => {
                const words = cmd.split(/\s+/);
                if (words.length === 1) {
                    return isValidNumber(words[0]);
                } else if (words.length === 2) {
                    return (orderWords.includes(words[0]) || specialWords.includes(words[0])) && isValidNumber(words[1]);
                } else if (words.length === 3) {
                    return ((orderWords.includes(words[0]) && specialWords.includes(words[1])) ||
                        (specialWords.includes(words[0]) && orderWords.includes(words[1]))) &&
                        isValidNumber(words[2]);
                }
                return false;
            };

            const isCerberus = (cmd) => {
                const words = cmd.split(/\s+/);
                return words.includes('CERBERUS') ||
                    (words.length === 2 && protocolWords.includes(words[0]) && words[1] === 'CERBERUS');
            };

            if (isSpecialOrder(command) || isCerberus(command)) {
                const isCaptain = (() => {
                    try {
                        const ids = game.settings.get('alien-mu-th-ur', 'captainUserIds') || [];
                        return ids.includes(game.user.id);
                    } catch (e) { return false; }
                })();

                const allowCaptain = (() => {
                    try { return game.settings.get('alien-mu-th-ur', 'allowCaptainSpecialOrders'); } catch (e) { return true; }
                })();

                const canAccess = game.user.isGM || hackSuccessful || (allowCaptain && isCaptain);
                if (!canAccess) {
                    await syncMessageToSpectators(chatLog, game.i18n.localize('MOTHER.AccessDenied'), '', '#ff0000', 'error');
                    if (!game.user.isGM) {
                        sendToGM(game.i18n.format("MUTHUR.SpecialOrderAttempt", { command: command }));
                    }
                    if (game.settings.get('alien-mu-th-ur', 'enableTypingSounds')) {
                        playErrorSound();
                    }
                    return;
                }

                await handleSpecialOrder(chatLog, command);
                return;
            }

            if (command.startsWith(motherPrefix)) {
                const message = command.substring(motherPrefix.length).trim();
                await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.waitingResponse"), '', '#00ff00', 'communication');
                chatLog.scrollTop = chatLog.scrollHeight;
                if (!game.user.isGM) {
                    sendToGM(message, 'command', 'm');
                }
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            const knownCommands = ['HACK', 'HELP', 'STATUS', 'CLEAR', 'EXIT'];
            const isKnownCommand = knownCommands.includes(command);

            if (/^(LIST\s+DOORS|DOORS)$/.test(command)) {
                const doors = getDoorsByPrefix('AD');
                if (!doors.length) {
                    await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.noDoorsFound") || "No doors found.", '', '#00ff00', 'reply');
                    return;
                }
                await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.doorListHeader") || "Doors in area:", '', '#00ff00', 'reply');
                for (let i = 0; i < doors.length; i++) {
                    const d = doors[i];
                    const labelName = getDoorPreferredLabel(d);
                    if (!labelName) continue;
                    await displayMuthurMessage(chatLog, `#${i+1} ${labelName}`, '', '#00ff00', 'reply');
                }
                return;
            }

            let m;
            if ((m = command.match(/^LOCK\s+DOOR\s+(\d+)$/))) {
                const index = parseInt(m[1], 10) - 1;
                if (!hackSuccessful && !game.user.isGM) {
                    await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.permissionDenied") || "ACCESS DENIED.", '', '#ff0000', 'error');
                    return;
                }
                try {
                    game.socket.emit('module.alien-mu-th-ur', { type: 'doorControlRequest', action: 'LOCK', index, filteredPrefix: 'AD', fromId: game.user.id, fromName: game.user.name });
                    await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.requestSent") || "Request sent to GM...", '', '#00ff00', 'reply');
                } catch(e) {}
                return;
            }
            if ((m = command.match(/^UNLOCK\s+DOOR\s+(\d+)$/))) {
                const index = parseInt(m[1], 10) - 1;
                if (!hackSuccessful && !game.user.isGM) {
                    await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.permissionDenied") || "ACCESS DENIED.", '', '#ff0000', 'error');
                    return;
                }
                try {
                    game.socket.emit('module.alien-mu-th-ur', { type: 'doorControlRequest', action: 'UNLOCK', index, filteredPrefix: 'AD', fromId: game.user.id, fromName: game.user.name });
                    await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.requestSent") || "Request sent to GM...", '', '#00ff00', 'reply');
                } catch(e) {}
                return;
            }

            if (/^SHUTDOWN\s+LIGHTS$/.test(command)) {
                if (!hackSuccessful && !game.user.isGM) {
                    await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.permissionDenied") || "ACCESS DENIED.", '', '#ff0000', 'error');
                    return;
                }
                try {
                    game.socket.emit('module.alien-mu-th-ur', { type: 'lightsControlRequest', action: 'SHUTDOWN', fromId: game.user.id, fromName: game.user.name });
                    await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.waitingForMother") || "EN ATTENTE DE MAMAN", '', '#00ff00', 'reply');
                } catch(e) {}
                return;
            }
            if (/^RESTORE\s+LIGHTS$/.test(command)) {
                if (!hackSuccessful && !game.user.isGM) {
                    await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.permissionDenied") || "ACCESS DENIED.", '', '#ff0000', 'error');
                    return;
                }
                try {
                    game.socket.emit('module.alien-mu-th-ur', { type: 'lightsControlRequest', action: 'RESTORE', fromId: game.user.id, fromName: game.user.name });
                    await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.waitingForMother") || "EN ATTENTE DE MAMAN", '', '#00ff00', 'reply');
                } catch(e) {}
                return;
            }

            if (/^(ACTIVATE\s+ALARM|ALARM|ALARME|ACTIV[ÉE]R?\s+ALARME)$/.test(command)) {
                if (!hackSuccessful && !game.user.isGM) {
                    await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.permissionDenied") || "ACCESS DENIED.", '', '#ff0000', 'error');
                    return;
                }
                try {
                    game.socket.emit('module.alien-mu-th-ur', { type: 'alarmRequest', fromId: game.user.id, fromName: game.user.name, overlay: true });
                    await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.waitingForMother") || "EN ATTENTE DE MAMAN", '', '#00ff00', 'reply');
                    try { sendToGM(command, 'command', 'valid'); } catch(_) {}
                } catch(e) {}
                return;
            }

            if ((m = command.match(/^GAS\s+TARGETS?$/))) {
                if (!hackSuccessful && !game.user.isGM) { await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.permissionDenied") || "ACCESS DENIED.", '', '#ff0000', 'error'); return; }
                try {
                    game.socket.emit('module.alien-mu-th-ur', { type: 'gasRequest', fromId: game.user.id, fromName: game.user.name });
                    await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.waitingForMother") || "EN ATTENTE DE MAMAN", '', '#00ff00', 'reply');
                } catch(e) {}
                return;
            }
            if ((m = command.match(/^CRYO\s+POD(?:\s+(.*))?$/))) {
                const targetName = (m[1] || '').trim();
                if (!hackSuccessful && !game.user.isGM) { await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.permissionDenied") || "ACCESS DENIED.", '', '#ff0000', 'error'); return; }
                try {
                    game.socket.emit('module.alien-mu-th-ur', { type: 'cryoRequest', targetName, fromId: game.user.id, fromName: game.user.name });
                    await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.waitingForMother") || "EN ATTENTE DE MAMAN", '', '#00ff00', 'reply');
                } catch(e) {}
                return;
            }

            if (/^(CRYO\s+RELEASE|RELEASE\s+CRYO|SORTIR\s+CRYO|RELACHER\s+CRYO|RELÂCHER\s+CRYO)\s*$/.test(command)) {
                const all = false;
                if (!hackSuccessful && !game.user.isGM) { await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.permissionDenied") || "ACCESS DENIED.", '', '#ff0000', 'error'); return; }
                try {
                    game.socket.emit('module.alien-mu-th-ur', { type: 'cryoReleaseRequest', all, fromId: game.user.id, fromName: game.user.name });
                    await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.waitingForMother") || "EN ATTENTE DE MAMAN", '', '#00ff00', 'reply');
                } catch(e) {}
                return;
            }

            switch (command) {
                case 'HACK':
                    if (!game.settings.get('alien-mu-th-ur', 'allowHack') && !game.user.isGM) {
                        await displayMuthurMessage(chatLog, game.i18n.localize("MUTHUR.commandNotFound"), '', '#00ff00', 'error');
                        sendToGM(game.i18n.localize("MOTHER.HackDisabledInfo"), 'hack');
                    } else {
                        await simulateHackingAttempt(chatLog);
                    }
                    return; 
                case 'HELP':
                    await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.help"), '', '#00ff00', 'reply');
                    if (hackSuccessful && game.settings.get('alien-mu-th-ur', 'phShowInHelp')) {
                        const extra = buildPostHackHelpList();
                        if (extra) {
                            await syncMessageToSpectators(chatLog, extra, '', '#00ff00', 'reply');
                        }
                    }
                    if (!game.user.isGM) {
                        sendToGM(command, 'command', 'valid');
                    }
                    break;
                case 'STATUS':
                    if (!game.user.isGM) {
                        game.socket.emit('module.alien-mu-th-ur', {
                            type: 'statusRequest',
                            fromId: game.user.id,
                            fromName: game.user.name
                        });
                        try { sendToGM(command, 'command', 'valid'); } catch(e) {}
                        await displayMuthurMessage(chatLog, game.i18n.localize('MUTHUR.waitingResponse'), '', '#00ff00', 'communication');
                    } else {
                        const key = game.settings.get('alien-mu-th-ur', 'currentStatusKey');
                        const presets = {
                            normal: 'MUTHUR.STATUS.text.normal',
                            anomalyDetected: 'MUTHUR.STATUS.text.anomalyDetected',
                            systemOffline: 'MUTHUR.STATUS.text.systemOffline',
                            degradedPerformance: 'MUTHUR.STATUS.text.degradedPerformance',
                            fireDetected: 'MUTHUR.STATUS.text.fireDetected',
                            quarantine: 'MUTHUR.STATUS.text.quarantine',
                            lockdown: 'MUTHUR.STATUS.text.lockdown',
                            intrusion: 'MUTHUR.STATUS.text.intrusion',
                            networkIssue: 'MUTHUR.STATUS.text.networkIssue'
                        };
                        const i18nKey = (key === 'custom') ? null : (presets[key] || 'MUTHUR.status');
                        const statusText = i18nKey ? game.i18n.localize(i18nKey)
                            : (game.settings.get('alien-mu-th-ur', 'customStatusText') || game.i18n.localize('MUTHUR.status'));
                        await syncMessageToSpectators(chatLog, statusText, '', '#00ff00', 'reply');
                    }
                    break;
                case 'CLEAR':
                    chatLog.innerHTML = '';
                    if (!game.user.isGM) {
                        try {
                            game.socket.emit('module.alien-mu-th-ur', { type: 'clearSpectatorChat' });
                        } catch (e) { console.warn('MUTHUR | emission clearSpectatorChat échouée', e); }
                    }
                    if (hackSuccessful) {
                        await syncMessageToSpectators(chatLog, game.i18n.localize("MOTHER.WelcomeAdminFull"), '', '#00ff00', 'reply');
                    } else {
                        await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.welcome"), '', '#00ff00', 'reply');
                    }
                    if (!game.user.isGM) {
                        sendToGM(command, 'command', 'valid');
                    }
                    break;
                case 'EXIT':
                    await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.sessionEnded"), '', '#00ff00', 'reply');
                    setTimeout(() => {
                        const muthurContainer = document.getElementById('muthur-chat-container');
                        if (muthurContainer) {
                            muthurContainer.remove();
                        }
                        if (currentMuthurSession.userId === game.user.id) {
                            currentMuthurSession.active = false;
                            currentMuthurSession.userId = null;
                            currentMuthurSession.userName = null;
                            game.socket.emit('module.alien-mu-th-ur', {
                                type: 'sessionStatus',
                                active: false
                            });
                        }
                    }, 1000);
                    if (!game.user.isGM) {
                        sendToGM(game.i18n.localize("MUTHUR.sessionEnded"), 'close');
                    }
                    return;
                default:
                    if (!command.startsWith(motherPrefix)) {
                        if (!game.user.isGM) { try { sendToGM(command, 'command', 'unknown'); } catch(_) {} }
                        await syncMessageToSpectators(chatLog, game.i18n.localize("MUTHUR.commandNotFound"), '', '#00ff00', 'error');
                    }
            }
        }
    };

    input.addEventListener('keypress', async (event) => {
        const soundEnabled = game.settings.get('alien-mu-th-ur', 'enableTypingSounds');
        if (soundEnabled) { playTypeSound(); }

        if (event.key === 'Enter' || event.key === 'NumpadEnter') {
            event.stopPropagation();
            event.preventDefault();
            await handleCommand();
        }
    });

    sendButton.addEventListener('click', handleCommand);

    return chatContainer;
}

function showWaitingMessage() {
    let waitingContainer = document.getElementById('muthur-waiting-container');
    if (waitingContainer) {
        return waitingContainer;
    }
    
    waitingContainer = document.createElement('div');
    waitingContainer.id = 'muthur-waiting-container';
    waitingContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: black;
        border: 2px solid #00ff00;
        padding: 20px;
        z-index: 100000;
        text-align: center;
        font-family: monospace;
        min-width: 400px;
    `;
    
    const title = document.createElement('h2');
    title.textContent = "MU/TH/UR 6000";
    title.style.cssText = `
        color: #00ff00;
        margin-top: 0;
        font-family: monospace;
    `;
    waitingContainer.appendChild(title);
    
    const message = document.createElement('p');
    message.textContent = game.i18n.localize("MUTHUR.waitingForGM");
    message.style.cssText = `
        color: #00ff00;
        font-family: monospace;
        margin-bottom: 20px;
    `;
    waitingContainer.appendChild(message);
    
    const loadingIndicator = document.createElement('div');
    loadingIndicator.style.cssText = `
        color: #00ff00;
        font-size: 24px;
        font-family: monospace;
    `;
    loadingIndicator.textContent = ".";
    waitingContainer.appendChild(loadingIndicator);
    
    let dots = 1;
    const loadingInterval = setInterval(() => {
        dots = (dots % 3) + 1;
        loadingIndicator.textContent = ".".repeat(dots);
    }, 500);
    
    waitingContainer.dataset.intervalId = loadingInterval;
    document.body.appendChild(waitingContainer);
    
    return waitingContainer;
}

function toggleMuthurChat() {
    let chatContainer = document.getElementById('muthur-chat-container');

    if (chatContainer) {
        chatContainer.remove();
        if (currentMuthurSession.userId === game.user.id) {
            currentMuthurSession.active = false;
            currentMuthurSession.userId = null;
            currentMuthurSession.userName = null;

            game.socket.emit('module.alien-mu-th-ur', {
                type: 'sessionStatus',
                active: false
            });
        }
        if (!game.user.isGM) {
            sendToGM(game.i18n.localize("MUTHUR.sessionEnded"), 'close');
        }
        return;
    }

    if (currentMuthurSession.active && currentMuthurSession.userId !== game.user.id) {
        ui.notifications.warn(game.i18n.format("MUTHUR.sessionActiveWarning", { userName: currentMuthurSession.userName }));
        return;
    }

    if (game.user.isGM) {
        showMuthurInterface();
    } else {
        showWaitingMessage();
        
        currentMuthurSession.active = true;
        currentMuthurSession.userId = game.user.id;
        currentMuthurSession.userName = game.user.name;
        
        game.socket.emit('module.alien-mu-th-ur', {
            type: 'requestSpectatorSelection',
            userId: game.user.id,
            userName: game.user.name
        });
        
        ui.notifications.info(game.i18n.localize("MUTHUR.waitingForGM"));
        return;
    }

    if (game.user.isGM) {
        showMuthurInterface();
    }
}

function createGMMuthurInterface(userName, userId) {
    const container = document.createElement('div');
    container.id = 'gm-muthur-container';

    const sidebar = document.getElementById('sidebar');
    const rightPosition = sidebar ? `${sidebar.offsetWidth + 20}px` : '320px';

    container.style.cssText = `
        position: ${game.settings.get('alien-mu-th-ur','allowDragGM') ? 'absolute' : 'fixed'};
        bottom: 20px;
        right: ${document.getElementById('sidebar').offsetWidth + 20}px;
        width: 400px;
        height: 600px;
        background: black;
        border: 2px solid #ff9900;
        padding: 10px;
        font-family: monospace;
        z-index: 100000;
        display: flex;
        flex-direction: column;
    `;
    
    const headerContainer = document.createElement('div');
    headerContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    `;
    
    const headerTitle = document.createElement('div');
    headerTitle.textContent = game.i18n.format("MUTHUR.gmInterfaceTitle", { userName: userName });
    headerTitle.style.cssText = `
        color: #ff9900;
        font-weight: bold;
        font-family: monospace;
        font-size: 16px;
    `;
    
    const helpButton = document.createElement('button');
    helpButton.textContent = '?';
    helpButton.title = game.i18n.localize('MUTHUR.helpMenu.tooltip') || 'Commands Help';
    helpButton.style.cssText = `
        background: black;
        border: 1px solid #ff9900;
        color: #ff9900;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-family: monospace;
        padding: 0;
        line-height: 1;
        margin-right: 6px;
    `;

    function buildGMHelpPanelContent() {
        const lines = [];
        const g = (k)=>{ try { return game.settings.get('alien-mu-th-ur', k); } catch(e) { return false; } };
        const sec = (k)=>({
            title: game.i18n.localize(`MUTHUR.helpMenu.sections.${k}.title`) || k.toUpperCase(),
            desc: game.i18n.localize(`MUTHUR.helpMenu.sections.${k}.desc`) || ''
        });
        const intro = game.i18n.localize('MUTHUR.helpMenu.sections.intro') || '';
        if (intro) lines.push(`<div style="margin:0 0 8px 0; opacity:0.9;">${intro}</div>`);
        const basic = sec('basic');
        lines.push(`<div style=\"margin:6px 0 2px 0; font-weight:bold;\">${basic.title}</div><div style=\"white-space:pre-wrap;\">${basic.desc}</div>`);
        const hack = sec('hack');
        lines.push(`<div style=\"margin:6px 0 2px 0; font-weight:bold;\">${hack.title}</div><div style=\"white-space:pre-wrap;\">${hack.desc}</div>`);
        if (g('phSpecialOrders')) { const s = sec('specialOrders'); lines.push(`<div style="margin:6px 0 2px 0; font-weight:bold;">${s.title}</div><div>${s.desc}</div>`); }
        { const s = sec('cerberus'); lines.push(`<div style=\"margin:6px 0 2px 0; font-weight:bold;\">${s.title}</div><div>${s.desc}</div>`); }
        if (g('phDoors'))         { const s = sec('doors');         lines.push(`<div style=\"margin:6px 0 2px 0; font-weight:bold;\">${s.title}</div><div>${s.desc}</div>`); }
        if (g('phLights'))        { const s = sec('lights');        lines.push(`<div style=\"margin:6px 0 2px 0; font-weight:bold;\">${s.title}</div><div>${s.desc}</div>`); }
        if (g('phAlarm'))         { const s = sec('alarm');         lines.push(`<div style=\"margin:6px 0 2px 0; font-weight:bold;\">${s.title}</div><div>${s.desc}</div>`); }
        if (g('phGas'))           { const s = sec('gas');           lines.push(`<div style=\"margin:6px 0 2px 0; font-weight:bold;\">${s.title}</div><div>${s.desc}</div>`); }
        if (g('phCryo'))          { const s1 = sec('cryo');         lines.push(`<div style=\"margin:6px 0 2px 0; font-weight:bold;\">${s1.title}</div><div>${s1.desc}</div>`);
                                     const s2 = sec('cryoRelease'); lines.push(`<div style=\"margin:6px 0 2px 0; font-weight:bold;\">${s2.title}</div><div>${s2.desc}</div>`); }

        if (g('phSpecialOrders')) {
            const orderCodes = ['754','899','931','937','939','966'];
            const items = orderCodes.map(code => {
                const name = game.i18n.localize(`MOTHER.SpecialOrders.${code}.name`) || code;
                const desc = game.i18n.localize(`MOTHER.SpecialOrders.${code}.description`) || '';
                return `<div style=\"margin:4px 0;\"><div style=\"font-weight:bold;\">${name}</div><div>${desc}</div></div>`;
            }).join('');
            lines.push(items);
        }
        return lines.join('<hr style="border-color:#333; border-width:1px 0 0; margin:8px 0;">');
    }

    function toggleGMHelpPanel() {
        const existing = document.getElementById('gm-muthur-help-panel');
        if (existing) { existing.remove(); return; }
        const panel = document.createElement('div');
        panel.id = 'gm-muthur-help-panel';
        const comp = window.getComputedStyle(container);
        const containerRight = parseInt(comp.right) || 320;
        const panelRight = containerRight + container.offsetWidth + 10;
        panel.style.cssText = `
            position: fixed;
            bottom: ${comp.bottom || '20px'};
            right: ${panelRight}px;
            width: 360px;
            height: ${container.offsetHeight || 600}px;
            background: black;
            border: 2px solid #ff9900;
            padding: 10px;
            font-family: monospace;
            z-index: 100000;
            display: flex;
            flex-direction: column;
        `;

        const header = document.createElement('div');
        header.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;';
        const title = document.createElement('div');
        title.textContent = game.i18n.localize('MUTHUR.helpMenu.title') || 'MUTHUR - HELP';
        title.style.cssText = 'color:#ff9900; font-weight:bold; font-size:16px;';
        const close = document.createElement('button');
        close.innerHTML = '&#10006;';
        close.title = game.i18n.localize('MUTHUR.helpMenu.close') || 'Close';
        close.style.cssText = 'background:black; border:1px solid #ff9900; color:#ff9900; width:24px; height:24px; display:flex; align-items:center; justify-content:center; cursor:pointer; padding:0; line-height:1;';
        close.addEventListener('click', ()=> panel.remove());
        header.appendChild(title);
        header.appendChild(close);

        const body = document.createElement('div');
        body.style.cssText = 'flex:1; overflow:auto; color:#ff9900;';
        body.innerHTML = buildGMHelpPanelContent();

        panel.appendChild(header);
        panel.appendChild(body);
        document.body.appendChild(panel);
    }

    helpButton.addEventListener('click', toggleGMHelpPanel);
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&#10006;'; 
    closeButton.style.cssText = `
        background: black;
        border: 1px solid #ff9900;
        color: #ff9900;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-family: monospace;
        padding: 0;
        line-height: 1;
    `;
    
    closeButton.addEventListener('click', () => {
        if (document.body.contains(container)) {
            document.body.removeChild(container);
        }
        
        game.socket.emit('module.alien-mu-th-ur', {
            type: 'closePlayerInterface',
            targetUserId: userId
        });

        try {
            game.socket.emit('module.alien-mu-th-ur', {
                type: 'sessionStatus',
                active: false,
                userId: currentMuthurSession?.userId || userId,
                userName: currentMuthurSession?.userName || ''
            });
        } catch (e) { /* no-op */ }
    });
    
    const rightControls = document.createElement('div');
    rightControls.style.cssText = 'display:flex; align-items:center; gap:0;';

    const stopAlarmBtn = document.createElement('button');
    stopAlarmBtn.id = 'gm-muthur-stop-alarm-btn';
    const stopLbl = game.i18n.localize('MUTHUR.stopAlarm');
    stopAlarmBtn.textContent = (stopLbl && stopLbl !== 'MUTHUR.stopAlarm') ? stopLbl : 'STOP ALARME';
    stopAlarmBtn.title = (stopLbl && stopLbl !== 'MUTHUR.stopAlarm') ? stopLbl : 'STOP ALARME';
    stopAlarmBtn.style.cssText = `
        background: black;
        border: 1px solid #ff0000;
        color: #ff0000;
        height: 24px;
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-family: monospace;
        padding: 0 6px;
        line-height: 1;
        margin-right: 6px;
    `;
    stopAlarmBtn.onclick = () => {
        console.log('[MUTHUR][ALARM] GM clicked STOP. Stopping locally and emitting universal command.');
        try { stopAlarm(); } catch (e) { console.warn('[MUTHUR][ALARM] local stop error:', e); }
        try {
            game.socket.emit('module.alien-mu-th-ur', { type: 'alarmControl', action: 'off' });
        } catch (e) {
            console.warn('[MUTHUR][ALARM] emit off error:', e);
        }
    };

    helpButton.style.marginRight = '0';
    rightControls.appendChild(stopAlarmBtn);
    rightControls.appendChild(helpButton);
    rightControls.appendChild(closeButton);
    headerContainer.appendChild(headerTitle);
    headerContainer.appendChild(rightControls);
    container.appendChild(headerContainer);

    try {
        if (game.settings.get('alien-mu-th-ur','allowDragGM')) {
            let isDragging = false; let ox=0; let oy=0; let sx=0; let sy=0;
            const startDrag = (e)=>{ isDragging = true; const r = container.getBoundingClientRect(); sx = r.left; sy = r.top; ox = (e.touches?e.touches[0].clientX:e.clientX); oy = (e.touches?e.touches[0].clientY:e.clientY); e.preventDefault(); };
            const onMove = (e)=>{ if(!isDragging) return; const cx = (e.touches?e.touches[0].clientX:e.clientX); const cy = (e.touches?e.touches[0].clientY:e.clientY); container.style.left = (sx + (cx-ox)) + 'px'; container.style.top = (sy + (cy-oy)) + 'px'; container.style.right=''; container.style.bottom=''; };
            const endDrag = ()=>{ isDragging = false; };
            headerContainer.style.cursor = 'move';
            headerContainer.addEventListener('mousedown', startDrag); headerContainer.addEventListener('touchstart', startDrag, {passive:false});
            window.addEventListener('mousemove', onMove); window.addEventListener('touchmove', onMove, {passive:false});
            window.addEventListener('mouseup', endDrag); window.addEventListener('touchend', endDrag);
        }
    } catch(_) {}

    const chatLog = document.createElement('div');
    chatLog.className = 'gm-chat-log';
    chatLog.style.cssText = `
        flex: 1;
        overflow-y: auto;
        margin-bottom: 10px;
        font-family: monospace;
        padding: 5px;
        background: rgba(0, 0, 0, 0.8);
    `;
    container.appendChild(chatLog);

    const responseArea = document.createElement('div');
    responseArea.style.cssText = `
        display: flex;
        gap: 5px;
        width: 100%;
        margin-top: 5px;
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    .muthur-color-dropdown { position: relative; display: inline-block; }
    .muthur-color-toggle { width: 28px; height: 24px; border: 1px solid #ff9900; background: #ff9900; cursor: pointer; padding: 0; }
    .muthur-color-menu { position: absolute; left: 0; bottom: 28px; background: #000; border: 1px solid #ff9900; padding: 6px; display: none; grid-template-columns: repeat(6, 20px); gap: 6px; z-index: 100002; }
    .muthur-color-dropdown.open .muthur-color-menu { display: grid; }
    .muthur-color-swatch { width: 20px; height: 20px; border: 1px solid #ff9900; cursor: pointer; padding: 0; background: transparent; display: inline-flex; align-items: center; justify-content: center; }
    .muthur-color-swatch i { color: #ff9900; font-size: 12px; }
    .muthur-color-swatch[aria-pressed="true"] { outline: 2px solid #ffffff; outline-offset: 1px; }
    .muthur-enter-btn { width: 32px; height: 24px; display: inline-flex; align-items: center; justify-content: center; background: black; border: 1px solid #ff9900; color: #ff9900; cursor: pointer; box-shadow: inset 0 -2px 0 rgba(255,153,0,0.4); }
    .muthur-enter-btn:hover { filter: brightness(1.2); }
`;
    document.head.appendChild(styleSheet);

    const colors = {
        "#ff9900": game.i18n.localize("MUTHUR.SETTINGS.motherResponseColor.orange"),
        "#00ff00": game.i18n.localize("MUTHUR.SETTINGS.motherResponseColor.green"),
        "#ff0000": game.i18n.localize("MUTHUR.SETTINGS.motherResponseColor.red"),
        "#ffffff": game.i18n.localize("MUTHUR.SETTINGS.motherResponseColor.white"),
        "#0099ff": game.i18n.localize("MUTHUR.SETTINGS.motherResponseColor.blue"),
        "#ffff00": game.i18n.localize("MUTHUR.SETTINGS.motherResponseColor.yellow")
    };

    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.style.cssText = `
        position: absolute; left: -10000px; top: -10000px; opacity: 0;
    `;
    document.body.appendChild(colorPicker);

    let savedColor = '#ff9900';
    try { savedColor = game.settings.get('alien-mu-th-ur', 'gmResponseColor') || '#ff9900'; } catch (e) {}
    colorPicker.value = savedColor;

    const colorDropdown = document.createElement('div');
    colorDropdown.className = 'muthur-color-dropdown';
    const colorToggle = document.createElement('button');
    colorToggle.className = 'muthur-color-toggle';
    colorToggle.style.background = savedColor;
    const colorMenu = document.createElement('div');
    colorMenu.className = 'muthur-color-menu';

    const predefined = Object.entries(colors).map(([value, label]) => ({ value, label }));
    let selectedColor = savedColor;

    const createSwatch = ({ value, label }) => {
        const btn = document.createElement('button');
        btn.className = 'muthur-color-swatch';
        btn.style.background = value;
        btn.setAttribute('aria-label', label);
        btn.title = label;
        btn.setAttribute('aria-pressed', String(value.toLowerCase() === selectedColor.toLowerCase()));
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedColor = value;
            colorToggle.style.background = selectedColor;
            Array.from(colorMenu.children).forEach(c => c.setAttribute('aria-pressed', 'false'));
            btn.setAttribute('aria-pressed', 'true');
            colorDropdown.classList.remove('open');
            try { game.settings.set('alien-mu-th-ur', 'gmResponseColor', selectedColor); } catch (e) {}
        });
        return btn;
    };

    predefined.forEach(item => colorMenu.appendChild(createSwatch(item)));

    const customSwatch = document.createElement('button');
    customSwatch.className = 'muthur-color-swatch';
    customSwatch.innerHTML = '<i class="fas fa-eye-dropper"></i>';
    customSwatch.title = 'Personnalisé';
    customSwatch.addEventListener('click', (e) => {
        e.stopPropagation();
        colorPicker.click();
    });
    colorPicker.addEventListener('input', () => {
        selectedColor = colorPicker.value;
        colorToggle.style.background = selectedColor;
        Array.from(colorMenu.children).forEach(c => c.setAttribute('aria-pressed', 'false'));
        customSwatch.setAttribute('aria-pressed', 'true');
        colorDropdown.classList.remove('open');
        try { game.settings.set('alien-mu-th-ur', 'gmResponseColor', selectedColor); } catch (e) {}
    });
    colorMenu.appendChild(customSwatch);

    colorToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        colorDropdown.classList.toggle('open');
    });
    document.addEventListener('click', () => colorDropdown.classList.remove('open'));

    colorDropdown.appendChild(colorToggle);
    colorDropdown.appendChild(colorMenu);

    const manageCaptainsBtn = document.createElement('button');
    manageCaptainsBtn.innerHTML = '<i class="fas fa-crown"></i>';
    manageCaptainsBtn.title = game.i18n.localize('MUTHUR.ROLES.manageCaptains');
    manageCaptainsBtn.style.cssText = `
        width: 28px; height: 24px; background: black; border: 1px solid #ff9900; color: #ff9900; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
    `;
    manageCaptainsBtn.addEventListener('click', () => {
        if (!game.user.isGM) return;
        const dialog = document.createElement('div');
        dialog.style.cssText = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: black; border: 2px solid #ff9900; padding: 12px; z-index: 100003; color: #ff9900; min-width: 280px;`;
        const title = document.createElement('div');
        title.textContent = game.i18n.localize('MUTHUR.ROLES.captainLabel');
        title.style.cssText = 'font-weight: bold; margin-bottom: 8px;';
        dialog.appendChild(title);

        const list = document.createElement('div');
        list.style.cssText = 'max-height: 240px; overflow: auto; margin-bottom: 8px;';
        const ids = (() => { try { return game.settings.get('alien-mu-th-ur', 'captainUserIds') || []; } catch(e) { return []; } })();
        game.users.forEach(u => {
            if (u.isGM) return; 
            const row = document.createElement('label');
            row.style.cssText = 'display:flex; align-items:center; gap:6px; margin: 2px 0;';
            const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = ids.includes(u.id);
            cb.addEventListener('change', async () => {
                const current = (() => { try { return game.settings.get('alien-mu-th-ur', 'captainUserIds') || []; } catch(e) { return []; } })();
                const next = cb.checked ? Array.from(new Set([...current, u.id])) : current.filter(id => id !== u.id);
                try { await game.settings.set('alien-mu-th-ur', 'captainUserIds', next); } catch(e) { console.error(e); }
            });
            const name = document.createElement('span'); name.textContent = u.name;
            row.appendChild(cb); row.appendChild(name); list.appendChild(row);
        });
        dialog.appendChild(list);

        const allowWrap = document.createElement('label');
        allowWrap.style.cssText = 'display:flex; align-items:center; gap:6px; margin-top: 6px;';
        const allow = document.createElement('input'); allow.type = 'checkbox';
        try { allow.checked = game.settings.get('alien-mu-th-ur', 'allowCaptainSpecialOrders'); } catch(e) {}
        allow.addEventListener('change', async () => {
            try { await game.settings.set('alien-mu-th-ur', 'allowCaptainSpecialOrders', allow.checked); } catch(e) { console.error(e); }
        });
        const allowLbl = document.createElement('span'); allowLbl.textContent = game.i18n.localize('MUTHUR.ROLES.allowCaptainOrders');
        allowWrap.appendChild(allow); allowWrap.appendChild(allowLbl);
        dialog.appendChild(allowWrap);

        const close = document.createElement('button');
        close.textContent = 'OK';
        close.style.cssText = 'margin-top: 10px; background:black; border:1px solid #ff9900; color:#ff9900; padding: 4px 10px; cursor:pointer;';
        close.addEventListener('click', () => dialog.remove());
        dialog.appendChild(close);
        document.body.appendChild(dialog);
    });

    const input = document.createElement('input');
    input.type = 'text';
    input.style.cssText = `
        flex: 1;
        min-width: 200px;
        background: black;
        border: 1px solid #ff9900;
        color: #ff9900;
        padding: 5px;
        font-family: monospace;
        height: 24px;
    `;

    const sendButton = document.createElement('button');
    sendButton.className = 'muthur-enter-btn';
    sendButton.innerHTML = '<i class="fas fa-level-down-alt" style="transform: rotate(90deg);"></i>';
    sendButton.title = game.i18n.localize("MUTHUR.send");
    sendButton.style.cssText = `
        background: black;
        border: 1px solid #ff9900;
        color: #ff9900;
        cursor: pointer;
        font-family: monospace;
        height: 24px;
        width: 32px;
    `;

    responseArea.appendChild(colorDropdown);
    responseArea.appendChild(manageCaptainsBtn);
    responseArea.appendChild(input);
    responseArea.appendChild(sendButton);
    container.appendChild(responseArea);

    const handleResponse = () => {
        if (input.value.trim()) {
            const chosen = selectedColor;
            sendGMResponse(userId, input.value.trim(), chosen);
            input.value = '';
        }
    };

    input.addEventListener('keypress', () => {
        const soundEnabled = game.settings.get('alien-mu-th-ur', 'enableTypingSounds');
        if (soundEnabled) { playTypeSound(); }
    });

    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleResponse();
        }
    });

    sendButton.addEventListener('click', handleResponse);

    return container;
}

async function handleGMResponse(data) {
    if (game.user.id !== data.targetUserId) return;

    const chatLog = document.querySelector('.muthur-chat-log');
    if (!chatLog) {
        console.error("Chat log non trouvé");
        return;
    }

    const response = data.command.toUpperCase();

    const motherName = game.i18n.localize("MUTHUR.motherName");
    const messageDiv = await displayMuthurMessage(chatLog, response, `${motherName}: `, data.color || '#ff9900', 'reply');
    messageDiv.classList.add('maman-message');

    chatLog.scrollTop = chatLog.scrollHeight;
    
    updateSpectatorsWithMessage(response, `${motherName}: `, data.color || '#ff9900', 'reply');
}

function showGMSpectatorSelectionDialog(activeUserId, activeUserName) {
    const dialog = document.createElement('div');
    dialog.id = 'muthur-spectator-dialog';
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        background: black;
        border: 2px solid #ff9900;
        padding: 20px;
        font-family: monospace;
        z-index: 100001;
        color: #ff9900;
    `;

    const title = document.createElement('h2');
    title.textContent = game.i18n.localize("MUTHUR.selectSpectators");
    title.style.cssText = `
        margin-top: 0;
        text-align: center;
        color: #ff9900;
        font-family: monospace;
        font-size: 18px;
    `;
    dialog.appendChild(title);

    const description = document.createElement('p');
    description.textContent = game.i18n.localize("MUTHUR.selectSpectatorsHint");
    description.style.cssText = `
        margin-bottom: 15px;
        color: #ff9900;
        font-family: monospace;
    `;
    dialog.appendChild(description);

    const playerList = document.createElement('div');
    playerList.style.cssText = `
        max-height: 200px;
        overflow-y: auto;
        margin-bottom: 15px;
        border: 1px solid #ff9900;
        padding: 10px;
    `;
    dialog.appendChild(playerList);

    const activeScene = game.scenes.active;
    const players = game.users.filter(user => 
        !user.isGM && 
        user.id !== activeUserId && 
        user.active
    );

    players.forEach(player => {
        const playerItem = document.createElement('div');
        playerItem.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        `;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `player-${player.id}`;
        checkbox.value = player.id;
        checkbox.style.cssText = `
            margin-right: 10px;
            cursor: pointer;
        `;

        const label = document.createElement('label');
        label.htmlFor = `player-${player.id}`;
        label.textContent = player.name;
        label.style.cssText = `
            cursor: pointer;
            color: #ff9900;
            font-family: monospace;
        `;

        playerItem.appendChild(checkbox);
        playerItem.appendChild(label);
        playerList.appendChild(playerItem);
    });

    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    `;

    const confirmButton = document.createElement('button');
    confirmButton.textContent = game.i18n.localize("MUTHUR.confirmSpectators");
    confirmButton.style.cssText = `
        background: black;
        border: 1px solid #ff9900;
        color: #ff9900;
        padding: 5px 15px;
        cursor: pointer;
        font-family: monospace;
    `;

    const cancelButton = document.createElement('button');
    cancelButton.textContent = game.i18n.localize("MUTHUR.cancelSpectators");
    cancelButton.style.cssText = `
        background: black;
        border: 1px solid #ff9900;
        color: #ff9900;
        padding: 5px 15px;
        cursor: pointer;
        font-family: monospace;
    `;

    buttonsContainer.appendChild(confirmButton);
    buttonsContainer.appendChild(cancelButton);
    dialog.appendChild(buttonsContainer);
    document.body.appendChild(dialog);

    confirmButton.addEventListener('click', () => {
        const selectedPlayers = [];
        players.forEach(player => {
            const checkbox = document.getElementById(`player-${player.id}`);
            if (checkbox && checkbox.checked) {
                selectedPlayers.push(player.id);
            }
        });

        dialog.remove();

        if (selectedPlayers.length > 0) {
            game.socket.emit('module.alien-mu-th-ur', {
                type: 'openSpectatorInterface',
                spectatorIds: selectedPlayers,
                activeUserId: activeUserId,
                activeUserName: activeUserName
            });
        }
        
        game.socket.emit('module.alien-mu-th-ur', {
            type: 'continueBootSequence',
            targetUserId: activeUserId,
            spectatorIds: selectedPlayers,
            activeUserName: activeUserName
        });
    });

    cancelButton.addEventListener('click', () => {
        dialog.remove();
        game.socket.emit('module.alien-mu-th-ur', {
            type: 'continueBootSequence',
        targetUserId: activeUserId,
        spectatorIds: [],
        activeUserName: activeUserName
        });
    });
}

function showSpectatorInterface(activeUserId, activeUserName, skipWelcomeMessage = false) {
    let spectatorContainer = document.getElementById('muthur-spectator-container');
    if (spectatorContainer) {
        return spectatorContainer;
    }

    spectatorContainer = document.createElement('div');
    spectatorContainer.id = 'muthur-spectator-container';

    const sidebar = document.getElementById('sidebar');
    const rightPosition = sidebar ? `${sidebar.offsetWidth + 20}px` : '320px';

    spectatorContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: ${rightPosition};
        width: 400px;
        height: 600px;
        background: black;
        border: 2px solid #00ff00;
        padding: 10px;
        font-family: monospace;
        z-index: 100000;
        display: flex;
        flex-direction: column;
    `;
    
    const headerContainer = document.createElement('div');
    headerContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    `;
    
    const headerTitle = document.createElement('div');
    headerTitle.textContent = game.i18n.format("MUTHUR.spectatorModeTitle", { userName: activeUserName });
    headerTitle.style.cssText = `
        color: #00ff00;
        font-weight: bold;
        font-family: monospace;
        font-size: 16px;
    `;
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&#10006;'; 
    closeButton.style.cssText = `
        background: black;
        border: 1px solid #00ff00;
        color: #00ff00;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-family: monospace;
        padding: 0;
        line-height: 1;
    `;
    
    closeButton.addEventListener('click', () => {
        document.body.removeChild(spectatorContainer);
    });
    
    headerContainer.appendChild(headerTitle);
    headerContainer.appendChild(closeButton);
    spectatorContainer.appendChild(headerContainer);

    const chatLog = document.createElement('div');
    chatLog.className = 'muthur-spectator-log';
    chatLog.style.cssText = `
        flex: 1;
        overflow-y: auto;
        margin-bottom: 10px;
        font-family: monospace;
        padding: 5px;
        background: rgba(0, 0, 0, 0.8);
    `;
    spectatorContainer.appendChild(chatLog);

    const infoBar = document.createElement('div');
    infoBar.textContent = game.i18n.localize("MUTHUR.spectatorModeInfo");
    infoBar.style.cssText = `
        padding: 5px;
        text-align: center;
        color: #00ff00;
        background-color: rgba(0, 0, 0, 0.8);
        border-top: 1px solid #00ff00;
        font-family: monospace;
        font-size: 12px;
    `;
    spectatorContainer.appendChild(infoBar);
    document.body.appendChild(spectatorContainer);

    if (!skipWelcomeMessage) {
        displayMuthurMessage(chatLog, game.i18n.format("MUTHUR.spectatorWelcome", { userName: activeUserName }), '', '#00ff00', 'reply');
    }

    return spectatorContainer;
}

try {
    window.displayMuthurMessage = displayMuthurMessage;
    window.displayHackMessage = displayHackMessage;
    window.updateSpectatorsWithMessage = updateSpectatorsWithMessage;
    window.syncMessageToSpectators = syncMessageToSpectators;
    window.showSpectatorInterface = showSpectatorInterface;
    window.currentMuthurSession = currentMuthurSession;
    window.createHackingWindows = createHackingWindows;
    window.clearHackingElements = clearHackingElements;
    window.stopAlarm = stopAlarm;
} catch (e) {}

async function handleMuthurResponse(data) {
    if (!game.user.isGM) return;

    let gmContainer = document.getElementById('gm-muthur-container');

    if (data.actionType === 'open' || !gmContainer) {
        gmContainer = createGMMuthurInterface(data.user, data.userId);
        document.body.appendChild(gmContainer);
    }

    const chatLog = gmContainer.querySelector('.gm-chat-log');
    if (!chatLog) {
        console.error("Chat log non trouvé dans le container GM");
        return;
    }

    if (data.actionType === 'hack') {
        await displayMuthurMessage(
            chatLog,
            game.i18n.format("MUTHUR.HackAttemptMessage", { user: data.user }),
            '',
            '#ff9900',
            'error'
        );

        const buttonsDiv = document.createElement('div');
        buttonsDiv.innerHTML = `
            <button id="enableHack" style="background: black; border: 1px solid #00ff00; color: #00ff00; padding: 5px 10px; margin-right: 10px;">
                ${game.i18n.localize("MOTHER.EnableHack")}
            </button>
            <button id="keepDisabled" style="background: black; border: 1px solid #ff0000; color: #ff0000; padding: 5px 10px;">
                ${game.i18n.localize("MOTHER.KeepDisabled")}
            </button>
        `;
        chatLog.appendChild(buttonsDiv);

        document.getElementById('enableHack').onclick = async () => {
            await game.settings.set('alien-mu-th-ur', 'allowHack', true);
            buttonsDiv.remove();
            await displayMuthurMessage(
                chatLog,
                game.i18n.localize("MOTHER.HackEnabled"),
                '',
                '#00ff00',
                'reply'
            );
        };

        document.getElementById('keepDisabled').onclick = async () => {
            buttonsDiv.remove();
            await displayMuthurMessage(
                chatLog,
                game.i18n.localize("MOTHER.HackKeptDisabled"),
                '',
                '#ff9900',
                'reply'
            );
        };
        return;
    }

    const playerColor = '#00ff00';
    if (data.commandType === 'm') {
        await displayMuthurMessage(chatLog, `${data.user}: ${game.i18n.localize("MUTHUR.motherPrefix")} ${data.command}`, '', playerColor);
    } else if (data.commandType === 'unknown') {
        await displayMuthurMessage(chatLog, `${data.user}: ${game.i18n.localize("MUTHUR.unknownCommandPrefix")} ${data.command}`, '', playerColor);
    } else if (data.commandType === 'valid') {
        await displayMuthurMessage(chatLog, `${data.user}: ${data.command}`, '', playerColor);
    } else {
        await displayMuthurMessage(chatLog, `${data.user}: ${data.command}`, '', playerColor);
    }

    if (data.actionType === 'open') {
        const consult = game.i18n.localize('MUTHUR.helpMenu.consultHint') || '';
        if (consult) {
            await displayMuthurMessage(chatLog, consult, '', '#ff9900', 'reply');
        }
    } else if (data.actionType === 'close') {
        await displayMuthurMessage(chatLog, game.i18n.localize("MUTHUR.muthurSessionEnded"), '', '#ff9900');
        setTimeout(() => gmContainer.remove(), 2000);
    }
}

Hooks.on('getSceneControlButtons', (controls) => {
    console.error("Hook getSceneControlButtons appelé");

    const toolDef = {
            name: "muthur",
            title: "MU/TH/UR 6000",
            icon: "fas fa-robot",
            visible: true,
            onClick: () => {
            console.log("MUTHUR | bouton cliqué");
                toggleMuthurChat();
            },
            button: true,
            toggle: false,
            active: false
    };

    const controlList = Array.isArray(controls)
        ? controls
        : (Array.isArray(controls?.controls) ? controls.controls : null);
    if (controlList) {
        try {
            console.log("MUTHUR getSceneControlButtons | groupes:", controlList.map(c => ({ name: c.name, tools: Array.isArray(c.tools) ? c.tools.length : 0 })));
        } catch (e) {
            console.warn("MUTHUR getSceneControlButtons | log groupes échoué:", e);
        }

        let targetGroup = controlList.find((c) => c.name === "token")
            || controlList.find((c) => c.name === "notes");
        if (!targetGroup) {
            console.warn("MUTHUR | Aucun groupe cible trouvé (token/notes) en mode tableau. Bouton non ajouté.");
            return;
        }
        if (!Array.isArray(targetGroup.tools)) targetGroup.tools = [];
        const exists = targetGroup.tools.some((t) => t.name === toolDef.name);
        console.log("MUTHUR | groupe ciblé (array):", targetGroup.name, "outils existants:", targetGroup.tools.map(t => t.name));
        if (!exists) {
            targetGroup.tools.push(toolDef);
            console.log("MUTHUR | bouton ajouté (array) dans le groupe:", targetGroup.name);
        }
        return;
    }

    if (controls && typeof controls === 'object') {
        const keys = Object.keys(controls);
        console.log("MUTHUR getSceneControlButtons | clés objet:", keys);

        let targetKey = null;
        if (controls.notes) targetKey = 'notes';
        else if (controls.token) targetKey = 'token';
        else targetKey = keys.find(k => controls[k] && (Array.isArray(controls[k].tools) || (controls[k].tools && typeof controls[k].tools === 'object')));

        if (!targetKey) {
            console.warn("MUTHUR getSceneControlButtons | aucun groupe avec tools trouvé parmi:", keys);
            return;
        }

        const groupObj = controls[targetKey];
        let tools = groupObj.tools;

        if (Array.isArray(tools)) {
            const exists = tools.some((t) => t.name === toolDef.name);
            console.log("MUTHUR | groupe ciblé (object-array):", targetKey, "outils existants:", tools.map(t => t.name));
            if (!exists) {
                tools.push(toolDef);
                console.log("MUTHUR | bouton ajouté (object-array) dans le groupe:", targetKey);
            }
        } else if (tools && typeof tools === 'object') {
            const exists = !!tools[toolDef.name];
            console.log("MUTHUR | groupe ciblé (object-map):", targetKey, "outils existants:", Object.keys(tools));
            if (!exists) {
                tools[toolDef.name] = toolDef;
                console.log("MUTHUR | bouton ajouté (object-map) dans le groupe:", targetKey);
            }
        } else {
            groupObj.tools = { [toolDef.name]: toolDef };
            console.log("MUTHUR | tools étaient absents. Création map avec outil dans:", targetKey);
        }
        return;
    }

    console.warn("MUTHUR getSceneControlButtons | structure inconnue:", controls);
});

Hooks.once('ready', async () => {
    if (game.user.isGM) {
        ChatMessage.create({
            content: `
                <div style="text-align: center; padding: 10px;">
                    <img src="modules/alien-mu-th-ur/pub/Shazprod.jpg" style="height: 100px; margin-bottom: 10px;">
                    <p style="font-weight: bold; text-decoration: underline;">${game.i18n.localize("MUTHUR.DONATION.support")}</p>
                    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 10px;">
                        <a href="https://ko-fi.com/shazprod" target="_blank">
                            <img src="modules/alien-mu-th-ur/pub/kofi.webp" style="height: 36px;">
                        </a>
                        <a href="https://fr.tipeee.com/shaz-prod" target="_blank">
                            <img src="modules/alien-mu-th-ur/pub/tipeee.png" style="height: 36px;">
                        </a>
                    </div>
                </div>
            `,
            whisper: [game.user.id]
        });
    }

    currentMuthurSession = {
        active: false,
        userId: null,
        userName: null
    };

    game.socket.on('module.alien-mu-th-ur', (data) => {
        if (data.type === 'muthurCommand' && game.user.isGM) {
            handleMuthurResponse(data);
        } else if (data.type === 'muthurResponse' && !game.user.isGM) {
            handleGMResponse(data);
        } else if (data.type === 'closePlayerInterface' && !game.user.isGM && data.targetUserId === game.user.id) {
            const chatContainer = document.getElementById('muthur-chat-container');
            if (chatContainer && document.body.contains(chatContainer)) {
                document.body.removeChild(chatContainer);
                currentMuthurSession.active = false;
                currentMuthurSession.userId = null;
                currentMuthurSession.userName = null;
                ui.notifications.info(game.i18n.localize("MUTHUR.sessionClosedByGM"));
            }
            
            const spectatorContainer = document.getElementById('muthur-spectator-container');
            if (spectatorContainer && document.body.contains(spectatorContainer)) {
                document.body.removeChild(spectatorContainer);
            }
        } else if (data.type === 'openSpectatorInterface' && !game.user.isGM && data.spectatorIds.includes(game.user.id)) {
            showSpectatorInterface(data.activeUserId, data.activeUserName, true);
            
            game.socket.emit('module.alien-mu-th-ur', {
                type: 'requestCurrentMessages',
                targetUserId: data.activeUserId,
                spectatorId: game.user.id
            });
        } else if (data.type === 'updateSpectators' && !game.user.isGM) {
            const spectatorLog = document.querySelector('.muthur-spectator-log');
            if (spectatorLog) {
                displayMuthurMessage(spectatorLog, data.text, data.prefix, data.color, data.messageType);
                spectatorLog.scrollTop = spectatorLog.scrollHeight;
            }
        } else if (data.type === 'requestCurrentMessages' && data.targetUserId === game.user.id) {
            const chatLog = document.querySelector('.muthur-chat-log');
            if (chatLog) {
                const messages = chatLog.querySelectorAll('.message');
                const messageData = [];
                
                messages.forEach(msg => {
                    messageData.push({
                        text: msg.textContent,
                        color: msg.style.color,
                        messageType: Array.from(msg.classList).find(c => c !== 'message') || 'normal'
                    });
                });
                
                game.socket.emit('module.alien-mu-th-ur', {
                    type: 'syncMessages',
                    messages: messageData,
                    targetSpectatorId: data.spectatorId
                });
            }
        } else if (data.type === 'syncMessages' && data.targetSpectatorId === game.user.id) {
            const spectatorLog = document.querySelector('.muthur-spectator-log');
            if (spectatorLog) {
                spectatorLog.innerHTML = '';
                
                data.messages.forEach(msg => {
                    displayMuthurMessage(spectatorLog, msg.text, '', msg.color, msg.messageType);
                });
                
                spectatorLog.scrollTop = spectatorLog.scrollHeight;
            }
        } else if (data.type === 'requestSpectatorSelection' && game.user.isGM) {
            showGMSpectatorSelectionDialog(data.userId, data.userName);
        } else if (data.type === 'continueBootSequence' && !game.user.isGM) {
            if (data.targetUserId === game.user.id) {
            try { showBootSequence(); } catch(e) { console.warn('Boot sequence error (player):', e); }
            } else if (data.spectatorIds && data.spectatorIds.includes(game.user.id)) {
                try { showBootSequence(true); } catch(e) { console.warn('Boot sequence error (spectator):', e); }
                try { showSpectatorInterface(data.targetUserId || data.activeUserId, data.activeUserName || (currentMuthurSession && currentMuthurSession.userName) || ''); } catch(e) { console.warn('Spectator interface error:', e); }
            }
            
            if (data.targetUserId === game.user.id) {
                const waitingContainer = document.getElementById('muthur-waiting-container');
                if (waitingContainer) {
                    waitingContainer.remove();
                }
            }
        } else if (data.type === 'hackProgress' && game.user.isGM) {
            const gmChatLog = document.querySelector('.gm-chat-log');
            if (gmChatLog) {
                if (!currentGMProgress) {
                    currentGMProgress = displayGMHackProgress(gmChatLog);
                }
                if (currentGMProgress && currentGMProgress.updateProgress) {
                    currentGMProgress.updateProgress(data.progress);
                }
            }
        } else if (data.type === 'hackComplete' && game.user.isGM) {
            if (currentGMProgress) {
                currentGMProgress.cleanup();
                currentGMProgress = null;
            }

            if (!data.success) {
                setTimeout(() => {
                    const gmContainer = document.getElementById('gm-muthur-container');
                    if (gmContainer) gmContainer.remove();
                }, 5000);
            }
        } else if (data.type === 'sessionStatus') {
            currentMuthurSession.active = data.active;
            if (data.active) {
                currentMuthurSession.userId = data.userId;
                currentMuthurSession.userName = data.userName;
                if (game.user.id !== data.userId) {
                    ui.notifications.info(game.i18n.format("MUTHUR.sessionStartedBy", { userName: data.userName }));
                }
            } else {
                if (game.user.id !== currentMuthurSession.userId) {
                    ui.notifications.info(game.i18n.format("MUTHUR.sessionEndedBy", { userName: currentMuthurSession.userName }));
                }
                currentMuthurSession.userId = null;
                currentMuthurSession.userName = null;
            }

        } else if (data.type === 'cerberusApprovalRequest' && game.user.isGM) {
            const wrap = document.createElement('div');
            wrap.style.cssText = 'background:black; border:2px solid #ff0000; color:#ff0000; padding:10px; z-index:100006; font-family:monospace; min-width:260px;';
            const t = document.createElement('div'); t.textContent = `${data.fromName} → CERBERUS ?`; t.style.cssText = 'font-weight:bold; margin-bottom:6px;'; wrap.appendChild(t);
            const row = document.createElement('div'); row.style.cssText = 'display:flex; gap:6px; align-items:center; margin-bottom:6px;';
            const lbl = document.createElement('label'); lbl.textContent = 'Minutes:'; lbl.style.minWidth = '70px';
            const inp = document.createElement('input'); inp.type = 'number'; inp.min = '1'; inp.max = '60'; inp.value = '10'; inp.style.cssText = 'width:70px; background:black; color:#ff0000; border:1px solid #ff0000; padding:2px 4px;';
            row.appendChild(lbl); row.appendChild(inp); wrap.appendChild(row);
            const ok = document.createElement('button'); ok.textContent = 'OK'; ok.style.cssText = 'background:black; color:#00ff00; border:1px solid #00ff00; padding:4px 10px; margin-right:6px;';
            const ko = document.createElement('button'); ko.textContent = 'X'; ko.style.cssText = 'background:black; color:#ff0000; border:1px solid #ff0000; padding:4px 10px;';
            wrap.appendChild(ok); wrap.appendChild(ko);
            appendDialogToGM(wrap, 'bottom-right', 8);
            ok.onclick = ()=>{ const m = Math.max(1, Math.min(60, parseInt(inp.value, 10) || 10)); try { game.socket.emit('module.alien-mu-th-ur', { type: 'cerberusApproval', targetUserId: data.fromId, approved: true, minutes: m }); } catch(_) {} wrap.remove(); };
            ko.onclick = ()=>{ try { game.socket.emit('module.alien-mu-th-ur', { type: 'cerberusApproval', targetUserId: data.fromId, approved: false }); } catch(_) {} wrap.remove(); };
        } else if (data.type === 'cerberusApproval' && data.targetUserId === game.user.id) {
            if (!data.approved) {
                const chatLog = document.querySelector('.muthur-chat-log'); if (chatLog) displayMuthurMessage(chatLog, game.i18n.localize('MUTHUR.requestDenied') || 'Request denied.', '', '#00ff00', 'reply');
                return;
            }
            window.__cerberusDurationMinutes = Math.max(1, Math.min(60, parseInt(data.minutes, 10) || 10));
            const chatLog = document.querySelector('.muthur-chat-log');
            if (chatLog) {
                const warningText = game.i18n.localize('MOTHER.SpecialOrders.Cerberus.confirmation');
                const maybe = displayMuthurMessage(chatLog, warningText, '', '#ff0000', 'error');
                try { updateSpectatorsWithMessage(warningText, `${game.i18n.localize('MUTHUR.motherName')}: `, '#ff0000', 'error'); } catch(_) {}
                const injectButtons = () => {
                    const ui = document.createElement('div');
                    ui.style.cssText = 'display:flex; gap:8px; justify-content:center; margin:10px 0;';
                    const yesBtn = document.createElement('button'); yesBtn.textContent = game.i18n.localize('MOTHER.SpecialOrders.Cerberus.confirm'); yesBtn.style.cssText = 'background:black; color:#ff3333; border:1px solid #ff3333; padding:4px 10px;';
                    const noBtn = document.createElement('button'); noBtn.textContent = game.i18n.localize('MOTHER.SpecialOrders.Cerberus.cancel'); noBtn.style.cssText = 'background:black; color:#33ff33; border:1px solid #33ff33; padding:4px 10px;';
                    ui.appendChild(yesBtn); ui.appendChild(noBtn); chatLog.appendChild(ui);
                    yesBtn.onclick = async ()=>{
                        ui.remove();
                        try { await displayMuthurMessage(chatLog, game.i18n.localize('MOTHER.CerberusConfirmed'), '', '#ff0000', 'error'); } catch(_) {}
                        try {
                            createCerberusWindow();
                            startCerberusCountdown(window.__cerberusDurationMinutes || 10);
                            game.socket.emit('module.alien-mu-th-ur', { type: 'showCerberusGlobal', fromId: game.user.id, fromName: game.user.name, minutes: window.__cerberusDurationMinutes || 10, startTime: Date.now() });
                        } catch(_) {}
                    };
                    noBtn.onclick = async ()=>{
                        ui.remove();
                        try { await displayMuthurMessage(chatLog, game.i18n.localize('MOTHER.CerberusCancelled'), '', '#00ff00', 'reply'); } catch(_) {}
                    };
                };
                if (maybe && typeof maybe.then === 'function') { maybe.then(()=> setTimeout(injectButtons, 10)); }
                else { setTimeout(injectButtons, 0); }
            }
        } else if (data.type === 'showCerberusGlobal') {
            if (data.fromId !== game.user.id) {
                window.__cerberusDurationMinutes = Math.max(1, Math.min(60, parseInt(data.minutes, 10) || 10));
                createCerberusWindow();
                startCerberusCountdown(window.__cerberusDurationMinutes);
            }
        } else if (data.type === 'stopCerberus') { 
            if (cerberusCountdownInterval) {
                clearInterval(cerberusCountdownInterval);
            }
            setTimeout(() => {
                const allCerberusElements = document.querySelectorAll('[id*="cerberus"], [class*="cerberus"]');
                allCerberusElements.forEach(element => {
                    element.remove();
                });
            }, 5000);

        } else if (data.type === 'closeMuthurChats') { 
            const allMuthurChats = document.querySelectorAll('#muthur-chat-container, #gm-muthur-container');
            allMuthurChats.forEach(chat => {
                chat.style.animation = 'fadeOut 1s ease-out';
                setTimeout(() => chat.remove(), 1000);
            });

            currentMuthurSession = {
                active: false,
                userId: null,
                userName: null
            };

        } else if (data.type === 'hackDisabled' && game.user.isGM) {
            const gmChatLog = document.querySelector('.muthur-chat-log');
            if (gmChatLog) {
                displayMuthurMessage(
                    gmChatLog,
                    game.i18n.localize("MOTHER.HackDisabledInfo"),
                    '',
                    '#ff9900',
                    'error'
                ).then(() => {
                    const buttonsDiv = document.createElement('div');
                    buttonsDiv.innerHTML = `
                        <button id="enableHack" style="background: black; border: 1px solid #00ff00; color: #00ff00; padding: 5px 10px; margin-right: 10px;">
                            ${game.i18n.localize("MOTHER.EnableHack")}
                        </button>
                        <button id="keepDisabled" style="background: black; border: 1px solid #ff0000; color: #ff0000; padding: 5px 10px;">
                            ${game.i18n.localize("MOTHER.KeepDisabled")}
                        </button>
                    `;
                    gmChatLog.appendChild(buttonsDiv);

                    document.getElementById('enableHack').onclick = async () => {
                        await game.settings.set('alien-mu-th-ur', 'allowHack', true);
                        buttonsDiv.remove();
                        await displayMuthurMessage(
                            gmChatLog,
                            game.i18n.localize("MOTHER.HackEnabled"),
                            '',
                            '#00ff00',
                            'reply'
                        );
                    };

                    document.getElementById('keepDisabled').onclick = async () => {
                        buttonsDiv.remove();
                        await displayMuthurMessage(
                            gmChatLog,
                            game.i18n.localize("MOTHER.HackKeptDisabled"),
                            '',
                            '#ff9900',
                            'reply'
                        );
                    };
                });
            }
        } else if (data.type === 'statusRequest' && game.user.isGM) {
            const requesterId = data.fromId;
            const requesterName = data.fromName;

            const picker = document.createElement('div');
            picker.style.cssText = `
                background: black; border: 2px solid #ff9900; padding: 8px; z-index: 100003; color: #ff9900; min-width: 260px;
            `;
            const title = document.createElement('div');
            title.textContent = `${game.i18n.localize('MUTHUR.STATUS.current')} - ${requesterName}`;
            title.style.cssText = 'font-weight:bold; margin-bottom:6px;';
            picker.appendChild(title);

            const select = document.createElement('select');
            select.style.cssText = 'width:100%; background:black; color:#ff9900; border:1px solid #ff9900; margin-bottom:6px;';
            const options = [
                {k:'normal'}, {k:'anomalyDetected'}, {k:'systemOffline'}, {k:'degradedPerformance'}, {k:'fireDetected'},
                {k:'quarantine'}, {k:'lockdown'}, {k:'intrusion'}, {k:'networkIssue'}, {k:'custom'}
            ];
            options.forEach(o=>{
                const opt = document.createElement('option');
                opt.value = o.k;
                opt.textContent = game.i18n.localize(`MUTHUR.STATUS.presets.${o.k}`);
                select.appendChild(opt);
            });
            picker.appendChild(select);

            const btn = document.createElement('button');
            btn.textContent = 'OK';
            btn.style.cssText = 'background:black; border:1px solid #ff9900; color:#ff9900; padding:4px 10px; cursor:pointer;';
            btn.addEventListener('click', ()=>{
                const key = select.value;
                const presets = {
                    normal: 'MUTHUR.STATUS.text.normal',
                    anomalyDetected: 'MUTHUR.STATUS.text.anomalyDetected',
                    systemOffline: 'MUTHUR.STATUS.text.systemOffline',
                    degradedPerformance: 'MUTHUR.STATUS.text.degradedPerformance',
                    fireDetected: 'MUTHUR.STATUS.text.fireDetected',
                    quarantine: 'MUTHUR.STATUS.text.quarantine',
                    lockdown: 'MUTHUR.STATUS.text.lockdown',
                    intrusion: 'MUTHUR.STATUS.text.intrusion',
                    networkIssue: 'MUTHUR.STATUS.text.networkIssue'
                };
                const i18nKey = (key === 'custom') ? null : (presets[key] || 'MUTHUR.status');
                const statusText = i18nKey ? game.i18n.localize(i18nKey)
                    : (game.settings.get('alien-mu-th-ur', 'customStatusText') || game.i18n.localize('MUTHUR.status'));
                game.socket.emit('module.alien-mu-th-ur', {
                    type: 'statusResponse',
                    targetUserId: requesterId,
                    text: statusText,
                    statusKey: key
                });
                picker.remove();
            });
            picker.appendChild(btn);
            const cancel = document.createElement('button');
            cancel.textContent = 'X';
            cancel.style.cssText = 'float:right; background:black; border:1px solid #ff9900; color:#ff9900; padding:4px 8px; margin-left:6px; cursor:pointer;';
            cancel.addEventListener('click', ()=>picker.remove());
            picker.appendChild(cancel);
            appendDialogToGM(picker, 'bottom-right', 8);

        } else if (data.type === 'statusResponse' && data.targetUserId === game.user.id) {
            const chatLog = document.querySelector('.muthur-chat-log');
            if (chatLog) {
                const maybePromise = displayMuthurMessage(chatLog, data.text, '', '#00ff00', 'reply');
                const handleGlitch = (msgDiv) => {
                    if (data.statusKey === 'degradedPerformance' && msgDiv) {
                        if (window.MUTHUR && typeof window.MUTHUR.applyLightGlitch === 'function') {
                            window.MUTHUR.applyLightGlitch(msgDiv, 1500);
                        }
                    }
                    chatLog.scrollTop = chatLog.scrollHeight;
                };
                const broadcastToSpectators = () => {
                    try {
                        const motherName = game.i18n.localize('MUTHUR.motherName');
                        updateSpectatorsWithMessage(data.text, `${motherName}: `, '#00ff00', 'reply');
                    } catch (e) { /* noop */ }
                };
                if (maybePromise && typeof maybePromise.then === 'function') {
                    maybePromise.then((div)=>{ handleGlitch(div); if (data.statusKey === 'degradedPerformance') window.MUTHUR.applyScreenGlitch(1200); broadcastToSpectators(); });
                } else {
                    handleGlitch(maybePromise);
                    if (data.statusKey === 'degradedPerformance') window.MUTHUR.applyScreenGlitch(1200);
                    broadcastToSpectators();
                }
            }
        } else if (data.type === 'doorControlRequest' && game.user.isGM) {
            const doors = data.filteredPrefix ? getDoorsByPrefix(data.filteredPrefix) : getSortedDoorDocuments();
            const idx = Math.max(0, Math.min(doors.length - 1, data.index || 0));
            const target = doors[idx];
            const pref = getDoorPreferredLabel(target) || `Door #${idx+1}`;
            const approvText = data.action === 'LOCK'
                ? game.i18n.format('MUTHUR.approve.lockDoor', { label: pref })
                : game.i18n.format('MUTHUR.approve.unlockDoor', { label: pref });
            showApprovalDialog(approvText, async (approved) => {
                if (!approved) {
                    notifyBackToRequester(data.fromId, game.i18n.localize('MUTHUR.requestDenied') || 'Request denied.', '#ff0000');
                    return;
                }
                await applyDoorAction(target, data.action);
                const msg = data.action === 'LOCK'
                    ? game.i18n.format('MUTHUR.doorLocked', { label: pref })
                    : game.i18n.format('MUTHUR.doorUnlocked', { label: pref });
                notifyBackToRequester(data.fromId, msg, '#00ff00');
                broadcastToSpectators(msg, '#00ff00');
            });
        } else if (data.type === 'lightsControlRequest' && game.user.isGM) {
            const approvMap = { DIM: 'MUTHUR.approve.dimLights', SHUTDOWN: 'MUTHUR.approve.shutdownLights', RESTORE: 'MUTHUR.approve.restoreLights' };
            const approvText = game.i18n.localize(approvMap[data.action] || 'MUTHUR.approve.dimLights');
            showApprovalDialog(approvText, async (approved) => {
                if (!approved) {
                    notifyBackToRequester(data.fromId, game.i18n.localize('MUTHUR.requestDenied') || 'Request denied.', '#ff0000');
                    return;
                }
                const msg = await applyLightsAction(data.action);
                notifyBackToRequester(data.fromId, msg, '#00ff00');
                broadcastToSpectators(msg, '#00ff00');
            });
        } else if (data.type === 'alarmRequest' && game.user.isGM) {
            showApprovalDialog(game.i18n.localize('MUTHUR.approve.activateAlarm'), async (approved) => {
                if (!approved) { notifyBackToRequester(data.fromId, game.i18n.localize('MUTHUR.requestDenied') || 'Request denied.', '#ff0000'); return; }
                const msg = game.i18n.localize('MUTHUR.alarmActivated');
                notifyBackToRequester(data.fromId, msg, '#ff0000');
                broadcastToSpectators(msg, '#ff0000');
                try { triggerAlarm(true); } catch(e) { console.warn('[MUTHUR][ALARM] local trigger error:', e); }
                try { console.log('[MUTHUR][ALARM] emit alarmControl:on'); game.socket.emit('module.alien-mu-th-ur', { type: 'alarmControl', action: 'on' }); } catch(e) { console.warn('[MUTHUR][ALARM] emit on error:', e); }
                try {
                    const headerStopBtn = document.getElementById('gm-muthur-stop-alarm-btn');
                    if (headerStopBtn) headerStopBtn.style.display = 'flex';
                } catch(_) {}
            });
        } else if (data.type === 'hackDecisionRequest' && game.user.isGM) {
            const wrap = document.createElement('div');
            wrap.style.cssText = 'background:black; border:2px solid #ff9900; color:#ff9900; padding:10px; z-index:100005; font-family:monospace;';
            const title = document.createElement('div');
            title.textContent = `${data.fromName || 'PLAYER'} → HACK ?`;
            title.style.cssText = 'margin-bottom:6px; font-weight:bold;';
            const ok = document.createElement('button'); ok.textContent = 'SUCCÈS'; ok.style.cssText = 'background:black; color:#00ff00; border:1px solid #00ff00; padding:4px 10px; margin-right:6px;';
            const ko = document.createElement('button'); ko.textContent = 'ÉCHEC'; ko.style.cssText = 'background:black; color:#ff0000; border:1px solid #ff0000; padding:4px 10px;';
            wrap.appendChild(title); wrap.appendChild(ok); wrap.appendChild(ko);
            appendDialogToGM(wrap, 'bottom-right', 8);
            const decide = (success)=>{
                wrap.remove();
                game.socket.emit('module.alien-mu-th-ur', { type: 'hackDecision', targetUserId: data.fromId, success });
            };
            ok.onclick = ()=> decide(true);
            ko.onclick = ()=> decide(false);
        } else if (data.type === 'gasRequest' && game.user.isGM) {
            const tokens = Array.from(canvas?.tokens?.placeables || []);
            const dialog = document.createElement('div');
            dialog.style.cssText = 'background:black; border:2px solid #ff9900; color:#ff9900; padding:10px; z-index:100004; font-family:monospace; min-width:300px;';
            const title = document.createElement('div'); title.textContent = game.i18n.localize('MUTHUR.approve.gasTargets'); title.style.cssText = 'margin-bottom:6px; font-weight:bold;'; dialog.appendChild(title);
            const list = document.createElement('div'); list.style.maxHeight = '260px'; list.style.overflow = 'auto'; list.style.marginBottom = '8px';
            const selections = new Map();
            tokens.forEach((t)=>{
                const row = document.createElement('label'); row.style.cssText = 'display:flex; align-items:center; gap:8px; margin:3px 0;';
                const cb = document.createElement('input'); cb.type = 'checkbox'; cb.onchange = ()=> selections.set(t.id, cb.checked);
                const name = document.createElement('span'); name.textContent = t.name || '—';
                row.appendChild(cb); row.appendChild(name); list.appendChild(row);
            });
            dialog.appendChild(list);
            const actions = document.createElement('div'); actions.style.cssText = 'display:flex; gap:8px; justify-content:flex-end;';
            const confirm = document.createElement('button'); confirm.textContent = 'OK'; confirm.style.cssText = 'background:black; border:1px solid #00ff00; color:#00ff00; padding:2px 8px;';
            const cancel = document.createElement('button'); cancel.textContent = 'X'; cancel.style.cssText = 'background:black; border:1px solid #ff0000; color:#ff0000; padding:2px 8px;';
            confirm.onclick = async ()=>{
                const picked = tokens.filter(t => selections.get(t.id));
                const affected = await applyPoisonToTokens(picked);
                const label = picked.map(t=>t.name).filter(Boolean).join(', ');
                const msg = `${affected} ${game.i18n.localize('MUTHUR.entitiesAffected') || 'entities affected'} (poisoned).${label ? ' ['+label+']' : ''}`;
                notifyBackToRequester(data.fromId, msg, '#00ff00');
                broadcastToSpectators(msg, '#00ff00');
                dialog.remove();
            };
            cancel.onclick = ()=> dialog.remove();
            actions.appendChild(confirm); actions.appendChild(cancel); dialog.appendChild(actions);
            appendDialogToGM(dialog, 'bottom-right', 8);
        } else if (data.type === 'cryoRequest' && game.user.isGM) {
            const tokens = Array.from(canvas?.tokens?.placeables || []);
            const dialog = document.createElement('div');
            dialog.style.cssText = 'background:black; border:2px solid #ff9900; color:#ff9900; padding:10px; z-index:100004; font-family:monospace; min-width:260px;';
            const title = document.createElement('div');
            title.textContent = game.i18n.localize('MUTHUR.approve.cryoPod').replace('{target}','');
            title.style.cssText = 'margin-bottom:6px; font-weight:bold;';
            dialog.appendChild(title);
            const list = document.createElement('div'); list.style.maxHeight = '240px'; list.style.overflow = 'auto';
            tokens.forEach((t)=>{
                const btn = document.createElement('button');
                btn.textContent = t.name || '—';
                btn.style.cssText = 'display:block; width:100%; text-align:left; background:black; border:1px solid #ff9900; color:#ff9900; margin:3px 0; padding:4px 8px;';
                btn.onclick = async ()=>{
                    dialog.remove();
                    const ok = await applyCryoEffect(t.name || '');
                    const msg = ok ? game.i18n.format('MUTHUR.cryoApplied', { name: ok }) : game.i18n.localize('MUTHUR.cryoNoMatch');
                    notifyBackToRequester(data.fromId, msg, '#00ff00');
                    broadcastToSpectators(msg, '#00ff00');
                };
                list.appendChild(btn);
            });
            dialog.appendChild(list);
            const cancel = document.createElement('button');
            cancel.textContent = 'X';
            cancel.style.cssText = 'margin-top:6px; background:black; border:1px solid #ff0000; color:#ff0000; padding:2px 8px; float:right;';
            cancel.onclick = ()=> dialog.remove();
            dialog.appendChild(cancel);
            appendDialogToGM(dialog, 'bottom-right', 8);
        } else if (data.type === 'cryoReleaseRequest' && game.user.isGM) {
            (async () => {
                const tokens = Array.from(canvas?.tokens?.placeables || []);
                const dialog = document.createElement('div');
                dialog.style.cssText = 'background:black; border:2px solid #ff9900; color:#ff9900; padding:10px; z-index:100004; font-family:monospace; min-width:300px;';
                const title = document.createElement('div'); title.textContent = 'CRYO RELEASE'; title.style.cssText = 'margin-bottom:6px; font-weight:bold;'; dialog.appendChild(title);
                const list = document.createElement('div'); list.style.maxHeight = '260px'; list.style.overflow = 'auto'; list.style.marginBottom = '8px';
                const selections = new Map();
                tokens.forEach((t)=>{
                    const row = document.createElement('label'); row.style.cssText = 'display:flex; align-items:center; gap:8px; margin:3px 0;';
                    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.onchange = ()=> selections.set(t.id, cb.checked);
                    const name = document.createElement('span'); name.textContent = t.name || '—';
                    row.appendChild(cb); row.appendChild(name); list.appendChild(row);
                });
                dialog.appendChild(list);
                const actions = document.createElement('div'); actions.style.cssText = 'display:flex; gap:8px; justify-content:flex-end;';
                const confirm = document.createElement('button'); confirm.textContent = 'OK'; confirm.style.cssText = 'background:black; border:1px solid #00ff00; color:#00ff00; padding:2px 8px;';
                const cancel = document.createElement('button'); cancel.textContent = 'X'; cancel.style.cssText = 'background:black; border:1px solid #ff0000; color:#ff0000; padding:2px 8px;';
                confirm.onclick = async ()=>{
                    const picked = tokens.filter(t => selections.get(t.id));
                    const released = await releaseCryoForTokens(picked.length ? picked : tokens.filter(t=>false));
                    const label = picked.length ? picked.map(t=>t.name).join(', ') : 'NONE';
                    const msg = released > 0 ? `CRYO RELEASED: ${label}.` : 'NO CRYO TO RELEASE.';
                    notifyBackToRequester(data.fromId, msg, '#00ff00');
                    broadcastToSpectators(msg, '#00ff00');
                    dialog.remove();
                };
                cancel.onclick = ()=> dialog.remove();
                actions.appendChild(confirm); actions.appendChild(cancel); dialog.appendChild(actions);
                appendDialogToGM(dialog, 'bottom-right', 8);
            })();
        } else if (data.type === 'alarmControl') {
            console.log('[MUTHUR][ALARM] recv alarmControl:', data);
            if (data.action === 'on') {
                try { triggerAlarm(true); } catch(e) { console.warn('[MUTHUR][ALARM] trigger on error:', e); }
            } else {
                try { stopAlarm(); } catch(e) { console.warn('[MUTHUR][ALARM] trigger off error:', e); }
                try {
                    const msg = game.i18n.localize('MUTHUR.alarmDeactivated') || 'ALARME DÉSACTIVÉE';
                    const chatLog = document.querySelector('.muthur-chat-log');
                    if (chatLog) { displayMuthurMessage(chatLog, msg, '', '#00ff00', 'reply'); }
                    updateSpectatorsWithMessage(msg, `${game.i18n.localize('MUTHUR.motherName')}: `, '#00ff00', 'reply');
                } catch(_) {}
            }
        } else if (data.type === 'spectatorAlarm' && !game.user.isGM) {
            try {
                if (data.action === 'on') {
                    (window.muthurSpectatorAlarmOn || (()=>{}))();
                } else {
                    (window.muthurSpectatorAlarmOff || (()=>{}))();
                }
            } catch(_) {}
        }
    });
    try { window.__muthurMainSocketBound = true; } catch(e) {}

    console.log(game.i18n.localize("MUTHUR.systemReady"));
});

Hooks.on('disconnect', () => {
    const chatContainer = document.getElementById('muthur-chat-container');
    if (chatContainer) {
        chatContainer.remove();
    }

    const gmContainer = document.getElementById('gm-muthur-container');
    if (gmContainer) {
        gmContainer.remove();
    }

    currentMuthurSession.active = false;
    currentMuthurSession.userId = null;
    currentMuthurSession.userName = null;
});

Hooks.on('canvasReady', () => {
    const chatContainer = document.getElementById('muthur-chat-container');
    if (chatContainer) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            chatContainer.style.right = `${sidebar.offsetWidth + 20}px`;
        }
    }
});

function sendGMResponse(targetUserId, message, color = '#ff9900') {
    if (!game.socket) {
        console.error("Socket non disponible!");
        return;
    }

    try {
        game.socket.emit('module.alien-mu-th-ur', {
            type: 'muthurResponse',
            command: message,
            fromGM: true,
            targetUserId: targetUserId,
            color: color,
            timestamp: Date.now()
        });

        const gmChatLog = document.querySelector('.gm-chat-log');
        if (gmChatLog) {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = `${game.i18n.localize("MUTHUR.motherName")}: ${message}`;
            messageDiv.style.color = color;
            gmChatLog.appendChild(messageDiv);
            gmChatLog.scrollTop = gmChatLog.scrollHeight;
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi de la réponse:", error);
        ui.notifications.error("Erreur de communication avec le joueur");
    }
}

function getTranslation(key) {
    const translation = game.i18n.localize(key);
    if (translation === key) {
        console.warn(`Traduction manquante pour la clé: ${key}`);
        return key.split('.')[1];
    }
    return translation;
}

let lastComSoundAt = 0;
function playComSoundThrottled(minIntervalMs = 200) {
    const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    if (now - lastComSoundAt < minIntervalMs) {
        try { console.log('MUTHUR Audio | playComSound throttled'); } catch(e) {}
        return Promise.resolve();
    }
    lastComSoundAt = now;
    return playComSound();
}

function playTypeSound() {
    try {
        const volume = game.settings.get('alien-mu-th-ur', 'typingSoundVolume');
        const randomNumber = Math.floor(Math.random() * 34) + 1;
        const soundPath = `/modules/alien-mu-th-ur/sounds/keypress/Keypress_${randomNumber}.wav`;

        const sound = new Audio(soundPath);
        sound.volume = volume;
        sound.onplay = () => { try { console.log('MUTHUR Audio | playTypeSound onplay', { soundPath, volume }); } catch(e) {} };
        sound.onended = () => { try { console.log('MUTHUR Audio | playTypeSound ended'); } catch(e) {} };
        sound.onerror = (e) => { try { console.error('MUTHUR Audio | playTypeSound error', { soundPath, error: e }); } catch(_) {} };

        const p = sound.play();
        try { console.log('MUTHUR Audio | playTypeSound invoked', { soundPath, volume }); } catch(e) {}
        return p;

    } catch (error) {
        console.error("Erreur lors de la lecture du son:", error);
    }
}

function isTypewriterEnabled() {
    try {
        return game.settings.get('alien-mu-th-ur', 'enableTypewriter');
    } catch (error) {
        console.warn("Erreur lors de la lecture des paramètres typewriter:", error);
        return true; 
    }
}

async function playSoundWithHelper(soundPath, volume, loop = false, label = 'generic') {
    try {
        if (typeof AudioHelper !== 'undefined' && AudioHelper?.play) {
            const result = await AudioHelper.play({ src: soundPath, volume, autoplay: true, loop }, true);
            return result;
        }
    } catch (e) {}
    const sound = new Audio(soundPath);
    sound.volume = volume;
    sound.loop = !!loop;
    return sound.play();
}

function playReturnSound() {
    try {
        const volume = game.settings.get('alien-mu-th-ur', 'typingSoundVolume');
        const randomNumber = Math.floor(Math.random() * 19) + 1;
        const soundPath = `/modules/alien-mu-th-ur/sounds/Key press return/Return_beep_${randomNumber}.wav`;
        return playSoundWithHelper(soundPath, volume, false, 'return');
    } catch (error) {
        console.error("Erreur lors de la lecture du son de retour:", error);
    }
}

function playErrorSound() {
    try {
        const volume = game.settings.get('alien-mu-th-ur', 'typingSoundVolume');
        const soundPath = `/modules/alien-mu-th-ur/sounds/pec_message/error.wav`;
        return playSoundWithHelper(soundPath, volume, false, 'error');
    } catch (error) {
        console.error("Erreur lors de la lecture du son d'erreur:", error);
    }
}

function playComSound() {
    try {
        const volume = game.settings.get('alien-mu-th-ur', 'typingSoundVolume');
        const randomNumber = Math.floor(Math.random() * 3) + 1;
        const soundPath = `/modules/alien-mu-th-ur/sounds/pec_message/Save_Sound_Communications_${randomNumber}.wav`;
        return playSoundWithHelper(soundPath, volume, false, 'communication');
    } catch (error) {
        console.error("Erreur lors de la lecture du son de communication:", error);
    }
}

async function playReplySound() {
    try {
        if (currentReplySound) {
            currentReplySound.pause();
            currentReplySound.currentTime = 0;
        }

        const volume = game.settings.get('alien-mu-th-ur', 'typingSoundVolume');
        const randomNumber = Math.floor(Math.random() * 9) + 1;
        const soundPath = `/modules/alien-mu-th-ur/sounds/reply/Computer_Reply_${randomNumber}.wav`;

        if (typeof AudioHelper !== 'undefined' && AudioHelper?.play) {
            await AudioHelper.play({ src: soundPath, volume, autoplay: true, loop: false }, true);
            setTimeout(async () => {
                if (shouldContinueReplySound) { await playReplySound(); }
            }, 900);
            return true;
        } else {
        currentReplySound = new Audio(soundPath);
        currentReplySound.volume = volume;
        currentReplySound.onended = async () => {
            if (shouldContinueReplySound) {
                await playReplySound(); 
                } else {
                    /* no-op */
            }
        };
            currentReplySound.onerror = () => { currentReplySound = null; };
        return currentReplySound.play();
        }

    } catch (error) {
        console.error("Erreur lors de la lecture du son de réponse:", error);
        currentReplySound = null;
    }
}

function stopReplySound() {
    shouldContinueReplySound = false;
    if (currentReplySound) {
        try { console.log('MUTHUR Audio | stopReplySound invoked'); } catch(e) {}
        currentReplySound.pause();
        currentReplySound.currentTime = 0;
        currentReplySound = null;
    }
}

async function displayHackMessage(chatLog, message, color, type, isPassword = false) {
    const messageDiv = document.createElement('div');
    messageDiv.style.color = color;
    messageDiv.classList.add('message', type);
    chatLog.appendChild(messageDiv);

    const soundGloballyMuted = (window.MUTHUR && window.MUTHUR.muteForSpectator) ? true : false;

    if (isPassword) {
        messageDiv.textContent = message;
        if (!soundGloballyMuted && game.settings.get('alien-mu-th-ur', 'enableTypingSounds')) {
                playComSoundThrottled(); 
        }
        return Promise.resolve();
    } else {
        let displayedText = '';
        for (const char of message) {
            displayedText += char;
            messageDiv.textContent = displayedText;
            if (!soundGloballyMuted && game.settings.get('alien-mu-th-ur', 'enableTypingSounds') && char === ' ') {
                playComSoundThrottled(); 
            }
            await new Promise(resolve => setTimeout(resolve, 20));
        }
        return Promise.resolve();
    }
}

async function simulateHackingAttempt(chatLog) {
    try { console.log('MUTHUR | simulateHackingAttempt déclenché (joueur=', !game.user.isGM, ', gm=', game.user.isGM, ')'); } catch(e) {}

    if (hackSuccessful) {
        await displayMuthurMessage(
            chatLog,
            game.i18n.localize("MOTHER.HackAlreadySuccessful"),
            '',
            '#ff0000',
            'error'
        );
        return;
    }

    const container = document.getElementById('muthur-chat-container');
    try { console.log('MUTHUR | container chat trouvé côté initiateur =', !!container); } catch(e) {}
    container.classList.add('hacking-active');

    const typingSoundEnabled = game.settings.get('alien-mu-th-ur', 'enableTypingSounds');
    const originalTypeSound = playTypeSound;
    playTypeSound = () => { }; 

    let isSuccess;
    let roll;
    if (!game.user.isGM) {
        try {
            await new Promise((resolve) => {
                game.socket.emit('module.alien-mu-th-ur', { type: 'hackDecisionRequest', fromId: game.user.id, fromName: game.user.name });
                const handler = (data) => {
                    if (data.type === 'hackDecision' && data.targetUserId === game.user.id) {
                        isSuccess = !!data.success;
                        game.socket.off('module.alien-mu-th-ur', handler);
                        resolve();
                    }
                };
                game.socket.on('module.alien-mu-th-ur', handler);
            });
        } catch(_) {}
    } else {
        roll = await new Roll('1d6').evaluate({ async: true });
        isSuccess = roll.total % 2 === 0;
    }

    const generatePassword = () => {
        const thematicPasswords = [
            'FACEHUGGER', 'XENOMORPH', 'RIPLEY', 'NOSTROMO', 'WEYLAND', 'SULACO', 'LV426', 
            'CHESTBURSTER', 'HADLEYHOPE', 'BISHOP', 'ASH', 'BURKE', 'NARCISSUS', 'SEVASTOPOL', 
            'TORRENS', 'ANESIDORA', 'WARRANT0FFICER', 'JONESY', 'PROMETHEUS', 'DERELICT', 
            'SPACEJOCKEY', 'UNITYPREFAB', 'GATEWAY', 'COLONIAL', 'MARINES', 'POWERLOADER', 
            'SMARTGUN', 'M41APULSE', 'USCM', 'BUILDBET7ER'
        ];

        if (Math.random() < 0.2) {
            return thematicPasswords[Math.floor(Math.random() * thematicPasswords.length)];
        }

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        return Array(12).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    const style = document.createElement('style');
    style.textContent = `
        @keyframes subtleGlitch {
            0% { transform: translate(0) }
            20% { transform: translate(-0.5px, 0.5px) }
            40% { transform: translate(-0.5px, -0.5px) }
            60% { transform: translate(0.5px, 0.5px) }
            80% { transform: translate(0.5px, -0.5px) }
            100% { transform: translate(0) }
        }
        .hacking-active {
            animation: subtleGlitch 0.8s infinite;
            position: relative;
            overflow: hidden;
        }
        .matrix-code {
            position: absolute;
            top: 0;
            right: 0;
            color: #0f0;
            font-size: 10px;
            opacity: 0.2;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-code';
    container.appendChild(matrixContainer);

    const updateMatrix = () => {
        matrixContainer.textContent = Array(20).fill(0)
            .map(() => Math.random().toString(36).substring(2, 4))
            .join(' ');
    };
    const matrixInterval = setInterval(updateMatrix, 50);

    const glitchEffect = async () => {
        const overlay = document.getElementById('muthur-glitch-overlay') || createFullScreenGlitch();
        if (container) {
            const intensity = Math.random() * 4 - 2;

            container.style.transform = `translate(${intensity}px, ${intensity}px) skew(${intensity}deg)`;
            container.style.filter = `hue-rotate(${Math.random() * 360}deg) blur(${Math.random() * 2}px)`;

            overlay.style.opacity = '0.5';
            overlay.style.backgroundColor = Math.random() > 0.5 ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)';
            overlay.style.transform = `scale(${1 + Math.random() * 0.02}) translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
            overlay.style.filter = `
                url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="filter"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" /></filter></svg>#filter')
                blur(${Math.random() * 1}px)
                hue-rotate(${Math.random() * 360}deg)
            `;

            await new Promise(resolve => setTimeout(resolve, 100));

            container.style.transform = 'none';
            container.style.filter = 'none';
            overlay.style.opacity = '0';
            overlay.style.transform = 'none';
            overlay.style.filter = 'none';
        }
    };

    const passwordAttempts = Array(50).fill(0).map(() => ({
        text: `ATTEMPT: ${generatePassword()}`,
        color: '#00ff00',
        type: 'reply'
    }));

    try { game.socket.emit('module.alien-mu-th-ur', { type: 'hackingAttempt', fromId: game.user.id }); console.log('MUTHUR | hackingAttempt émis aux spectateurs'); } catch(e) { console.warn('MUTHUR | emission hackingAttempt échouée', e); }
    const stopHackingWindows = createHackingWindows();
    try { console.log('MUTHUR | createHackingWindows() appelée côté initiateur'); } catch(e) {}
    try {
        for (let i = 0; i < window.hackingSequences.length; i++) {
            const line = window.hackingSequences[i];
            await displayHackMessage(chatLog, line, '#00ff00', 'reply', false);
            try { game.socket.emit('module.alien-mu-th-ur', { type: 'hackStream', text: line, color: '#00ff00', msgType: 'reply', isPassword: false }); } catch(e) {}
            chatLog.scrollTop = chatLog.scrollHeight;

            if (!game.user.isGM) {
                game.socket.emit('module.alien-mu-th-ur', {
                    type: 'hackProgress',
                    progress: Math.floor((i + 1) * 30 / window.hackingSequences.length),
                    fromId: game.user.id
                });
            }
        }

        for (let i = 0; i < passwordAttempts.length; i++) {
            const attempt = passwordAttempts[i];
            await displayHackMessage(chatLog, attempt.text, attempt.color, attempt.type, true);
            try { game.socket.emit('module.alien-mu-th-ur', { type: 'hackStream', text: attempt.text, color: attempt.color, msgType: attempt.type, isPassword: true }); } catch(e) {}
            chatLog.scrollTop = chatLog.scrollHeight;

            if (Math.random() < (i / passwordAttempts.length) * 0.5) {
                await glitchEffect();
            }
            await new Promise(resolve => setTimeout(resolve, 50));

            if (!game.user.isGM) {
                game.socket.emit('module.alien-mu-th-ur', {
                    type: 'hackProgress',
                    progress: Math.floor(30 + (i + 1) * 40 / passwordAttempts.length),
                    fromId: game.user.id
                });
            }
        }

        for (let i = 0; i < window.postPasswordSequences.length; i++) {
            const line = window.postPasswordSequences[i];
            await displayHackMessage(chatLog, line, '#00ff00', 'reply', false);
            try { game.socket.emit('module.alien-mu-th-ur', { type: 'hackStream', text: line, color: '#00ff00', msgType: 'reply', isPassword: false }); } catch(e) {}

            if (Math.random() < 0.6) {
                await glitchEffect();
            }

            chatLog.scrollTop = chatLog.scrollHeight;

            if (!game.user.isGM) {
                game.socket.emit('module.alien-mu-th-ur', {
                    type: 'hackProgress',
                    progress: Math.floor(70 + (i + 1) * 15 / window.postPasswordSequences.length),
                    fromId: game.user.id
                });
            }
        }

        const alertSequences = isSuccess ? window.successSequences : window.failureSequences;
        for (let i = 0; i < alertSequences.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 100));
            const txt = game.i18n.localize(alertSequences[i].text);
            await displayHackMessage(chatLog, txt, alertSequences[i].color, alertSequences[i].type, false);
            try { game.socket.emit('module.alien-mu-th-ur', { type: 'hackStream', text: txt, color: alertSequences[i].color, msgType: alertSequences[i].type, isPassword: false }); } catch(e) {}
            chatLog.scrollTop = chatLog.scrollHeight;

            if (alertSequences[i].text === 'MOTHER.AdminPrivileges') {
                try { game.socket.emit('module.alien-mu-th-ur', { type: 'hackStopGlitch' }); } catch(e) {}
            }

            if (!game.user.isGM) {
                game.socket.emit('module.alien-mu-th-ur', {
                    type: 'hackProgress',
                    progress: Math.floor(85 + (i + 1) * 15 / alertSequences.length),
                    fromId: game.user.id
                });
            }

            if (Math.random() > 0.7) {
                await glitchEffect();
                try { game.socket.emit('module.alien-mu-th-ur', { type: 'hackGlitch' }); } catch(e) {}
                if (game.settings.get('alien-mu-th-ur', 'enableTypingSounds')) {
                    playErrorSound();
                }
            }
        }

        if (isSuccess) {
            hackSuccessful = true;

            const overlay = document.getElementById('muthur-glitch-overlay') || createFullScreenGlitch();

            for (let i = 0; i < 10; i++) {
                overlay.style.opacity = '0.8';
                overlay.style.backgroundColor = 'rgba(255,0,0,0.2)';
                await glitchEffect();
                try { game.socket.emit('module.alien-mu-th-ur', { type: 'hackGlitch' }); } catch(e) {}
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            container.style.transition = 'background-color 2s';
            container.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';

            for (let i = 0; i < 5; i++) {
                await glitchEffect();
                try { game.socket.emit('module.alien-mu-th-ur', { type: 'hackGlitch' }); } catch(e) {}
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            if (!game.user.isGM) {
                game.socket.emit('module.alien-mu-th-ur', {
                    type: 'hackComplete',
                    success: isSuccess,
                    fromId: game.user.id,
                    fromName: game.user.name
                });
            }
            try { stopHackingWindows(); } catch(e) {}

            await new Promise(resolve => setTimeout(resolve, 2000));
            chatLog.innerHTML = '';
            chatLog.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';

            await displayHackMessage(
                chatLog,
                game.i18n.localize('MOTHER.WelcomeAdminFull'),
                '#00ff00',
                'normal',
                false
            );
            
            syncCommandResult('HACK', {
                text: game.i18n.localize('MOTHER.WelcomeAdminFull'),
                color: '#00ff00',
                type: 'normal'
            });
            try { game.socket.emit('module.alien-mu-th-ur', { type: 'hackStream', text: game.i18n.localize('MOTHER.WelcomeAdminFull'), color: '#00ff00', msgType: 'normal', isPassword: false }); } catch(e) {}
        }

    } finally {
        playTypeSound = originalTypeSound;
        const overlay = document.getElementById('muthur-glitch-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    clearInterval(matrixInterval);
    matrixContainer.remove();
    container.classList.remove('hacking-active');
    style.remove();

    if (!game.user.isGM) {
        game.socket.emit('module.alien-mu-th-ur', {
            type: 'hackComplete',
            success: isSuccess,
            fromId: game.user.id,
            fromName: game.user.name
        });

        game.socket.emit('module.alien-mu-th-ur', {
            type: 'muthurCommand',
            command: game.i18n.format("MUTHUR.HackDetectionMessage", {
                userName: game.user.name,
                result: isSuccess ? game.i18n.localize("MUTHUR.HackSuccess") : game.i18n.localize("MUTHUR.HackFailure")
            }),
            user: game.user.name,
            userId: game.user.id,
            timestamp: Date.now()
        });
    }

    if (!isSuccess) {
        const lockTime = Date.now();
        localStorage.setItem('muthur-terminal-lock', lockTime.toString());

        if (!game.user.isGM) {
            game.socket.emit('module.alien-mu-th-ur', {
                type: 'hackComplete',
                success: isSuccess,
                fromId: game.user.id,
                fromName: game.user.name,
                timestamp: Date.now()
            });

            setTimeout(() => {
                const container = document.getElementById('muthur-chat-container');
                if (container) container.remove();
            }, 5000);
        }
    }

    if (!isSuccess) {
        if (typeof stopHackingWindows === 'function') {
            stopHackingWindows();
        }
        
        clearHackingElements();
        
        setTimeout(() => {
            const muthurChat = document.getElementById('muthur-chat-container');
            if (muthurChat) {
                muthurChat.remove();
            }
            currentMuthurSession.active = false;
            currentMuthurSession.userId = null;
            currentMuthurSession.userName = null;
        }, 5000);
    }

    if (!game.user.isGM) {
        game.socket.emit('module.alien-mu-th-ur', {
            type: 'hackComplete',
            success: isSuccess,
            fromId: game.user.id
        });
    }
}

function clearHackingElements() {
    const hackingWindows = document.querySelectorAll('.hacking-window');
    hackingWindows.forEach(window => window.remove());
    
    const hackingStyles = document.querySelectorAll('style[data-hacking]');
    hackingStyles.forEach(style => style.remove());
    
    const overlays = document.querySelectorAll('.matrix-code, #muthur-glitch-overlay');
    overlays.forEach(overlay => overlay.remove());
}

function getSortedDoorDocuments() {
    const scene = game.scenes.active;
    if (!scene) return [];
    const walls = scene.walls?.contents || scene.walls || [];
    const doorDocs = walls.filter(w => (w.document?.door ?? w.door ?? 0) > 0);
    const sorted = doorDocs.slice().sort((a,b)=>{
        const ac = (a.document?.c || a.c || [0,0]);
        const bc = (b.document?.c || b.c || [0,0]);
        const ax = ac[0], ay = ac[1];
        const bx = bc[0], by = bc[1];
        return ax - bx || ay - by;
    });
    return sorted;
}

function getDoorPreferredLabel(doorDoc) {
    const doc = doorDoc?.document || doorDoc;
    const flags = doc?.flags || {};
    const tagger = flags['tagger']?.tags || [];
    const our = flags['alien-mu-th-ur'] || {};
    const name = doc?.name || '';
    const tags = [].concat(name ? [name] : [], tagger, our.tags || [], our.airlockTag || []);
    const ad = tags.find(t => /^AD/i.test(String(t)));
    return ad || name || '';
}

function getDoorsByPrefix(prefix) {
    const all = getSortedDoorDocuments();
    return all.filter(d => {
        const label = getDoorPreferredLabel(d);
        return label && new RegExp(`^${prefix}`, 'i').test(label);
    });
}

async function applyDoorAction(doorDoc, action) {
    if (!doorDoc) return;
    const doc = doorDoc.document || doorDoc;
    const current = doc.ds ?? doc.document?.ds; 
    let targetState = current;
    if (action === 'LOCK') targetState = 2;
    if (action === 'UNLOCK') targetState = 1; 
    try {
        await doc.update?.({ ds: targetState }) || await doc.update({ ds: targetState });
    } catch(e) {}
}

let savedLightStates = null;
async function applyLightsAction(action) {
    const scene = game.scenes.active;
    if (!scene) return 'No active scene.';
    const lights = scene.lights?.contents || scene.lights || [];
    if (action === 'SHUTDOWN') {
        savedLightStates = lights.map(l=>({ id: (l.id || l.document?.id), bright: l.document?.bright ?? l.bright, dim: l.document?.dim ?? l.dim, hidden: l.document?.hidden ?? l.hidden, alpha: l.document?.alpha ?? l.alpha }));
        for (const l of lights) {
            const doc = l.document || l;
            await doc.update({ hidden: true, alpha: 0 });
        }
        return game.i18n.localize('MUTHUR.lightsShutdown') || 'Lights shutdown complete.';
    }
    if (action === 'DIM') {
        if (!savedLightStates) {
            savedLightStates = lights.map(l=>({ id: (l.id || l.document?.id), bright: l.document?.bright ?? l.bright, dim: l.document?.dim ?? l.dim, hidden: l.document?.hidden ?? l.hidden, alpha: l.document?.alpha ?? l.alpha }));
        }
        for (const l of lights) {
            const doc = l.document || l;
            const curBright = doc.bright ?? doc.document?.bright ?? 1;
            const curDim = doc.dim ?? doc.document?.dim ?? 1;
            await doc.update({ hidden: false, alpha: 0.5, bright: Math.max(0, curBright * 0.5), dim: Math.max(0, curDim * 0.5) });
        }
        return game.i18n.localize('MUTHUR.lightsDimmed') || 'Lights dimmed.';
    }
    if (action === 'RESTORE') {
        if (!savedLightStates) return game.i18n.localize('MUTHUR.noSavedLights') || 'No saved lights state to restore.';
        const byId = new Map(savedLightStates.map(s=>[s.id, s]));
        for (const l of lights) {
            const doc = l.document || l;
            const s = byId.get(doc.id);
            if (!s) continue;
            await doc.update({ hidden: s.hidden, alpha: s.alpha, bright: s.bright, dim: s.dim });
        }
        return game.i18n.localize('MUTHUR.lightsRestored') || 'Lights restored.';
    }
    return 'OK';
}

async function applySealDeck(deck) {
    const doors = getSortedDoorDocuments();
    let count = 0;
    for (const d of doors) {
        await applyDoorAction(d, 'LOCK');
        count++;
    }
    return count;
}

function showApprovalDialog(text, cb) {
    if (!game.user.isGM) return;
    const wrap = document.createElement('div');
    wrap.style.cssText = 'background:black; border:2px solid #ff9900; color:#ff9900; padding:10px; z-index:100004; font-family:monospace;';
    const t = document.createElement('div'); t.textContent = text; t.style.marginBottom = '8px'; wrap.appendChild(t);
    const ok = document.createElement('button'); ok.textContent = 'OK'; ok.style.cssText = 'background:black; color:#00ff00; border:1px solid #00ff00; padding:4px 10px; margin-right:6px;';
    const ko = document.createElement('button'); ko.textContent = 'X'; ko.style.cssText = 'background:black; color:#ff0000; border:1px solid #ff0000; padding:4px 10px;';
    wrap.appendChild(ok); wrap.appendChild(ko);
    appendDialogToGM(wrap, 'bottom-right', 8);
    ok.onclick = ()=>{ wrap.remove(); try{ cb(true); }catch(e){} };
    ko.onclick = ()=>{ wrap.remove(); try{ cb(false); }catch(e){} };
}

function notifyBackToRequester(userId, text, color) {
    if (!userId) return;
    game.socket.emit('module.alien-mu-th-ur', { type: 'muthurResponse', targetUserId: userId, command: text, color: color || '#00ff00' });
}

function broadcastToSpectators(text, color) {
    try { const motherName = game.i18n.localize('MUTHUR.motherName'); updateSpectatorsWithMessage(text, `${motherName}: `, color || '#00ff00', 'reply'); } catch(e) {}
}

function appendDialogToGM(element, position = 'bottom-right', margin = 10) {
    try {
        const container = document.getElementById('gm-muthur-container');
        if (container) {
            element.style.position = 'absolute';
            element.style.left = element.style.right = element.style.top = element.style.bottom = '';
            switch (position) {
                case 'top-right':
                    element.style.top = `${margin}px`;
                    element.style.right = `${margin}px`;
                    break;
                case 'top-left':
                    element.style.top = `${margin}px`;
                    element.style.left = `${margin}px`;
                    break;
                case 'bottom-left':
                    element.style.bottom = `${margin}px`;
                    element.style.left = `${margin}px`;
                    break;
                default:
                    element.style.bottom = `${margin}px`;
                    element.style.right = `${margin}px`;
            }
            container.appendChild(element);
            return true;
        }
    } catch(_) {}
    element.style.position = 'fixed';
    element.style.right = '20px';
    element.style.bottom = '150px';
    document.body.appendChild(element);
    return false;
}

function buildPostHackHelpList() {
    const lines = [];
    const g = (k)=>{ try { return game.settings.get('alien-mu-th-ur', k); } catch(e) { return false; } };
    if (g('phSpecialOrders')) lines.push('- ORDERS: 754, 899, 931, 937, 939, 966');
    lines.push('- CERBERUS');
    if (g('phDoors')) lines.push('- DOORS, LOCK DOOR X, UNLOCK DOOR X');
    if (g('phLights')) lines.push('- SHUTDOWN LIGHTS, RESTORE LIGHTS');
    if (g('phAlarm')) lines.push('- ACTIVATE ALARM');
    if (g('phGas')) lines.push('- GAS TARGETS');
    if (g('phCryo')) { lines.push('- CRYO POD <NAME?>'); lines.push('- CRYO RELEASE'); }
    
    if (!lines.length) return '';
    const title = (game.i18n.localize('MUTHUR.postHack.title') || 'POST-HACK COMMANDS:');
    return title + '\n' + lines.join('\n');
}

let currentAlarm = { howl: null, src: null };
async function triggerAlarm(withOverlay) {
    try {
        const src = (game.settings.get('alien-mu-th-ur', 'alarmSoundPath') || '').trim();
        console.log('[MUTHUR][ALARM] triggerAlarm requested | withOverlay=', withOverlay, '| src=', src);
        const volume = 1.0;
        if (src) {
            try {
                if (currentAlarm.howl && typeof currentAlarm.howl.stop === 'function') { try { currentAlarm.howl.stop(); } catch(e) { console.warn('[MUTHUR][ALARM] pre-stop error:', e); } }
            } catch(_) {}
            try {
                const result = await AudioHelper.play({ src, volume, autoplay: true, loop: true }, true);
                currentAlarm.howl = result; 
                currentAlarm.src = src;
                console.log('[MUTHUR][ALARM] playing started | resultType=', typeof result, '| hasStop=', !!(result && result.stop), '| hasPause=', !!(result && result.pause));
            } catch(e) {
                console.error('[MUTHUR][ALARM] play error:', e);
                await playErrorSound?.();
            }
        } else {
            console.warn('[MUTHUR][ALARM] no src configured');
            await playErrorSound?.();
        }
    } catch(e) {}
    if (withOverlay) {
        console.log('[MUTHUR][ALARM] creating overlay');
        const id = 'muthur-alarm-overlay';
        let ov = document.getElementById(id);
        if (!ov) {
            ov = document.createElement('div');
            ov.id = id;
            ov.style.cssText = 'position:fixed; inset:0; background:rgba(255,0,0,0.12); pointer-events:none; z-index:100002; animation: alarmPulse 1s infinite;';
            const style = document.createElement('style');
            style.textContent = '@keyframes alarmPulse { 0%{opacity:0.3} 50%{opacity:0.6} 100%{opacity:0.3} }';
            style.setAttribute('data-hacking','');
            document.head.appendChild(style);
            document.body.appendChild(ov);
        }
    }
}

function stopAlarm() {
    console.log('[MUTHUR][ALARM] stopAlarm requested | current=', currentAlarm);

    try {
        const ov = document.getElementById('muthur-alarm-overlay');
        if (ov) {
            ov.remove();
            console.log('[MUTHUR][ALARM] overlay removed');
        }
    } catch (e) {
        console.warn('[MUTHUR][ALARM] overlay remove error:', e);
    }

    if (currentAlarm.src) {
        try {
            if (typeof AudioHelper?.stop === 'function') {
                AudioHelper.stop({ src: currentAlarm.src });
                console.log(`[MUTHUR][ALARM] AudioHelper.stop called for src: ${currentAlarm.src}`);
            }
            try {
                const playing = game?.audio?.playing;
                if (playing && typeof playing.values === 'function') {
                    for (const sound of playing.values()) {
                        try {
                            if (sound && sound.src === currentAlarm.src) {
                                sound.stop?.();
                                console.log(`[MUTHUR][ALARM] Forcefully stopped sound with matching src: ${sound.src}`);
                            }
                        } catch (_) {}
                    }
                }
            } catch (_) {}
        } catch (e) {
            console.error('[MUTHUR][ALARM] AudioHelper.stop error:', e);
        }
    }

    currentAlarm.howl = null;
    currentAlarm.src = null;

    try {
        const headerStopBtn = document.getElementById('gm-muthur-stop-alarm-btn');
        if (headerStopBtn) {
            headerStopBtn.style.display = 'none';
        }
    } catch (_) {}
}

async function triggerConfinementAroundSelection() {
    const scene = game.scenes.active;
    if (!scene) return {count:0};
    const token = canvas?.tokens?.controlled?.[0] || canvas?.tokens?.hover;
    const zoneName = token?.name || 'TARGET';
    let count = 0;
    const doors = getSortedDoorDocuments();
    const tCenter = token?.center || token?.document?.center || {x:0,y:0};
    for (const d of doors) {
        const c = (d.document?.c || d.c || [0,0]);
        const dx = (c[0] - tCenter.x), dy = (c[1] - tCenter.y);
        const dist = Math.hypot(dx, dy);
        if (dist < 600) { await applyDoorAction(d, 'LOCK'); count++; }
    }
    return {count, zoneName};
}

async function performZoneScan(zoneLabel) {
    const scene = game.scenes.active;
    if (!scene) return '0 ' + (game.i18n.localize('MUTHUR.lifeformsDetected') || 'lifeforms detected') + ': -';
    const tiles = canvas?.tiles?.placeables || [];
    const regions = canvas?.regions?.placeables || [];
    const targets = [];
    const upper = (zoneLabel || '').toUpperCase();
    for (const t of tiles) {
        const label = (t.document?.name || t.document?.texture?.src || '').toUpperCase();
        if (label.startsWith('ALIEN') && (upper === '' || label.includes(upper))) {
            const x = t.document?.x ?? t.x ?? t.center?.x ?? 0;
            const y = t.document?.y ?? t.y ?? t.center?.y ?? 0;
            const w = t.document?.width ?? t.w ?? t.document?.texture?.width ?? 0;
            const h = t.document?.height ?? t.h ?? t.document?.texture?.height ?? 0;
            targets.push({ x: x + w/2, y: y + h/2, w, h });
        }
    }
    for (const r of regions) {
        const label = (r.document?.name || '').toUpperCase();
        if (label.startsWith('ALIEN') && (upper === '' || label.includes(upper))) {
            const x = r.document?.x ?? r.x ?? r.center?.x ?? 0;
            const y = r.document?.y ?? r.y ?? r.center?.y ?? 0;
            const w = r.document?.width ?? r.w ?? 0;
            const h = r.document?.height ?? r.h ?? 0;
            targets.push({ x: x + w/2, y: y + h/2, w, h });
        }
    }
    if (!targets.length) return '0 ' + (game.i18n.localize('MUTHUR.lifeformsDetected') || 'lifeforms detected') + ': -';
    const tokens = canvas?.tokens?.placeables || [];
    const isInside = (tok, Z) => {
        const tx = tok.document?.x ?? tok.x ?? tok.center?.x ?? 0;
        const ty = tok.document?.y ?? tok.y ?? tok.center?.y ?? 0;
        const tw = tok.document?.width ?? tok.w ?? tok.document?.texture?.width ?? (tok.w ?? 0);
        const th = tok.document?.height ?? tok.h ?? tok.document?.texture?.height ?? (tok.h ?? 0);
        const cx = tx + (tw/2);
        const cy = ty + (th/2);
        return cx >= Z.x - Z.w/2 && cx <= Z.x + Z.w/2 && cy >= Z.y - Z.h/2 && cy <= Z.y + Z.h/2;
    };
    const inside = tokens.filter(t => targets.some(Z => isInside(t, Z)));
    const names = inside.map(t => {
        const actorType = t.actor?.type || '';
        const isHuman = /human|pc|npc|colonist|crew/i.test(actorType) || /ripley|bishop|hudson|hicks|crew/i.test(t.name || '');
        return isHuman ? (t.name || 'Unknown') : game.i18n.localize('MUTHUR.unknownEntity') || 'Unknown entity';
    });
    const count = names.length;
    const joined = names.join(', ');
    return `${count} ${game.i18n.localize('MUTHUR.lifeformsDetected') || 'lifeforms detected'}: ${joined || '-'}.`;
}

async function applyGasEffect() {
    const token = canvas?.tokens?.controlled?.[0] || canvas?.tokens?.hover;
    const center = token?.center || token?.document?.center || {x:0,y:0};
    const radius = 500;
    const tokens = canvas?.tokens?.placeables || [];
    let affected = 0;
    for (const t of tokens) {
        const dist = Math.hypot(t.center.x - center.x, t.center.y - center.y);
        if (dist <= radius) {
            affected++;
            try {
                await t.document?.setFlag?.('alien-mu-th-ur', 'gas', { poisoned: true, unconscious: true });
            } catch(e) {}
        }
    }
    try { await playErrorSound?.(); } catch(e) {}
    return affected;
}

async function applyPoisonToTokens(tokens) {
    const list = Array.from(tokens || []);
    let affected = 0;
    for (const t of list) {
        try {
            try { t.control({ releaseOthers: false }); } catch(e) {}
            const poisoned = getPoisonedEffect();
            if (typeof t.toggleStatusEffect === 'function') {
                await t.toggleStatusEffect(poisoned.id || poisoned.icon, { active: true, overlay: false });
            } else if (typeof t.document?.toggleStatusEffect === 'function') {
                await t.document.toggleStatusEffect(poisoned.id || poisoned.icon, { active: true, overlay: false });
            } else if (typeof t.toggleEffect === 'function') {
                await t.toggleEffect(poisoned.icon || poisoned.id, { active: true, overlay: false });
            }
            const actor = t.document?.actor;
            if (actor) {
                if (typeof actor.toggleStatusEffect === 'function') {
                    await actor.toggleStatusEffect(poisoned.id || poisoned.icon, { active: true });
                } else if (typeof actor.setStatusEffect === 'function') {
                    await actor.setStatusEffect(poisoned.id || poisoned.icon, { active: true });
                } else {
                    const effectData = {
                        name: 'Poisoned',
                        label: 'Poisoned',
                        icon: poisoned.icon || 'icons/svg/poison.svg',
                        disabled: false,
                        origin: 'alien-mu-th-ur',
                        flags: { core: { statusId: poisoned.id || 'poisoned' } }
                    };
                    try { await actor.createEmbeddedDocuments('ActiveEffect', [effectData]); } catch(_) {}
                }
            }
            await t.document?.setFlag?.('alien-mu-th-ur', 'gas', { poisoned: true });
            affected++;
        } catch(e) {}
    }
    try { await playErrorSound?.(); } catch(e) {}
    return affected;
}

function getPoisonedEffect() {
    try {
        const effects = (CONFIG.statusEffects ?? []);
        const list = Array.isArray(effects) ? effects : Array.from(effects.values?.() || []);
        const match = list.find(e => {
            const id = (e.id || e.label || e.name || '').toString().toLowerCase();
            const label = (e.label || e.name || '').toString().toLowerCase();
            return id.includes('poison') || label.includes('poison') || id.includes('toxic') || label.includes('toxic');
        }) || {};
        const id = match.id || match.label || match.name || null;
        const icon = match.icon || 'icons/svg/poison.svg';
        return { id, icon };
    } catch (e) {
        return { id: null, icon: 'icons/svg/poison.svg' };
    }
}

function getUnconsciousEffect() {
    try {
        const effects = (CONFIG.statusEffects ?? []);
        const list = Array.isArray(effects) ? effects : Array.from(effects.values?.() || []);
        const match = list.find(e => {
            const id = (e.id || e.label || e.name || '').toString().toLowerCase();
            const label = (e.label || e.name || '').toString().toLowerCase();
            return id.includes('unconscious') || id.includes('inconscient') || label.includes('unconscious') || label.includes('inconscient') || id.includes('sleep') || id.includes('stasis');
        }) || {};
        const id = match.id || match.label || match.name || null;
        const icon = match.icon || 'icons/svg/sleep.svg';
        const resolved = { id, icon };
        console.log('CRYO | resolved effect', resolved);
        return resolved;
    } catch (e) {
        const fallback = { id: null, icon: 'icons/svg/sleep.svg' };
        console.warn('CRYO | resolve effect failed, fallback used', e);
        return fallback;
    }
}

async function applyCryoEffect(targetName) {
    const tokens = canvas?.tokens?.placeables || [];
    let matched = null;
    if (targetName) {
        matched = tokens.find(t => (t.name || '').toUpperCase() === targetName.toUpperCase());
    } else {
        matched = canvas?.tokens?.controlled?.[0] || null;
    }
    if (!matched) return '';

    try { matched.control({ releaseOthers: true }); } catch(e) { try { matched.control(); } catch(_) {} }

    try { await matched.document?.setFlag?.('alien-mu-th-ur', 'cryo', { stasis: true }); } catch(e) { console.warn('CRYO | setFlag failed', e); }

    const eff = getUnconsciousEffect();
    try {
        if (typeof matched.toggleStatusEffect === 'function') {
            console.log('CRYO | Token.toggleStatusEffect', eff.id || eff.icon);
            await matched.toggleStatusEffect(eff.id || eff.icon, { active: true, overlay: true });
        } else if (typeof matched.document?.toggleStatusEffect === 'function') {
            console.log('CRYO | TokenDocument.toggleStatusEffect', eff.id || eff.icon);
            await matched.document.toggleStatusEffect(eff.id || eff.icon, { active: true, overlay: true });
        } else if (typeof matched.toggleEffect === 'function') {
            console.log('CRYO | Token.toggleEffect', eff.icon || eff.id);
            await matched.toggleEffect(eff.icon || eff.id, { active: true, overlay: true });
        } 

        const actor = matched.document?.actor;
        if (actor) {
            if (typeof actor.toggleStatusEffect === 'function') {
                console.log('CRYO | Actor.toggleStatusEffect', eff.id || eff.icon);
                await actor.toggleStatusEffect(eff.id || eff.icon, { active: true, overlay: false });
            } else if (typeof actor.setStatusEffect === 'function') {
                console.log('CRYO | Actor.setStatusEffect', eff.id || eff.icon);
                await actor.setStatusEffect(eff.id || eff.icon, { active: true });
            }
        }

        if (actor) {
            const effectData = {
                name: 'Unconscious',
                label: 'Unconscious',
                icon: eff.icon || 'icons/svg/unconscious.svg',
                disabled: false,
                origin: 'alien-mu-th-ur',
                flags: { core: { statusId: eff.id || 'unconscious' } }
            };
            console.log('CRYO | ensure AE with statusId', effectData);
            try { await actor.createEmbeddedDocuments('ActiveEffect', [effectData]); } catch(err) { /* ignore if already exists */ }
        }
    } catch(e) { console.warn('CRYO | status effect failed', e); }

    return matched.name || 'TARGET';
}

async function releaseCryoForTokens(tokenList) {
    let released = 0;
    const eff = getUnconsciousEffect();
    for (const tok of tokenList) {
        try {
            try { tok.control({ releaseOthers: false }); } catch(e) {}
            try { await tok.document?.unsetFlag?.('alien-mu-th-ur', 'cryo'); } catch(e) { console.warn('CRYO | unsetFlag failed', e); }
            if (typeof tok.toggleStatusEffect === 'function') {
                console.log('CRYO | Token.disable toggleStatusEffect', eff.id || eff.icon);
                await tok.toggleStatusEffect(eff.id || eff.icon, { active: false, overlay: false });
            } else if (typeof tok.document?.toggleStatusEffect === 'function') {
                console.log('CRYO | TokenDocument.disable toggleStatusEffect', eff.id || eff.icon);
                await tok.document.toggleStatusEffect(eff.id || eff.icon, { active: false, overlay: false });
            } else if (typeof tok.toggleEffect === 'function') {
                console.log('CRYO | Token.disable toggleEffect', eff.icon || eff.id);
                await tok.toggleEffect(eff.icon || eff.id, { active: false, overlay: false });
            }
            const actor = tok.document?.actor;
            if (actor?.effects) {
                const toDelete = actor.effects.filter(e => (e.origin === 'alien-mu-th-ur') || (e.icon === (eff.icon || eff.id)) || (e.flags?.core?.statusId === (eff.id || 'unconscious')) || ((e.label||'').toLowerCase().includes('unconscious') || (e.label||'').toLowerCase().includes('inconscient')));
                if (toDelete.length) {
                    console.log('CRYO | delete AE on actor', toDelete.map(e=>e.id));
                    await actor.deleteEmbeddedDocuments('ActiveEffect', toDelete.map(e=>e.id));
                }
            }
            if (actor) {
                if (typeof actor.toggleStatusEffect === 'function') {
                    console.log('CRYO | Actor.toggleStatusEffect OFF', eff.id || eff.icon);
                    await actor.toggleStatusEffect(eff.id || eff.icon, { active: false });
                } else if (typeof actor.setStatusEffect === 'function') {
                    console.log('CRYO | Actor.setStatusEffect OFF', eff.id || eff.icon);
                    await actor.setStatusEffect(eff.id || eff.icon, { active: false });
                }
            }
            released++;
        } catch(e) {}
    }
    return released;
}

async function handleSpecialOrder(chatLog, command) {
    const orders = {
        "754": "MOTHER.SpecialOrders.754",
        "899": "MOTHER.SpecialOrders.899",
        "931": "MOTHER.SpecialOrders.931",
        "937": "MOTHER.SpecialOrders.937",
        "939": "MOTHER.SpecialOrders.939",
        "966": "MOTHER.SpecialOrders.966",
        "CERBERUS": "MOTHER.SpecialOrders.Cerberus"
    };

    let orderKey = command.toUpperCase()
        .replace(/^ORDRE\s+SPECIAL\s+/i, '')
        .replace(/^ORDRE\s+SPÉCIAL\s+/i, '')  
        .replace(/^ORDER\s+SPECIAL\s+/i, '')   
        .replace(/^SPECIAL\s+ORDRE\s+/i, '')
        .replace(/^SPÉCIAL\s+ORDRE\s+/i, '')   
        .replace(/^SPECIAL\s+ORDER\s+/i, '')    
        .replace(/^ORDRE\s+/i, '')
        .replace(/^ORDER\s+/i, '')              
        .replace(/^SPECIAL\s+/i, '')
        .replace(/^SPÉCIAL\s+/i, '')           
        .replace(/^PROTOCOLE\s+/i, '')
        .replace(/^PROTOCOL\s+/i, '')          
        .trim();

    if (orders[orderKey]) {
        if (orderKey === 'CERBERUS') {
            if (!game.user.isGM) {
                try {
                    game.socket.emit('module.alien-mu-th-ur', { type: 'cerberusApprovalRequest', fromId: game.user.id, fromName: game.user.name });
                    await displayMuthurMessage(chatLog, game.i18n.localize('MUTHUR.waitingForMother'), '', '#ff0000', 'communication');
                } catch(_) {}
                return;
            }

            if (!game.user.isGM && hackSuccessful) {
                game.socket.emit('module.alien-mu-th-ur', {
                    type: 'muthurCommand',
                    command: game.i18n.format("MOTHER.CerberusHackAlert", { userName: game.user.name }),
                    user: 'MUTHUR 6000',
                    userId: game.user.id,
                    timestamp: Date.now()
                });
            }
            await syncMessageToSpectators(
                chatLog,
                game.i18n.localize("MOTHER.SpecialOrders.Cerberus.confirmation"),
                '',
                '#ff0000',
                'error'
            );
            
            syncCommandResult('SPECIAL_ORDER', {
                text: game.i18n.localize("MOTHER.SpecialOrders.Cerberus.confirmation"),
                color: '#ff0000',
                type: 'error'
            });

            const confirmationDiv = document.createElement('div');
            confirmationDiv.style.cssText = `
                border: 2px solid #ff3333;
                background: rgba(0, 0, 0, 0.9);
                padding: 20px;
                margin: 15px 0;
                text-align: center;
                animation: borderPulse 1s infinite;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 20px;
                width: fit-content;
                margin-left: auto;
                margin-right: auto;
            `;

            const style = document.createElement('style');
            style.textContent = `
                @keyframes borderPulse {
                    0% { border-color: #ff3333; }
                    50% { border-color: #990000; }
                    100% { border-color: #ff3333; }
                }
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.7; }
                    100% { opacity: 1; }
                }
            `;
            document.head.appendChild(style);

            const confirmButton = document.createElement('button');
            confirmButton.textContent = game.i18n.localize("MOTHER.SpecialOrders.Cerberus.confirm");
            confirmButton.style.cssText = `
                background: #330000;
                color: #ff3333;
                border: 1px solid #ff3333;
                padding: 8px 15px;
                margin: 0;
                font-family: monospace;
                font-size: 14px;
                cursor: pointer;
                text-transform: uppercase;
                transition: all 0.3s ease;
                text-shadow: 0 0 5px #ff3333;
                min-width: 100px;
                height: 32px;
                line-height: 1;
            `;

            const cancelButton = document.createElement('button');
            cancelButton.textContent = game.i18n.localize("MOTHER.SpecialOrders.Cerberus.cancel");
            cancelButton.style.cssText = `
                background: #001100;
                color: #33ff33;
                border: 1px solid #33ff33;
                padding: 8px 15px;
                margin: 0;
                font-family: monospace;
                font-size: 14px;
                cursor: pointer;
                text-transform: uppercase;
                transition: all 0.3s ease;
                text-shadow: 0 0 5px #33ff33;
                min-width: 100px;
                height: 32px;
                line-height: 1;
            `;

            confirmButton.onmouseover = () => {
                confirmButton.style.background = '#660000';
                confirmButton.style.boxShadow = '0 0 10px #ff3333';
            };
            confirmButton.onmouseout = () => {
                confirmButton.style.background = '#330000';
                confirmButton.style.boxShadow = 'none';
            };

            cancelButton.onmouseover = () => {
                cancelButton.style.background = '#003300';
                cancelButton.style.boxShadow = '0 0 10px #33ff33';
            };
            cancelButton.onmouseout = () => {
                cancelButton.style.background = '#001100';
                cancelButton.style.boxShadow = 'none';
            };

            confirmationDiv.appendChild(confirmButton);
            confirmationDiv.appendChild(cancelButton);
            chatLog.appendChild(confirmationDiv);

            const confirmation = await new Promise(resolve => {
                confirmButton.onclick = async () => {
                    confirmationDiv.remove();
                    await displayMuthurMessage(
                        chatLog,
                        game.i18n.localize("MOTHER.CerberusConfirmed"),
                        '',
                        '#ff0000',
                        'error'
                    );
                    if (!game.user.isGM && hackSuccessful) {
                        game.socket.emit('module.alien-mu-th-ur', {
                            type: 'muthurCommand',
                            command: game.i18n.localize("MOTHER.CerberusConfirmed"),
                            user: 'MUTHUR 6000',
                            userId: game.user.id,
                            timestamp: Date.now()
                        });
                    }
                    resolve(true);
                };
                cancelButton.onclick = async () => {
                    confirmationDiv.remove();
                    await displayMuthurMessage(
                        chatLog,
                        game.i18n.localize("MOTHER.CerberusCancelled"),
                        '',
                        '#00ff00',
                        'reply'
                    );
                    if (!game.user.isGM && hackSuccessful) {
                        game.socket.emit('module.alien-mu-th-ur', {
                            type: 'muthurCommand',
                            command: game.i18n.localize("MOTHER.CerberusCancelled"),
                            user: 'MUTHUR 6000',
                            userId: game.user.id,
                            timestamp: Date.now()
                        });
                    }
                    resolve(false);
                };
            });

            if (!confirmation) {
                return;
            }

            if (!confirmation) {
                await displayMuthurMessage(
                    chatLog,
                    game.i18n.localize("MOTHER.SpecialOrders.Cerberus.cancelled"),
                    '',
                    '#00ff00',
                    'reply'
                );
                return;
            }

            await displayHackMessage(
                chatLog,
                game.i18n.localize("MOTHER.SpecialOrders.Cerberus.warning"),
                '#ff0000',
                'error',
                false
            );

            await new Promise(resolve => setTimeout(resolve, 1000));

            createCerberusWindow();
            startCerberusCountdown(window.__cerberusDurationMinutes || 10);

            game.socket.emit('module.alien-mu-th-ur', {
                type: 'showCerberusGlobal',
                fromId: game.user.id,
                fromName: game.user.name,
                minutes: window.__cerberusDurationMinutes || 10,
                startTime: Date.now()
            });

            console.log("préparation de la fermeture des chats");

            setTimeout(() => {
                console.log("Fermeture des chats");
                const allMuthurChats = document.querySelectorAll('#muthur-chat-container, #gm-muthur-container');
                console.log("chat trouve", allMuthurChats.length);
                allMuthurChats.forEach(chat => {
                    chat.style.animation = 'fadeOut 1s ease-out';
                    setTimeout(() => chat.remove(), 1000);
                });

                currentMuthurSession.active = false;
                currentMuthurSession.userId = null;
                currentMuthurSession.userName = null;

                game.socket.emit('module.alien-mu-th-ur', {
                    type: 'closeMuthurChats',
                    fromId: game.user.id
                });
                console.log("signal Chat fermé");
            }, 5000);

            return;
        }

        const orderName = game.i18n.localize(`${orders[orderKey]}.name`);
        const orderDesc = game.i18n.localize(`${orders[orderKey]}.description`);

        await displayHackMessage(chatLog, orderName, '#00ff00', 'reply', false);
        try { game.socket.emit('module.alien-mu-th-ur', { type: 'hackStream', text: orderName, color: '#00ff00', msgType: 'reply', isPassword: false }); } catch(e) {}
        try {
            if (!game.user.isGM && hackSuccessful) {
                game.socket.emit('module.alien-mu-th-ur', {
                    type: 'muthurCommand',
                    command: orderName,
                    user: 'MUTHUR 6000',
                    userId: game.user.id,
                    timestamp: Date.now()
                });
            }
        } catch(e) {}

        await displayHackMessage(chatLog, orderDesc, '#00ff00', 'reply', false);
        try { game.socket.emit('module.alien-mu-th-ur', { type: 'hackStream', text: orderDesc, color: '#00ff00', msgType: 'reply', isPassword: false }); } catch(e) {}
        try {
            if (!game.user.isGM && hackSuccessful) {
                game.socket.emit('module.alien-mu-th-ur', {
                    type: 'muthurCommand',
                    command: orderDesc,
                    user: 'MUTHUR 6000',
                    userId: game.user.id,
                    timestamp: Date.now()
                });
            }
        } catch(e) {}
    } else {
        await displayHackMessage(
            chatLog,
            game.i18n.localize("MOTHER.commandNotFound"),
            '#ff0000',
            'error',
            false
        );
    }
}

async function displayCerberusProtocol(chatLog) {
    if (!game.settings.get('alien-mu-th-ur', 'allowCerberus')) {
        await displayMuthurMessage(
            chatLog,
            game.i18n.localize("MOTHER.CerberusDisabled"),
            '',
            '#ff0000',
            'error'
        );
        return;
    }

    const cerberusWindow = createCerberusWindow();
    chatLog.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = `
        .cerberus-container {
            color: #ff0000;
            text-align: center;
            font-family: monospace;
            padding: 20px;
            animation: pulse 2s infinite;
        }
        
        .cerberus-title {
            font-size: 1.5em;
            margin-bottom: 20px;
            text-transform: uppercase;
        }
        
        .cerberus-warning {
            border: 2px solid #ff0000;
            padding: 10px;
            margin: 10px 0;
            animation: borderPulse 1s infinite;
        }
        
        .cerberus-countdown {
            font-size: 2em;
            margin: 20px 0;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }
        
        @keyframes borderPulse {
            0% { border-color: #ff0000; }
            50% { border-color: #990000; }
            100% { border-color: #ff0000; }
        }
        
        .cerberus-flashing {
            animation: flash 0.5s infinite;
        }
        
        @keyframes flash {
            0% { color: #ff0000; }
            50% { color: #ffffff; }
            100% { color: #ff0000; }
        }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.className = 'cerberus-container';
    container.innerHTML = `
    <div class="cerberus-title">
        ${game.i18n.localize("MOTHER.CerberusActivated")}
    </div>
    <div class="cerberus-warning">
        ${game.i18n.localize("MOTHER.CerberusWarning")}
    </div>
    <div class="cerberus-warning">
        ${game.i18n.localize("MOTHER.CerberusEvacuate")}
    </div>
    <div class="cerberus-countdown">
        ${(window.__cerberusDurationMinutes || 10)}:00
    </div>
    <div class="cerberus-warning">
        ${game.i18n.localize("MOTHER.SpecialOrders.Cerberus.NoReturn")}
    </div>
    <div class="cerberus-warning" style="margin-top: 20px;">
        ${game.i18n.localize("MUTHUR.sessionEnded")}
        <br><br>
        ${game.i18n.localize("MOTHER.SpecialOrders.Cerberus.GoodLuck")}
    </div>
`;

    chatLog.appendChild(container);

    setTimeout(() => {
        const muthurContainer = document.getElementById('muthur-chat-container');
        if (muthurContainer) {
            muthurContainer.remove();
        }
    }, 10000);

    const duration = (window.__cerberusDurationMinutes || 10);
    let timeLeft = duration * 60;

    const countdownInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const countdownText = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const chatCountdown = document.querySelector('.cerberus-countdown');
        const floatingCountdown = document.getElementById('cerberus-floating-countdown');

        if (chatCountdown) chatCountdown.textContent = countdownText;
        if (floatingCountdown) floatingCountdown.textContent = countdownText;

        if (timeLeft <= 10 && timeLeft > 0) {
            const audio = new Audio(`modules/alien-mu-th-ur/sounds/count/${timeLeft}.mp3`);
            audio.volume = game.settings.get('alien-mu-th-ur', 'typingSoundVolume');
            audio.play();
        }

        if (timeLeft % 30 === 0 && timeLeft > 10 && game.settings.get('alien-mu-th-ur', 'enableTypingSounds')) {
            playErrorSound();
        }

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            playEndSequence();
        }
    },
        1000);

    return () => {
        clearInterval(countdownInterval);
        style.remove();
        if (cerberusWindow) cerberusWindow.remove();
    };
}

function createCerberusWindow() {
    const audio = new Audio('modules/alien-mu-th-ur/sounds/count/Cerberuslunch.mp3');
    audio.volume = game.settings.get('alien-mu-th-ur', 'typingSoundVolume');
    audio.play();

    const cerberusWindow = document.createElement('div');
    cerberusWindow.id = 'cerberus-floating-window';

    cerberusWindow.style.cssText = `
        position: fixed;
        top: 20px;
        right: 440px;
        width: 440px;          
        background: rgba(0, 0, 0, 0.95);
        border: 2px solid #ff0000;  
        box-shadow: 0 0 15px #ff0000, inset 0 0 8px #ff0000;  
        padding: 15px;         
        z-index: 100000;
        font-family: monospace;
        color: #ff0000;
        cursor: move;
        user-select: none;
        animation: cerberusPulse 2s infinite;
        transform: scale(0.95);  
        transform-origin: top right;
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes cerberusPulse {
            0% { box-shadow: 0 0 15px #ff0000, inset 0 0 8px #ff0000; }
            50% { box-shadow: 0 0 30px #ff0000, inset 0 0 15px #ff0000; }
            100% { box-shadow: 0 0 15px #ff0000, inset 0 0 8px #ff0000; }
        }
        
        @keyframes warningFlash {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        @keyframes textGlow {
            0% { text-shadow: 0 0 4px #ff0000; }
            50% { text-shadow: 0 0 12px #ff0000; }
            100% { text-shadow: 0 0 4px #ff0000; }
        }
        
        .cerberus-warning-icon {
            animation: warningFlash 1s infinite;
            font-size: 16px;
            margin: 5px;
        }
        
        .cerberus-text {
            animation: textGlow 2s infinite;
            text-align: center;
            margin: 8px 0;
            font-weight: bold;
            font-size: 0.9em;
        }
        
        .cerberus-countdown {
            font-size: 30px;
            text-align: center;
            margin: 12px 0;
            text-shadow: 0 0 8px #ff0000;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            padding: 5px;                      
            border: 1px solid #ff0000;         
            border-radius: 3px;
        }
        
        .cerberus-status {
            border: 1px solid #ff0000;
            padding: 8px;
            margin: 8px 0;
            text-align: center;
            
        }
    `;
    document.head.appendChild(style);

    cerberusWindow.innerHTML = `
        <div class="cerberus-container" style="background: rgba(0, 0, 0, 0.95); padding: 10px;">
            <div class="cerberus-text" style="font-size: 16px; white-space: nowrap;">
                ⚠️ ${game.i18n.localize("MOTHER.CerberusActivated")} ⚠️
            </div>
            <div class="cerberus-status">
                ${game.i18n.localize("MOTHER.SpecialOrders.Cerberus.Status")}: 
                <span style="color: #ff3333;">${game.i18n.localize("MOTHER.SpecialOrders.Cerberus.Critical")}</span>
            </div>
            <div class="cerberus-text">
                ${game.i18n.localize("MOTHER.CerberusWarning")}
            </div>
            <div id="cerberus-floating-countdown" class="cerberus-countdown">
                ${(window.__cerberusDurationMinutes || 10)}:00
            </div>
            <div class="cerberus-status">
                ${game.i18n.localize("MOTHER.SpecialOrders.Cerberus.Warning")}<br>
                ${game.i18n.localize("MOTHER.SpecialOrders.Cerberus.NoReturn")}
            </div>
            <div class="cerberus-text" style="font-size: 14px;">
                ${game.i18n.localize("MOTHER.CerberusEvacuate")}
            </div>
            ${game.user.isGM ? `
                <div style="text-align: center; margin-top: 15px;">
                    <button id="stop-cerberus" style="
                        background: #ff0000;
                        color: white;
                        border: 1px solid #ff3333;
                        padding: 5px 15px;
                        cursor: pointer;
                        font-family: monospace;
                        text-transform: uppercase;
                        font-weight: bold;
                        text-shadow: 0 0 5px #ff0000;
                    ">${game.i18n.localize("MOTHER.SpecialOrders.Cerberus.StopCerberus")}</button>
                </div>
            ` : ''}
        </div>
    `;

    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    function dragStart(e) {
        initialX = e.clientX - cerberusWindow.offsetLeft;
        initialY = e.clientY - cerberusWindow.offsetTop;

        if (e.target.closest('#cerberus-floating-window')) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();

            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            const maxX = window.innerWidth - cerberusWindow.offsetWidth;
            const maxY = window.innerHeight - cerberusWindow.offsetHeight;

            currentX = Math.min(Math.max(0, currentX), maxX);
            currentY = Math.min(Math.max(0, currentY), maxY);

            cerberusWindow.style.left = `${currentX}px`;
            cerberusWindow.style.top = `${currentY}px`;
            cerberusWindow.style.right = 'auto'; 
        }
    }

    function dragEnd(e) {
        isDragging = false;
    }

    cerberusWindow.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    document.body.appendChild(cerberusWindow);
    if (game.user.isGM) {
        const stopButton = cerberusWindow.querySelector('#stop-cerberus');
        stopButton.addEventListener('click', () => {
            game.socket.emit('module.alien-mu-th-ur', {
                type: 'stopCerberus'
            });

            if (cerberusCountdownInterval) {
                clearInterval(cerberusCountdownInterval);
            }

            ChatMessage.create({
                content: `<span style="color: #ff0000;">${game.i18n.localize("MOTHER.SpecialOrders.Cerberus.Stopped")}</span>`,
                type: CONST.CHAT_MESSAGE_TYPES.EMOTE,
                speaker: { alias: "MUTHUR 6000" }
            });

            setTimeout(() => {
                const allCerberusElements = document.querySelectorAll('[id*="cerberus"], [class*="cerberus"]');
                allCerberusElements.forEach(element => {
                    element.remove();
                });
            }, 5000);
        });
    }

    return cerberusWindow;
}

function createDeathScreen() {
    const deathScreen = document.createElement('div');
    deathScreen.id = 'cerberus-death-screen';
    deathScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.95);
        z-index: 999999;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        animation: fadeIn 2s ease-in;
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes explosionPulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes glitchText {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(2px, -2px); }
            60% { transform: translate(-2px, -2px); }
            80% { transform: translate(2px, 2px); }
            100% { transform: translate(0); }
        }
        
        .death-text {
            color: #ff0000;
            font-size: 120px;
            font-family: 'Arial Black', sans-serif;
            text-shadow: 0 0 20px #ff0000;
            animation: explosionPulse 2s infinite, glitchText 0.3s infinite;
            margin-bottom: 30px;
        }
        
        .death-subtext {
            color: #ff3333;
            font-size: 36px;
            font-family: monospace;
            text-shadow: 0 0 10px #ff3333;
            opacity: 0.8;
            animation: glitchText 0.5s infinite;
        }
    `;
    document.head.appendChild(style);

    const deathText = document.createElement('div');
    deathText.className = 'death-text';
    deathText.textContent = game.i18n.localize("MOTHER.SpecialOrders.Cerberus.YouAreDead");

    const subText = document.createElement('div');
    subText.className = 'death-subtext';
    subText.textContent = game.i18n.localize("MOTHER.SpecialOrders.Cerberus.MissionFailed");

    deathScreen.appendChild(deathText);
    deathScreen.appendChild(subText);
    document.body.appendChild(deathScreen);
}

function displayGMHackProgress(chatLog) {
    if (currentGMProgress && currentGMProgress.interval) {
        clearInterval(currentGMProgress.interval);
    }

    const existingBar = document.getElementById('hack-progress-container');
    if (existingBar) {
        existingBar.remove();
    }

    const progressContainer = document.createElement('div');
    progressContainer.id = 'hack-progress-container';
    progressContainer.style.cssText = `
        width: 100%;
        margin: 10px 0;
        font-family: monospace;
        color: #00ff00;
    `;

    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        width: 100%;
        height: 20px;
        border: 1px solid #00ff00;
        background: black;
        margin: 5px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        position: relative;
    `;

    const progressFill = document.createElement('div');
    progressFill.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        background: #003300;
        width: 0%;
        transition: width 0.5s linear;
    `;

    const progressText = document.createElement('div');
    progressText.textContent = game.i18n.localize("MUTHUR.HackInProgress");
    progressText.style.zIndex = '1';

    const spinner = document.createElement('div');
    spinner.style.cssText = `
        font-family: monospace;
        color: #00ff00;
        z-index: 1;
    `;

    progressBar.appendChild(progressFill);
    progressBar.appendChild(progressText);
    progressBar.appendChild(spinner);
    progressContainer.appendChild(progressBar);
    chatLog.appendChild(progressContainer);

    const spinChars = ['|', '/', '-', '\\'];
    let spinIndex = 0;
    const spinnerInterval = setInterval(() => {
        spinner.textContent = spinChars[spinIndex];
        spinIndex = (spinIndex + 1) % spinChars.length;
    }, 250);

    return {
        container: progressContainer,
        interval: spinnerInterval,
        updateProgress: (progress) => {
            progressFill.style.width = `${progress}%`;
            if (progress >= 100) {
                clearInterval(spinnerInterval); 
            }
        },
        cleanup: () => {
            clearInterval(spinnerInterval);
            progressContainer.remove();
        }
    }
}

async function playEndSequence() {
    try {
        if (game.settings.get('alien-mu-th-ur', 'enableTypingSounds')) {
            const byebye = new Audio('modules/alien-mu-th-ur/sounds/count/Weythanks.mp3');
            byebye.volume = game.settings.get('alien-mu-th-ur', 'typingSoundVolume');
            await byebye.play();

            await new Promise(resolve => byebye.onended = resolve);

            const boom = new Audio('modules/alien-mu-th-ur/sounds/count/boom.mp3');
            boom.volume = game.settings.get('alien-mu-th-ur', 'typingSoundVolume');
            await boom.play();
        }

        const cerberusWindow = document.getElementById('cerberus-window');
        if (cerberusWindow) cerberusWindow.remove();

        createDeathScreen();

        if (game.settings.get('alien-mu-th-ur', 'enableTypingSounds')) {
            const deathMusic = new Audio('modules/alien-mu-th-ur/sounds/count/musicmort.mp3');
            deathMusic.volume = game.settings.get('alien-mu-th-ur', 'typingSoundVolume');
            await deathMusic.play();

            deathMusic.addEventListener('ended', () => {
                const deathScreen = document.getElementById('cerberus-death-screen');
                if (deathScreen) {
                    deathScreen.style.animation = 'fadeOut 1s ease-out';
                    setTimeout(() => {
                        deathScreen.remove();
                    }, 1000);
                }
            });
        }
    } catch (error) {
        console.error("Erreur dans playEndSequence:", error);
    }
}

function createHackingWindows() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glowPulse {
            0% { box-shadow: 0 0 10px #00ff00, inset 0 0 5px #00ff00; }
            50% { box-shadow: 0 0 20px #00ff00, inset 0 0 15px #00ff00; }
            100% { box-shadow: 0 0 10px #00ff00, inset 0 0 5px #00ff00; }
        }
        @keyframes glowPulseRed {
            0% { box-shadow: 0 0 10px #ff0000, inset 0 0 5px #ff0000; }
            50% { box-shadow: 0 0 20px #ff0000, inset 0 0 15px #ff0000; }
            100% { box-shadow: 0 0 10px #ff0000, inset 0 0 5px #ff0000; }
        }
        @keyframes borderFlash {
            0% { border-color: #ff0000; filter: brightness(1); }
            50% { border-color: #ff3333; filter: brightness(1.5); }
            100% { border-color: #ff0000; filter: brightness(1); }
        }
        @keyframes matrixRain {
            0% { transform: translateY(-100%) rotate(0deg); }
            100% { transform: translateY(100%) rotate(1deg); }
        }
        @keyframes scanline {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes textFlicker {
            0% { opacity: 1; text-shadow: 0 0 5px currentColor; }
            25% { opacity: 0.8; text-shadow: 0 0 10px currentColor; }
            30% { opacity: 0.4; text-shadow: 0 0 5px currentColor; }
            35% { opacity: 0.9; text-shadow: 0 0 10px currentColor; }
            100% { opacity: 1; text-shadow: 0 0 5px currentColor; }
        }
        @keyframes windowShake {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(-2px, 2px) rotate(-0.5deg); }
            50% { transform: translate(2px, -2px) rotate(0.5deg); }
            75% { transform: translate(-2px, -2px) rotate(-0.5deg); }
        }
        .terminal-window {
            position: fixed;
            background: linear-gradient(135deg, rgba(0, 20, 0, 0.95) 0%, rgba(0, 40, 0, 0.85) 100%);
            border: 2px solid #00ff00;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            padding: 15px;
            overflow: hidden;
            z-index: 1000;
            backdrop-filter: blur(3px);
            transition: transform 0.5s ease-out;
        }
        .terminal-window::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00ff00, transparent);
            animation: scanline 2s linear infinite;
        }
        .terminal-window::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                rgba(0, 255, 0, 0.03) 0px,
                rgba(0, 255, 0, 0.03) 1px,
                transparent 1px,
                transparent 2px
            );
            pointer-events: none;
        }
        .error-mode {
            animation: glowPulseRed 1s infinite ease-in-out, borderFlash 0.5s infinite, windowShake 0.2s infinite !important;
            border-color: #ff0000 !important;
        }
        .glitch-text {
            animation: textFlicker 0.3s infinite;
            text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5);
        }
    `;
    document.head.appendChild(style);
    const windows = new Set();
    const intervals = new Set();
    let isRunning = true;

    const systemMessages = [
        "WEYLAND-YUTANI CORPORATION - SECURITY SYSTEM",
        "QUARANTINE PROTOCOL ACTIVATED",
        "BIOHAZARD ALERT LEVEL 6",
        "UNAUTHORIZED ACCESS DETECTED",
        "SPECIAL ORDER 937 PROTOCOL INITIALIZATION",
        "DNA ANALYSIS IN PROGRESS...",
        "SPECIMEN XX121 DETECTED",
        "SELF-DESTRUCT SEQUENCE INITIATED",
        "ATMOSPHERIC PURGE IMMINENT",
        "APOLLO NETWORK CONNECTION",
        "DOWNLOADING SENSITIVE DATA",
        "SECURITY PROTOCOL VIOLATION",
        "LIFEFORM ANALYSIS IN PROGRESS",
        "MOTHER OVERRIDE SEQUENCE ACTIVE",
        "PRIORITY ONE: PROTECT COMPANY ASSETS",
        "CREW EXPENDABLE PROTOCOL ENGAGED",
        "HYPERSLEEP CHAMBER MALFUNCTION",
        "MOTION TRACKER SIGNAL DETECTED"
    ];

    const errorSnippets = [
        "CRITICAL ERROR: CONTAMINATION DETECTED",
        "BIOMETRIC AUTHENTICATION FAILURE",
        "QUARANTINE PROTOCOL VIOLATION",
        "SYSTEM ERROR: ATMOSPHERIC PRESSURE LOSS",
        "CONTAINMENT SYSTEM FAILURE",
        "SECURITY DATA CORRUPTION",
        "LIFE SUPPORT SYSTEMS CRITICAL",
        "EVACUATION SEQUENCE FAILURE",
        "FATAL ERROR: CONTAINMENT BREACH",
        "ACCESS DENIED: SECURITY LOCKDOWN",
        "MAINFRAME CONNECTION LOST",
        "WARNING: HOSTILE ORGANISM DETECTED",
        "EMERGENCY PROTOCOLS ENGAGED"
    ];

    function createWindow() {
        const window = document.createElement('div');
        window.classList.add('terminal-window');
        window.style.cssText = `
            width: ${Math.random() * 300 + 200}px;
            height: ${Math.random() * 200 + 150}px;
            top: ${Math.random() * (document.documentElement.clientHeight - 200)}px;
            left: ${Math.random() * (document.documentElement.clientWidth - 300)}px;
            animation: glowPulse 2s infinite ease-in-out;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            border-bottom: 1px solid #00ff00;
            padding-bottom: 5px;
            margin-bottom: 10px;
            font-size: 0.9em;
        `;
        header.innerHTML = `MOTHER TERMINAL ${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;
        window.appendChild(header);

        const codeContainer = document.createElement('div');
        codeContainer.style.cssText = `
            height: calc(100% - 30px);
            overflow: hidden;
            font-size: 12px;
            line-height: 1.2;
        `;
        window.appendChild(codeContainer);

        document.body.appendChild(window);
        windows.add(window);

        let codeContent = '';
        let isError = false;

        const updateInterval = setInterval(() => {
            if (!isRunning) return;

            const newContent = [];
            const glitchMode = Math.random() < 0.15;
            isError = glitchMode ? Math.random() < 0.6 : Math.random() < 0.3;

            if (glitchMode) {
                window.style.transform = `skew(${Math.random() * 10 - 5}deg)`;
                window.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
                setTimeout(() => {
                    window.style.transform = 'none';
                    window.style.filter = 'none';
                }, 100);

                const glitchText = Array(Math.floor(Math.random() * 3) + 1)
                    .fill(0)
                    .map(() => Math.random().toString(36).substring(2))
                    .join('\n');
                newContent.push(`<span style="color: #ff3333;">${glitchText}</span>`);
            }

            if (isError) {
                const errorMessage = errorSnippets[Math.floor(Math.random() * errorSnippets.length)];
                newContent.push(`<span style="color: #ff0000; text-shadow: 0 0 5px #ff0000;">${errorMessage}</span>`);
                window.style.animation = 'glowPulseRed 2s infinite ease-in-out, borderFlash 1s infinite';
            } else {
                newContent.push(systemMessages[Math.floor(Math.random() * systemMessages.length)]);
                window.style.animation = 'glowPulse 2s infinite ease-in-out';
            }

            if (Math.random() < 0.2) {
                const noise = Array(Math.floor(Math.random() * 3) + 1)
                    .fill(0)
                    .map(() => {
                        const color = Math.random() < 0.3 ? '#ff0000' : '#00ff00';
                        return `<span style="opacity: ${Math.random()}; color: ${color};">
                                ${Array(Math.floor(Math.random() * 10) + 1).fill('█').join('')}
                            </span>`;
                    })
                    .join('\n');
                newContent.push(noise);
            }

            codeContent += newContent.join('\n') + '\n';
            const lines = codeContent.split('\n').slice(-20);
            codeContainer.innerHTML = lines.join('\n');
        }, 100);

        intervals.add(updateInterval);

        const moveInterval = setInterval(() => {
            if (Math.random() < 0.3) {
                window.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                window.style.top = `${Math.random() * (document.documentElement.clientHeight - 200)}px`;
                window.style.left = `${Math.random() * (document.documentElement.clientWidth - 300)}px`;
            }
        }, 2000);
        intervals.add(moveInterval);

        setTimeout(() => {
            if (window && window.parentNode && isRunning) {
                window.style.animation = 'terminalGlitch 0.3s, fadeOut 0.5s';
                setTimeout(() => {
                    window.remove();
                    windows.delete(window);
                    if (isRunning && windows.size < 8) {
                        createWindow();
                    }
                }, 500);
            }
        }, 2000 + Math.random() * 3000);
    }

    for (let i = 0; i < 3; i++) {
        setTimeout(() => createWindow(), i * 200);
    }

    const escalationInterval = setInterval(() => {
        if (isRunning && windows.size < 8) {
            createWindow();
        }
    }, 1000);
    intervals.add(escalationInterval);

    return () => {
        isRunning = false;
        intervals.forEach(interval => clearInterval(interval));
        intervals.clear();
        windows.forEach(window => {
            window.style.animation = 'terminalGlitch 0.3s, fadeOut 0.5s';
            setTimeout(() => window.remove(), 500);
        });
        windows.clear();
        style.remove();
    };
}