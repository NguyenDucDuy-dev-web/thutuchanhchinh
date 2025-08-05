<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProcedureSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'procedure_id',
        'user_id',
        'status',
        'current_step_id',
        'submitted_at',
        'completed_at',
        'notes',
        'attachments'
    ];

    protected $casts = [
        'attachments' => 'array',
        'submitted_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function procedure()
    {
        return $this->belongsTo(Procedure::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function currentStep()
    {
        return $this->belongsTo(ProcedureProcessStep::class, 'current_step_id');
    }

    public function fields()
    {
        return $this->hasMany(ProcedureSubmissionField::class, 'submission_id');
    }


}
