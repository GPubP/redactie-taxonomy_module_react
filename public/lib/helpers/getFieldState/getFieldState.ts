import { FormikErrors, FormikTouched, FormikValues } from 'formik';
import { path } from 'ramda';

export const getFieldState = <Values extends FormikValues>(
	touched: FormikTouched<Values>,
	errors: FormikErrors<Values>,
	pathString: string
): string => {
	const pathArray = pathString.split('.');
	return !!path(pathArray, touched) && !!path(pathArray, errors) ? 'error' : '';
};
