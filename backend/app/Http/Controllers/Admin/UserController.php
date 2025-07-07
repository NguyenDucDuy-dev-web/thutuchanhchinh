<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index()
    {
        $user = User::all(); // Nếu dữ liệu quá nhiều thì dùng User::paginate(10)
        return response()->json([
            'status' => true,
            'data' => $user
        ]);
    }


    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|string|max:255',
                'email' => 'required|email|string|max:255|unique:users,email',
                'password' => 'required|string|min:6',
                'status' => 'required|in:0,1'
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => (int) $request->status
        ]);

        return response()->json([
            'status' => true,
            'data' => $user,
            'message' => 'Thêm người dùng thành công'
        ], 201);
    }


    public function show($id)
    {
        $user = User::find($id);
        if ($user == null) {
            return response()->json([
                'status' => false,
                'message' => "Không tìm thấy người dùng"
            ], 404);
        }
        return response()->json([
            'status' => true,
            "data" => $user,
            'errors' => null
        ]);
    }


    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if ($user == null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy người dùng'
            ], 404);
        }
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => "sometimes|required|email|string|max:255|unique:users,email,{$user->id}",
            'password' => 'nullable|string|min:6',
            'status' => 'sometimes|required|in:0,1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($request->has('email')) {
            $user->email = $request->email;
        }

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        if ($request->has('status')) {
            $user->status = $request->status;
        }

        $user->save();

        return response()->json([
            'status' => true,
            'data' => $user,
            'message' => "Cập nhật người dùng thành công",
            'errors' => null
        ]);
    }


    public function destroy($id)
    {
        $user = User::find($id);

        if ($user == null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy người dùng'
            ], 404);
        }
        $user->delete();
        return response()->json([
            'status' => true,
            'message' => 'Xóa người dùng thành công',
            'errors' => null
        ]);
    }
}
