<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormTemplate extends Model
{
    protected $fillable = ['name', 'description', 'pdf_file_path'];

    public function fields()
    {
        return $this->hasMany(FormTemplateField::class);
    }
}
