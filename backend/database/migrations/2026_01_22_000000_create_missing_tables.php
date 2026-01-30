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
        // Créer la table semestres si elle n'existe pas
        if (!Schema::hasTable('semestres')) {
            Schema::create('semestres', function (Blueprint $table) {
                $table->id();
                $table->string('nom');
                $table->text('description')->nullable();
                $table->date('date_debut');
                $table->date('date_fin');
                $table->boolean('actif')->default(true);
                $table->timestamps();
            });
        }

        // Créer la table departements si elle n'existe pas
        if (!Schema::hasTable('departements')) {
            Schema::create('departements', function (Blueprint $table) {
                $table->id();
                $table->string('nom');
                $table->text('description')->nullable();
                $table->string('code')->unique();
                $table->timestamps();
            });
        }

        // Créer la table matieres si elle n'existe pas
        if (!Schema::hasTable('matieres')) {
            Schema::create('matieres', function (Blueprint $table) {
                $table->id();
                $table->string('nom');
                $table->text('description')->nullable();
                $table->string('code')->unique();
                $table->foreignId('departement_id')->nullable()->constrained('departements')->onDelete('set null');
                $table->timestamps();
            });
        }

        // Ajouter les champs manquants à la table cours
        if (Schema::hasTable('cours') && !Schema::hasColumn('cours', 'code')) {
            Schema::table('cours', function (Blueprint $table) {
                $table->string('code')->unique()->after('id');
                $table->foreignId('semestre_id')->nullable()->constrained('semestres')->onDelete('set null')->after('enseignant_id');
                $table->foreignId('matiere_id')->nullable()->constrained('matieres')->onDelete('set null')->after('semestre_id');
                $table->integer('credits')->default(3)->after('matiere_id');
                $table->string('niveau')->default('L1')->after('credits');
                $table->boolean('actif')->default(true)->after('niveau');
            });
        }

        // Ajouter les champs manquants à la table devoirs
        if (Schema::hasTable('devoirs') && !Schema::hasColumn('devoirs', 'type')) {
            Schema::table('devoirs', function (Blueprint $table) {
                $table->string('type')->default('devoir')->after('titre');
                $table->decimal('note_maximale', 5, 2)->default(20.00)->after('date_limite');
                $table->boolean('publie')->default(false)->after('note_maximale');
            });
        }

        // Créer la table inscriptions si elle n'existe pas
        if (!Schema::hasTable('inscriptions')) {
            Schema::create('inscriptions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('etudiant_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('cours_id')->constrained('cours')->onDelete('cascade');
                $table->date('date_inscription');
                $table->enum('statut', ['en_attente', 'accepte', 'rejete'])->default('en_attente');
                $table->timestamps();
                
                $table->unique(['etudiant_id', 'cours_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscriptions');
        
        if (Schema::hasTable('devoirs') && Schema::hasColumn('devoirs', 'type')) {
            Schema::table('devoirs', function (Blueprint $table) {
                $table->dropColumn(['type', 'note_maximale', 'publie']);
            });
        }
        
        if (Schema::hasTable('cours') && Schema::hasColumn('cours', 'code')) {
            Schema::table('cours', function (Blueprint $table) {
                $table->dropColumn(['code', 'semestre_id', 'matiere_id', 'credits', 'niveau', 'actif']);
            });
        }
        
        Schema::dropIfExists('matieres');
        Schema::dropIfExists('departements');
        Schema::dropIfExists('semestres');
    }
};
