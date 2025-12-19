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
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->after('id');
            $table->string('last_name')->after('first_name');
            $table->string('phone')->nullable()->after('email');
            $table->string('address')->nullable()->after('phone');
            $table->string('city')->nullable()->after('address');
            $table->string('country')->nullable()->after('city');
            $table->string('postal_code', 20)->nullable()->after('country');
            $table->text('about')->nullable()->after('postal_code');
            $table->string('avatar')->nullable()->after('about');
            $table->boolean('status')->default(true)->after('avatar');
            $table->timestamp('last_login_at')->nullable()->after('status');
            $table->string('last_login_ip')->nullable()->after('last_login_at');
            
            // Renommer le champ name en username
            $table->renameColumn('name', 'username');
            
            // Ajouter les index
            $table->index('status');
            $table->index('email');
            $table->index('username');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'last_name',
                'phone',
                'address',
                'city',
                'country',
                'postal_code',
                'about',
                'avatar',
                'status',
                'last_login_at',
                'last_login_ip',
            ]);
            
            $table->renameColumn('username', 'name');
            
            $table->dropIndex(['status']);
            $table->dropIndex(['email']);
            $table->dropIndex(['username']);
        });
    }
};
