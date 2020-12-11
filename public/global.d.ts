declare module '@acpaas-ui/react-components';
declare module '@acpaas-ui/react-editorial-components';

declare module '*.module.scss' {
	const classes: { [key: string]: string };
	export default classes;
}

declare const BFF_MODULE_PUBLIC_PATH: string;
