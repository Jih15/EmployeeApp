<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\karyawan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class karyawanApi extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pgw = karyawan::orderBy('id_karyawan', 'asc')->get();
        return response()->json([
            'status' => true,
            'message' => 'Success',
            'data' => $pgw
        ], 200);
    }

    public function getKaryawanByUserId($user_id)
    {
        $pgw = karyawan::where('id_user', $user_id)->first();
        if ($pgw) {
            return response()->json([
                'status' => true,
                'message' => 'Data berhasil ditemukan',
                'data' => $pgw
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Data gagal ditemukan'
            ], 404);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $datapgw = new karyawan;
        $rules = [
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
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Data gagal disimpan',
                'data' => $validator->errors()
            ]);
        }

        $datapgw->id_user = $request->id_user;
        $datapgw->nama_depan = $request->nama_depan;
        $datapgw->nama_belakang = $request->nama_belakang;
        $datapgw->id_posisi = $request->id_posisi;
        $datapgw->id_manager = $request->id_manager;
        $datapgw->jenis_kelamin = $request->jenis_kelamin;
        $datapgw->tgl_lahir = $request->tgl_lahir;
        $datapgw->alamat = $request->alamat;
        $datapgw->no_telp = $request->no_telp;
        $datapgw->email = $request->email;
        $datapgw->tgl_masuk = $request->tgl_masuk;

        $post = $datapgw->save();
        return response()->json([
            'status' => true,
            'message' => 'Data berhasil disimpan',

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id_user)
    {
        $pgw = karyawan::where('id_user', $id_user);
        if ($pgw) {
            return response()->json([
                'status' => true,
                'message' => 'Data berhasil ditemukan',
                'data' => $pgw
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Data gagal ditemukan'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id_karyawan)
    {
        $datapgw = karyawan::find($id_karyawan);
        if (empty($datapgw)) {
            return response()->json([
                'status' => false,
                'message' => 'Data tidak ditemukan'
            ], 404);
        }
        $rules = [
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
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Data gagal diupdate',
                'data' => $validator->errors()
            ]);
        }

        $datapgw->id_user = $request->id_user;
        $datapgw->nama_depan = $request->nama_depan;
        $datapgw->nama_belakang = $request->nama_belakang;
        $datapgw->id_posisi = $request->id_posisi;
        $datapgw->id_manager = $request->id_manager;
        $datapgw->jenis_kelamin = $request->jenis_kelamin;
        $datapgw->tgl_lahir = $request->tgl_lahir;
        $datapgw->alamat = $request->alamat;
        $datapgw->no_telp = $request->no_telp;
        $datapgw->email = $request->email;
        $datapgw->tgl_masuk = $request->tgl_masuk;

        $post = $datapgw->save();
        return response()->json([
            'status' => true,
            'message' => 'Data berhasil diupdate',

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
