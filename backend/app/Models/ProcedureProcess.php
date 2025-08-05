<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProcedureProcess extends Model
{
    protected $fillable = [
        'name',
    ];
    public function steps()
    {
        return $this->hasMany(ProcedureProcessStep::class, 'procedure_process_id')->orderBy('step_order');
    }
    public function procedures()
    {
        return $this->hasMany(Procedure::class, 'process_id');
    }
}
