<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('devoirs', function (Blueprint $table) {
            $table->integer('note_maximale')->default(20)->after('description');
            $table->boolean('is_published')->default(false)->after('date_limite');
            $table->boolean('allow_late_submission')->default(false)->after('is_published');
            $table->text('instructions')->nullable()->after('note_maximale');
        });
    }

    public function down(): void
    {
        Schema::table('devoirs', function (Blueprint $table) {
            $table->dropColumn(['note_maximale', 'is_published', 'allow_late_submission', 'instructions']);
        });
    }
};
