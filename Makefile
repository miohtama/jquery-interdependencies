all: clean docs

clean:
	rm -rf docs
	mkdir docs

docs:
	jsduck . --output docs



