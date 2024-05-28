<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class evaluasi extends Model
{
    use HasFactory;
    protected $guarded=[];

    protected $table = 'evaluasis';

    protected $primaryKey = 'id_evaluasi';

    public function _karyawan(): BelongsTo {
        return $this->belongsTo(karyawan::class, 'id_karyawan');
    }
}
