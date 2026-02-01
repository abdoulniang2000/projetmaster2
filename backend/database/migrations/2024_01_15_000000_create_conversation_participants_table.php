<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('conversation_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('role')->default('membre'); // admin, membre, enseignant
            $table->timestamp('date_adhesion')->default(now());
            $table->timestamp('derniere_lecture')->nullable();
            $table->integer('nombre_messages_non_lus')->default(0);
            $table->boolean('active')->default(true);
            $table->boolean('silencieux')->default(false);
            $table->boolean('a_quitté')->default(false);
            $table->timestamps();

            $table->unique(['conversation_id', 'user_id']);
            $table->index(['conversation_id', 'active']);
            $table->index(['user_id', 'active']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('conversation_participants');
    }
};
