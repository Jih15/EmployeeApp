<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\cuti;
use Carbon\Carbon;
use Illuminate\Http\Request;

class cutiApi extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cuti = cuti::orderBy('id_cuti', 'asc')->get();
        return response()->json([
            'status' => true,
            'message' => 'Success',
            'data' => $cuti
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request -> validate([
            'id_karyawan' => 'required',
            'tgl_mulai' => 'required|date',
            'tgl_Selesai' => 'required|date|after:tgl_mulai',
            'keterangan_cuti' => 'required'
        ]);

        $lama_cuti = $this->hitungLamaCuti($request->tanggal_mulai, $request->tanggal_selesai);

        $cuti = cuti::where('id_karyawan', $request->id_karyawan)->first();
        // $sisaJatah = $cuti ? $cuti;
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id_cuti)
    {
        $cuti = cuti::find($id_cuti);
        if($cuti){
            return response()->json([
                'status' => true,
                'message' => 'Data berhasil ditemukan',
                'data' => $cuti
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

    private function hitungLamaCuti($tanggal_mulai,$tanggal_selesai)
    {
        $tgl_mulai = Carbon::parse($tanggal_mulai);
        $tgl_selesai = Carbon::parse($tanggal_selesai);

        $lamaCuti = 0;

        $tanggal = $tgl_mulai->copy();
        while ($tanggal->lte($tgl_selesai)){
            if ($tanggal->isWeekday()){
                $lamaCuti++;
            }
            $tanggal->addDay();
        }
        return $lamaCuti;
    }
}
