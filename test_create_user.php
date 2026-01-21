<?php

// Test de création d'utilisateur via API
require_once 'backend/bootstrap/app.php';

use Illuminate\Http\Request;
use App\Http\Controllers\UserController;

echo "=== TEST DE CRÉATION D'UTILISATEUR ===\n\n";

// Simuler une requête POST
$requestData = [
    'first_name' => 'Test',
    'last_name' => 'User',
    'email' => 'test.user' . time() . '@example.com',
    'password' => 'password123',
    'role' => 'etudiant',
    'phone' => '771234567',
    'address' => 'Test Address',
    'city' => 'Dakar'
];

echo "Données de test:\n";
foreach ($requestData as $key => $value) {
    echo "- $key: $value\n";
}

echo "\nCréation de la requête simulée...\n";

try {
    // Créer une requête simulée
    $request = Request::create('/api/v1/users', 'POST', $requestData);
    
    // Créer le controller
    $controller = new UserController();
    
    // Valider les données avec StoreUserRequest
    $storeRequest = new \App\Http\Requests\Api\V1\StoreUserRequest();
    
    // Simuler la validation
    $validator = \Illuminate\Support\Facades\Validator::make($requestData, $storeRequest->rules());
    
    if ($validator->fails()) {
        echo "❌ Erreurs de validation:\n";
        foreach ($validator->errors()->all() as $error) {
            echo "- $error\n";
        }
        exit;
    }
    
    echo "✅ Validation réussie\n";
    
    // Tenter de créer l'utilisateur
    $user = \App\Models\User::create([
        'first_name' => $requestData['first_name'],
        'last_name' => $requestData['last_name'],
        'email' => $requestData['email'],
        'password' => \Illuminate\Support\Facades\Hash::make($requestData['password']),
        'role' => $requestData['role'],
        'status' => true,
        'phone' => $requestData['phone'] ?? null,
        'address' => $requestData['address'] ?? null,
        'city' => $requestData['city'] ?? null,
    ]);
    
    echo "✅ Utilisateur créé avec ID: {$user->id}\n";
    
    // Assigner le rôle
    $role = \App\Models\Role::where('name', $requestData['role'])->first();
    if ($role) {
        $user->roles()->attach($role->id);
        echo "✅ Rôle {$role->name} assigné\n";
    }
    
    echo "\nUtilisateur final:\n";
    echo "- ID: {$user->id}\n";
    echo "- Nom: {$user->first_name} {$user->last_name}\n";
    echo "- Email: {$user->email}\n";
    echo "- Rôle: {$user->role}\n";
    echo "- Statut: " . ($user->status ? 'Actif' : 'Inactif') . "\n";
    
    echo "\n✅ Test réussi !\n";
    
} catch (\Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
?>
