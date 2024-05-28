<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use App\Models\cuti;
use App\Models\karyawan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class cutiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $karyawans = karyawan::all();
        $cutis = cuti::orderBy('id_cuti')->get();
        return view('backend.cuti.cutiGet',[
            'cutis'=> $cutis,
            'karyawans' => $karyawans
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('backend.cuti.cutiCreate');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'id_karyawan' => 'required',
            'tgl_mulai' => 'required',
            'tgl_selesai' => 'required',
            'jenis_cuti' => 'required',
            'status' => 'required'
        ]);

        cuti::create($validatedData);
        return redirect('/cuti')->with('success', 'Department berhasil ditambahkan.');
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
    public function edit(string $id_cuti)
    {
        $cuti = cuti::find($id_cuti);
        if (!$cuti) {
            return response()->json(['error' => 'Data cuti tidak ditemukan.'], 404);
        }
        return response()->json($cuti);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id_cuti)
    {
        $validator = Validator::make($request->all(), [
            'id_karyawan' => 'required',
            'tgl_mulai' => 'required',
            'tgl_selesai' => 'required',
            'jenis_cuti' => 'required',
            'status' => 'required'
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $cuti = cuti::find($id_cuti);

        if (!$cuti) {
            return redirect('/cuti')->with('error', 'Data cuti tidak ditemukan.');
        }

        $cuti->update($request->only(['id_karyawan','tgl_mulai','tgl_selesai','jenis_cuti','status']));
        return redirect('/cuti')->with('success', 'Data berhasil diubah.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id_cuti)
    {
        cuti::destroy($id_cuti);
        return redirect('/cuti')->with('success', 'Data berhasil dihapus.');
    }
}
