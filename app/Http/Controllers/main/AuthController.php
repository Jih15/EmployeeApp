<?php

namespace App\Http\Controllers\main;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'message' => ['Email ini belum terdaftar'],
            ]);
        }

        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'message' => ['Password anda salah'],
            ]);
        }

        if (!in_array($user->hak_akses, ['Manager', 'Karyawan'])) {
            return response()->json(['message' => 'Hanya karyawan yang bisa mengakses aplikasi ini'], 403);
        }

        $token = $user->createToken('token-name')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login Berhasil',
            'user' => $user,
            'token' => $token
        ]);
    }
}
