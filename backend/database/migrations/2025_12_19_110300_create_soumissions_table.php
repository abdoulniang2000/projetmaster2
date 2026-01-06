<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('soumissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('devoir_id')->constrained()->onDelete('cascade');
            $table->foreignId('etudiant_id')->constrained('users')->onDelete('cascade');
            $table->string('fichier_soumis');
            $table->timestamp('date_soumission');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('soumissions');
    }
};
