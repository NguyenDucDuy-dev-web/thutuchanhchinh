<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormTemplateField extends Model
{
    protected $fillable = ['form_template_id', 'field_id', 'page', 'position_x', 'position_y'];

    public function field()
    {
        return $this->belongsTo(Fields::class);
    }

    public function submissionFields()
    {
        return $this->hasMany(ProcedureSubmissionField::class, 'field_id');
    }
}
