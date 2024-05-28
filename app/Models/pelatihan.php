<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class pelatihan extends Model
{
    use HasFactory;
    protected $guarded=[];
    protected $table = 'pelatihans';

    protected $primaryKey = 'id_pelatihan';

    public function _karyawan(): BelongsTo {
        return $this->belongsTo(karyawan::class, 'id_karyawan');
    }
}
