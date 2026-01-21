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
        Schema::create('devoirs', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description');
            $table->enum('type', ['devoir', 'projet', 'examen']);
            $table->foreignId('cours_id')->constrained()->onDelete('cascade');
            $table->foreignId('instructeur_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('date_publication');
            $table->timestamp('date_limite');
            $table->integer('ponderation')->default(20);
            $table->text('instructions')->nullable();
            $table->string('fichier_instructions_path')->nullable();
            $table->boolean('visible')->default(true);
            $table->timestamps();

            $table->index(['cours_id', 'type']);
            $table->index(['instructeur_id']);
            $table->index(['date_limite']);
            $table->index(['type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devoirs');
    }
};
