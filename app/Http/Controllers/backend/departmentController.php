<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use App\Models\department;
use Illuminate\Http\Request;

class departmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $departments = department::orderBy('id_department')->get();
        return view('backend.department.departmentGet', ['departments' => $departments]);
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
        $validatedData = $request->validate([
            'nama_department' => 'required',
            'deskripsi' => 'required'
        ]);

        Department::create($validatedData);
        return redirect('/department')->with('success', 'Department berhasil ditambahkan.');
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
    public function edit(string $id_department)
    {
        $department = Department::find($id_department);
        return response()->json($department);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id_department)
    {
        $validatedData = $request->validate([
            'nama_department' => 'required',
            'deskripsi' => 'required',
        ]);

        try {
            department::where('id_department', $id_department)->update($validatedData);
            return redirect('/department')->with('success', 'Data berhasil diubah.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui data.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id_department)
    {
        department::destroy($id_department);
        return redirect('/department')->with('success', 'Data berhasil dihapus.');
    }
}

