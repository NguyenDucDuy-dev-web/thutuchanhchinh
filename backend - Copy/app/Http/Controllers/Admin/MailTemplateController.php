<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MailTemplateController extends Controller
{
    public function index()
    {
        $templates = EmailTemplate::all()->map(function ($template) {
            return [
                'id' => $template->id,
                'name' => $template->name,
                'subject' => $template->subject,
                'content' => $template->content, 
                'created_at' => $template->created_at,
                'updated_at' => $template->updated_at,
            ];
        });

        return response()->json([
            'status' => true,
            'data' => $templates,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false, // Sửa lại thành false
                'errors' => $validator->errors()
            ], 422);
        }

        // Decode HTML entities nếu bị encode từ frontend
        $content = html_entity_decode($request->content, ENT_QUOTES, 'UTF-8');
        
        $template = EmailTemplate::create([
            'name' => $request->name,
            'subject' => $request->subject,
            'content' => $content, 
        ]);

        return response()->json([
            'status' => true,
            'data' => $template,
            'message' => 'Tạo mẫu email thành công',
        ], 201);
    }

    public function show($id)
    {
        try {
            $template = EmailTemplate::findOrFail($id);
            
            return response()->json([
                'status' => true,
                'data' => [
                    'id' => $template->id,
                    'name' => $template->name,
                    'subject' => $template->subject,
                    'content' => $template->content, 
                    'created_at' => $template->created_at,
                    'updated_at' => $template->updated_at,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy mẫu email'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $template = EmailTemplate::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'subject' => 'required|string|max:255',
                'content' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Decode HTML entities nếu bị encode từ frontend
            $content = html_entity_decode($request->content, ENT_QUOTES, 'UTF-8');

            $template->update([
                'name' => $request->name,
                'subject' => $request->subject,
                'content' => $content,  
            ]);

            return response()->json([
                'status' => true,
                'data' => $template,
                'message' => 'Cập nhật mẫu email thành công',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy mẫu email'
            ], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $template = EmailTemplate::findOrFail($id);
            $template->delete();

            return response()->json([
                'status' => true,
                'message' => 'Xóa mẫu email thành công',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy mẫu email'
            ], 404);
        }
    }

    /**
     * Preview email với placeholder được thay thế
     */
    public function preview(Request $request, $id)
    {
        try {
            $template = EmailTemplate::findOrFail($id);
            
            // Sample data để preview
            $sampleData = [
                '{{name}}' => $request->get('sample_name', 'Nguyễn Văn A'),
                '{{email}}' => $request->get('sample_email', 'example@email.com'),
                '{{password}}' => $request->get('sample_password', 'temp123456'),
                '{{current_date}}' => now()->format('d/m/Y'),
                '{{current_time}}' => now()->format('H:i:s'),
            ];

            $previewContent = str_replace(
                array_keys($sampleData),
                array_values($sampleData),
                $template->content
            );

            $previewSubject = str_replace(
                array_keys($sampleData),
                array_values($sampleData),
                $template->subject
            );

            return response()->json([
                'status' => true,
                'data' => [
                    'id' => $template->id,
                    'name' => $template->name,
                    'subject' => $previewSubject,
                    'content' => $previewContent,
                    'original_subject' => $template->subject,
                    'original_content' => $template->content,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy mẫu email'
            ], 404);
        }
    }
}