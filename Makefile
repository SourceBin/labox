.PHONY: image
image:
	# build image with all languages
	docker build -t labox .

.PHONY: image-%
image-%:
	# build image with a single language
	docker build -t labox-$(*) --build-arg LANGUAGE=$(*) .

.PHONY: run
run: image
	# run image with all languages
	docker run --rm -it labox

.PHONY: run-%
run-%: image-%
	# run image with a single language
	docker run --rm -it labox-$(*)
