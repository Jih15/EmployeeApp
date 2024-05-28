<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\department;
use Illuminate\Http\Request;

class departmentApi extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $dpt = department::orderBy('id_department', 'asc')->get();
        return response()->json([
            'status' => true,
            'message' => 'Success',
            'data' => $dpt
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
    public function show(string $id_department)
    {
        $dpt = department::find($id_department);
        if($dpt){
            return response()->json([
                'status' => true,
                'message' => 'Data berhasil ditemukan',
                'data' => $dpt
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
