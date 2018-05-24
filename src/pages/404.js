import React from 'react';

import CSS from '../css/modules/404.module.scss';

const NotFound = () => {
	return (
		<main className="main" role="main">
			<div className="container">
				<div className={CSS.wrap}>
					<h1 className={CSS.title}>
						Sorry there doesn't appear to be content here!
					</h1>
				</div>
			</div>
		</main>
	);
};

export default NotFound;
