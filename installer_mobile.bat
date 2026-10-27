@echo off
title BengaApp - Version Mobile
color 0B

echo.
echo ==============================================================
echo     INSTALLER BENGAAPP SUR VOTRE SMARTPHONE (MEME WIFI)
echo ==============================================================
echo.
echo L'application a ete transformee en "PWA" (Progressive Web App).
echo Cela signifie que vous pouvez l'installer nativament sur votre 
echo iPhone ou votre appareil Android sans passer par l'App Store !
echo.
echo ETAPES A SUIVRE :
echo --------------------------------------------------------------
echo 1. Laissez le serveur principal (start.bat) allume sur ce PC.
echo 2. Prenez votre telephone (connecte au meme Wi-Fi).
echo 3. Ouvrez Safari (iPhone) ou Chrome (Android).
echo 4. Tapez EXACTEMENT cette adresse dans la barre de recherche :
echo.

:: Récupération automatique de l'IP du PC
for /f "tokens=14" %%i in ('ipconfig ^| findstr IPv4') do set IP=%%i
echo      --^>  http://%IP%:5000  ^<--
echo.
echo 5. Une fois la page chargee sur votre mobile :
echo    - Sur iPhone : Cliquez sur le bouton "Partager", 
echo      puis sur "Sur l'ecran d'accueil".
echo    - Sur Android : Cliquez sur les 3 petits points,
echo      puis "Ajouter a l'ecran d'accueil".
echo.
echo L'icone BengaApp apparaitra parmi vos applications !
echo ==============================================================
echo.
pause
