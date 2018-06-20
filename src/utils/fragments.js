import graphql from 'graphql';

export const YoastFragment = graphql`
	fragment Yoast on yoast_6 {
		metaKeywords: focuskw
		title: title
		metaDescription: metadesc
		linkdex
		metakeywords
		noIndex: meta_robots_noindex
		noFollow: meta_robots_nofollow
		meta_robots_adv
		canonical
		redirect
		ogTitle: opengraph_title
		ogDescription: opengraph_description
		ogImage: opengraph_image
		twitterTitle: twitter_title
		twitterDescription: twitter_description
		twitterImage: twitter_image
	}
`;

export const PostYoast = graphql`
	fragment PostYoast on yoast_5 {
		metaKeywords: focuskw
		title: title
		metaDescription: metadesc
		linkdex
		metakeywords
		noIndex: meta_robots_noindex
		noFollow: meta_robots_nofollow
		meta_robots_adv
		canonical
		redirect
		ogTitle: opengraph_title
		ogDescription: opengraph_description
		ogImage: opengraph_image
		twitterTitle: twitter_title
		twitterDescription: twitter_description
		twitterImage: twitter_image
	}
`;

export const LookbookYoast = graphql`
	fragment LookbookYoast on yoast_8 {
		metaKeywords: focuskw
		title: title
		metaDescription: metadesc
		linkdex
		metakeywords
		noIndex: meta_robots_noindex
		noFollow: meta_robots_nofollow
		meta_robots_adv
		canonical
		redirect
		ogTitle: opengraph_title
		ogDescription: opengraph_description
		ogImage: opengraph_image
		twitterTitle: twitter_title
		twitterDescription: twitter_description
		twitterImage: twitter_image
	}
`;

export const CaseStudyYoast = graphql`
	fragment CaseStudyYoast on yoast_7 {
		metaKeywords: focuskw
		title: title
		metaDescription: metadesc
		linkdex
		metakeywords
		noIndex: meta_robots_noindex
		noFollow: meta_robots_nofollow
		meta_robots_adv
		canonical
		redirect
		ogTitle: opengraph_title
		ogDescription: opengraph_description
		ogImage: opengraph_image
		twitterTitle: twitter_title
		twitterDescription: twitter_description
		twitterImage: twitter_image
	}
`;

export const PageFragment = graphql`
	fragment Page on wordpress__PAGE {
		id
		content
		title
		date(formatString: "MMMM DD, YYYY")
		excerpt
		template
		yoast {
			...Yoast
		}
		image: featured_media {
			...LargeImage
		}
	}
`;

export const Post = graphql`
	fragment Post on wordpress__POST {
		id
		content
		title
		date(formatString: "MMMM DD, YYYY")
		excerpt
		categories {
			name
			link
		}
		yoast {
			...PostYoast
		}
		image: featured_media {
			...LargeImage
		}
	}
`;

export const Site = graphql`
	fragment Site on Site {
		id
		siteMeta: siteMetadata {
			title
			subtitle
		}
	}
`;

export const MenuItems = graphql`
	fragment MenuItems on wordpress__wp_api_menus_menus_items {
		items {
			title
			url
			classes
			children: wordpress_children {
				title
				url
			}
		}
	}
`;

export const ImageSizes = graphql`
	fragment ImageSizes on ImageSharpSizes {
		base64
		aspectRatio
		src
		srcSet
		sizes
	}
`;

export const ImageResolutions = graphql`
	fragment ImageResolutions on ImageSharpResolutions {
		base64
		aspectRatio
		src
		srcSet
		width
		height
	}
`;

export const BaseImage = graphql`
	fragment BaseImage on wordpress__wp_media {
		id: wordpress_id
		url: source_url
		mediaDetails: media_details {
			width
			height
		}
	}
`;

export const LargeImage = graphql`
	fragment LargeImage on wordpress__wp_media {
		...BaseImage
		localFile {
			childImageSharp {
				sizes(maxWidth: 1600) {
					...ImageSizes
				}
			}
		}
	}
`;

export const SmallMediumImage = graphql`
	fragment SmallMediumImage on wordpress__wp_media {
		...BaseImage
		localFile {
			childImageSharp {
				sizes(maxWidth: 350) {
					...ImageSizes
				}
			}
		}
	}
`;

export const CaseStudy = graphql`
	fragment CaseStudy on wordpress__wp_case_study {
		id: wordpress_id
		title
		slug
		menu_order
		image: featured_media {
			...LargeImage
		}
		thumbnail: featured_media {
			...SmallMediumImage
		}
		acf {
			logo
			subtitle
		}
	}
`;
