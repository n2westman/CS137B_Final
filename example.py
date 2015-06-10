#!/usr/bin/python

import sys
import subprocess
import argparse

parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('example', metavar='N', type=int, help='example number')
parser.add_argument('-b','--build', action='store_true', help='builds the example')
parser.add_argument('-r','--run', action='store_true', help='runs the example')

args = parser.parse_args()
print args

def main(args):
	if (args.build):
		print "Building Example {0}".format(str(args.example))
		command = "node scraper.js ts/example{0}.ts".format(str(args.example))
		process = subprocess.call(command.split())

	if (args.run):
		print "Running Example {0}".format(str(args.example))
		command2 = "node build/example{0}/example{0}.js".format(str(args.example))
		process = subprocess.call(command2.split())

if __name__ == "__main__":
   main(args)