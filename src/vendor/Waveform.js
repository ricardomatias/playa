import Analyzer from './Analyzer';

export default (domNode) => {
	document.addEventListener('DOMContentLoaded', () => {
		var analyzer = new Analyzer(domNode);

		window.addEventListener("resize", function() {
			analyzer.resize();
		});
	});
}
