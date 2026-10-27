@echo off
title BengaApp - Serveur Local
color 0A

echo ===================================================
echo    BENGAAPP - Serveur d'Urgence et Triage
echo ===================================================
echo.
echo  Le serveur demarre... Ne fermez pas cette fenetre 
echo  noire tant que vous utilisez l'application !
echo.
echo  Ouverture de l'interface dans votre navigateur...
echo.

:: Ouvre l'adresse dans le navigateur par défaut
start "" "http://localhost:5000"

:: Lance l'application avec Python
python app.py

:: Maintient la fenêtre ouverte en cas de crash
pause
