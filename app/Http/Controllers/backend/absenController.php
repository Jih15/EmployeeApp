<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use App\Models\absen;
use App\Models\karyawan;
use Illuminate\Http\Request;

class absenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $absens = absen::orderBy('id_absen')->get();
        $karyawans = karyawan::all();
        return view('backend.absen.absenGet', [
            'absens' => $absens,
            'karyawans' => $karyawans
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('backend.absen.absenCreate');
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
            'jam_keluar' => 'required',
            'status' => 'required',
        ]);

        absen::create($validatedData);
        return redirect('/absen')->with('pesan', 'Data Berhasil di Simpan');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id_absen)
    {
        $absen = absen::find($id_absen);
        return response()->json($absen);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id_absen)
    {
        $validatedData = $request->validate([
            'id_karyawan' => 'required',
            'tanggal_absen' => 'required',
            'jam_masuk' => 'required',
            'jam_keluar' => 'required',
            'status' => 'required'
        ]);

        try {
            absen::where('id_absen', $id_absen)->update($validatedData);
            return redirect('/absen')->with('success', 'Data berhasil diubah.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui data.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id_absen)
    {
        absen::destroy($id_absen);
        return redirect('/absen')->with('success', 'Data berhasil dihapus.');
    }
}

