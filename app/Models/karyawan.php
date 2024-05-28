<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class karyawan extends Model
{
    use HasFactory;
    protected $guarded=[];

    protected $table = 'karyawans';

    protected $primaryKey = 'id_karyawan';

    protected $fillable = [
        'id_user',
        'nama_depan',
        'nama_belakang',
        'id_posisi',
        'id_manager',
        'jenis_kelamin',
        'tgl_lahir',
        'alamat',
        'no_telp',
        'email',
        'tgl_masuk',
        'foto'
    ];


    public function _user(): BelongsTo {
        return $this->belongsTo(User::class, 'id_user');
    }
    public function _posisi(): BelongsTo {
        return $this->belongsTo(posisi::class, 'id_posisi');
    }
    public function _manager(): BelongsTo {
        return $this->belongsTo(karyawan::class, 'id_manager');
    }

    public static function joinEvaluasi(){
        return static::leftJoin('evaluasis', 'karyawans.id_karyawan', '=', 'evaluasis.id_karyawan');
    }
}
