<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use App\Models\evaluasi;
use App\Models\karyawan;
use Illuminate\Http\Request;

class evaluasiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $evaluasis = evaluasi::orderBy('id_evaluasi')->get();
        $karyawans = karyawan::all();
        return view('backend.evaluasi.evaluasiGet',[
            'karyawans' => $karyawans,
            'evaluasis' => $evaluasis,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('backend.evaluasi.evaluasiCreate');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'id_karyawan' => 'required',
            'tahun_evaluasi' => 'required',
            'penilaian_kinerja' => 'required',
            'catatan' => 'required',
        ]);

        evaluasi::create($validatedData);
        return redirect('/evaluasi')->with('pesan','Data Berhasil di Simpan');
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
    public function edit(string $id_evaluasi)
    {
        $evaluasi = evaluasi::find($id_evaluasi);
        return response()->json($evaluasi);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id_evaluasi)
    {
        $validatedData = $request->validate([
            'id_karyawan' => 'required',
            'tahun_evaluasi' => 'required',
            'penilaian_kinerja' => 'required',
            'catatan' => 'required',
        ]);

        try {
            evaluasi::where('id_evaluasi', $id_evaluasi)->update($validatedData);
            return redirect('/evaluasi')->with('success', 'Data berhasil diubah.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui data.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id_evaluasi)
    {
        evaluasi::destroy($id_evaluasi);
        return redirect('/evaluasi')->with('success', 'Data berhasil dihapus.');
    }
}
