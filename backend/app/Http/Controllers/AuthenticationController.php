<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthenticationController extends Controller
{
    public function authenticate(Request $request)
    {
        // Xử lý preflight request
        if ($request->isMethod('OPTIONS')) {
            return response()->json([], 200);
        }

        // Apply Validation:
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
            'captcha' => 'required|captcha'
        ], [
            'captcha.captcha' => 'Mã captcha không đúng',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
                'message' => 'Đăng nhập không thành công'
            ], 422);
        }

        $credentials = [
            'email' => $request->email,
            'password' => $request->password
        ];

        if (Auth::attempt($credentials)) {
            $user = User::find(Auth::user()->id);
            $token = $user->createToken('token')->plainTextToken;

            return response()->json([
                'status' => true,
                'token' => $token,
                'id' => Auth::user()->id,
                'message' => 'Đăng nhập thành công'
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Đăng nhập không thành công'
            ], 401);
        }
    }

    public function me(Request $request)
    {
        return response()->json([
            'id' => $request->user()->id,
            'role' => $request->user()->role,
            'email' => $request->user()->email,
        ]);
    }

    public function logout()
    {
        $user = User::find(Auth::user()->id);
        $user->tokens()->delete();

        return response()->json([
            'status' => true,
            'message' => 'Đăng xuất thành công'
        ]);
    }
}