# Makefile for building jsduck documentation

all: clean build-docs publish-docs

clean:
	rm -rf docs
	mkdir docs

build-docs:
	jsduck deps.js --title="jQuery Interdependencies" \
		--output docs \
		--external=jQuery \
		--welcome=api-welcome.html

publish-docs:
	./publish-docs.sh