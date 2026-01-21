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
        Schema::create('soumissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('devoir_id')->constrained()->onDelete('cascade');
            $table->foreignId('etudiant_id')->constrained('users')->onDelete('cascade');
            $table->string('fichier_path');
            $table->string('fichier_nom');
            $table->string('fichier_taille');
            $table->text('commentaire')->nullable();
            $table->integer('version')->default(1);
            $table->enum('statut', ['en_attente', 'corrige', 'rejete'])->default('en_attente');
            $table->decimal('note', 5, 2)->nullable();
            $table->text('feedback')->nullable();
            $table->timestamp('date_soumission');
            $table->timestamp('date_correction')->nullable();
            $table->foreignId('correcteur_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->unique(['devoir_id', 'etudiant_id', 'version']);
            $table->index(['devoir_id', 'etudiant_id']);
            $table->index(['statut']);
            $table->index(['date_soumission']);
            $table->index(['etudiant_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('soumissions');
    }
};
