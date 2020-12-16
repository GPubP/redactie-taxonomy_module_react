import { AlertProps, alertService } from '@redactie/utils';

export const showAlert = (
	containerId: string,
	type: 'success' | 'error',
	alertProps?: AlertProps
): void => {
	if (!alertProps || !containerId) {
		return;
	}
	const alertType = type === 'error' ? 'danger' : type;
	const alertOptions = { containerId };

	const alertFn = alertService[alertType];

	if (typeof alertFn === 'function') {
		alertFn.call(alertService, alertProps, alertOptions);
	}
};
