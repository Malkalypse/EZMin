/* A class to manage the minimize and restore lifecycle of any page element */
class EZMin {

	/**
	 * Constructor
	 * @param {Object}					options
	 * @param {string|Element}	options.target					- Element (or ID) to minimize
	 * @param {string}					[options.initialState]	- 'normal' or 'minimized' (defaults to 'normal')

	 * @param {Object}					[options.restore]						- Configuration for restore button
	 * @param {string|Element}	[options.restore.parent]		- Where to append restore button (defaults to target parent)
	 * @param {string}					[options.restore.tag]				- HTML tag for restore button
	 * @param {string}					[options.restore.id]				- ID for restore button
	 * @param {string}					[options.restore.className]	- CSS class for restore button
	 * @param {string}					[options.restore.text]			- Inner text/HTML for restore button
	 * @param {string}					[options.restore.title]			- Tooltip text

	 * @param {Object}					[options.minimize]								- Configuration for minimize button
	 * @param {string}					[options.minimize.parentSelector]	- Selector inside target to append minimize button
	 * @param {string}					[options.minimize.tag]						- HTML tag for minimize button
	 * @param {string}					[options.minimize.id]							- ID for minimize button
	 * @param {string}					[options.minimize.className]			- CSS class for minimize button
	 * @param {string}					[options.minimize.text]						- Inner text/HTML for minimize button
	 * @param {string}					[options.minimize.title]					- Tooltip text

	 * @param {function}				[options.onMinimize]	- Callback on minimize
	 * @param {function}				[options.onRestore]		- Callback on restore
	 */
	constructor( {
		target,
		initialState  = 'normal',
		restore       = {},
		minimize			= {},
		onMinimize		= () => {},
		onRestore			= () => {}
	} ) {
		this.targetConfig	= target;
		this.initialState	= initialState;
		this.onMinimize		= onMinimize;
		this.onRestore		= onRestore;

		// Clean defaults for the restore button
		this.restoreConfig = {
			parent:			null,
			tag:				'button',
			id:					null,
			className:	'restore-btn',
			text:				'+',
			title:			'Restore',
			...restore
		};

		// Clean defaults for the minimize button
		this.minimizeConfig = {
			parentSelector:	null,
			tag:						'button',
			id:							null,
			className:			'minimize-btn',
			text:						'−',
			title:					'Minimize',
			...minimize
		};

		// Core State Nodes
		this.target				= null;
		this.restoreBtn		= null;
		this.minimizeBtn	= null;

		// Track bound event listener handlers for clean disposal
		this._handlers = {
			minimize:	null,
			restore:	null
		};
	}

	/** Initialize the controller behaviors and UI elements */
	init() {

		// Resolve target element using native API
		this.target = typeof this.targetConfig === 'string' 
			? document.getElementById( this.targetConfig ) 
			: this.targetConfig;

		if ( !this.target ) return;

		// Setup UI elements
		this._buildRestoreButton();
		this._buildMinimizeButton();
		
		// Apply initial state configuration without firing event hooks
		if( this.initialState === 'minimized' ) {
			this.target.setAttribute( 'data-minimized', 'true' );
			this.target.classList.add( 'is-minimized' );
			if ( this.restoreBtn ) this.restoreBtn.style.display = '';
		} else {
			this.target.setAttribute( 'data-minimized', 'false' );
		}
	}

	/** Build and append the layout-nested button to minimize the element */
	_buildMinimizeButton() {
	  const cfg = this.minimizeConfig;

	  const parent = cfg.parentSelector
	    ? this.target.querySelector( cfg.parentSelector )
	    : this.target;

	  if( !parent ) return;

		this.minimizeBtn = this._createButton(
		  cfg,
		  'minimize',
		  () => this.minimize()
		);

	  parent.appendChild( this.minimizeBtn );
	}
	/** Minimize the target element */
	minimize() {
		this.target.setAttribute( 'data-minimized', 'true' );
		this.target.classList.add( 'is-minimized' );
		
		if( this.restoreBtn ) {
			this.restoreBtn.style.display = '';
		}
		
		this.onMinimize( this.target );
	}

	/** Build and inject the button used to restore the element */
	_buildRestoreButton() {
	  const cfg = this.restoreConfig;

		this.restoreBtn = this._createButton(
		  cfg,
		  'restore',
		  () => this.restore()
		);

	  // Hide by default until element minimizes
	  this.restoreBtn.style.display = 'none';

	  // If an explicit parent is supplied, append to it;
	  // otherwise place immediately after the target element.
	  if ( cfg.parent ) {
	    const insertionParent = typeof cfg.parent === 'string'
	      ? document.getElementById( cfg.parent )
	      : cfg.parent;

	    if ( insertionParent ) {
	      insertionParent.appendChild( this.restoreBtn );
	    }
	  } else {
	    this.target.after( this.restoreBtn );
	  }
	}
	/** Restore the target element to its visible state */
	restore() {
		this.target.setAttribute( 'data-minimized', 'false' );
		this.target.classList.remove( 'is-minimized' );
		
		if( this.restoreBtn ) {
			this.restoreBtn.style.display = 'none';
		}
		
		this.onRestore( this.target );
	}

	/** Create a button from configuration and optionally wire a click handler.
	 * @param {object}   cfg
	 * @param {string}   handlerKey
	 * @param {Function} callback
	 * @returns {HTMLElement}
	 */
	_createButton( cfg, handlerKey, callback ) {
	  const btn = document.createElement( cfg.tag );

	  if( cfg.id ) btn.id = cfg.id;
	  if( cfg.className ) btn.className = cfg.className;

	  btn.innerHTML = cfg.text || '';

	  if( cfg.title ) btn.title = cfg.title;

	  if( callback ) {
	    this._handlers[ handlerKey ] = callback;
	    btn.addEventListener( 'click', callback );
	  }

	  return btn;
	}

	/** Complete cleanup of DOM alterations and attached listeners */
	destroy() {
		if( this.minimizeBtn && this._handlers.minimize ) {
			this.minimizeBtn.removeEventListener( 'click', this._handlers.minimize );
			this.minimizeBtn.remove();
		}
		if( this.restoreBtn && this._handlers.restore ) {
			this.restoreBtn.removeEventListener( 'click', this._handlers.restore );
			this.restoreBtn.remove();
		}
		if( this.target ) {
			this.target.removeAttribute( 'data-minimized' );
			this.target.classList.remove( 'is-minimized' );
		}
	}
}

