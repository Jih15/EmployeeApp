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
        Schema::create('karyawans', function (Blueprint $table) {
            $table->increments('id_karyawan');
            $table->unsignedInteger('id_user');
            $table->foreign('id_user')->references('id_user')->on('users');
            $table->string('nama_depan', 20);
            $table->string('nama_belakang', 35);
            $table->unsignedInteger('id_posisi');
            $table->unsignedInteger('id_manager')->nullable();
            $table->foreign('id_posisi')->references('id_posisi')->on('posisis');
            $table->foreign('id_manager')->references('id_karyawan')->on('karyawans')->nullable();
            $table->char('jenis_kelamin', 10);
            $table->date('tgl_lahir');
            $table->string('alamat', 130);
            $table->string('no_telp', 15);
            $table->string('email', 40);
            $table->date('tgl_masuk');
            $table->string('foto', 500);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('karyawans');
    }
};
