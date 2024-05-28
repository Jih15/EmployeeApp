<?php

use App\Http\Controllers\backend\absenController;
use App\Http\Controllers\backend\cutiController;
use App\Http\Controllers\backend\departmentController;
use App\Http\Controllers\backend\evaluasiController;
use App\Http\Controllers\backend\gajiController;
use App\Http\Controllers\backend\karyawanController;
use App\Http\Controllers\backend\pelatihanController;
use App\Http\Controllers\backend\posisiController;
use App\Http\Controllers\backend\userController;
use App\Http\Controllers\main\dashboardController;
use App\Http\Controllers\main\loginController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/template', function () {
    return view('template');
});

//Dashboard
Route::get('/', [dashboardController::class, 'index']);

///Karyawan///
Route::resource('/karyawan', karyawanController::class);

///User///
Route::resource('/user', userController::class);

//Department
Route::resource('/department', departmentController::class);

//Posisi
Route::resource('/posisi', posisiController::class);

//Gaji
Route::resource('/gaji', gajiController::class);
Route::get('/get-gaji/{id_karyawan}', [gajiController::class, 'getGaji']); //mendapatkan gaji karyawan

//Absen
Route::resource('/absen', absenController::class);

//evaluasi
Route::resource('/evaluasi', evaluasiController::class);

//pelatihan
Route::resource('/pelatihan', pelatihanController::class);

//cuti
Route::resource('/cuti', cutiController::class);

//Login
Route::get('/login', [loginController::class, 'login'])->name('login')->middleware('guest');
Route::post('login', [loginController::class, 'authenticate']);

Route::post('/logout', [loginController::class, 'logout']);
