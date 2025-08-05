<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProcedureProcess;
use App\Models\ProcedureProcessStep;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProcedureProcessController extends Controller
{

    public function index() {
        $process = ProcedureProcess::with('steps') -> get();
        return response()->json([
            'status' => true,
            'data' => $process
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'steps' => 'required|array|min:1',
            'steps.*.name' => 'required|string|max:255',
            'steps.*.description' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                "errors" => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            $process = ProcedureProcess::create([
                'name' => $request->name,
            ]);

            foreach ($request->steps as $index => $step) {
                ProcedureProcessStep::create([
                    'procedure_process_id' => $process->id,
                    'step_order' => $index + 1,
                    'name' => $step['name'],
                    'description' => $step['description'] ?? null,
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'data' => $process->load('steps'),
                'message' => 'Tạo quy trình và các bước thành công',
            ]);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi tạo quy trình',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'steps' => 'required|array|min:1',
            'steps.*.name' => 'required|string|max:255',
            'steps.*.description' => 'required|string',
            'steps.*.id' => 'nullable|integer|exists:procedure_process_steps,id',
            'steps.*.step_order' => 'nullable|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                "errors" => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            
            $process = ProcedureProcess::findOrFail($id);

            
            $process->update([
                'name' => $request->name,
            ]);

            
            $requestStepIds = collect($request->steps)
                ->pluck('id')
                ->filter()
                ->toArray();

            
            ProcedureProcessStep::where('procedure_process_id', $process->id)
                ->when(!empty($requestStepIds), function ($query) use ($requestStepIds) {
                    $query->whereNotIn('id', $requestStepIds);
                })
                ->delete();

            
            foreach ($request->steps as $index => $stepData) {
                $stepOrder = $stepData['step_order'] ?? ($index + 1);

                if (isset($stepData['id']) && !empty($stepData['id'])) {
                    ProcedureProcessStep::where('id', $stepData['id'])
                        ->where('procedure_process_id', $process->id)
                        ->update([
                            'step_order' => $stepOrder,
                            'name' => $stepData['name'],
                            'description' => $stepData['description'] ?? null,
                        ]);
                } else {
                    ProcedureProcessStep::create([
                        'procedure_process_id' => $process->id,
                        'step_order' => $stepOrder,
                        'name' => $stepData['name'],
                        'description' => $stepData['description'] ?? null,
                    ]);
                }
            }

            DB::commit();

            $updatedProcess = $process->fresh()->load('steps');

            return response()->json([
                'status' => true,
                'data' => $updatedProcess,
                'message' => 'Cập nhật quy trình và các bước thành công',
            ]);

        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi cập nhật quy trình',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $process = ProcedureProcess::with('steps')->findOrFail($id);
            
            return response()->json([
                'status' => true,
                'data' => $process
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy quy trình',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $process = ProcedureProcess::findOrFail($id);
            
            ProcedureProcessStep::where('procedure_process_id', $process->id)->delete();
            
            $process->delete();

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Xóa quy trình thành công',
            ]);

        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi xóa quy trình',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}