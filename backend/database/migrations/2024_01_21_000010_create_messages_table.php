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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained()->onDelete('cascade');
            $table->foreignId('expediteur_id')->constrained('users')->onDelete('cascade');
            $table->text('contenu');
            $table->enum('type', ['texte', 'fichier', 'image', 'lien'])->default('texte');
            $table->string('fichier_path')->nullable();
            $table->string('fichier_nom')->nullable();
            $table->string('fichier_taille')->nullable();
            $table->string('lien_url')->nullable();
            $table->string('lien_titre')->nullable();
            $table->boolean('est_edite')->default(false);
            $table->timestamp('date_edition')->nullable();
            $table->boolean('est_supprime')->default(false);
            $table->timestamp('date_suppression')->nullable();
            $table->timestamp('date_envoi');
            $table->boolean('visible')->default(true);
            $table->timestamps();

            $table->index(['conversation_id', 'date_envoi']);
            $table->index(['expediteur_id']);
            $table->index(['type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
