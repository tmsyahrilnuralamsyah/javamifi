<?php

namespace App\Http\Controllers;

use App\Services\MidtransPaymentSyncService;
use App\Services\MidtransService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MidtransNotificationController extends Controller
{
    public function __construct(
        protected MidtransService $midtransService,
        protected MidtransPaymentSyncService $midtransPaymentSyncService,
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $payload = $request->all();

        if (! $this->midtransService->verifyNotificationSignature($payload)) {
            return response()->json([
                'message' => 'Signature notification tidak valid.',
            ], 403);
        }

        $payment = $this->midtransPaymentSyncService->syncByPaymentNumber(
            (string) ($payload['order_id'] ?? ''),
            $payload,
        );

        if (! $payment) {
            return response()->json([
                'message' => 'Pembayaran tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'message' => 'Notification berhasil diproses.',
        ]);
    }
}
