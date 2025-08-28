<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('barbers', function (Blueprint $table) {
            // remove old location field
            if (Schema::hasColumn('barbers', 'location')) {
                $table->dropColumn('location');
            }

            // add new fields
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('barbers', function (Blueprint $table) {
            $table->string('location')->nullable();

            $table->dropColumn(['latitude', 'longitude']);
        });
    }
};
