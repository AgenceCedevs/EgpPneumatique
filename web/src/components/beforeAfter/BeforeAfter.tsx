import type { ChangeEvent, CSSProperties, ReactElement } from "react";
import { useId, useState } from "react";
import "./BeforeAfter.css";

type ComparisonItem = {
	id: string;
	title: string;
	before: string;
	beforeAlt: string;
	after: string;
	afterAlt: string;
};

type SingleImageItem = {
	id: string;
	title: string;
	image: string;
	imageAlt: string;
};

type BeforeAfterProps = {
	item: ComparisonItem | SingleImageItem;
};

function BeforeAfter({ item }: BeforeAfterProps): ReactElement {
	const [position, setPosition] = useState<number>(50);
	const inputId = useId();

	if ("image" in item) {
		return (
			<figure className="ba ba--single">
				<div className="ba__frame">
					<img className="ba__img" src={item.image} alt={item.imageAlt} loading="lazy" />
				</div>
				<figcaption className="ba__caption">{item.title}</figcaption>
			</figure>
		);
	}

	const style = { "--ba-pos": `${position}%` } as CSSProperties;

	const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
		setPosition(Number(event.target.value));
	};

	return (
		<figure className="ba">
			<div className="ba__frame" style={style}>
				<img className="ba__img" src={item.after} alt={item.afterAlt} loading="lazy" />
				<img className="ba__img ba__img--before" src={item.before} alt={item.beforeAlt} loading="lazy" />
				<span className="ba__tag ba__tag--before">Avant</span>
				<span className="ba__tag ba__tag--after">Après</span>
				<span className="ba__handle" aria-hidden="true" />
				<label className="visually-hidden" htmlFor={inputId}>
					Comparer avant et après : {item.title}
				</label>
				<input id={inputId} className="ba__range" type="range" min={0} max={100} value={position} onChange={onChange} />
			</div>
			<figcaption className="ba__caption">{item.title}</figcaption>
		</figure>
	);
}

export default BeforeAfter;
