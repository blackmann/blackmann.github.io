import MangobaseFeatureImage from "../components/MangobaseFeatureImage.astro";

const featuredLinks = [
	// {
	// 	title: 'SerialBox',
	// 	description:
	// 		'Growing engineers. A project to teach people especially kids how to build eletronic projects — with community.',
	// 	link: 'sb.degreat.co.uk',
	// },
	{
		title: "Mangobase 🥭",
		description:
			"Low-code Javascript backend framework for Node and Bun runtimes.",
		link: "degreat.co.uk/mangobase",
		featureImage: MangobaseFeatureImage,
	},
	{
		title: "Adeton",
		description:
			"This is a SaaS project I founded; an e-commerce enabler. Think Shopify but tailored for the Ghanaian merchant.",
		link: "adeton.io",
	},
	{
		title: "Devlog",
		description:
			"This is a Youtube channel I share progress on stuff I'm working on. You'll also find some tutorials on code, 3d, etc. It's fun, check it out!",
		link: "youtube.com/@notgr",
		footer: "Please subscribe",
		icon: "i-lucide-youtube text-red-500 text-lg",
	},
];

export default featuredLinks;
