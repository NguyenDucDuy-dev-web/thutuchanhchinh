<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Procedure;
use App\Models\FormTemplate;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProcedureController extends Controller
{
    public function index()
    {
        $procedures = Procedure::with('formTemplate')->orderBy('created_at', 'DESC')->get();

        return response()->json([
            "status" => true,
            "data" => $procedures
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "title" => "required|string|max:255",
            "short_desc" => "required|string|max:500",
            "content" => "required|string",
            "room" => "required|string|max:255",
            "time" => "required|string|max:255",
            "image" => "nullable|string",
            "type" => "required|in:0,1",
            "format" => "required|in:0,1",
            "form_template_id" => "required|exists:form_templates,id"
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "errors" => $validator->errors()
            ], 422);
        }

        $model = new Procedure();
        $model->title = $request->title;
        $model->short_desc = $request->short_desc;
        $model->content = $request->content;
        $model->room = $request->room;
        $model->time = $request->time;
        $model->type = $request->type;
        $model->format = $request->format;
        $model->form_template_id = $request->form_template_id;

        if ($request->imageId) {
            $tempImage = TempImage::find($request->imageId);

            if ($tempImage) {
                $ext = pathinfo($tempImage->name, PATHINFO_EXTENSION);
                $fileName = time() . '_procedure.' . $ext;

                $sourcePath = storage_path('app/public/' . $tempImage->path);
                $destPath = storage_path('app/public/procedures/' . $fileName);
                $thumbPath = storage_path('app/public/procedures/thumb/' . $fileName);

                Storage::makeDirectory('public/procedures');
                Storage::makeDirectory('public/procedures/thumb');

                $manager = new ImageManager(Driver::class);
                $image = $manager->read($sourcePath);
                $image->coverDown(300, 200);
                $image->save($thumbPath);
                copy($sourcePath, $destPath);

                $model->image = 'procedures/' . $fileName;

                Storage::delete('public/' . $tempImage->path);
                Storage::delete('public/uploads/temp/thumbs/' . $tempImage->name);
                $tempImage->delete();
            }
        }

        $model->save();

        return response()->json([
            "status" => true,
            "message" => "Tạo thủ tục thành công"
        ], 201);
    }

    public function show($id)
    {
        $procedure = Procedure::with('formTemplate')->find($id);

        if (!$procedure) {
            return response()->json([
                "status" => false,
                "message" => "Không tìm thấy thủ tục"
            ], 404);
        }

        return response()->json([
            "status" => true,
            "data" => $procedure
        ]);
    }

    public function update(Request $request, $id)
    {
        $model = Procedure::find($id);

        if (!$model) {
            return response()->json([
                "status" => false,
                "message" => "Không tìm thấy thủ tục"
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            "title" => "required|string|max:255",
            "short_desc" => "required|string|max:500",
            "content" => "required|string",
            "room" => "required|string|max:255",
            "time" => "required|string|max:255",
            "image" => "nullable|string",
            "type" => "required|in:0,1",
            "format" => "required|in:0,1",
            "form_template_id" => "required|exists:form_templates,id"
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "errors" => $validator->errors()
            ], 422);
        }

        $model->title = $request->title;
        $model->short_desc = $request->short_desc;
        $model->content = $request->content;
        $model->room = $request->room;
        $model->time = $request->time;
        $model->type = $request->type;
        $model->format = $request->format;
        $model->form_template_id = $request->form_template_id;

        if ($request->imageId) {
            $oldImage = $model->image;
            $tempImage = TempImage::find($request->imageId);

            if ($tempImage) {
                $ext = pathinfo($tempImage->name, PATHINFO_EXTENSION);
                $fileName = time() . '_procedure.' . $ext;

                $sourcePath = storage_path('app/public/' . $tempImage->path);
                $destPath = storage_path('app/public/procedures/' . $fileName);
                $thumbPath = storage_path('app/public/procedures/thumb/' . $fileName);

                Storage::makeDirectory('public/procedures');
                Storage::makeDirectory('public/procedures/thumb');

                $manager = new ImageManager(Driver::class);
                $image = $manager->read($sourcePath);
                $image->coverDown(300, 200);
                $image->save($thumbPath);
                copy($sourcePath, $destPath);

                $model->image = 'procedures/' . $fileName;

                Storage::delete('public/' . $tempImage->path);
                Storage::delete('public/uploads/temp/thumbs/' . $tempImage->name);
                $tempImage->delete();

                if (!empty($oldImage)) {
                    Storage::delete('public/' . $oldImage);
                    Storage::delete('public/procedures/thumb/' . basename($oldImage));
                }
            }
        }

        $model->save();

        return response()->json([
            "status" => true,
            "message" => "Cập nhật thủ tục thành công"
        ]);
    }

    public function destroy($id)
    {
        $procedure = Procedure::find($id);

        if (!$procedure) {
            return response()->json([
                "status" => false,
                "message" => "Không tìm thấy thủ tục"
            ]);
        }

        if (!empty($procedure->image)) {
            Storage::delete('public/' . $procedure->image);
            Storage::delete('public/procedures/thumb/' . basename($procedure->image));
        }

        $procedure->delete();

        return response()->json([
            "status" => true,
            "message" => "Xóa thủ tục thành công"
        ]);
    }
}
