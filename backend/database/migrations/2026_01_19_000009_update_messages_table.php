<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->string('sujet')->nullable()->after('contenu');
            $table->json('tags')->nullable()->after('destinataire_id');
            $table->boolean('is_urgent')->default(false)->after('tags');
            $table->boolean('is_read')->default(false)->after('is_urgent');
            $table->timestamp('read_at')->nullable()->after('is_read');
            $table->foreignId('groupe_id')->nullable()->after('destinataire_id')->constrained('cours')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['groupe_id']);
            $table->dropColumn(['sujet', 'tags', 'is_urgent', 'is_read', 'read_at', 'groupe_id']);
        });
    }
};
