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
        Schema::create('forums', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description');
            $table->foreignId('cours_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('createur_id')->constrained('users')->onDelete('cascade');
            $table->enum('categorie', ['General', 'Questions techniques', 'Projets', 'Examens', 'Ressources']);
            $table->enum('statut', ['ouvert', 'ferme', 'epingle'])->default('ouvert');
            $table->integer('nombre_messages')->default(0);
            $table->integer('nombre_participants')->default(0);
            $table->timestamp('date_creation');
            $table->timestamp('dernier_message_date')->nullable();
            $table->string('dernier_message_auteur')->nullable();
            $table->text('dernier_message_contenu')->nullable();
            $table->boolean('visible')->default(true);
            $table->timestamps();

            $table->index(['cours_id', 'statut']);
            $table->index(['createur_id']);
            $table->index(['categorie']);
            $table->index(['statut']);
            $table->index(['date_creation']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('forums');
    }
};
