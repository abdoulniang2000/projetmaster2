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
        Schema::create('message_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('message_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('tag'); // #urgent, #annonce, #projet, etc.
            $table->string('couleur')->default('#3b82f6'); // Couleur du tag
            $table->timestamp('date_creation');
            $table->timestamps();

            $table->index(['message_id']);
            $table->index(['user_id']);
            $table->index(['tag']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('message_tags');
    }
};
