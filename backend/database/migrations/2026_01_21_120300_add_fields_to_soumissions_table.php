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
        Schema::table('soumissions', function (Blueprint $table) {
            $table->text('commentaire')->nullable()->after('fichier');
            $table->timestamp('date_correction')->nullable()->after('updated_at');
            $table->boolean('corrige')->default(false)->after('date_correction');
            
            $table->index('corrige');
            $table->index('date_correction');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('soumissions', function (Blueprint $table) {
            $table->dropColumn(['commentaire', 'date_correction', 'corrige']);
        });
    }
};
