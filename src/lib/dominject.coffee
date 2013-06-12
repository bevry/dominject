# Define
dominject = (opts) ->
		# Prepare
		debugger
		{type,url,attrs,next} = opts
		attrs or= {}

		# Next fallback
		next ?= (err) ->
			throw err  if err

		# Check
		el = document.getElementById(url)
		if el
			return next(null,el)

		# Loader
		destroy = (err=null) ->
			done = true
			el.onload = el.onreadystatechange = null
			return next(err, el)

		onLoad = ->
			#console.log 'injecting '+url+' '+@readyState
			return  unless !done and (!@readyState or @readyState is 'loaded' or @readyState or 'complete')
			#console.log 'injected '+url+' '+@readyState
			return destroy()

		onError = ->
			return  unless !done
			err = new Error('an error occured with the dominject for: '+url)
			return destroy(err)

		# Handle
		switch type
			when 'script'
				el = document.createElement('script')

				attrs.defer ?= true
				attrs.src ?= url
				attrs.id ?= url
				for own key,value of attrs
					el.setAttribute(key,value)

				done = false
				#console.log 'inject '+url
				el.onload = el.onreadystatechange = onLoad
				el.onerror = onError

				document.body.appendChild(el)

			when 'style'
				el = document.createElement('link')

				attrs.rel ?= 'stylesheet'
				attrs.href ?= url
				attrs.id ?= url
				for own key,value of attrs
					el.setAttribute(key,value)

				done = false
				#console.log 'inject '+url
				el.onload = el.onreadystatechange = onLoad
				el.onerror = onError

				document.head.appendChild(el)

				# create a fallback for older browsers
				# http://www.backalleycoder.com/2011/03/20/link-tag-css-stylesheet-load-event/
				img = document.createElement('img')
				img.onerror = onLoad
				img.src = url

			else
				err = new Error('unknown dominject type: '+type)
				return next(err)

# Export
module.exports = dominject