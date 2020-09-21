#!/bin/bash

run() { # Executer
    echo "> $@" && echo "$($@)";
}
bcd() { # Patched CD
    run cd $@;
    cd $@;
}

# Build
run npm run build;

# CD in
bcd build/;

# Launch
node index.js;