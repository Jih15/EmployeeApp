<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class department extends Model
{
    use HasFactory;
    protected $guarded =[];
    protected $table = 'departments';

    protected $primaryKey = 'id_department';
}
