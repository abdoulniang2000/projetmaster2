@echo off
echo === CORRECTION FINALE ABDOUL NIANG ===
echo.

REM Trouver MySQL
if exist "C:\xampp\mysql\bin\mysql.exe" (
    set MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe
    echo Utilisation de MySQL XAMPP
) else if exist "C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe" (
    set MYSQL_PATH=C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe
    echo Utilisation de MySQL WAMP
) else (
    echo ❌ MySQL non trouvé. Veuillez installer XAMPP ou WAMP.
    pause
    exit /b 1
)

echo.
echo 1. Mise à jour du mot de passe...
%MYSQL_PATH% -u root mastercampus -e "UPDATE users SET password = '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE email = 'abdoilniang00@gmail.com';"

echo 2. Mise à jour du rôle...
%MYSQL_PATH% -u root mastercampus -e "UPDATE users SET role = 'admin' WHERE email = 'abdoilniang00@gmail.com';"

echo 3. Correction des rôles dans user_roles...
%MYSQL_PATH% -u root mastercampus -e "DELETE FROM user_roles WHERE user_id = (SELECT id FROM users WHERE email = 'abdoilniang00@gmail.com');"
%MYSQL_PATH% -u root mastercampus -e "INSERT INTO user_roles (user_id, role_id, created_at, updated_at) SELECT u.id, r.id, NOW(), NOW() FROM users u, roles r WHERE u.email = 'abdoilniang00@gmail.com' AND r.name = 'admin';"

echo.
echo 4. Vérification...
%MYSQL_PATH% -u root mastercampus -e "SELECT id, first_name, last_name, email, role FROM users WHERE email = 'abdoilniang00@gmail.com';"

echo.
echo ✅ CORRECTION TERMINÉE !
echo.
echo 📧 Email: abdoilniang00@gmail.com
echo 🔑 Mot de passe: passer
echo 👤 Rôle: admin
echo.
echo Essayez de vous connecter maintenant.
pause
