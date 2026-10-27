"""Script de test BengaApp - Validation de l'API"""
import urllib.request
import json
import time

BASE_URL = "http://localhost:5000"

def test_endpoint(name, url, method="GET", payload=None):
    try:
        data = json.dumps(payload).encode() if payload else None
        headers = {"Content-Type": "application/json"} if data else {}
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        resp = urllib.request.urlopen(req, timeout=5)
        result = json.loads(resp.read())
        print(f"[OK] {name}")
        return result
    except Exception as e:
        print(f"[ERREUR] {name}: {e}")
        return None

print("=" * 55)
print("  BENGAAPP - TESTS API")
print("=" * 55)

# Test 1: Stats vides
r = test_endpoint("GET /api/stats", f"{BASE_URL}/api/stats")
if r:
    print(f"       Total alertes : {r['total']}")

# Test 2: Liste vide
r = test_endpoint("GET /api/alerts", f"{BASE_URL}/api/alerts")
if r:
    print(f"       Alertes en DB : {r['count']}")

# Test 3: Creer une alerte Police
r = test_endpoint(
    "POST /api/alert/create (Police)",
    f"{BASE_URL}/api/alert/create",
    method="POST",
    payload={"service": "Police", "language": "fr"}
)
if r:
    alert = r["alert"]
    print(f"       ID        : {alert['id']}")
    print(f"       Service   : {alert['service']}")
    print(f"       Zone      : {alert['zone']}")
    print(f"       Cell ID   : {alert['cell_id']}")
    print(f"       GPS       : {alert['lat']}, {alert['lng']}")
    print(f"       Statut    : {alert['status']}")
    print(f"       SMS Link  : {alert['sms_fallback']}")
    alert_id = alert["id"]

    # Test 4: Mettre a jour le statut
    time.sleep(0.5)
    r2 = test_endpoint(
        "POST /api/alert/{id}/update -> En route",
        f"{BASE_URL}/api/alert/{alert_id}/update",
        method="POST",
        payload={"status": "En route"}
    )
    if r2:
        print(f"       Nouveau statut : {r2['alert']['status']}")

# Test 5: Creer Ambulance
test_endpoint(
    "POST /api/alert/create (Ambulance)",
    f"{BASE_URL}/api/alert/create",
    method="POST",
    payload={"service": "Ambulance", "language": "fr"}
)

# Test 6: Creer Pompiers
test_endpoint(
    "POST /api/alert/create (Pompiers)",
    f"{BASE_URL}/api/alert/create",
    method="POST",
    payload={"service": "Pompiers", "language": "fr"}
)

# Test 7: Stats finales
r = test_endpoint("GET /api/stats (final)", f"{BASE_URL}/api/stats")
if r:
    print(f"       Total     : {r['total']}")
    print(f"       En attente: {r['en_attente']}")
    print(f"       En route  : {r['en_route']}")
    print(f"       Par service: {r['par_service']}")

print("=" * 55)
print("  TESTS TERMINES - Ouvrez http://localhost:5000")
print("=" * 55)
