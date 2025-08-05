<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FormTemplate;
use App\Models\FormTemplateField;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class FormTemplateController extends Controller
{
    public function index()
    {
        $templates = FormTemplate::with('fields.field')->get();
        return response()->json([
            'status' => true,
            'data' => $templates
        ]);
    }

    public function getform_template()
    {
        $templates = FormTemplate::with('fields.field')
        ->where('status', 1)
        ->get();
        return response()->json([
            'status' => true,
            'data' => $templates
        ]);
    }


    public function store(Request $request)
    {
        // Giải mã chuỗi JSON fields
        $fields = json_decode($request->fields, true);

        // Kiểm tra giải mã có thành công không
        if (!is_array($fields)) {
            return response()->json([
                'status' => false,
                'errors' => ['fields' => ['Trường fields không hợp lệ hoặc không phải là JSON.']],
            ], 422);
        }

        // Validate dữ liệu
        $validator = Validator::make([
            'name' => $request->name,
            'description' => $request->description,
            'pdf_file' => $request->file('pdf_file'),
            'fields' => $fields,
        ], [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'pdf_file' => 'required|file|mimes:pdf|max:20480',
            'fields' => 'required|array',
            'fields.*.field_id' => 'required|integer|exists:fields,id',
            'fields.*.page' => 'required|integer|min:1',
            'fields.*.position_x' => 'required|numeric',
            'fields.*.position_y' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Lưu file PDF
        $pdfPath = null;
        if ($request->hasFile('pdf_file')) {
            $pdfPath = $request->file('pdf_file')->store('form-templates', 'public');
        }

        // Tạo template
        $template = FormTemplate::create([
            'name' => $request->name,
            'description' => $request->description,
            'pdf_file_path' => $pdfPath,
        ]);

        // Lưu các field
        foreach ($fields as $field) {
            FormTemplateField::create([
                'form_template_id' => $template->id,
                'field_id' => $field['field_id'],
                'page' => $field['page'],
                'position_x' => $field['position_x'],
                'position_y' => $field['position_y'],
            ]);
        }

        return response()->json([
            'status' => true,
            'data' => $template->load('fields'),
            'message' => 'Lưu mẫu thủ tục thành công'
        ], 201);
    }

    // public function store(Request $request)
    // {
    //     try {
    //         // Debug log
    //         Log::info('Form template creation started', [
    //             'name' => $request->name,
    //             'description' => $request->description,
    //             'has_file' => $request->hasFile('pdf_file'),
    //             'file_info' => $request->hasFile('pdf_file') ? [
    //                 'original_name' => $request->file('pdf_file')->getClientOriginalName(),
    //                 'size' => $request->file('pdf_file')->getSize(),
    //                 'mime_type' => $request->file('pdf_file')->getMimeType(),
    //             ] : null
    //         ]);

    //         // Giải mã chuỗi JSON fields
    //         $fields = json_decode($request->fields, true);

    //         // Kiểm tra giải mã có thành công không
    //         if (!is_array($fields)) {
    //             return response()->json([
    //                 'status' => false,
    //                 'errors' => ['fields' => ['Trường fields không hợp lệ hoặc không phải là JSON.']],
    //             ], 422);
    //         }

    //         // Validate dữ liệu
    //         $validator = Validator::make([
    //             'name' => $request->name,
    //             'description' => $request->description,
    //             'pdf_file' => $request->file('pdf_file'),
    //             'fields' => $fields,
    //         ], [
    //             'name' => 'required|string|max:255',
    //             'description' => 'nullable|string|max:1000',
    //             'pdf_file' => 'required|file|mimes:pdf|max:20480',
    //             'fields' => 'required|array',
    //             'fields.*.field_key' => 'required|string|max:255',
    //             'fields.*.field_label' => 'required|string|max:255',
    //             'fields.*.page' => 'required|integer|min:1',
    //             'fields.*.position_x' => 'required|numeric',
    //             'fields.*.position_y' => 'required|numeric',
    //         ]);

    //         if ($validator->fails()) {
    //             Log::warning('Validation failed', $validator->errors()->toArray());
    //             return response()->json([
    //                 'status' => false,
    //                 'errors' => $validator->errors(),
    //             ], 422);
    //         }

    //         // Bắt đầu transaction
    //         DB::beginTransaction();

    //         // Lưu file PDF với error handling
    //         $pdfPath = null;
    //         if ($request->hasFile('pdf_file')) {
    //             $file = $request->file('pdf_file');

    //             // Kiểm tra file có hợp lệ không
    //             if (!$file->isValid()) {
    //                 throw new \Exception('File PDF không hợp lệ hoặc bị lỗi trong quá trình upload');
    //             }

    //             // Tạo tên file unique
    //             $fileName = time() . '_' . $file->getClientOriginalName();

    //             // Lưu file
    //             $pdfPath = $file->storeAs('form-templates', $fileName, 'public');

    //             // Kiểm tra file đã được lưu thành công chưa
    //             if (!$pdfPath || !Storage::disk('public')->exists($pdfPath)) {
    //                 throw new \Exception('Không thể lưu file PDF. Vui lòng kiểm tra quyền thư mục storage.');
    //             }

    //             Log::info('PDF file saved successfully', ['path' => $pdfPath]);
    //         } else {
    //             throw new \Exception('Không tìm thấy file PDF');
    //         }

    //         // Tạo template
    //         $template = FormTemplate::create([
    //             'name' => $request->name,
    //             'description' => $request->description,
    //             'pdf_file_path' => $pdfPath,
    //         ]);

    //         // Kiểm tra template đã được tạo thành công chưa
    //         if (!$template || !$template->id) {
    //             throw new \Exception('Không thể tạo template');
    //         }

    //         Log::info('Template created', ['template_id' => $template->id, 'pdf_path' => $template->pdf_file_path]);

    //         // Lưu các field
    //         foreach ($fields as $fieldData) {
    //             $field = FormTemplateField::create([
    //                 'form_template_id' => $template->id,
    //                 'field_key' => $fieldData['field_key'],
    //                 'field_label' => $fieldData['field_label'],
    //                 'page' => $fieldData['page'],
    //                 'position_x' => $fieldData['position_x'],
    //                 'position_y' => $fieldData['position_y'],
    //             ]);

    //             if (!$field) {
    //                 throw new \Exception('Không thể lưu field: ' . $fieldData['field_key']);
    //             }
    //         }

    //         // Commit transaction
    //         DB::commit();

    //         // Load lại template với fields
    //         $template = $template->fresh()->load('fields');

    //         Log::info('Form template created successfully', ['template_id' => $template->id]);

    //         return response()->json([
    //             'status' => true,
    //             'data' => $template,
    //             'message' => 'Lưu mẫu thủ tục thành công'
    //         ], 201);

    //     } catch (\Exception $e) {
    //         // Rollback transaction
    //         DB::rollback();

    //         // Xóa file đã upload nếu có
    //         if (isset($pdfPath) && $pdfPath && Storage::disk('public')->exists($pdfPath)) {
    //             Storage::disk('public')->delete($pdfPath);
    //             Log::info('Cleaned up uploaded file due to error', ['path' => $pdfPath]);
    //         }

    //         Log::error('Error creating form template', [
    //             'error' => $e->getMessage(),
    //             'trace' => $e->getTraceAsString()
    //         ]);

    //         return response()->json([
    //             'status' => false,
    //             'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
    //         ], 500);
    //     }
    // }


    public function show($id)
    {
        $template = FormTemplate::with('fields.field')->find($id);

        if (!$template) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy mẫu thủ tục'
            ], 404);
        }

        $template->file_url = $template->pdf_file_path
            ? Storage::url($template->pdf_file_path)
            : null;

        return response()->json([
            'status' => true,
            'data' => $template
        ]);
    }

    public function destroy($id)
    {
        $template = FormTemplate::find($id);

        if (!$template) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy mẫu thủ tục'
            ], 404);
        }

        // // Xóa file PDF nếu có
        // if ($template->pdf_file_path && Storage::disk('public')->exists($template->pdf_file_path)) {
        //     Storage::disk('public')->delete($template->pdf_file_path);
        // }

        // // Xóa các fields
        // $template->fields()->delete();

        // // Xóa template
        // $template->delete();

        // Tiến hành xóa mềm:
        $template->status = 0;
        $template->save();

        return response()->json([
            'status' => true,
            'message' => 'Xóa mẫu thủ tục thành công'
        ]);
    }

    public function restore($id)
    {
        $template = FormTemplate::find($id);

        if (!$template) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy mẫu thủ tục'
            ], 404);
        }

        if ($template->status == 1) {
            return response()->json([
                'status' => false,
                'message' => " Mẫu thủ tục đã đang hoạt động"
            ]);
        }

        // // Xóa file PDF nếu có
        // if ($template->pdf_file_path && Storage::disk('public')->exists($template->pdf_file_path)) {
        //     Storage::disk('public')->delete($template->pdf_file_path);
        // }

        // // Xóa các fields
        // $template->fields()->delete();

        // // Xóa template
        // $template->delete();

        // Tiến hành xóa mềm:
        $template->status = 1;
        $template->save();

        return response()->json([
            'status' => true,
            'message' => 'Khôi phục mẫu thủ tục thành công'
        ]);
    }
}
