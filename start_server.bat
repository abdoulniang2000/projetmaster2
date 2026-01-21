@echo off
echo === DÉMARRAGE SERVEUR LARAVEL ===
echo.

REM Vérifier si nous sommes dans le bon répertoire
if not exist "artisan" (
    echo ❌ Fichier artisan non trouvé. Veuillez exécuter ce script depuis le répertoire backend.
    pause
    exit /b 1
)

echo Démarrage du serveur Laravel sur http://127.0.0.1:8001
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.

php artisan serve --host=127.0.0.1 --port=8001
