<?php

use App\Http\Controllers\API\absenApi;
use App\Http\Controllers\API\departmentApi;
use App\Http\Controllers\API\evaluasiApi;
use App\Http\Controllers\API\gajiApi;
use App\Http\Controllers\API\karyawanApi;
use App\Http\Controllers\API\posisiApi;
use App\Http\Controllers\API\userApi;
use App\Http\Controllers\main\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//Login Berdasarkan ID User
Route::post('/login', [AuthController::class, 'login']);
Route::get('/karyawan/user/{id_user}', [karyawanApi::class, 'getKaryawanByUserId']);

//API Department
Route::get('/department', [departmentApi::class, 'index']);
Route::get('department/{id_department}', [departmentApi::class, 'show']);

//API Evaluasi
Route::get('/evaluasi', [evaluasiApi::class, 'index']);
Route::get('/evaluasi/{id_evaluasi}', [evaluasiApi::class, 'show']);

//API Absen
Route::get('/absen/{id_absen}', [absenApi::class, 'show']);
Route::post('/absen', [absenApi::class, 'store']);


//API User
Route::get('/user', [userApi::class, 'index']);
Route::get('/user/{id_user}', [userApi::class, 'show']);
Route::put('/user/{id_user}', [userApi::class, 'update']);


//API Posisi
Route::get('/posisi', [posisiApi::class, 'index']);
Route::get('/posisi/{id_posisi}', [posisiApi::class, 'show']);


//API Gaji
Route::get('/gaji', [gajiApi::class, 'index']);
Route::get('/gaji/{id_gaji}', [gajiApi::class, 'show']);

//API Karyawan
Route::get('/karyawan', [karyawanApi::class, 'index']);
Route::get('/karyawan/{id_karyawan}', [karyawanApi::class, 'show']);
Route::post('/karyawan', [karyawanApi::class, 'store']);
Route::put('/karyawan/{id_karyawan}', [karyawanApi::class, 'update']);

