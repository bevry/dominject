# Define
dominject = (opts) ->
		# Prepare
		{type,url,attrs,timeout,next} = opts
		attrs or= {}
		timeout ?= 60*1000
		done = false
		timer = null
		parent = null

		# Next fallback
		next ?= (err) ->
			throw err  if err

		# Check if we already exist
		el = document.getElementById(url) or null
		if el?
			next(null, el)
			return el

		# Finish up
		finish = (err=null) ->
			# Check
			return  unless !done

			# Reset
			done = true
			el.onload = el.onreadystatechange = null
			if timer?
				clearTimeout(timer)
				timer = null

			# Remove the element if we error'd
			if err and el and parent
				parent.removeChild(el)
				el = null

			# Complete
			next(err, el)
			return el

		# Handle on Load
		onLoad = ->
			# Check
			return  unless !done and (!@readyState or @readyState is 'loaded' or @readyState or 'complete')

			# Finish
			return finish()

		# Handle on Error
		onError = ->
			# Check
			return  unless !done

			# Error
			err = new Error('the url '+url+' failed to be injected')

			# Finish
			return finish(err)

		# Handle on Timeout
		onTimeout = ->
			# Check
			return  unless !done

			# Error
			err = new Error('the url '+url+' took too long to be injected and timed out')

			# Finish
			return finish(err)

		# Handle
		switch type
			# Script
			when 'script'
				# Create
				el = document.createElement('script')

				# Attributes
				attrs.defer ?= true
				attrs.src ?= url
				attrs.id ?= url
				for own key,value of attrs
					el.setAttribute(key,value)

				# Events
				el.onload = el.onreadystatechange = onLoad
				el.onerror = onError

				# Attach
				parent = document.body
				parent.appendChild(el)

			# Stylesheet
			when 'style'
				# Create
				el = document.createElement('link')

				# Attributes
				attrs.rel ?= 'stylesheet'
				attrs.href ?= url
				attrs.id ?= url
				for own key,value of attrs
					el.setAttribute(key,value)

				# Events
				el.onload = el.onreadystatechange = onLoad
				el.onerror = onError

				# Attach
				parent = document.head
				parent.appendChild(el)

				# Fallback for older browsers
				# http://www.backalleycoder.com/2011/03/20/link-tag-css-stylesheet-load-event/
				img = document.createElement('img')
				img.onerror = onLoad
				img.src = url

			# Something else
			else
				# Error
				err = new Error('the url '+url+' has an unknown inject type of '+type)
				return finish(err)

		# Timeout if applicable
		timer = setTimeout(onTimeout, timeout)  if timeout

		# Return the element
		return el

# Export
module.exports = dominject