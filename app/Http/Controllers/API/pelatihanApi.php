<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\pelatihan;
use Illuminate\Http\Request;

class pelatihanApi extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $plth = pelatihan::orderBy('id_pelatihan', 'asc')->get();
        return response()->json([
            'status' => true,
            'message' => 'Success',
            'data' => $plth
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
    public function show(string $id_pelatihan)
    {
        $plth = pelatihan::find($id_pelatihan);
        if($plth){
            return response()->json([
                'status' => true,
                'message' => 'Data berhasil ditemukan',
                'data' => $plth
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
