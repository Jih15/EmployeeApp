<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\evaluasi;
use Illuminate\Http\Request;

class evaluasiApi extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $eval = evaluasi::orderBy('id_evaluasi', 'asc')->get();
        return response()->json([
            'status' => true,
            'message' => 'Success',
            'data' => $eval
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
    public function show(string $id_evaluasi)
    {
        $eval = evaluasi::find($id_evaluasi);
        if($eval){
            return response()->json([
                'status' => true,
                'message' => 'Data berhasil ditemukan',
                'data' => $eval
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
