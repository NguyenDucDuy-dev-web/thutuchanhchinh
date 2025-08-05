<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;


class TempImageController extends Controller
{
    public function index() {}


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|mimes:png,jpg,jpeg,gif'
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "errors" => $validator->errors()
            ]);
        }

        $image = $request->image;

        if (!empty($image)) {
            $ext = $image->getClientOriginalExtension();
            $imageName = strtotime('now') . '.' . $ext;

            // Lưu ảnh gốc
            $path = $image->storeAs('uploads/temp', $imageName, 'public');

            // Tạo thumbnail
            $thumbPath = storage_path('app/public/uploads/temp/thumbs');
            if (!file_exists($thumbPath)) {
                mkdir($thumbPath, 0755, true);
            }

            $originalPath = storage_path('app/public/uploads/temp/' . $imageName);
            $thumbFullPath = $thumbPath . '/' . $imageName;

            $manager = new ImageManager(new Driver());
            $manager->read($originalPath)
                ->resize(300, 300, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                })
                ->save($thumbFullPath);

            // Lưu vào DB
            $model = new TempImage();
            $model->name = $imageName;
            $model->path = $path;
            $model->save();

            return response()->json([
                "status" => true,
                "message" => "Tải ảnh thành công",
                'data' => [
                    'id' => $model->id,
                    'url' => asset("storage/{$path}"),
                    'thumb_url' => asset("storage/uploads/temp/thumbs/{$imageName}")
                ]
            ]);
        }

        return response()->json([
            "status" => false,
            "message" => "Không có file hợp lệ được gửi lên"
        ]);
    }



    public function show($id) {}


    public function update(Request $request, $id) {}


    public function destroy($id) {}
}
