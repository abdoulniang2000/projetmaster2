@echo off
echo === CORRECTION DU RÔLE DE ABDOUL NIANG ===
echo.

REM Vérifier si XAMPP est installé
if exist "C:\xampp\mysql\bin\mysql.exe" (
    set MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe
) else (
    echo ❌ MySQL non trouvé dans C:\xampp\mysql\bin\mysql.exe
    pause
    exit /b 1
)

echo Utilisation de MySQL: %MYSQL_PATH%
echo.

REM Exécuter les commandes SQL
echo Mise à jour du rôle dans la table users...
%MYSQL_PATH% -u root -p mastercampus -e "UPDATE users SET role = 'admin' WHERE email = 'abdoilniang00@gmail.com';"

echo Suppression des anciens rôles...
%MYSQL_PATH% -u root -p mastercampus -e "DELETE FROM user_roles WHERE user_id = (SELECT id FROM users WHERE email = 'abdoilniang00@gmail.com');"

echo Ajout du rôle admin...
%MYSQL_PATH% -u root -p mastercampus -e "INSERT INTO user_roles (user_id, role_id, created_at, updated_at) SELECT u.id, r.id, NOW(), NOW() FROM users u, roles r WHERE u.email = 'abdoilniang00@gmail.com' AND r.name = 'admin';"

echo.
echo === VÉRIFICATION ===
%MYSQL_PATH% -u root -p mastercampus -e "SELECT u.id, u.first_name, u.last_name, u.email, u.role as role_column, r.display_name as role_name FROM users u LEFT JOIN user_roles ur ON u.id = ur.user_id LEFT JOIN roles r ON ur.role_id = r.id WHERE u.email = 'abdoilniang00@gmail.com';"

echo.
echo ✅ Correction terminée !
echo 📧 Email: abdoilniang00@gmail.com
echo 🔑 Mot de passe: passer
echo 👤 Rôle: admin
echo.
pause
