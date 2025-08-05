<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProcedureSubmission;
use Illuminate\Support\Facades\Storage;
use setasign\Fpdi\PdfReader\PageBoundaries;
use setasign\Fpdi\Tfpdf\Fpdi;

class ProcedureSubmissionPdfController extends Controller
{
    public function generatePdf($submissionId)
    {
        $submission = ProcedureSubmission::with([
            'fields.formTemplateField.field',
            'procedure.formTemplate'
        ])->findOrFail($submissionId);

        $templatePath = $submission->procedure->formTemplate->pdf_file_path;

        if (!Storage::disk('public')->exists($templatePath)) {
            return response()->json(['message' => 'Không tìm thấy mẫu PDF'], 404);
        }

        $templateFullPath = Storage::disk('public')->path($templatePath);

        
        $pdf = new Fpdi('P', 'mm', 'A4');

        $pdf->AddFont('DejaVu', '', 'DejaVuSansCondensed.ttf', true);
        $pdf->SetFont('DejaVu', '', 12);

        $pageCount = $pdf->setSourceFile($templateFullPath);

        for ($i = 1; $i <= $pageCount; $i++) {
            $tplId = $pdf->importPage($i, PageBoundaries::MEDIA_BOX);
            $pdf->AddPage();
            $pdf->useTemplate($tplId, 0, 0, null, null, true);

            foreach ($submission->fields as $field) {
                $templateField = $field->formTemplateField;
                if (!$templateField || $templateField->page != $i) continue;

                
                $x = $templateField->position_x * 0.26458;
                $y = $templateField->position_y * 0.26458 + 3;

                $value = $field->value ?? '';
                $pdf->SetXY($x, $y);
                $pdf->Write(6, $value);
            }
        }

        return response($pdf->Output('S'), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="filled.pdf"');
    }
}
