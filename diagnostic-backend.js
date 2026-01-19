// Script de diagnostic pour vérifier la connexion au backend
// Ouvrir la console du navigateur et coller ce code

async function diagnosticBackend() {
    console.log('🔍 DIAGNOSTIC DU BACKEND');
    console.log('========================');

    const baseURL = 'http://127.0.0.1:8001/api';

    try {
        // Test 1: Vérifier si le backend est accessible
        console.log('\n1️⃣ Test de connexion au backend...');
        const response = await fetch(`${baseURL}/v1/test`);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend accessible:', data);
        } else {
            console.log('❌ Backend répond avec statut:', response.status);
        }

        // Test 2: Vérifier l'endpoint users
        console.log('\n2️⃣ Test de l\'endpoint users...');
        const usersResponse = await fetch(`${baseURL}/v1/users`);
        console.log('Statut users endpoint:', usersResponse.status);

        if (usersResponse.ok) {
            const users = await usersResponse.json();
            console.log('✅ Users endpoint OK, nombre d\'utilisateurs:', users.length);
        } else {
            console.log('❌ Users endpoint erreur:', usersResponse.status);
        }

        // Test 3: Vérifier les rôles
        console.log('\n3️⃣ Test de l\'endpoint roles...');
        const rolesResponse = await fetch(`${baseURL}/v1/roles`);
        console.log('Statut roles endpoint:', rolesResponse.status);

        if (rolesResponse.ok) {
            const roles = await rolesResponse.json();
            console.log('✅ Roles endpoint OK, rôles disponibles:', roles.map(r => r.name));
        } else {
            console.log('❌ Roles endpoint erreur:', rolesResponse.status);
        }

        // Test 4: Tester la création d'utilisateur (avec données de test)
        console.log('\n4️⃣ Test de création d\'utilisateur...');
        const testUser = {
            first_name: 'Test',
            last_name: 'Diagnostic',
            email: `test${Date.now()}@diagnostic.com`,
            password: 'password123',
            role: 'etudiant',
            department: 'Test',
            student_id: 'TEST' + Date.now()
        };

        const createResponse = await fetch(`${baseURL}/v1/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(testUser)
        });

        console.log('Statut création utilisateur:', createResponse.status);

        if (createResponse.ok) {
            const createdUser = await createResponse.json();
            console.log('✅ Utilisateur créé avec succès:', createdUser);
        } else {
            const errorData = await createResponse.json();
            console.log('❌ Erreur création utilisateur:', errorData);
        }

    } catch (error) {
        console.error('❌ Erreur de diagnostic:', error);

        if (error.message.includes('Failed to fetch')) {
            console.log('💡 Le backend est probablement arrêté ou inaccessible');
            console.log('💡 Démarrez le backend avec: cd backend && php artisan serve --port=8001');
        } else if (error.message.includes('CORS')) {
            console.log('💡 Problème CORS - vérifiez la configuration Laravel');
        }
    }

    console.log('\n🎯 Diagnostic terminé!');
}

// Exécuter le diagnostic
diagnosticBackend();
