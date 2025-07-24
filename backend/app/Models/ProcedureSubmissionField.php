<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProcedureSubmissionField extends Model
{
    use HasFactory;

    protected $fillable = [
        'submission_id',
        'field_id',
        'value',
    ];

    
    public function submission()
    {
        return $this->belongsTo(ProcedureSubmission::class, 'submission_id');
    }

    
    public function field()
    {
        return $this->belongsTo(Fields::class, 'field_id');
    }
}
