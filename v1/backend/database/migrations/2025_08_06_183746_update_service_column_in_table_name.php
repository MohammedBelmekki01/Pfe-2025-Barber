<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateServiceColumnInTableName extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('reservations', function (Blueprint $table) {
            // Drop the 'service' column
            $table->dropColumn('service');

            // Add the 'service_id' column (adjust type as needed)
            $table->unsignedBigInteger('service_id');

            // If necessary, you can add a foreign key constraint
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('reservations', function (Blueprint $table) {
            // Reverse the changes: drop the 'service_id' and re-add 'service'
            $table->dropForeign(['service_id']);  // Drop the foreign key constraint (if added)
            $table->dropColumn('service_id');
            $table->string('service');  // Or whatever the original type of the 'service' column was
        });
    }
}
