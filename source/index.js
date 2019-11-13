// Prepare
const ONE_MINUTE = 60 * 1000

/* :: declare class DOMInjectElement extends HTMLElement {
  ondominject: Array<function>;
  domInjectDone: bool;
  domInjectTimer: any;
} */

/**
 * Get the object type string
 * @param {Object} opts - an object of the following properties, requires at least type and url
 * @param {string} opts.type - either 'script' or 'style'
 * @param {string} opts.url - the url of the resource to inject
 * @param {Object} [opts.attrs] - an object of attribute names to values for the injected element
 * @param {number} [opts.timeout=ONE_MINUTE] - the timeout duration in milliseconds, can be fasley for none
 * @param {function} [opts.next] - the completion callback, accepts a potential Error as the first argument, and the dom element as the second
 * @returns {string}
 */
export default function dominject(opts /* :Object */) {
	// Extract
	const { type, url, attrs = {}, timeout = ONE_MINUTE } = opts

	// Ensure that errors won't go unhandled if the next callback doesn't exist
	function next(err, el) {
		if (opts.next) {
			opts.next(err, el)
		} else if (err) {
			throw err
		}
	}

	// Check if we already have an existing element
	// If so, our job was el.domInjectDone earlier
	let el /* : HTMLElement */ = document.getElementById(url)
	if (el) {
		if (el.domInjectDone) {
			next(null, el)
		} else {
			el.ondominject.push(next)
		}
		return el
	}
	// Otherwise create the element

	// Finish up
	function finish(err) {
		// Check
		if (el.domInjectDone) return

		// Reset
		el.domInjectDone = true
		el.onload = el.onreadystatechange = null
		if (el.domInjectTimer != null) {
			clearTimeout(el.domInjectTimer)
			el.domInjectTimer = null
		}

		// Remove the element if we error'd
		if (err && el && parent) {
			el.parentNode.removeChild(el)
			el = null
		}

		// Complete (with ensured err as null)
		/* eslint no-cond-assign:0 */
		let handler
		while ((handler = el.ondominject.shift())) {
			handler(err || null, el)
		}
	}

	// Handle on Load
	function onLoad() {
		// Check
		if (
			el.domInjectDone ||
			!this.readyState /* browsers/events that do not support ready state */ ||
			this.readyState === 'complete' /* mdn */ ||
			this.readyState === 'loaded' /* IE */
		) {
			finish()
		}
	}

	// Handle on Error
	function onError() {
		// Check
		if (!el.domInjectDone) {
			// Error
			const err = new Error(`The ${url} failed to be injected`)
			finish(err)
		}
	}

	// Handle on Timeout
	function onTimeout() {
		// Check
		if (!el.domInjectDone) {
			// Error
			const err = new Error(
				`The url ${url} took too long to be injected and timed out`
			)
			finish(err)
		}
	}

	// Handle
	switch (type) {
		case 'script': {
			// Create
			el = document.createElement('script')
			el.ondominject = [next]
			el.domInjectDone = false

			// Attributes
			if (attrs.defer == null) attrs.defer = true
			if (attrs.src == null) attrs.src = url
			if (attrs.id == null) attrs.id = url
			for (const key in attrs) {
				if (attrs.hasOwnProperty(key)) {
					el.setAttribute(key, attrs[key])
				}
			}

			// Events
			el.onload = el.onreadystatechange = onLoad
			el.onerror = onError

			// Attach
			document.body.appendChild(el)
			break
		}

		case 'style': {
			// Create
			el = document.createElement('link')
			el.ondominject = [next]
			el.domInjectDone = false

			// Attributes
			if (attrs.rel == null) attrs.rel = 'stylesheet'
			if (attrs.href == null) attrs.href = url
			if (attrs.id == null) attrs.id = url
			for (const key in attrs) {
				if (attrs.hasOwnProperty(key)) {
					el.setAttribute(key, attrs[key])
				}
			}

			// Events
			el.onload = el.onreadystatechange = onLoad
			el.onerror = onError

			// Attach
			document.head.appendChild(el)

			// Fallback for older browsers
			// http://www.backalleycoder.com/2011/03/20/link-tag-css-stylesheet-load-event/
			const img = document.createElement('img')
			img.onerror = onLoad
			img.src = url
			break
		}

		// Something else
		default: {
			// Error
			const err = new Error(
				`The url ${url} has an unknown inject type of ${type}`
			)
			return next(err)
		}
	}

	// Timeout if applicable
	if (timeout) el.domInjectTimer = setTimeout(onTimeout, timeout)

	// Return the element
	return el
}
