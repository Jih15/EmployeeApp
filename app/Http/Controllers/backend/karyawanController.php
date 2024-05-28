<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use App\Models\karyawan;
use App\Models\posisi;
use App\Models\User;
use Illuminate\Http\Request;

class karyawanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $karyawans = karyawan::orderBy('id_karyawan')->get();
        $users = User::all();
        $posisi = posisi::all();
        return view('backend.karyawan.karyawanGet',[
            'karyawans' => $karyawans,
            'user' => $users,
            'posisis' => $posisi
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('backend.karyawan.karyawanCreate');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'id_user' => 'required',
            'nama_depan' => 'required',
            'nama_belakang' => 'required',
            'id_posisi' => 'required',
            'id_manager' => 'nullable',
            'jenis_kelamin' => 'required',
            'tgl_lahir' => 'required',
            'alamat' => 'required',
            'no_telp' => 'required',
            'email' => 'required|email',
            'tgl_masuk' => 'required',
            'foto' => 'required'
        ]);

        karyawan::create($validatedData);
        return redirect('/karyawan')->with('pesan','Data Berhasil di Simpan');
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
    public function edit(string $id_karyawan)
    {
        $karyawan = karyawan::find($id_karyawan);
        return response()->json($karyawan);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id_karyawan)
    {
        $validatedData = $request->validate([
            'id_user' => 'required',
            'nama_depan' => 'required',
            'nama_belakang' => 'required',
            'id_posisi' => 'required',
            'id_manager' => 'nullable',
            'jenis_kelamin' => 'required',
            'tgl_lahir' => 'required',
            'alamat' => 'required',
            'no_telp' => 'required',
            'email' => 'required|email',
            'tgl_masuk' => 'required',
            'foto' => 'required'
        ]);

        try {
            karyawan::where('id_karyawan', $id_karyawan)->update($validatedData);
            return redirect('/karyawan')->with('success', 'Data berhasil diubah.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui data.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id_karyawan)
    {
        karyawan::destroy($id_karyawan);
        return redirect('/karyawan')->with('success', 'Data berhasil dihapus.');
    }
}
