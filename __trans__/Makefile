all:
	docker build -t mycont:latest ./

stop:
	docker stop $$(docker ps -q)

clean:
	docker rmi -f $$(docker images -q)

re: stop clean all