#!/bin/bash

# Build dir
BUILD_DIR="./build/";

run() { # Executer
    echo "> $@" && echo "$($@)";
}
bcd() { # Patched CD
    run cd $@;
    cd $@;
}
del() { # Patched RM
    run rm $@;
}

if [ -d "$BUILD_DIR" ]; then # Delete old build
    run rm -r $BUILD_DIR
fi;
run mkdir $BUILD_DIR; # Make build dir
bcd $BUILD_DIR; # CD there
run pwd; # Log PWD
bcd ..; # CD back
run rsync -aP ./* $BUILD_DIR; # Copy files
bcd $BUILD_DIR; # CD in
run rm -r $BUILD_DIR; # Remove dupe BUILD_DIR

run npm run minify; # Minify

# Rm unneeded files
del 'LICENCE';
del 'templatecmd.js';
del 'templatemodule.js';
del 'config-example.json';
del 'build.sh';
del 'header.js';
del 'shalog.txt';
del 'quickbuild.sh';

# Exit and echo out
echo "Build complete."
echo "Build shasum: --- EVALULATING ---"
SHASUM=$(find . -type f \( -exec sha1sum "$PWD"/{} \; \) | sha1sum)
printf "\033[1A"
echo -e "\rBuild shasum: \"$SHASUM\""

# Log shasum
echo $SHASUM >> '../shalog.txt';

exit 0;