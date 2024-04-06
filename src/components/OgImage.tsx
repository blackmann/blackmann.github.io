import type { getCollection } from "astro:content";

type G = typeof getCollection<"blog">;
type Post = Awaited<ReturnType<G>>[number];

interface Props {
	post: Post;
	resources: {
		bg: string;
		arrow: string;
		logo: string;
	};
}

function OgImage({ post, resources }: Props) {
	return (
		<div
			style={{
				background: "#2A2D29",
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				backgroundImage: `url(${resources.bg})`,
				padding: "80px 160px 30px",
			}}
		>
			<BlogTag />

			{/* title */}
			<p
				style={{
					fontFamily: "Inter",
					color: "white",
					fontWeight: 700,
					fontSize: 72,
					lineHeight: 1,
					opacity: 1,
				}}
			>
				{post.data.title}
			</p>

			{/* sub-title */}
			<p
				style={{
					fontFamily: "Inter",
					color: "white",
					fontSize: 40,
					opacity: 0.9,
				}}
			>
				{post.data.description}
			</p>

			{/* footer */}
			<Footer resources={resources} />
		</div>
	);
}

function BlogTag() {
	return (
		<div style={{ display: "flex" }}>
			<div
				style={{
					background: "#fff",
					width: 93,
					height: 40,
					position: "absolute",
					left: 0,
					top: 10,
					borderRadius: 10,
				}}
			/>

			<div
				style={{
					background: "#2A2D29",
					border: "3px solid #fff",
					padding: "2px 10px",
					borderRadius: 10,
					color: "white",
					fontWeight: 700,
					fontSize: 26,
				}}
			>
				/blog
			</div>
		</div>
	);
}

function Footer({ resources }: Pick<Props, "resources">) {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "flex-end",
			}}
		>
			<SiteTag resources={resources} />

			<img height={150} src={resources.logo} alt="Logo" />
		</div>
	);
}

function SiteTag({ resources }: Pick<Props, "resources">) {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				height: 56,
			}}
		>
			<div
				style={{
					display: "flex",
					fontSize: 32,
					fontWeight: 700,
					padding: "5px 20px",
					borderRadius: 60,
					alignItems: "center",
					background: "#41AA4C2E",
				}}
			>
				<div style={{ color: "white" }}>degreat.co.uk</div>
				<div style={{ color: "#67C571" }}>/blog</div>
				<img
					height={20}
					style={{ marginLeft: 15 }}
					src={resources.arrow}
					alt="arrow"
				/>
			</div>
		</div>
	);
}

function getOgImage(props: Props) {
	return <OgImage {...props} />;
}

export { getOgImage };
