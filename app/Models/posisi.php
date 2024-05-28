<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class posisi extends Model
{
    use HasFactory;
    protected $guarded=[];
    protected $table = 'posisis';

    protected $primaryKey = 'id_posisi';

    public function _department(): BelongsTo {
        return $this->belongsTo(department::class, 'id_department');
    }
    public function gaji(): HasOne {
        return $this->hasOne(gaji::class, 'id_posisi');
    }
}
