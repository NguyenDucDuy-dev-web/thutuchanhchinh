<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FormTemplateFileController extends Controller
{
    public function getFile(Request $request, $filename)
    {
        $filename = basename($filename);
        $filePath = 'form-templates/' . $filename;

        // Kiểm tra file tồn tại
        if (!Storage::disk('public')->exists($filePath)) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy file'
            ], 404);
        }

        $file = Storage::disk('public')->get($filePath);
        $mime = Storage::disk('public')->mimeType($filePath);

        return response($file, 200)
            ->header('Content-Type', $mime)
            ->header('Content-Disposition', 'inline')
            ->header('Cache-Control', 'public, max-age=31536000');
    }
}
