<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sidebar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SidebarController extends Controller
{

    public function index()
    {
        $sidebarItem = Sidebar::where('status', 1)->select('id', 'name', 'icon', 'status')->get();
        return response()->json([
            'status' => true,
            'data' => $sidebarItem
        ]);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'icon' => 'required|string|max:50',
            'status' => 'required|in:0,1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ]);
        }

        $sidebar = Sidebar::create([
            'name' => $request->name,
            'icon' => $request->icon,
            'status' => $request->status
        ]);

        return response()->json([
            'status' => true,
            'data' => $sidebar,
            'message' => 'Thêm sidebar thành công'
        ]);
    }


    public function show(Sidebar $sidebar)
    {
        return response()->json([
            'status' => true,
            'data' => $sidebar
        ]);
    }


    public function edit(Sidebar $sidebar) {}


    public function update(Request $request, Sidebar $sidebar)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'icon' => 'required|string|max:50',
            'status' => 'required|in:0,1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ]);
        }

        $sidebar->update([
            'name' => $request->name,
            'icon' => $request->icon,
            'status' => $request->status
        ]);

        return response() -> json([
            'status' => true,
            'data' => $sidebar,
            'message' => 'Cập nhật sidebar thành công'
        ]);
    }


    public function destroy(Sidebar $sidebar)
    {
        $sidebar -> delete();
        return response() -> json([
            'status' => true,
            'message' => "Xóa sidebar thành công"
        ]);
    }
}
