<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = ['name', 'code', 'description', 'status'];
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_departments')
            ->withPivot('role_id', 'is_head')
            ->withTimestamps();
    }

    public function heads()
    {
        return $this->belongsToMany(User::class, 'user_departments')
            ->wherePivot('is_head', true)
            ->withPivot('role_id')
            ->withTimestamps();
    }
}
