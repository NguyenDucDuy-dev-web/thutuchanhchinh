<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fields extends Model
{
    protected $fillable = ['label', 'name', 'type', 'icon', 'input_type', 'source_table', 'source_column'];
}
