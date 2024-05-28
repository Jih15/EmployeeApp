<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\gaji;
use Illuminate\Http\Request;

class gajiApi extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $gaji = gaji::orderBy('id_gaji', 'asc')->get();
        return response()->json([
            'status' => true,
            'message' => 'Success',
            'data' => $gaji
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
    public function show(string $id_gaji)
    {
        $gaji = gaji::find($id_gaji);
        if($gaji){
            return response()->json([
                'status' => true,
                'message' => 'Data berhasil ditemukan',
                'data' => $gaji
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

