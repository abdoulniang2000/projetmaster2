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
        Schema::create('annonces', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('contenu');
            $table->string('type'); // general, cours, urgent
            $table->foreignId('cours_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('enseignant_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('date_publication')->default(now());
            $table->timestamp('date_expiration')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
            
            $table->index(['enseignant_id', 'active']);
            $table->index('type');
            $table->index('date_publication');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('annonces');
    }
};
