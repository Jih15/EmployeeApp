<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\posisi;
use Illuminate\Http\Request;

class posisiApi extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posisi = posisi::orderBy('id_posisi', 'asc')->get();
        return response()->json([
            'status' => true,
            'message' => 'Success',
            'data' => $posisi
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id_posisi)
    {
        $posisi = posisi::find($id_posisi);
        if($posisi){
            return response()->json([
                'status' => true,
                'message' => 'Data berhasil ditemukan',
                'data' => $posisi
            ], 200);
        }
        else{
            return response()->json([
                'status' => false,
                'message' => 'Data gagal ditemukan'
            ], 404);
        }
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
