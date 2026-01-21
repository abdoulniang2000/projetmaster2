<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->string('type')->after('id');
            $table->string('titre')->after('type');
            $table->json('metadonnees')->nullable()->after('contenu');
            $table->boolean('is_push')->default(false)->after('metadonnees');
            $table->boolean('is_email')->default(false)->after('is_push');
            $table->timestamp('sent_at')->nullable()->after('is_email');
            $table->morphs('notifiable');
        });
    }

    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropColumn(['type', 'titre', 'metadonnees', 'is_push', 'is_email', 'sent_at']);
            $table->dropMorphs(['notifiable']);
        });
    }
};
