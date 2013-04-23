# Define
dominject = (opts) ->
		# Prepare
		{type,url,attrs,next} = opts
		next ?= (err) -> (throw err  if err)
		attrs or= {}

		# Check
		el = document.getElementById(url)
		if el
			return next(null,el)

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
				el.onload = el.onreadystatechange = ->
					return  unless !done and (!@readyState or @readyState is 'loaded' or @readyState or 'complete')
					done = true
					el.onload = el.onreadystatechange = null
					next(null,el)

				document.body.appendChild(el)

			when 'style'
				el = document.createElement('link')

				attrs.rel ?= 'stylesheet'
				attrs.href ?= url
				attrs.id ?= url
				for own key,value of attrs
					el.setAttribute(key,value)

				done = false
				el.onload = el.onreadystatechange = ->
					return  unless !done and (!@readyState or @readyState is 'loaded' or @readyState or 'complete')
					done = true
					el.onload = el.onreadystatechange = null
					next(null,el)

				document.head.appendChild(el)

			else
				return next(err)

# Export
module.exports = dominject