import React from 'react';
import PropTypes from 'prop-types';

import Seo from '../components/seo';
import Fragment from '../components/fragment';
import CSS from '../css/modules/404.module.scss';

const NotFound = ({site, location}) => {
	return (
		<Fragment>
			<Seo
				currentPage={{
					title: 'Not Found'
				}}
				site={site}
				location={location}
			/>
			<main className="main" role="main">
				<div className="container">
					<div className={CSS.wrap}>
						<h1 className={CSS.title}>
							Sorry there doesn't appear to be content here!
						</h1>
					</div>
				</div>
			</main>
		</Fragment>
	);
};

NotFound.propTypes = {
	site: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired
};

export default NotFound;
