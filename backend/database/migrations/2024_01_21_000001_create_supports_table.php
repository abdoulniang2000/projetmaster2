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
        Schema::create('supports', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description');
            $table->enum('type', ['pdf', 'ppt', 'video', 'image', 'document']);
            $table->string('fichier_path');
            $table->string('fichier_nom');
            $table->string('fichier_taille');
            $table->foreignId('cours_id')->constrained()->onDelete('cascade');
            $table->foreignId('instructeur_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('date_ajout');
            $table->integer('nombre_telechargements')->default(0);
            $table->string('categorie')->nullable();
            $table->boolean('visible')->default(true);
            $table->timestamps();

            $table->index(['cours_id', 'type']);
            $table->index(['instructeur_id']);
            $table->index(['type']);
            $table->index(['categorie']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supports');
    }
};
