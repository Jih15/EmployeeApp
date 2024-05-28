<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use App\Models\department;
use App\Models\posisi;
use Illuminate\Http\Request;

class posisiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posisis = posisi::orderBy('id_posisi')->get();
        $departments = department::all();
        return view('backend.posisi.posisiGet', compact('posisis', 'departments'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'id_department' => 'required',
            'nama_posisi' => 'required',
            'gaji_pokok' => 'required'
        ]);

        posisi::create($validatedData);
        return redirect('/posisi')->with('pesan', 'Data Berhasil di Simpan');
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
    public function edit(string $id_posisi)
    {
        $posisi = posisi::find($id_posisi);
        return response()->json($posisi);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id_posisi)
    {
        $validatedData = $request->validate([
            'id_department' => 'required',
            'nama_posisi' => 'required',
            'gaji_pokok' => 'required'
        ], [
            'id_department.required' => 'Department wajib diisi.',
            'nama_posisi.required' => 'Posisi wajib diisi.'
        ]);

        try {
            posisi::where('id_posisi', $id_posisi)->update($validatedData);
            return redirect('/posisi')->with('success', 'Data berhasil diubah.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui data.');
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(posisi $posisi)
    {
        $posisi->delete();
        return redirect('/posisi')->with('success', 'Posisi berhasil dihapus.');
    }
}

