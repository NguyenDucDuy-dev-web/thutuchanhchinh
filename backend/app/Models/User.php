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

    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
        'role',
        'is_change_password'
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_change_password' => 'boolean',
    ];

    // Quan hệ với departments
    public function departments()
    {
        return $this->belongsToMany(Department::class, 'user_departments')
            ->withPivot('role_id', 'is_head')
            ->withTimestamps();
    }

    // Các bước user có thể xử lý
    public function processingSteps()
    {
        return $this->belongsToMany(ProcedureProcessStep::class, 'procedure_process_assignments')
            ->withPivot('department_id', 'can_approve', 'can_reject', 'can_edit')
            ->withTimestamps();
    }

    // Hồ sơ user nộp
    public function submissions()
    {
        return $this->hasMany(ProcedureSubmission::class);
    }

    // Kiểm tra quyền
    public function hasPermission($permission)
    {
        if ($this->role === self::ROLE_ADMIN) {
            return true;
        }

        return $this->departments()
            ->join('role_permissions', 'user_departments.role_id', '=', 'role_permissions.role_id')
            ->join('permissions', 'role_permissions.permission_id', '=', 'permissions.id')
            ->where('permissions.name', $permission)
            ->exists();
    }

    // Kiểm tra có thể xử lý bước không
    public function canProcessStep($stepId, $action = 'edit')
    {
        if ($this->role === self::ROLE_ADMIN) {
            return true;
        }

        $assignment = $this->processingSteps()
            ->where('procedure_process_steps.id', $stepId)
            ->first();

        if (!$assignment) {
            return false;
        }

        switch ($action) {
            case 'approve':
                return $assignment->pivot->can_approve;
            case 'reject':
                return $assignment->pivot->can_reject;
            case 'edit':
                return $assignment->pivot->can_edit;
            default:
                return false;
        }
    }

    // Lấy các phòng ban user làm trưởng phòng
    public function headOfDepartments()
    {
        return $this->departments()->wherePivot('is_head', true);
    }

    // Helper methods để phân biệt loại user
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

    // Lấy display name cho role
    public function getRoleNameAttribute()
    {
        return match ($this->role) {
            self::ROLE_ADMIN => 'Quản trị viên',
            self::ROLE_TEACHER => 'Giảng viên',
            self::ROLE_STUDENT => 'Sinh viên',
            default => 'Không xác định'
        };
    }
}
