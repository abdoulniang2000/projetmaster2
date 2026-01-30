<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            // Ajouter le champ nom
            $table->string('nom')->after('id');
            
            // Rendre les anciens champs nullable pour ne pas perdre de données
            $table->foreignId('cours_id')->nullable()->change();
            $table->string('titre')->nullable()->change();
            $table->text('contenu')->nullable()->change();
            $table->integer('ordre')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->dropColumn('nom');
            
            // Remettre les champs comme requis
            $table->foreignId('cours_id')->nullable(false)->change();
            $table->string('titre')->nullable(false)->change();
            $table->text('contenu')->nullable(false)->change();
            $table->integer('ordre')->nullable(false)->change();
        });
    }
};
