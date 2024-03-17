DEF_COLOR = \033[0;39m
GRAY = \033[0;90m
RED = \033[0;91m
GREEN = \033[0;92m
YELLOW = \033[0;93m
BLUE = \033[0;94m
MAGENTA = \033[0;95m
CYAN = \033[0;96m
WHITE = \033[0;97m
RESET = [0m
BOLD = [1m

NAME = Transcendence


up:
	@mkdir -p ./data/PostgreSQL
	@mkdir -p ./data/NginX
	@docker-compose -f docker-compose.yml up -d --build

down:
	@docker-compose -f docker-compose.yml down

clean:
	@docker-compose -f docker-compose.yml down -v --remove-orphans
	@docker rmi -f $$(docker images -q)
	@rm -rf ./data/PostgreSQL
	@rm -rf ./data/NginX

fclean: clean

# SHOW DOCKER VERSION AND INFO #
DockerHello:
	@echo "\n$(BLUE)=========$(WHITE)   DOCKER VERSION/INFO  $(BLUE)=========$(DEF_COLOR)\n"
	@echo "\n$(BLUE)====$(WHITE)         VERSION        $(BLUE)====$(DEF_COLOR)\n"
	@docker version
	@echo "\n$(BLUE)====$(WHITE)          INFO          $(BLUE)====$(DEF_COLOR)\n"
	@docker info
	@echo ""

# SHOW ALL RUNNING CONTAINERS #
ShowRunning:
	@echo "\n$(BLUE)=========$(WHITE) ALL RUNNING CONTAINERS $(BLUE)=========$(DEF_COLOR)\n"
	@docker ps
	@echo ""

# SHOW ALL CONTAINERS #
ShowAll:
	@echo "\n$(BLUE)=========$(WHITE)     ALL CONTAINERS     $(BLUE)=========$(DEF_COLOR)\n"
	@docker ps -a
	@echo ""

# SHOW ALL IMAGES #
ShowImages:
	@echo "\n$(BLUE)=========$(WHITE)       ALL IMAGES       $(BLUE)=========$(DEF_COLOR)\n"
	@docker image ls
#THIS WOULD ALSO WORK -> "@docker images"
	@echo ""


# ================ DOCKER CONTROLLING ================ # 

# RUN ALL CONTAINERS #
DeatchedBuild:
	@echo "\n$(BLUE)-----> $(WHITE)STARTED BUILD [ $(BLUE)$(NAME) $(WHITE)] ....$(DEF_COLOR)\n"
	@docker-compose up -d

#RUNNING A SINGLE CONTAINER

#DELETE A SINGLE IMAGE

#KILLING A CONTAINER

#STOPING A CONTAINER

#KILLING ALL RUNNING CONTAINERS

#STOPING ALL RUNNING CONTAINERS

re: clean up