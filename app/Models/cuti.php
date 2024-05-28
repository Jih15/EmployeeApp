<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class cuti extends Model
{
    use HasFactory;
    protected $guarded =[];

    protected $table = 'cutis';

    protected $primaryKey = 'id_cuti';

    public function _karyawan(): BelongsTo {
        return $this->belongsTo(karyawan::class, 'id_karyawan');
    }
}
