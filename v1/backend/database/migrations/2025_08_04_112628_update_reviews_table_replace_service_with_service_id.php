<?php

use App\Models\Service;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::table('reviews', function (Blueprint $table) {
        $table->dropColumn('service');
        $table->foreignIdFor(Service::class)->nullable()->constrained()->onDelete('set null');
    });
}

public function down()
{
    Schema::table('reviews', function (Blueprint $table) {
        $table->dropForeign(['service_id']);
        $table->dropColumn('service_id');
        $table->string('service')->nullable();
    });
}

};
