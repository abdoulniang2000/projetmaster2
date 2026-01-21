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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('message');
            $table->enum('type', ['info', 'success', 'warning', 'error']);
            $table->enum('categorie', ['cours', 'devoir', 'note', 'forum', 'systeme']);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('lue')->default(false);
            $table->enum('priorite', ['basse', 'moyenne', 'haute'])->default('moyenne');
            $table->string('action_url')->nullable();
            $table->string('action_label')->nullable();
            $table->timestamp('date_creation');
            $table->timestamp('expire_le')->nullable();
            $table->boolean('visible')->default(true);
            $table->timestamps();

            $table->index(['user_id', 'lue']);
            $table->index(['categorie']);
            $table->index(['type']);
            $table->index(['priorite']);
            $table->index(['date_creation']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
