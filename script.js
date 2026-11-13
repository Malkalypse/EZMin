document.addEventListener('DOMContentLoaded', () => {
	
	// This element will start completely hidden, displaying the restore toggle right away
	const sidebarMinimizer = new EZMin({
		target: 'sidebar-panel',
		initialState: 'minimized', // <-- Starts minimized immediately
		minimize: {
			parentSelector: '.panel-header',
			title: 'Hide Sidebar'
		},
		restore: {
			className: 'restore-btn blue-circle',
			title: 'Restore Sidebar'
		}
	});
	sidebarMinimizer.init();

	// This element stays standard 'normal' on page initialization
	const contentMinimizer = new EZMin({
		target: document.getElementById('content-panel'),
		initialState: 'normal',
		minimize: {
			text: 'Minimize Section',
			className: 'minimize-btn text-btn'
		},
		restore: {
			text: '↳ Restore Content Section',
			className: 'restore-btn text-link'
		}
	});
	contentMinimizer.init();
});
