import MangobaseFeatureImage from "../components/MangobaseFeatureImage.astro";
import YTFeatureImage from "../components/YTFeatureImage.astro";
import AdetonFeatureImage from "../components/AdetonFeatureImage.astro";

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
			"This is a Youtube channel I share progress on stuff I'm working on. It's fun, check it out!",
		link: "youtube.com/@notgr",
		footer: "Please subscribe",
	},
];

export default featuredLinks;
