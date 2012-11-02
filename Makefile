all: clean docs publish

clean:
	rm -rf docs
	mkdir docs

docs:
	jsduck deps.js --title="jQuery Interdependencies" --output docs --external=jQuery

publish:
	./publish-docs.sh