<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('evenements', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description');
            $table->enum('type', ['cours', 'devoir', 'examen', 'reunion', 'webinaire']);
            $table->date('date');
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->string('lieu')->nullable();
            $table->string('lien')->nullable();
            $table->foreignId('cours_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('instructeur_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->enum('statut', ['a_venir', 'en_cours', 'termine', 'annule'])->default('a_venir');
            $table->boolean('rappel')->default(false);
            $table->enum('priorite', ['basse', 'moyenne', 'haute'])->default('moyenne');
            $table->timestamp('date_creation');
            $table->boolean('visible')->default(true);
            $table->timestamps();

            $table->index(['date', 'statut']);
            $table->index(['cours_id', 'type']);
            $table->index(['instructeur_id']);
            $table->index(['type']);
            $table->index(['statut']);
            $table->index(['priorite']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evenements');
    }
};
