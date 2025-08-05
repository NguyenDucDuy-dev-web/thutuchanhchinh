<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProcedureProcessStep extends Model
{
    protected $fillable = [
        'procedure_process_id',
        'step_order',
        'name',
        'description'
    ];

    public function process()
    {
        return $this->belongsTo(ProcedureProcess::class, 'procedure_process_id');
    }
}
