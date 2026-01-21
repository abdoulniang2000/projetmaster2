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
        Schema::create('inscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('etudiant_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('cours_id')->constrained()->onDelete('cascade');
            $table->timestamp('date_inscription')->default(now());
            $table->boolean('active')->default(true);
            $table->timestamps();
            
            $table->unique(['etudiant_id', 'cours_id']);
            $table->index(['cours_id', 'active']);
            $table->index(['etudiant_id', 'active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscriptions');
    }
};
