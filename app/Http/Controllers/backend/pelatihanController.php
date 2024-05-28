<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use App\Models\karyawan;
use App\Models\pelatihan;
use Illuminate\Http\Request;

class pelatihanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pelatihans = pelatihan::orderBy('id_pelatihan')->get();
        $karyawans = karyawan::all();
        return view('backend.pelatihan.pelatihanGet',[
            'karyawans' => $karyawans,
            'pelatihans' => $pelatihans,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('backend.pelatihan.pelatihanCreate');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'id_karyawan' => 'required',
            'nama_pelatihan' => 'required',
            'tgl_pelatihan' => 'required',
            'lokasi_pelatihan' => 'required',
            'lama_pelatihan' => 'required',
        ]);

        pelatihan::create($validatedData);
        return redirect('/pelatihan')->with('pesan','Data Berhasil di Simpan');
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
    public function edit(string $id)
    {
        //
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
    public function destroy(string $id_pelatihan)
    {
        pelatihan::destroy($id_pelatihan);
        return redirect('/pelatihan')->with('success', 'Data berhasil dihapus.');
    }
}
