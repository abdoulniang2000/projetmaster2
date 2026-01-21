<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cours', function (Blueprint $table) {
            $table->foreignId('module_id')->nullable()->after('id')->constrained()->onDelete('cascade');
            $table->foreignId('matiere_id')->nullable()->after('module_id')->constrained()->onDelete('cascade');
            $table->foreignId('semestre_id')->nullable()->after('matiere_id')->constrained()->onDelete('cascade');
            $table->string('code')->unique()->after('nom');
            $table->integer('credits')->default(1)->after('description');
            $table->boolean('is_active')->default(true)->after('credits');
        });
    }

    public function down(): void
    {
        Schema::table('cours', function (Blueprint $table) {
            $table->dropForeign(['module_id']);
            $table->dropForeign(['matiere_id']);
            $table->dropForeign(['semestre_id']);
            $table->dropColumn(['module_id', 'matiere_id', 'semestre_id', 'code', 'credits', 'is_active']);
        });
    }
};
