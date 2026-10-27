/**
 * BengaApp — Frontend JavaScript (Unified Dashboard)
 */

// ============================================================
// CONFIGURATION & VARIABLES GLOBALES
// ============================================================
const COMMUNES = [
    { id: '1', name: 'Gombe', lat: -4.3050, lng: 15.3140, numbers: { 'Police': '0810010010', 'Ambulance': '0810010020', 'Pompiers': '0810010030' } },
    { id: '2', name: 'Lingwala', lat: -4.3210, lng: 15.3080, numbers: { 'Police': '0820020010', 'Ambulance': '0820020020', 'Pompiers': '0820020030' } },
    { id: '3', name: 'Bandalungwa', lat: -4.3410, lng: 15.2890, numbers: { 'Police': '0890040010', 'Ambulance': '0890040020', 'Pompiers': '0890040030' } },
    { id: '4', name: 'Limete', lat: -4.3540, lng: 15.3370, numbers: { 'Police': '0900030010', 'Ambulance': '0900030020', 'Pompiers': '0900030030' } },
    { id: '5', name: 'Lemba', lat: -4.3940, lng: 15.3170, numbers: { 'Police': '0850050010', 'Ambulance': '0850050020', 'Pompiers': '0850050030' } },
    { id: '6', name: "N'djili", lat: -4.4070, lng: 15.3780, numbers: { 'Police': '0840060010', 'Ambulance': '0840060020', 'Pompiers': '0840060030' } }
];

const TRIAGE_SCRIPT = {
    'fr': {
        'Police': [
            { q: "Qu'est-ce qui se passe exactement ?", opts: ["Agression", "Vol/Cambriolage", "Bagarre/Troubles"] },
            { q: "Les assaillants sont-ils encore presents sur place ?", opts: ["Oui", "Non", "Je ne sais pas"] },
            { q: "Y a-t-il des armes impliquees ?", opts: ["Oui, arme a feu", "Oui, arme blanche", "Non", "Je ne sais pas"] }
        ],
        'Ambulance': [
            { q: "Quelle est la situation ?", opts: ["Malaise/Inconscient", "Blessure grave", "Accident de route"] },
            { q: "La victime respire-t-elle ?", opts: ["Oui", "Non", "Je ne sais pas"] },
            { q: "Quel age a la victime (environ) ?", opts: ["Bebe/Enfant", "Adulte", "Personne agee"] }
        ],
        'Pompiers': [
            { q: "Que voyez-vous ?", opts: ["Fumee epaisse", "Flammes visibles", "Fuite de gaz/chimique"] },
            { q: "Y a-t-il des personnes bloquees a l'interieur ?", opts: ["Oui", "Non", "Inconnu"] },
            { q: "Le batiment est-il grand ?", opts: ["Maison/Petit", "Immeuble", "Usine/Commerce"] }
        ]
    },
    'ln': {
        'Police': [
            { q: "Likambo nini ezali koleka awa ?", opts: ["Mabe", "Moyibi/Koyiba", "Etumba/Mobulu"] },
            { q: "Bato yango ya mabe baze kaka wana ?", opts: ["Ee", "Te", "Nayebi te"] },
            { q: "Baza na mindoki to bibundeli ?", opts: ["Ee, mondoki", "Ee, mbeli", "Te", "Nayebi te"] }
        ],
        'Ambulance': [
            { q: "Likama nini ezali ?", opts: ["Bokono makasi", "Zoka nve", "Likama ya nzela"] },
            { q: "Moto yango azali kopema be ?", opts: ["Ee", "Te", "Nayebi te"] },
            { q: "Moto yango aza mbula boni ?", opts: ["Mwana moke", "Mokolo", "Mobange"] }
        ],
        'Pompiers': [
            { q: "Ozali komona nini ?", opts: ["Mulinga mingi", "Moto ezali kopela", "Visi to gaz mabe"] },
            { q: "Bato baze likanga na kati ?", opts: ["Ee", "Te", "Nayebi te"] },
            { q: "Ndako yango eza monene ?", opts: ["Mwa ndako", "Immeuble", "Usine/Ewando"] }
        ]
    }
};

const I18N = {
    fr: { 
        tab_sos: "SOS", tab_flux: "Flux", tab_profil: "Parametres", tab_lang: "Langue", 
        sos_title: "Choisir un service :",
        pol_desc: "Agressions, vols, securite", amb_desc: "Malaise, accident de route", pom_desc: "Incendie, sauvetage, risques",
        locating: "Localisation en cours...", locating_desc: "Recherche du poste le plus proche de votre position.",
        matched_title: "Unite Assignee", matched_post: "Poste de", distance: "Distance", eta: "Arrivee estimee",
        next_triage: "Suivant : Triage Paramedical", cancel: "Annuler l'alerte", end_call: "Terminer l'appel",
        triage_done: "Triage termine. L'equipe est en chemin. Restez en securite.",
        flux_empty: "Le flux est vide.", flux_empty_desc: "Aucune urgence active dans le secteur.",
        flux_active: "Urgences Actives", flux_info: "info(s) de triage attachee(s)",
        prof_title: "Parametres Utilisateur", prof_desc: "Creez votre compte pour faciliter l'identification par les secours.",
        prof_name: "Nom ou Pseudo", prof_save: "Enregistrer le Profil",
        lang_title: "Langue", lang_fr: "Francais", lang_ln: "Lingala",
        contact_title: "Proches Habilitees", contact_desc: "Ces numeros seront joints automatiquement aux equipes d'urgence.",
        c1: "Proche 1 (Prioritaire)", c2: "Proche 2", c_save: "Sauvegarder Proches",
        toast_prof: "Profil enregistre !", toast_cont: "Contacts enregistres !"
    },
    ln: { 
        tab_sos: "SOS", tab_flux: "Sango", tab_profil: "Kombo", tab_lang: "Lokota", 
        sos_title: "Soki likama eza, pona :",
        pol_desc: "Mabe, moyibi, kobatela batu", amb_desc: "Bokono, likama ya nzela", pom_desc: "Moto, kobikisa batu",
        locating: "Bozali koluka esika oza...", locating_desc: "Bozali koluka ndako ya misala ya pembeni na yo.",
        matched_title: "Esika Eponami", matched_post: "Ndako ya", distance: "Mosika", eta: "Ntango ya kokoma",
        next_triage: "Kende liboso : Mituna po na bokolongono", cancel: "Kokatisa libenga", end_call: "Kokata libenga",
        triage_done: "Mituna esili. Bato bazali koya. Zala na kimia.",
        flux_empty: "Sango eza te.", flux_empty_desc: "Likama moko te eza awa.",
        flux_active: "Malasi ya sikoyo", flux_info: "Tonsango topesami",
        prof_title: "Bizaleli ya yo", prof_desc: "Kela kombo na yo po bayeba yo noki tango ya likama.",
        prof_name: "Kombo to Nkombo ya lisano", prof_save: "Komba Profil",
        lang_title: "Lokota (Langue)", lang_fr: "Falanse", lang_ln: "Lingala",
        contact_title: "Batu ya pembeni", contact_desc: "Numero oyo bako benga bango na mbala moko soki likama eza.",
        c1: "Moto 1 (Ya liboso)", c2: "Moto 2", c_save: "Komba bato ya pembeni",
        toast_prof: "Kombo ekotisi malu !", toast_cont: "Numero ekotisi malu !"
    }
};

const SERVICE_COLORS = { "Police": "#3b8eff", "Ambulance": "#ff3b3b", "Pompiers": "#ff8c3b" };

const state = {
    currentTab: 1,
    lang: 'fr',
    view: 'home',
    service: null,
    matchedCommune: null,
    matchedDistance: 0,
    matchedTime: 0,
    alertId: null,
    triageStep: 0,
    triageHistory: [],
    map: null,
    markers: {},
    alerts: [],
    userProfile: { name: "", contacts: [] },
    gpsWatcherId: null
};

// ============================================================
// DOM Refs & INITIALISATION SECURISEE
// ============================================================
const $ = id => document.getElementById(id);
const sidebarContent = $('sidebar-content');

document.addEventListener('DOMContentLoaded', () => {
    try { renderSidebar(); } catch(e) { console.error("Sidebar Error:", e); }
    try { initMap(); } catch(e) { console.error("Map Error:", e); }
    try { initSocket(); } catch(e) { console.error("Socket Error:", e); }
    setTimeout(() => { if (state.map) state.map.invalidateSize(); }, 500);
});

function deg2rad(deg) { return deg * (Math.PI/180); }
function getDistanceKM(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = deg2rad(lat2-lat1);  
    const dLon = deg2rad(lon2-lon1); 
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

function findNearestCommune(lat, lng) {
    let nearest = COMMUNES[0];
    let minDistance = 99999;
    COMMUNES.forEach(c => {
        let d = getDistanceKM(lat, lng, c.lat, c.lng);
        if(d < minDistance) { minDistance = d; nearest = c; }
    });
    return { commune: nearest, distance: minDistance };
}

window.switchTab = (tabId) => {
    state.currentTab = tabId;
    document.querySelectorAll('.side-tab').forEach((btn, idx) => {
        btn.classList.toggle('active', idx + 1 === tabId);
    });
    renderSidebar();
};

function renderSidebar() {
    const t = I18N[state.lang];
    if($('tab-1')) $('tab-1').textContent = t.tab_sos;
    if($('tab-2')) $('tab-2').textContent = t.tab_flux;
    if($('tab-3')) $('tab-3').textContent = t.tab_profil;
    if($('tab-4')) $('tab-4').textContent = t.tab_lang;

    let html = '';
    if (state.currentTab === 1) html = renderTabSOS(t);
    else if (state.currentTab === 2) html = renderTabFlux(t);
    else if (state.currentTab === 3) html = renderTabProfile(t);
    else if (state.currentTab === 4) html = renderTabLangContacts(t);

    if (sidebarContent) sidebarContent.innerHTML = html;
    
    if(state.currentTab === 1 && state.view === 'triage') {
        setTimeout(() => {
            const chatWin = document.getElementById('triage-chat-window');
            if(chatWin) chatWin.scrollTop = chatWin.scrollHeight;
        }, 50);
    }
}

function renderTabSOS(t) {
    let content = '';

    if (state.view === 'home') {
        content = `
            <h2 style="color:#dce6f5; font-size:1.1rem; margin-bottom:15px;">${t.sos_title}</h2>
            <div class="svc-card" onclick="triggerAlert('Police')" style="border-left-color:${SERVICE_COLORS['Police']}">
                <div class="svc-icon">🚓</div>
                <div class="svc-info"><h3>Police</h3><p>${t.pol_desc}</p></div>
            </div>
            <div class="svc-card" onclick="triggerAlert('Ambulance')" style="border-left-color:${SERVICE_COLORS['Ambulance']}">
                <div class="svc-icon">🚑</div>
                <div class="svc-info"><h3>Ambulance</h3><p>${t.amb_desc}</p></div>
            </div>
            <div class="svc-card" onclick="triggerAlert('Pompiers')" style="border-left-color:${SERVICE_COLORS['Pompiers']}">
                <div class="svc-icon">🚒</div>
                <div class="svc-info"><h3>Pompiers</h3><p>${t.pom_desc}</p></div>
            </div>
        `;
    } 
    else if (state.view === 'locating') {
        content = `
            <div class="finding-ui">
                <div class="loader"></div>
                <h2 style="color:#fff;">${t.locating}</h2>
                <p style="color:#8a9bb5">${t.locating_desc}</p>
            </div>
        `;
    }
    else if (state.view === 'matched') {
        const num = state.matchedCommune.numbers[state.service] || "Non-dispo";
        content = `
            <div class="finding-ui" style="justify-content: flex-start; align-items: stretch; text-align: left;">
                <div class="matched-box">
                    <h2>${t.matched_title}</h2>
                    <p>${t.matched_post} <b>${state.matchedCommune.name}</b></p>
                    <div class="matched-number">${num}</div>
                    
                    <div class="dist-box">
                        <div>📍 ${t.distance} : <strong>${state.matchedDistance.toFixed(1)} km</strong></div>
                        <div>⏱️ ${t.eta} : <strong>~${Math.max(1, Math.round(state.matchedTime))} min</strong></div>
                    </div>
                </div>
                <button class="submit-btn" onclick="startTriage()">${t.next_triage}</button>
                <div style="text-align:center; margin-top:10px;"><a href="#" onclick="goHome()" style="color:#8a9bb5; font-size:0.8rem; text-decoration:none;">${t.cancel}</a></div>
            </div>
        `;
    }
    else if (state.view === 'triage') {
        const questions = TRIAGE_SCRIPT[state.lang][state.service] || [];
        let chatHtml = `<div class="triage-chat" id="triage-chat-window">`;
        
        state.triageHistory.forEach(h => {
            chatHtml += `<div class="msg msg-bot">${h.bot}</div>`;
            if (h.user) chatHtml += `<div class="msg msg-user">${h.user}</div>`;
        });

        const currentQ = questions[state.triageStep];
        
        if (currentQ) {
            chatHtml += `<div class="msg msg-bot">${currentQ.q}</div></div>`;
            let controlsHtml = `<div class="triage-controls">`;
            currentQ.opts.forEach(o => { controlsHtml += `<button class="triage-btn" onclick="answerTriage('${o}')">${o}</button>`; });
            controlsHtml += `</div>`;
            content = `<div class="triage-container">${chatHtml}${controlsHtml}</div>`;
        } else {
            chatHtml += `<div class="msg msg-bot" style="color:#2fce7e; font-weight:bold;">${t.triage_done}</div></div>`;
            content = `<div class="triage-container">${chatHtml}<button class="submit-btn" onclick="goHome()">${t.end_call}</button></div>`;
        }
    }

    return `
        <div class="phone-device" style="margin: 0 auto;">
            <div class="phone-notch"></div>
            <div class="phone-app-wrap">
               <div class="status-bar">
                    <span class="carrier">BengaNet 4G</span>
                    <div class="status-icons">
                        <span id="phone-signal">📶</span>
                        <span>LIVE</span>
                    </div>
                </div>
                <div class="app-content">
                    ${content}
                </div>
            </div>
        </div>
    `;
}

function renderTabFlux(t) {
    if (state.alerts.length === 0) {
        return `<div class="finding-ui"><h3 style="color:#8a9bb5; font-weight:500;">${t.flux_empty}</h3><p style="font-size:0.85rem; color:#5a6a85">${t.flux_empty_desc}</p></div>`;
    }
    
    let html = `<h2 style="color:#fff; margin-bottom:15px; font-size:1.1rem;">${t.flux_active}</h2>`;
    html += state.alerts.map(a => {
        const color = SERVICE_COLORS[a.service] || "#fff";
        let triageItems = a.triage && a.triage.length > 0 ? `<div style="font-size:0.8rem; color:var(--orange); margin-top:8px;">⚠️ ${a.triage.length} ${t.flux_info}</div>` : "";
        return `
        <div class="alert-card" style="border-left-color:${color}" onclick="focusAlert(${a.id})">
            <div class="alert-top">
                <div class="alert-service" style="color:${color}">${a.service}</div>
                <span class="alert-time">${a.time}</span>
            </div>
            <div class="alert-zone">📍 ${a.zone} — ${a.sender_name}</div>
            <div class="alert-status">${a.status}</div>
            ${triageItems}
        </div>`;
    }).join('');
    
    return html;
}

function renderTabProfile(t) {
    return `
        <div>
            <h2 style="color:#fff; margin-bottom:20px; font-size:1.1rem;">${t.prof_title}</h2>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:20px;">${t.prof_desc}</p>
            <div class="form-group">
                <label>${t.prof_name}</label>
                <input type="text" id="prof-name" class="form-input" value="${state.userProfile.name}" placeholder="Ex: Jean Dupont">
            </div>
            <button class="submit-btn" onclick="saveProfile()">${t.prof_save}</button>
        </div>
    `;
}

function renderTabLangContacts(t) {
    return `
        <div style="display:flex; flex-direction:column;">
            <h2 style="color:#fff; margin-bottom:15px; font-size:1.1rem;">${t.lang_title}</h2>
            <div style="display:flex; gap:10px; margin-bottom:30px;">
                <button class="triage-btn" style="flex:1; background:${state.lang==='fr' ? 'var(--accent)' : 'rgba(255,255,255,0.05)'}; border-color:transparent;" onclick="setLang('fr')">${t.lang_fr}</button>
                <button class="triage-btn" style="flex:1; background:${state.lang==='ln' ? 'var(--accent)' : 'rgba(255,255,255,0.05)'}; border-color:transparent;" onclick="setLang('ln')">${t.lang_ln}</button>
            </div>

            <h2 style="color:#fff; margin-bottom:15px; font-size:1.1rem;">${t.contact_title}</h2>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:20px;">${t.contact_desc}</p>
            <div class="form-group">
                <label>${t.c1}</label>
                <input type="text" id="prof-contact1" class="form-input" value="${state.userProfile.contacts[0] || ''}" placeholder="081...">
            </div>
            <div class="form-group">
                <label>${t.c2}</label>
                <input type="text" id="prof-contact2" class="form-input" value="${state.userProfile.contacts[1] || ''}" placeholder="082...">
            </div>
            <button class="submit-btn" onclick="saveContacts()">${t.c_save}</button>
        </div>
    `;
}

// ============================================================
// ACTIONS FRONTEND
// ============================================================

window.goHome = () => { 
    if (state.gpsWatcherId) { navigator.geolocation.clearWatch(state.gpsWatcherId); state.gpsWatcherId = null; }
    state.alertId = null; state.view = 'home'; renderSidebar(); 
};

window.setLang = (lang) => { state.lang = lang; renderSidebar(); };

window.saveProfile = () => {
    state.userProfile.name = $('prof-name').value.trim();
    showToast(I18N[state.lang].toast_prof);
};

window.saveContacts = () => {
    let c1 = $('prof-contact1').value.trim(); let c2 = $('prof-contact2').value.trim();
    state.userProfile.contacts = [];
    if(c1) state.userProfile.contacts.push(c1);
    if(c2) state.userProfile.contacts.push(c2);
    showToast(I18N[state.lang].toast_cont);
};

window.triggerAlert = (svc) => {
    state.service = svc;
    state.view = 'locating';
    renderSidebar();

    if (navigator.geolocation) {
        state.gpsWatcherId = navigator.geolocation.watchPosition(
            (pos) => {
                if (!state.alertId) processAlert(pos.coords.latitude, pos.coords.longitude);
                else updateLocation(pos.coords.latitude, pos.coords.longitude);
            },
            (err) => { if (!state.alertId) processAlert(null, null); },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        processAlert(null, null);
    }
};

function updateLocation(lat, lng) {
    if (!state.alertId) return;
    fetch('/api/alert/' + state.alertId + '/location', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: lat, lng: lng })
    });
}

function processAlert(lat, lng) {
    if (!lat) { lat = -4.33; lng = 15.31; } 
    
    const result = findNearestCommune(lat, lng);
    state.matchedCommune = result.commune;
    state.matchedDistance = result.distance;
    state.matchedTime = (result.distance / 30) * 60;
    
    fetch('/api/alert/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            service: state.service, language: state.lang, sender_name: state.userProfile.name || 'Inconnu',
            contacts: state.userProfile.contacts, lat: lat, lng: lng
        })
    })
    .then(r => r.json())
    .then(data => {
        state.alertId = data.alert.id;
        state.view = 'matched';
        renderSidebar();
    });
}

window.startTriage = () => {
    state.triageHistory = []; state.triageStep = 0; state.view = 'triage'; renderSidebar();
};

window.answerTriage = (answer) => {
    const q = TRIAGE_SCRIPT[state.lang][state.service][state.triageStep].q;
    state.triageHistory.push({ bot: q, user: answer });
    state.triageStep++;
    renderSidebar();
    fetch('/api/alert/' + state.alertId + '/update_triage', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triage: state.triageHistory })
    });
};

// ============================================================
// CARTE / WEBSOCKET (DASHBOARD)
// ============================================================

function initMap() {
    state.map = L.map('map', { zoomControl: true, zoomAnimation:true }).setView([-4.322, 15.307], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(state.map);
}

function initSocket() {
    const socket = io();
    socket.on('init_alerts', (data) => {
        data.alerts.forEach(a => { state.alerts.unshift(a); addMapMarker(a); });
        if(state.currentTab === 2) renderSidebar();
    });
    socket.on('new_alert', (alert) => {
        state.alerts.unshift(alert); addMapMarker(alert);
        if(state.currentTab === 2) renderSidebar();
    });
    socket.on('alert_updated', (updated) => {
        const idx = state.alerts.findIndex(a => a.id === updated.id);
        if (idx !== -1) { state.alerts[idx] = updated; updateMapMarker(updated); }
        if(state.currentTab === 2) renderSidebar();
    });
    
    socket.on('location_updated', (loc) => {
        const alert = state.alerts.find(a => a.id === loc.id);
        if (alert) {
            alert.lat = loc.lat; alert.lng = loc.lng;
            if (state.markers[loc.id]) state.markers[loc.id].setLatLng([loc.lat, loc.lng]); 
        }
    });
}

function addMapMarker(alert) {
    const svc = (alert.service || "").toLowerCase();
    let markerCls = svc.includes("police") ? "police" : svc.includes("pompier") || svc.includes("fire") ? "pompiers" : "ambulance";
    const icon = L.divIcon({ className: '', html: '<div class="pulsar ' + markerCls + '"></div>' });
    const marker = L.marker([alert.lat, alert.lng], { icon }).addTo(state.map);
    state.markers[alert.id] = marker;
    updateMapMarker(alert);
}

function updateMapMarker(alert) {
    const marker = state.markers[alert.id];
    if(marker) {
        let triageHtml = "";
        let distHtml = "";
        if(alert.triage && alert.triage.length > 0) {
            triageHtml = "<hr style='border:0; border-top:1px solid rgba(255,255,255,0.1); margin:8px 0'>" + 
                         alert.triage.map(t => '<small style="display:block;margin-bottom:3px;color:#a0aabf;"><b>Q:</b> ' + t.bot + '<br><b style="color:#fff;">R: <span style="color:#ff3b3b">' + t.user + '</span></b></small>').join("");
        }
        marker.setPopupContent(
            '<b>' + alert.service + '</b> - <span style="color:var(--accent);">' + alert.status + '</span><br>' +
            '<div style="font-size:0.9rem; margin-top:5px;">👤 ' + alert.sender_name + '</div>' +
            '<div style="font-size:0.8rem; color:#8a9bb5;">📍 ' + alert.zone + ' | 🕐 ' + alert.time + '</div>' +
            triageHtml
        );
    }
}

window.focusAlert = (alertId) => {
    const alert = state.alerts.find(a => a.id === alertId);
    if (alert && state.map) {
        state.map.flyTo([alert.lat, alert.lng], 16);
        if (state.markers[alert.id]) state.markers[alert.id].openPopup();
    }
};

function showToast(msg) {
    const toast = $('toast');
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => { toast.classList.add('hidden'); }, 3000);
}
