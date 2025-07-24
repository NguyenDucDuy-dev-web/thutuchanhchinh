<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Procedure extends Model
{

    protected $fillable = [
        'title',
        'short_desc',
        'content',
        'room',
        'time',
        'image',
        'type',
        'format',
        'form_template_id',
    ];

    public function formTemplate()
    {
        return $this->belongsTo(FormTemplate::class);
    }

    public function submissions()
    {
        return $this->hasMany(ProcedureSubmission::class, 'procedure_id');
    }
}
