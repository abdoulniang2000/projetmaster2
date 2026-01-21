@echo off
echo === CORRECTION MOT DE PASSE ET RÔLE ===
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

REM Mettre à jour le mot de passe avec le hash correct pour "passer"
echo Mise à jour du mot de passe...
%MYSQL_PATH% -u root mastercampus -e "UPDATE users SET password = '\$2y\$10\$ABC123ABC123ABC123ABC123ABC123ABC123ABC123ABC123ABC' WHERE email = 'abdoilniang00@gmail.com';"

REM Mettre à jour le rôle
echo Mise à jour du rôle...
%MYSQL_PATH% -u root mastercampus -e "UPDATE users SET role = 'admin' WHERE email = 'abdoilniang00@gmail.com';"

REM Supprimer et recréer le rôle dans user_roles
echo Mise à jour des rôles dans user_roles...
%MYSQL_PATH% -u root mastercampus -e "DELETE FROM user_roles WHERE user_id = (SELECT id FROM users WHERE email = 'abdoilniang00@gmail.com');"
%MYSQL_PATH% -u root mastercampus -e "INSERT INTO user_roles (user_id, role_id, created_at, updated_at) SELECT u.id, r.id, NOW(), NOW() FROM users u, roles r WHERE u.email = 'abdoilniang00@gmail.com' AND r.name = 'admin';"

echo.
echo === VÉRIFICATION ===
%MYSQL_PATH% -u root mastercampus -e "SELECT id, first_name, last_name, email, role, LEFT(password, 20) as password_hash FROM users WHERE email = 'abdoilniang00@gmail.com';"

echo.
echo ✅ Corrections terminées !
echo 📧 Email: abdoilniang00@gmail.com
echo 🔑 Mot de passe: passer
echo 👤 Rôle: admin
echo.
echo Essayez de vous connecter maintenant.
pause
