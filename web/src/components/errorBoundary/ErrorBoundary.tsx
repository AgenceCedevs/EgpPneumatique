import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

type ErrorBoundaryProps = {
	children: ReactNode;
};

type ErrorBoundaryState = {
	hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = { hasError: false };

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo): void {
		console.error(error, info.componentStack);
	}

	render(): ReactNode {
		if (this.state.hasError) {
			return (
				<div className="error-fallback">
					<h1>Une erreur est survenue</h1>
					<p>La page n'a pas pu s'afficher. Vous pouvez la recharger.</p>
					<button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
						Recharger la page
					</button>
				</div>
			);
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
