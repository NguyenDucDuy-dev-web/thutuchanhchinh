<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::orderBy('created_at', 'DESC')->get();

        return response()->json([
            "status" => true,
            "data" => $news
        ]);
    }
    public function getNewsNoiBat()
    {
        $news = News::where('status', 1)
            ->orderBy('created_at', 'DESC')
            ->get();

        return response()->json([
            "status" => true,
            "data" => $news
        ]);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "title" => "required|string|max:255",
            "slug" => "required|unique:news,slug|string|max:255",
            "short_desc" => "nullable|string|max:500",
            "content" => "nullable|string",
            "image" => "nullable|string",
            "department" => "required|string|max:255",
            "status" => "required|in:0,1"
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "errors" => $validator->errors()
            ], 422);
        }

        $model = new News();
        $model->title = $request->title;
        $model->slug = Str::slug($request->slug);
        $model->short_desc = $request->short_desc;
        $model->content = $request->content;
        $model->image = $request->image;
        $model->department = $request->department;
        $model->status = $request->status;


        if (isset($request->imageId) && $request->imageId > 0) {
            $tempImage = TempImage::find($request->imageId);

            if ($tempImage) {
                $extArray = explode('.', $tempImage->name);
                $ext = last($extArray);
                $fileName = strtotime('now') . '_news.' . $ext;

                $sourcePath = storage_path('app/public/' . $tempImage->path);
                $destPath = storage_path('app/public/news/' . $fileName);
                $thumbPath = storage_path('app/public/news/thumb/' . $fileName);

                Storage::makeDirectory('public/news');
                Storage::makeDirectory('public/news/thumb');

                // Resize và tạo thumbnail
                $manager = new ImageManager(Driver::class);
                $image = $manager->read($sourcePath);
                $image->coverDown(300, 200);
                $image->save($thumbPath);

                // Di chuyển ảnh gốc
                copy($sourcePath, $destPath);

                // Cập nhật đường dẫn ảnh mới
                $model->image = 'news/' . $fileName;

                // Xóa ảnh tạm và bản ghi
                Storage::delete('public/' . $tempImage->path);
                Storage::delete('public/uploads/temp/thumbs/' . $tempImage->name);
                $tempImage->delete();
            }
        }

        // Lưu 
        $model->save();
        return response()->json([
            "status" => true,
            "message" => "Thêm tin tức thành công"
        ], 201);
    }


    public function show($id)
    {

        $news = News::find($id);

        if ($news == null) {
            return response()->json([
                "status" => false,
                "message" => "Không tìm thấy tin tức"
            ]);
        }
        return response()->json([
            "status" => true,
            "data" => $news,
        ]);
    }


    public function update(Request $request, $id)
    {
        $news = News::find($id);

        if ($news == null) {
            return response()->json([
                "status" => false,
                "message" => "Không tìm thấy tin tức"
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            "title" => "required|string|max:255",
            "slug" => "required|string|max:255|unique:news,slug," . $id,
            "short_desc" => "nullable|string|max:500",
            "content" => "nullable|string",
            "image" => "nullable|string",
            "department" => "required|string|max:255",
            "status" => "required|in:0,1"
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "errors" => $validator->errors()
            ], 422);
        }

        // Cập nhật các trường cơ bản
        $news->title = $request->title;
        $news->slug = Str::slug($request->slug);
        $news->short_desc = $request->short_desc;
        $news->content = $request->content;
        $news->department = $request->department;
        $news->status = $request->status;

        // Nếu có ảnh mới được upload
        if (isset($request->imageId) && $request->imageId > 0) {
            $oldImage = $news->image;
            $tempImage = TempImage::find($request->imageId);

            if ($tempImage) {
                $extArray = explode('.', $tempImage->name);
                $ext = last($extArray);
                $fileName = strtotime('now') . '_news.' . $ext;

                $sourcePath = storage_path('app/public/' . $tempImage->path);
                $destPath = storage_path('app/public/news/' . $fileName);
                $thumbPath = storage_path('app/public/news/thumb/' . $fileName);

                Storage::makeDirectory('public/news');
                Storage::makeDirectory('public/news/thumb');

                // Resize và tạo thumbnail
                $manager = new ImageManager(Driver::class);
                $image = $manager->read($sourcePath);
                $image->coverDown(300, 200);
                $image->save($thumbPath);

                // Di chuyển ảnh gốc
                copy($sourcePath, $destPath);

                // Cập nhật đường dẫn ảnh mới
                $news->image = 'news/' . $fileName;

                // Xóa ảnh tạm và bản ghi
                Storage::delete('public/' . $tempImage->path);
                Storage::delete('public/uploads/temp/thumbs/' . $tempImage->name);
                $tempImage->delete();

                // Xóa ảnh cũ nếu có
                if (!empty($oldImage) && Storage::exists('public/' . $oldImage)) {
                    Storage::delete('public/' . $oldImage);
                    Storage::delete('public/news/thumb/' . basename($oldImage));
                }
            }
        }

        // Lưu 
        $news->save();

        return response()->json([
            "status" => true,
            "message" => "Cập nhật tin tức thành công"
        ], 201);
    }



    public function destroy($id)
    {
        $news = News::find($id);

        if ($news == null) {
            return response()->json([
                "status" => false,
                "message" => "Không tìm thấy tin tức"
            ]);
        }

        if (!empty($news->image) && Storage::exists('public/' . $news->image)) {
            Storage::delete('public/' . $news->image);
            Storage::delete('public/news/thumb/' . basename($news->image));
        }

        $news->delete();
        return response()->json([
            "status" => true,
            "message" => "Xóa tin tức thành công"
        ]);
    }
}
