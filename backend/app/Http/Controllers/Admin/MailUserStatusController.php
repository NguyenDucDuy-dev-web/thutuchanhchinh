<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MailUserStatus;
use App\Models\User;
use App\Models\EmailTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Hash;

class MailUserStatusController extends Controller
{
    public function getUsersWithStatus($mailTemplateId)
    {
        $users = User::all();

        $statusMap = MailUserStatus::where('mail_template_id', $mailTemplateId)
            ->pluck('sent', 'user_id')
            ->toArray();

        $result = $users->map(function ($user) use ($statusMap) {
            return [
                'id'     => $user->id,
                'name'   => $user->name,
                'email'  => $user->email,
                'status' => isset($statusMap[$user->id]) ? ($statusMap[$user->id] ? 1 : 0) : 0,
            ];
        });

        return response()->json([
            'status' => true,
            'data' => $result,
        ]);
    }

    /**
     * Gửi mail hàng loạt
     */
    public function sendBulkMail(Request $request)
    {
        // Validate input
        $request->validate([
            'mail_template_id' => 'required|integer|exists:email_templates,id',
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'integer|exists:users,id'
        ]);

        $mailTemplateId = $request->mail_template_id;
        $userIds = $request->user_ids;

        try {
            // Lấy template email
            $template = EmailTemplate::findOrFail($mailTemplateId);

            // Lấy danh sách users
            $users = User::whereIn('id', $userIds)->get();

            // Kiểm tra users đã được gửi mail chưa
            $sentUsers = MailUserStatus::where('mail_template_id', $mailTemplateId)
                ->whereIn('user_id', $userIds)
                ->where('sent', true)
                ->pluck('user_id')
                ->toArray();

            // Lọc ra những user chưa được gửi
            $usersToSend = $users->filter(function ($user) use ($sentUsers) {
                return !in_array($user->id, $sentUsers);
            });

            if ($usersToSend->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Tất cả người dùng đã được gửi mail template này'
                ], 400);
            }

            $successCount = 0;
            $failedUsers = [];

            // Transaction 
            DB::beginTransaction();

            foreach ($usersToSend as $user) {
                try {
                    // Gửi mail
                    $this->sendMailToUser($user, $template);

                    // Cập nhật trạng thái gửi mail
                    MailUserStatus::updateOrCreate([
                        'user_id' => $user->id,
                        'mail_template_id' => $mailTemplateId
                    ], [
                        'sent' => true
                    ]);

                    $successCount++;

                    // Log thành công
                    Log::info("Mail sent successfully", [
                        'user_id' => $user->id,
                        'email' => $user->email,
                        'template_id' => $mailTemplateId
                    ]);
                } catch (Exception $e) {
                    // Log lỗi và thêm vào danh sách thất bại
                    Log::error("Failed to send mail", [
                        'user_id' => $user->id,
                        'email' => $user->email,
                        'template_id' => $mailTemplateId,
                        'error' => $e->getMessage()
                    ]);

                    $failedUsers[] = [
                        'user_id' => $user->id,
                        'email' => $user->email,
                        'error' => $e->getMessage()
                    ];
                }
            }

            DB::commit();

            // Tạo response message
            $message = "Đã gửi thành công {$successCount} mail";
            if (count($failedUsers) > 0) {
                $message .= ", thất bại " . count($failedUsers) . " mail";
            }

            return response()->json([
                'status' => true,
                'message' => $message,
                'data' => [
                    'success_count' => $successCount,
                    'failed_count' => count($failedUsers),
                    'failed_users' => $failedUsers
                ]
            ]);
        } catch (Exception $e) {
            DB::rollback();

            Log::error("Bulk mail sending failed", [
                'template_id' => $mailTemplateId,
                'user_ids' => $userIds,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra khi gửi mail: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Gửi mail cho một user cụ thể
     */
    private function sendMailToUser($user, $template)
    {
        
        $tempPassword = $this->generateRandomPassword(8);

        
        $user->update([
            'password' => Hash::make($tempPassword),
            'is_change_password' => true
        ]);

        Log::info("Generated password for user", [
            'user_id' => $user->id,
            'plain_password' => $tempPassword
        ]);

        
        $placeholders = [
            '{{name}}' => $user->name,
            '{{email}}' => $user->email,
            '{{password}}' => $tempPassword,
            '{{current_date}}' => now()->format('d/m/Y'),
        ];

        
        $content = str_replace(array_keys($placeholders), array_values($placeholders), $template->content);
        $subject = str_replace(array_keys($placeholders), array_values($placeholders), $template->subject);

        // Gửi mail
        Mail::send([], [], function ($message) use ($user, $subject, $content) {
            $message->to($user->email, $user->name)
                ->subject($subject)
                ->html($content);
        });
    }

    private function generateRandomPassword($length = 8)
    {
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return substr(str_shuffle($chars), 0, $length);
    }

    /**
     * Gửi mail cho một user đơn lẻ
     */
    public function sendSingleMail(Request $request)
    {
        $request->validate([
            'mail_template_id' => 'required|integer|exists:email_templates,id',
            'user_id' => 'required|integer|exists:users,id'
        ]);

        try {
            $template = EmailTemplate::findOrFail($request->mail_template_id);
            $user = User::findOrFail($request->user_id);

            // Kiểm tra đã gửi chưa
            $alreadySent = MailUserStatus::where('user_id', $user->id)
                ->where('mail_template_id', $template->id)
                ->where('sent', true)
                ->exists();

            if ($alreadySent) {
                return response()->json([
                    'status' => false,
                    'message' => 'Mail đã được gửi cho người dùng này'
                ], 400);
            }

            // Gửi mail
            $this->sendMailToUser($user, $template);

            // Cập nhật trạng thái
            MailUserStatus::updateOrCreate([
                'user_id' => $user->id,
                'mail_template_id' => $template->id
            ], [
                'sent' => true
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Mail đã được gửi thành công'
            ]);
        } catch (Exception $e) {
            Log::error("Single mail sending failed", [
                'user_id' => $request->user_id,
                'template_id' => $request->mail_template_id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reset trạng thái gửi mail 
     */
    public function resetMailStatus(Request $request)
    {
        $request->validate([
            'mail_template_id' => 'required|integer|exists:email_templates,id',
            'user_ids' => 'sometimes|array',
            'user_ids.*' => 'integer|exists:users,id'
        ]);

        try {
            $query = MailUserStatus::where('mail_template_id', $request->mail_template_id);

            if ($request->has('user_ids')) {
                $query->whereIn('user_id', $request->user_ids);
            }

            $query->update(['sent' => false]);

            return response()->json([
                'status' => true,
                'message' => 'Đã reset trạng thái gửi mail'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
}
