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
        Schema::create('forum_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('forum_id')->constrained()->onDelete('cascade');
            $table->foreignId('auteur_id')->constrained('users')->onDelete('cascade');
            $table->text('contenu');
            $table->foreignId('parent_id')->nullable()->constrained('forum_messages')->onDelete('cascade');
            $table->integer('nombre_likes')->default(0);
            $table->timestamp('date_creation');
            $table->boolean('visible')->default(true);
            $table->timestamps();

            $table->index(['forum_id', 'parent_id']);
            $table->index(['auteur_id']);
            $table->index(['date_creation']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('forum_messages');
    }
};
