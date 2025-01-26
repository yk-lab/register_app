import { Notyf } from "notyf";
import type { DeepPartial, INotyfNotificationOptions } from "notyf";

const getToast = () => {
	return new Notyf({
		position: {
			x: "right",
			y: "top",
		},
	});
};

export const useToast = (toast: Notyf = getToast()) => {
	type ToastMessage = string | Partial<INotyfNotificationOptions>;

	return {
		open: (payload: DeepPartial<INotyfNotificationOptions>) =>
			toast.open(payload),
		success: (payload: ToastMessage) => toast.success(payload),
		error: (payload: ToastMessage) => toast.error(payload),
	};
};
