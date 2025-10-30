// types/paystack-inline-js.d.ts
declare module '@paystack/inline-js' {
	export interface PaystackPopOptions {
		key: string; // Public key from Paystack Dashboard
		email: string;
		amount: number; // in kobo (₦100 = 10000)
		ref?: string;
		onClose?: () => void;
		callback?: (response: { reference: string }) => void;
	}

	export default class PaystackPop {
		newTransaction(options: PaystackPopOptions): void;
	}
}
