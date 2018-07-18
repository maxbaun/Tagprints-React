import React, {Component} from 'react';

export default function WindowSize(WrappedComponent) {
	return class extends Component {
		constructor(props) {
			super(props);

			this.state = {
				windowWidth: 0
			};

			this.handleResize = this.handleResize.bind(this);
		}

		componentDidMount() {
			window.addEventListener('resize', this.handleResize);
			this.handleResize();
		}

		componentWillUnmount() {
			window.removeEventListener('resize', this.handleResize);
		}

		handleResize() {
			this.setState({
				windowWidth: window.innerWidth,
				windowHeight: window.innerHeight
			});
		}

		render() {
			const props = {
				windowWidth: this.state.windowWidth,
				windowHeight: this.state.windowHeight
			};

			return <WrappedComponent {...this.props} {...props}/>;
		}
	};
}
