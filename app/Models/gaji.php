<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class gaji extends Model
{
    use HasFactory;
    protected $guarded=[];
    protected $table = 'gajis';

    protected $primaryKey = 'id_gaji';

    public function _karyawan(): BelongsTo {
        return $this->belongsTo(karyawan::class, 'id_karyawan');
    }
    public function _posisi(): BelongsTo {
        return $this->belongsTo(posisi::class, 'id_posisi');
    }
}
