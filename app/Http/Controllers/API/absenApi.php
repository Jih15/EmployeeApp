<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\absen;
use Illuminate\Http\Request;

class absenApi extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $abs = absen::orderBy('id_absen')->get();
        return response()->json([
            'status' => true,
            'message' => 'Success',
            'data' => $abs
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'id_karyawan' => 'required',
            'tanggal_absen' => 'required',
            'jam_masuk' => 'required',
            'jam_keluar' => 'required'
        ]);

        $dataabs = new Absen;

        $dataabs->id_karyawan = $validatedData['id_karyawan'];
        $dataabs->tanggal_absen = $validatedData['tanggal_absen'];
        $dataabs->jam_masuk = $validatedData['jam_masuk'];
        $dataabs->jam_keluar = $validatedData['jam_keluar'];
        $dataabs->status = 'Hadir';

        $dataabs->save();

        return response()->json([
            'message' => 'Absensi berhasil disimpan.'
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id_absen)
    {
        $absensi = Absen::where('id_karyawan', $id_absen)->get();
        if ($absensi->isEmpty()) {
            return response()->json([
                'message' => 'Tidak ada data absensi untuk karyawan dengan ID ' . $id_absen
            ], 404);
        }
        return response()->json([
            'absensi' => $absensi
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
