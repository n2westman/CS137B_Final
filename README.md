# CS137B_Final
A better TypeScript
I work with TS on a regular basis, and gradual typing is great. But there are a lot of things that can break the typesystem.
We need runtime help!

#Commands to run for it all to work

#Make sure to have node installed!

#To install dependencies
npm install --dev

#To use the modified typescript compiler
#Will compile everything in the ts/ directory and place in the build/ directory
gulp

#Set a file watcher and continuously build
gulp watch

#To Scrape Interfaces off of a file, run the following command. Spits to stdout
#node scraper.js first.ts second.ts third.ts ...
node scraper.js ts/checked.ts