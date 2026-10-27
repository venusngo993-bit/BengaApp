"""
BengaApp - Serveur Principal Flask
Application d'urgence universelle USSD
"""

import random
import datetime
from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'bengaapp-secret-2026'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# === Base de données en mémoire (simulation) ===
alerts_db = []

# === Simulation Cell ID → Coordonnées GPS (Kinshasa) ===
CELL_ID_MAP = {
    "CELL-8291-A": {"lat": -4.3050, "lng": 15.3140, "zone": "Gombe, Kinshasa"},
    "CELL-8291-B": {"lat": -4.3210, "lng": 15.3080, "zone": "Lingwala, Kinshasa"},
    "CELL-1042-C": {"lat": -4.3410, "lng": 15.2890, "zone": "Bandalungwa"},
    "CELL-5510-D": {"lat": -4.3540, "lng": 15.3370, "zone": "Limete"},
    "CELL-3301-E": {"lat": -4.3940, "lng": 15.3170, "zone": "Lemba"},
    "CELL-9900-F": {"lat": -4.4070, "lng": 15.3780, "zone": "N'djili"},
}

SERVICE_ICONS = {
    "Police": "🚓",
    "Ambulance": "🚑",
    "Pompiers": "🚒",
    "Police (Police)": "🚓",
    "Fire (Dafa Tang)": "🚒",
    "Medical (Ambulance)": "🚑",
}

# ============================================================
# ROUTES FLASK
# ============================================================

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """Retourne toutes les alertes actives."""
    return jsonify({
        "status": "ok",
        "count": len(alerts_db),
        "alerts": alerts_db
    })


@app.route('/api/alert/create', methods=['POST'])
def create_alert():
    """
    Crée une nouvelle alerte d'urgence.
    Appelé par le simulateur USSD côté frontend.
    """
    data = request.get_json()
    service = data.get('service', 'Inconnu')
    language = data.get('language', 'fr')
    sender_name = data.get('sender_name', 'Anonyme')
    contacts = data.get('contacts', [])
    real_lat = data.get('lat')
    real_lng = data.get('lng')

    # Simulation Cell ID aléatoire
    cell_id = random.choice(list(CELL_ID_MAP.keys()))
    location = CELL_ID_MAP[cell_id]

    # Utiliser les coordonnées réelles si fournies, sinon fallback Cell ID
    if real_lat and real_lng:
        lat = real_lat
        lng = real_lng
        zone = "Localisation GPS Exacte"
        cell_id = "GPS-SAT-LINK"
    else:
        lat = location['lat'] + random.uniform(-0.005, 0.005)
        lng = location['lng'] + random.uniform(-0.005, 0.005)
        zone = location['zone']

    alert = {
        "id": int(datetime.datetime.now().timestamp() * 1000),
        "service": service,
        "language": language,
        "cell_id": cell_id,
        "zone": zone,
        "lat": round(lat, 6),
        "lng": round(lng, 6),
        "time": datetime.datetime.now().strftime("%H:%M:%S"),
        "date": datetime.datetime.now().strftime("%d/%m/%Y"),
        "status": "En attente",
        "sender_name": sender_name,
        "contacts": contacts,
        "triage": [],
        "sms_fallback": f"https://maps.benga.app/?lat={lat:.6f}&lng={lng:.6f}"
    }

    alerts_db.insert(0, alert)

    # Broadcast en temps réel via WebSocket vers le tableau de bord
    socketio.emit('new_alert', alert, to=None)

    return jsonify({"status": "alert_sent", "alert": alert}), 201


@app.route('/api/alert/<int:alert_id>/update', methods=['POST'])
def update_alert_status(alert_id):
    """Met à jour le statut d'une alerte (pour les opérateurs)."""
    data = request.get_json()
    new_status = data.get('status', 'En route')

    for alert in alerts_db:
        if alert['id'] == alert_id:
            alert['status'] = new_status
            socketio.emit('alert_updated', alert, to=None)
            return jsonify({"status": "updated", "alert": alert})

    return jsonify({"status": "not_found"}), 404


@app.route('/api/alert/<int:alert_id>/update_triage', methods=['POST'])
def update_alert_triage(alert_id):
    """Met à jour les informations de triage (questions/réponses) pour une alerte."""
    data = request.get_json()
    triage_data = data.get('triage', [])

    for alert in alerts_db:
        if alert['id'] == alert_id:
            alert['triage'] = triage_data
            socketio.emit('alert_updated', alert, to=None)
            return jsonify({"status": "updated", "alert": alert})

    return jsonify({"status": "not_found"}), 404


@app.route('/api/alert/<int:alert_id>/location', methods=['POST'])
def update_alert_location(alert_id):
    """Met à jour les coordonnées GPS en temps réel d'une alerte en cours."""
    data = request.get_json()
    new_lat = data.get('lat')
    new_lng = data.get('lng')

    for alert in alerts_db:
        if alert['id'] == alert_id:
            alert['lat'] = round(float(new_lat), 6)
            alert['lng'] = round(float(new_lng), 6)
            # Diffuse aux opérateurs uniquement la nouvelle position
            socketio.emit('location_updated', {
                "id": alert['id'], 
                "lat": alert['lat'], 
                "lng": alert['lng']
            }, to=None)
            return jsonify({"status": "location_tracked"})

    return jsonify({"status": "not_found"}), 404


@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Statistiques pour le tableau de bord."""
    total = len(alerts_db)
    en_attente = sum(1 for a in alerts_db if a['status'] == 'En attente')
    en_route = sum(1 for a in alerts_db if a['status'] == 'En route')
    resolues = sum(1 for a in alerts_db if a['status'] == 'Résolue')

    services = {}
    for a in alerts_db:
        s = a['service']
        services[s] = services.get(s, 0) + 1

    return jsonify({
        "total": total,
        "en_attente": en_attente,
        "en_route": en_route,
        "resolues": resolues,
        "par_service": services
    })


# ============================================================
# SOCKET.IO EVENTS
# ============================================================

@socketio.on('connect')
def on_connect():
    print(f"[BengaApp] Client connecté : {request.sid}")
    # Envoyer toutes les alertes existantes au nouveau client
    emit('init_alerts', {"alerts": alerts_db})


@socketio.on('disconnect')
def on_disconnect():
    print(f"[BengaApp] Client déconnecté : {request.sid}")


@socketio.on('operator_ack')
def on_operator_ack(data):
    """Un opérateur prend en charge une alerte."""
    alert_id = data.get('alert_id')
    operator = data.get('operator', 'Opérateur')
    for alert in alerts_db:
        if alert['id'] == alert_id:
            alert['status'] = 'En route'
            alert['operator'] = operator
            socketio.emit('alert_updated', alert, to=None)
            break


# ============================================================
# PROGRAMME PRINCIPAL
# ============================================================

if __name__ == '__main__':
    print("=" * 50)
    print("  [BENGA] BengaApp - Systeme d'Urgence Universel")
    print("  Acces : http://localhost:5000")
    print("=" * 50)
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, allow_unsafe_werkzeug=True)
