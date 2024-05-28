<?php

namespace App\Http\Controllers\main;

use App\Http\Controllers\Controller;
use App\Models\department;
use App\Models\evaluasi;
use App\Models\karyawan;
use App\Models\pelatihan;
use App\Models\posisi;
use Illuminate\Http\Request;

class dashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $karyawans = karyawan::paginate(5);
        $totalKaryawans = karyawan::count();
        $departments = department::all();
        $posisis = posisi::all();
        $evaluasis = evaluasi::orderBy('penilaian_kinerja', 'desc')->limit(3)->get();
        $pelatihans = pelatihan::all();
        return view('backend.dashboard.index',[
            'karyawans' => $karyawans,
            'totalKaryawans' => $totalKaryawans,
            'departments' => $departments,
            'posisis' => $posisis,
            'evaluasis' => $evaluasis,
            'pelatihans' => $pelatihans
        ]);
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
        //
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
    public function edit(string $id)
    {
        //
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
