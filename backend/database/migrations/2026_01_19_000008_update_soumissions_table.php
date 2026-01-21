<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('soumissions', function (Blueprint $table) {
            $table->integer('version')->default(1)->after('etudiant_id');
            $table->text('commentaire')->nullable()->after('fichier');
            $table->boolean('is_late')->default(false)->after('commentaire');
            $table->timestamp('date_soumission')->useCurrent()->after('is_late');
        });
    }

    public function down(): void
    {
        Schema::table('soumissions', function (Blueprint $table) {
            $table->dropColumn(['version', 'commentaire', 'is_late', 'date_soumission']);
        });
    }
};
