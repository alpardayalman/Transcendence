CMD = docker-compose -f ./docker-compose.yml
CONTAINERS = $$(docker ps -q | wc -l)
IMAGES = $$(docker images -q | wc -l)

# ======= COLORS ======= #
BLACK	= \033[0;30m
RED		= \033[0;31m
GREEN	= \033[0;32m
YELLOW	= \033[0;33m
BLUE	= \033[0;34m
PURPLE	= \033[0;35m
CYAN	= \033[0;36m
WHITE	= \033[0;37m
END		= \033[m
RESET	= \033[0m
X		= \033[m

B_CYAN		= \033[1;36m
B_BLUE		= \033[1;34m
B_YELLOW	= \033[1;33m
B_GREEN		= \033[1;32m
B_RED		= \033[1;31m
B_RESET		= \033[1m

all:
	$(CMD) build

stop:
	@if [ $(CONTAINERS) -gt 0 ]; then \
		docker stop $$(docker ps -q); \
	else \
		echo "$(YELLOW)*No containers running*$(RESET)"; \
	fi

fclean:
	$(CMD) down
	$(MAKE) clean

clean: stop
	@if [ $(IMAGES) -gt 0 ]; then \
		docker rmi -f $$(docker images -q); \
	else \
		echo "$(YELLOW)*There is no images*$(RESET)"; \
	fi

show:
	@echo docker ps -a
	@echo docker images -a
	@echo docker volume ls
	@echo docker network ls

# $(shell chmod +x update.sh)
update:
	$(shell ./update.sh)

re: clean all