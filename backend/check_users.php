<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illware_Console_Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

$users = \App\Models\User::all();

echo "Nombre d'utilisateurs : " . $users->count() . "\n";

foreach ($users as $user) {
    echo "- " . $user->name . " (" . $user->email . ")\n";
}
