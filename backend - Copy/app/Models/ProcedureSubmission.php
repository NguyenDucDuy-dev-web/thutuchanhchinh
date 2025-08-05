<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProcedureSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'procedure_id',
        'user_id',
    ];

    public function fields()
    {
        return $this->hasMany(ProcedureSubmissionField::class, 'submission_id');
    }

   
    public function procedure()
    {
        return $this->belongsTo(Procedure::class, 'procedure_id');
    }

   
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
