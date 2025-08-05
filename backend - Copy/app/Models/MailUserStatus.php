<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MailUserStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'mail_template_id',
        'sent',
    ];

    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function mailTemplate()
    {
        return $this->belongsTo(EmailTemplate::class);
    }
}
