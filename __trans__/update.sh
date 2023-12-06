
if [[ -d "data" && -d "backup" ]]; then
    # rm -rf backup
    # mv backdoor/transcendence backup -r
    # mv data backdoor/transcendence -r
    # rm backdoor/transcendence/ssh.sh
    echo "update"
else
    echo "cant update"
fi