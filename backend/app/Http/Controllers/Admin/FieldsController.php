<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Fields;
use App\Models\FormTemplateField;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;

class FieldsController extends Controller
{

    public function index()
    {
        $fields = Fields::all();
        return response()->json([
            'status' => true,
            'data' => $fields
        ]);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'label' => 'required|string|max:255',
            'name'  => 'required|string|max:255|unique:fields,name',
            'type'  => 'required|string|max:50',
            'icon'  => 'nullable|string|max:255',
            'input_type' => 'nullable|string|max:50',
            'source_table' => 'nullable|string|max:255',
            'source_column' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $fields = Fields::create([
            'label' => $request->label,
            'name' => $request->name,
            'type' => $request->type,
            'icon' => $request->icon,
            'input_type' => $request->input_type,
            'source_table' => $request->source_table,
            'source_column' => $request->source_column,
        ]);

        return response()->json([
            'status' => true,
            'data' => $fields,
            'message' => 'Thêm trường dữ liệu thành công'
        ], 201);
    }


    public function show($id)
    {
        $fields = Fields::find($id);

        if ($fields == null) {
            return response()->json([
                'status' => false,
                'message' => "Không tìm thấy trường dữ liệu"
            ], 404);
        }
        return response()->json([
            'status' => true,
            "data" => $fields,
            'errors' => null
        ]);
    }



    public function update(Request $request, $id)
    {
        $fields = Fields::find($id);

        if ($fields == null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy trường dữ liệu'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'label' => 'sometimes|required|string|max:255',
            'name'  => "sometimes|required|string|max:255|unique:fields,name,{$fields->id}",
            'type'  => 'sometimes|required|string|max:50',
            'icon'  => 'nullable|string|max:255',
            'input_type' => 'nullable|string|max:50',
            'source_table' => 'nullable|string|max:255',
            'source_column' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        if ($request->has('label')) {
            $fields->label = $request->label;
        }

        if ($request->has('name')) {
            $fields->name = $request->name;
        }

        if ($request->has('type')) {
            $fields->type = $request->type;
        }

        if ($request->has('icon')) {
            $fields->icon = $request->icon;
        }
        if ($request->has('input_type')) {
            $fields->input_type = $request->input_type;
        }
        if ($request->has('source_table')) {
            $fields->source_table = $request->source_table;
        }
        if ($request->has('source_column')) {
            $fields->source_column = $request->source_column;
        }

        $fields->save();

        return response()->json([
            'status' => true,
            'data' => $fields,
            'message' => 'Cập nhật trường dữ liệu thành công',
            'errors' => null
        ]);
    }


    public function destroy($id)
    {
        $fields = Fields::find($id);
        if ($fields == null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy trường dữ liệu'
            ], 404);
        }

        $fields->delete();
        return response()->json([
            'status' => true,
            'message' => 'Xóa trường dữ liệu thành công',
            'errors' => null
        ]);
    }


    public function getAllTables()
    {
        try {
            $tables = DB::select('SHOW TABLES');
            $key = 'Tables_in_' . env('DB_DATABASE');
            $tableNames = array_map(fn($t) => $t->$key, $tables);

            return response()->json([
                'status' => true,
                'data' => $tableNames
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi lấy danh sách bảng: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getTableColumns($table)
    {
        try {
            if (!Schema::hasTable($table)) {
                return response()->json([
                    'status' => false,
                    'message' => "Không tìm thấy bảng $table"
                ], 404);
            }

            $columns = Schema::getColumnListing($table);

            return response()->json([
                'status' => true,
                'data' => $columns
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi lấy cột dữ liệu: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getSourceData($id)
    {
        $formField = FormTemplateField::with('field')->find($id);

        if (!$formField || !$formField->field) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy field'
            ], 404);
        }

        $field = $formField->field;

        if (strtolower($field->input_type) !== 'db' || !$field->source_table || !$field->source_column) {
            return response()->json([
                'status' => false,
                'message' => 'Field này không có nguồn dữ liệu từ bảng'
            ], 400);
        }

        try {
            if (!Schema::hasTable($field->source_table)) {
                return response()->json([
                    'status' => false,
                    'message' => "Không tìm thấy bảng {$field->source_table}"
                ], 404);
            }

            $user = auth()->user();

            $data = [
                [
                    $field->source_column => $user->{$field->source_column}
                ]
            ];

            return response()->json([
                'status' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi truy vấn bảng dữ liệu: ' . $e->getMessage()
            ], 500);
        }
    }
}
