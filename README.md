
# BengaApp

Prototype d'application d'urgence universelle : un point d'entrée unique pour contacter la police, les ambulances ou les pompiers à Kinshasa (RDC). Projet réalisé en équipe pour le concours STEM d'Orange pour femmes ingénieures (4e sur environ 200 participantes).

## Fonctionnalités
- Alerte SOS avec choix du service (police, ambulance, pompiers)
- Questions de triage selon le service
- Carte et position de la personne en danger (OpenStreetMap)
- Tableau de bord en temps réel pour les opérateurs (WebSocket)
- Interface en français et en lingala
- Version installable sur téléphone (PWA)

## Technologies
Python, Flask, Flask-SocketIO, JavaScript, Leaflet, OpenStreetMap

## Remarque
Prototype : la localisation par antenne et le service USSD sont simulés.

## Lancer le projet
Installer les dépendances avec `pip install -r requirements.txt`, puis lancer `python app.py` et ouvrir http://localhost:5000
