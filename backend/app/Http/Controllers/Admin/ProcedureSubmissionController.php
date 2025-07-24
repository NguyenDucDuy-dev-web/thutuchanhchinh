<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProcedureSubmission;
use App\Models\ProcedureSubmissionField;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProcedureSubmissionController extends Controller
{
    // public function index()
    // {
    //     $submissions = ProcedureSubmission::with('fields')->orderBy('created_at', 'DESC')->get();

    //     return response()->json([
    //         "status" => true,
    //         "data" => $submissions
    //     ]);
    // }

    public function index()
    {
        $submissions = ProcedureSubmission::with(['procedure', 'user'])
            ->orderBy('created_at', 'DESC')
            ->get();

        return response()->json([
            "status" => true,
            "data" => $submissions
        ]);
    }

    public function show($id)
    {
        $submission = ProcedureSubmission::with('fields')->find($id);

        if (!$submission) {
            return response()->json([
                "status" => false,
                "message" => "Không tìm thấy bản ghi thủ tục đã nộp"
            ], 404);
        }

        return response()->json([
            "status" => true,
            "data" => $submission
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "procedure_id" => "required|integer",
            "fields" => "required|array",
            "fields.*.field_id" => "required|integer",
            "fields.*.value" => "required|string",
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "errors" => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $submission = new ProcedureSubmission();
        $submission->procedure_id = $request->procedure_id;
        $submission->user_id = $user ? $user->id : null;
        $submission->save();

        foreach ($request->fields as $field) {
            ProcedureSubmissionField::create([
                'submission_id' => $submission->id,
                'field_id' => $field['field_id'],
                'value' => $field['value'] ?? null,
            ]);
        }

        return response()->json([
            "status" => true,
            "message" => "Lưu thủ tục thành công",
            "data" => [
                "submission_id" => $submission->id
            ]
        ], 201);
    }

    public function destroy($id)
    {
        $submission = ProcedureSubmission::find($id);

        if (!$submission) {
            return response()->json([
                "status" => false,
                "message" => "Không tìm thấy thủ tục để xóa"
            ], 404);
        }

        ProcedureSubmissionField::where('submission_id', $id)->delete();


        $submission->delete();

        return response()->json([
            "status" => true,
            "message" => "Xóa thủ tục đã nộp thành công"
        ]);
    }
}
