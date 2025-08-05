<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    const ROLE_ADMIN = 0;
    const ROLE_TEACHER = 1;
    const ROLE_STUDENT = 2;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
        'role',
        'is_change_password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_change_password' => 'boolean',
        ];
    }

    public function getRoleNameAttribute()
    {
        $roles = [
            self::ROLE_ADMIN => 'Admin',
            self::ROLE_TEACHER => 'Giảng viên',
            self::ROLE_STUDENT => 'Sinh viên'
        ];
        return $roles[$this->role] ?? 'Không xác định';
    }

    // Check role methods
    public function isAdmin()
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isTeacher()
    {
        return $this->role === self::ROLE_TEACHER;
    }

    public function isStudent()
    {
        return $this->role === self::ROLE_STUDENT;
    }

    public function submissions()
    {
        return $this->hasMany(ProcedureSubmission::class, 'user_id');
    }
}
