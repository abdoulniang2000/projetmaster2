<?php

// Simple test to check API and database
echo "=== Simple API Test ===\n";

// Test 1: Check if backend server is running
echo "1. Testing backend connection...\n";
$ch = curl_init('http://127.0.0.1:8000/api/v1/test');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo "   ✓ Backend server is running\n";
    echo "   Response: " . substr($response, 0, 100) . "...\n";
} else {
    echo "   ✗ Backend server not accessible (HTTP $httpCode)\n";
    echo "   Please start the backend server with: php artisan serve --host=127.0.0.1 --port=8000\n";
    exit;
}

// Test 2: Check modules endpoint
echo "\n2. Testing modules endpoint...\n";
$ch = curl_init('http://127.0.0.1:8000/api/v1/modules');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo "   ✓ Modules endpoint working\n";
    $data = json_decode($response, true);
    $count = is_array($data) ? count($data) : 0;
    echo "   Current modules count: $count\n";
    
    if ($count > 0) {
        echo "   Sample modules:\n";
        for ($i = 0; $i < min(3, $count); $i++) {
            echo "   - ID: {$data[$i]['id']}, Titre: {$data[$i]['titre']}\n";
        }
    }
} else {
    echo "   ✗ Modules endpoint failed (HTTP $httpCode)\n";
    echo "   Response: $response\n";
}

// Test 3: Create a test module
echo "\n3. Testing module creation...\n";
$testData = [
    'nom' => 'Test Module ' . date('Y-m-d H:i:s'),
    'cours_id' => 1
];

$ch = curl_init('http://127.0.0.1:8000/api/v1/modules');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 201) {
    echo "   ✓ Module creation successful\n";
    $data = json_decode($response, true);
    echo "   Created module ID: {$data['id']}\n";
    
    // Test 4: Verify module persists
    echo "\n4. Testing module persistence...\n";
    sleep(1); // Wait a second
    
    $ch = curl_init('http://127.0.0.1:8000/api/v1/modules');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        $data = json_decode($response, true);
        $found = false;
        foreach ($data as $module) {
            if ($module['id'] == $data['id']) {
                $found = true;
                break;
            }
        }
        if ($found) {
            echo "   ✓ Module persists in database\n";
        } else {
            echo "   ✗ Module not found after creation\n";
        }
    }
} else {
    echo "   ✗ Module creation failed (HTTP $httpCode)\n";
    echo "   Response: $response\n";
}

echo "\n=== Test Complete ===\n";
