<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('statistiques', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('cle');
            $table->integer('valeur')->default(0);
            $table->json('metadonnees')->nullable();
            $table->date('date_stat');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('cours_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('activites', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->text('description');
            $table->json('donnees')->nullable();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->morphs('concernable');
            $table->timestamp('date_activite');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activites');
        Schema::dropIfExists('statistiques');
    }
};
