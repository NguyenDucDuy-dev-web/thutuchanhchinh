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

    // Relationship tới FormTemplateField
    public function formTemplateField()
    {
        return $this->belongsTo(FormTemplateField::class, 'field_id');
    }

    // Relationship tới Fields thông qua FormTemplateField
    public function field()
    {
        return $this->hasOneThrough(
            Fields::class,           
            FormTemplateField::class, 
            'id',                    
            'id',                  
            'field_id',              
            'field_id'              
        );
    }
}
