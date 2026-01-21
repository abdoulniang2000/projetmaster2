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
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description')->nullable();
            $table->enum('type', ['prive', 'groupe', 'matiere'])->default('prive');
            $table->foreignId('cours_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('createur_id')->constrained('users')->onDelete('cascade');
            $table->enum('statut', ['actif', 'archive', 'ferme'])->default('actif');
            $table->timestamp('dernier_message_date')->nullable();
            $table->string('dernier_message_contenu')->nullable();
            $table->string('dernier_message_auteur')->nullable();
            $table->integer('nombre_messages')->default(0);
            $table->integer('nombre_participants')->default(0);
            $table->boolean('visible')->default(true);
            $table->timestamps();

            $table->index(['type', 'statut']);
            $table->index(['createur_id']);
            $table->index(['cours_id']);
            $table->index(['dernier_message_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
