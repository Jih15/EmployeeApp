<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use App\Models\evaluasi;
use App\Models\gaji;
use App\Models\karyawan;
use App\Models\posisi;
use Illuminate\Http\Request;

class gajiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $gajis = gaji::orderBy('id_gaji')->get();
        $karyawans = karyawan::all();
        $posisi = posisi::all();
        $evaluasi = evaluasi::all();
        return view('backend.gaji.gajiGet', [
            'gajis' => $gajis,
            'karyawans' => $karyawans,
            'posisis' => $posisi,
            'evaluasi' => $evaluasi
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('backend.gaji.gajiCreate');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'id_karyawan' => 'required|integer',
            'gaji_pokok' => 'required|numeric',
            'tanggal_penggajian' => 'required|date',
        ]);

        // Hitung tunjangan (10% dari gaji pokok)
        $tunjangan = $validatedData['gaji_pokok'] * 0.1;

        // Dapatkan nilai penilaian kinerja dari tabel evaluasi berdasarkan ID karyawan
        $evaluasi = evaluasi::where('id_karyawan', $validatedData['id_karyawan'])->first();

        // Inisialisasi bonus
        $bonus = 0;

        // Jika nilai penilaian kinerja ada
        if ($evaluasi) {
            $nilai_penilaian = $evaluasi->penilaian_kinerja;

            // Hitung bonus berdasarkan nilai penilaian kinerja
            if ($nilai_penilaian < 65) {
                $bonus = 0;
            } elseif ($nilai_penilaian < 75) {
                $bonus = 200000;
            } else {
                $bonus = 500000;
            }

            // Tambahkan bonus ke tunjangan
            $new_tunjangan = $tunjangan + $bonus;
        }

        // Hitung PPH sesuai ketentuan
        $gaji_pokok = $validatedData['gaji_pokok'];
        if ($gaji_pokok <= 25000000) {
            $pph = $gaji_pokok * 0.05;
        } elseif ($gaji_pokok <= 50000000) {
            $pph = $gaji_pokok * 0.15;
        } elseif ($gaji_pokok <= 100000000) {
            $pph = $gaji_pokok * 0.25;
        } else {
            $pph = $gaji_pokok * 0.3;
        }

        // Tambahkan PPH ke dalam potongan gaji dari cuti
        $potongan_gaji = $pph;

        // Hitung total gaji
        $total_gaji = $validatedData['gaji_pokok'] + $tunjangan - $potongan_gaji;

        // Simpan data gaji ke dalam tabel gaji
        $gaji = new Gaji();
        $gaji->id_karyawan = $validatedData['id_karyawan'];
        $gaji->gaji_pokok = $validatedData['gaji_pokok'];
        $gaji->tunjangan = $new_tunjangan;
        $gaji->bonus = $bonus;
        $gaji->potongan = $potongan_gaji;
        $gaji->total_gaji = $total_gaji;
        $gaji->tanggal_penggajian = $validatedData['tanggal_penggajian'];
        $gaji->save();

        // Redirect atau response sesuai kebutuhan
        return redirect('/gaji')->with('pesan', 'Data Berhasil Dihitung dan Disimpan.');
    }

    public function getGaji($id_karyawan)
    {
        $karyawan = Karyawan::find($id_karyawan);

        if ($karyawan) {
            $posisi = $karyawan->posisi;

            if ($posisi) {
                $gaji_pokok = $posisi->gaji_pokok;
                return response()->json(['gaji_pokok' => $gaji_pokok]);
            }
        }

        return response()->json(['error' => 'Gaji pokok not found'], 404);
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
    public function destroy(string $id_gaji)
    {
        gaji::destroy($id_gaji);
        return redirect('/gaji')->with('success', 'Data berhasil dihapus.');
    }
}
